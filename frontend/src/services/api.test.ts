import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import api from './api'
import i18n from '../i18n'
import MockAdapter from 'axios-mock-adapter'

describe('API Axios Interceptor', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(api)
    localStorage.clear()
  })

  afterEach(() => {
    mock.restore()
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
})
