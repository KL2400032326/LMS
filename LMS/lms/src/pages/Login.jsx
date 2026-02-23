import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Lock, LogIn, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { demoUsers } from '../data/demoUsers'
import { loginUser } from '../services/authApi'

const dashboardByRole = {
  student: '/student-dashboard',
  instructor: '/instructor-dashboard',
  admin: '/admin-dashboard',
  creator: '/creator-dashboard'
}

const roleLabels = {
  student: 'Student',
  instructor: 'Instructor',
  admin: 'Admin',
  creator: 'Content Creator'
}

const Login = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const selectedRole = localStorage.getItem('selectedRole')

  const demo = useMemo(() => {
    if (!selectedRole) return null
    return demoUsers[selectedRole] || null
  }, [selectedRole])

  const [form, setForm] = useState({
    email: demo?.email || '',
    password: demo?.password || ''
  })

  if (!selectedRole || !demo) {
    return <Navigate to="/" replace />
  }

  if (isAuthenticated && user?.role) {
    return <Navigate to={dashboardByRole[user.role] || '/'} replace />
  }

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await loginUser({ role: selectedRole, ...form })

    if (!result.success) {
      setError(result.message || 'Login failed.')
      setLoading(false)
      return
    }

    login({
      role: result.user.role,
      email: result.user.email,
      name: result.user.name,
      avatar: result.user.avatar
    })

    navigate(dashboardByRole[result.user.role] || '/', { replace: true })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-primary-300/30 blur-3xl" />

      <form onSubmit={handleLogin} className="glass w-full max-w-md rounded-3xl p-6 shadow-glow">
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="rounded-xl bg-primary-500 p-2 text-white"><GraduationCap size={18} /></span>
          <span className="font-display text-lg">LMS Portal</span>
        </div>

        <h1 className="font-display text-3xl">LMS Login</h1>
        <p className="mt-2 text-sm font-medium text-primary-600 dark:text-primary-300">Welcome {demo.name}</p>
        <p className="text-sm text-slate-500">{roleLabels[selectedRole]} Login</p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Email</span>
            <div className="relative w-full">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 transform text-gray-400 pointer-events-none"
              />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Password</span>
            <div className="relative w-full">
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 transform text-gray-400 pointer-events-none"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-12 pr-12 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {error ? <p className="rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

          <button type="submit" className="btn-primary inline-flex w-full items-center justify-center gap-2" disabled={loading}>
            <LogIn size={16} /> {loading ? 'Signing in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
