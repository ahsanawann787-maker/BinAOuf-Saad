import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please fill in both fields')
      return
    }

    setLoading(true)
    setError('')
    try {
      await login(email.trim(), password)
    } catch (err) {
      setError(err.message || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#1a1410',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'DM Sans, sans-serif'
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '40px',
          borderRadius: '16px',
          width: '340px',
          maxWidth: '90vw',
          boxShadow: '0 20px 60px rgba(0,0,0,.4)'
        }}
      >
        <h2
          style={{
            margin: '0 0 4px',
            fontFamily: 'Playfair Display, serif',
            color: '#8a3a28',
            fontSize: '24px',
            fontWeight: '700'
          }}
        >
          Bin Aouf Admin
        </h2>
        <p style={{ margin: '0 0 20px', color: '#888', fontSize: '13px' }}>
          Sign in to continue
        </p>
        <input
          type="email"
          placeholder="Email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxSizing: 'border-box',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxSizing: 'border-box',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: '#8a3a28',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: loading ? 'default' : 'pointer',
            fontSize: '14px',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
        <p
          style={{
            color: '#c0432f',
            fontSize: '12px',
            margin: '10px 0 0',
            minHeight: '14px',
            textAlign: 'center'
          }}
        >
          {error}
        </p>
      </form>
    </div>
  )
}
