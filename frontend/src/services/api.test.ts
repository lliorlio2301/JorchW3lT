import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import api from './api'
import i18n from '../i18n'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

describe('API Axios Interceptor', () => {
  let mock: MockAdapter
  let axiosPostSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    mock = new MockAdapter(api)
    axiosPostSpy = vi.spyOn(axios, 'post')
    localStorage.clear()
  })

  afterEach(() => {
    mock.restore()
    axiosPostSpy.mockRestore()
  })

  it('adds Authorization header when token exists in localStorage', async () => {
    localStorage.setItem('token', 'fake-jwt-token')
    mock.onGet('/test').reply(200, {})
    
    const response = await api.get('/test')
    
    // axios-mock-adapter stores the request config
    const requestConfig = response.config
    expect(requestConfig.headers?.Authorization).toBe('Bearer fake-jwt-token')
  })

  it('adds Accept-Language header based on i18n language', async () => {
    i18n.language = 'fr'
    mock.onGet('/test').reply(200, {})
    
    const response = await api.get('/test')
    
    const requestConfig = response.config
    expect(requestConfig.headers?.['Accept-Language']).toBe('fr')
  })

  it('does not add Authorization header when token is missing', async () => {
    mock.onGet('/test').reply(200, {})
    
    const response = await api.get('/test')
    
    const requestConfig = response.config
    expect(requestConfig.headers?.Authorization).toBeUndefined()
  })

  it('rotates refresh token on 401 and retries original request', async () => {
    localStorage.setItem('token', 'expired-token')
    localStorage.setItem('refreshToken', 'old-refresh-token')

    mock.onGet('/protected').replyOnce(401)
    mock.onGet('/protected').replyOnce(200, { ok: true })
    axiosPostSpy.mockResolvedValue({
      data: { token: 'new-access-token', refreshToken: 'new-refresh-token' }
    } as never)

    const response = await api.get('/protected')

    expect(response.status).toBe(200)
    expect(localStorage.getItem('token')).toBe('new-access-token')
    expect(localStorage.getItem('refreshToken')).toBe('new-refresh-token')
    expect(axiosPostSpy).toHaveBeenCalledWith('/api/auth/refresh-token', { refreshToken: 'old-refresh-token' })
  })

  it('clears auth storage when refresh fails', async () => {
    localStorage.setItem('token', 'expired-token')
    localStorage.setItem('refreshToken', 'old-refresh-token')

    mock.onGet('/protected').replyOnce(401)
    axiosPostSpy.mockRejectedValue(new Error('refresh failed'))

    await expect(api.get('/protected')).rejects.toBeTruthy()
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('refreshToken')).toBeNull()
    expect(axiosPostSpy).toHaveBeenCalledWith('/api/auth/refresh-token', { refreshToken: 'old-refresh-token' })
  })
})
