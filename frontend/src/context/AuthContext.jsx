import { createContext, useContext, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem('ba_token') } catch { return null }
  })

  const login = async (email, password) => {
    const data = await api.login(email, password)
    const tokenVal = data?.data?.token || data?.token
    if (tokenVal) {
      localStorage.setItem('ba_token', tokenVal)
      setToken(tokenVal)
    }
    return data
  }

  const logout = () => {
    localStorage.removeItem('ba_token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
