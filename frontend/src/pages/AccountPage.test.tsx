import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import AccountPage from './AccountPage'
import { BrowserRouter } from 'react-router-dom'
import userService from '../services/userService'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { username: 'currentadmin' },
    logout: vi.fn(),
  }),
}))

// Mock userService
vi.mock('../services/userService', () => ({
  default: {
    updateUsername: vi.fn().mockResolvedValue({}),
    updatePassword: vi.fn().mockResolvedValue({}),
  },
}))

// Mock useNavigate hook
const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

describe('AccountPage', () => {
  it('renders account forms correctly', () => {
    render(
      <BrowserRouter>
        <AccountPage />
      </BrowserRouter>
    )
    
    expect(screen.getByText(/account.title/i)).toBeInTheDocument()
    expect(screen.getByText(/account.changeUsername/i)).toBeInTheDocument()
    expect(screen.getByText(/account.changePassword/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/account.newUsername/i)).toBeInTheDocument()
  })

  it('calls updateUsername on submit', async () => {
    render(
      <BrowserRouter>
        <AccountPage />
      </BrowserRouter>
    )
    
    const usernameInput = screen.getByPlaceholderText(/account.newUsername/i)
    fireEvent.change(usernameInput, { target: { value: 'newadmin' } })
    
    const saveButton = screen.getByTestId('save-username-btn')
    fireEvent.click(saveButton)
    
    await waitFor(() => {
      expect(userService.updateUsername).toHaveBeenCalledWith('newadmin')
    })
  })

  it('calls updatePassword on submit if passwords match', async () => {
    render(
      <BrowserRouter>
        <AccountPage />
      </BrowserRouter>
    )
    
    const passwordInput = screen.getByPlaceholderText(/account.newPassword/i)
    const confirmInput = screen.getByPlaceholderText(/account.confirmPassword/i)
    
    fireEvent.change(passwordInput, { target: { value: 'secret123' } })
    fireEvent.change(confirmInput, { target: { value: 'secret123' } })
    
    const saveButton = screen.getByTestId('save-password-btn')
    fireEvent.click(saveButton)
    
    await waitFor(() => {
      expect(userService.updatePassword).toHaveBeenCalledWith('secret123')
    })
  })
})
