import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, BookOpenCheck, GraduationCap, ShieldCheck, Clapperboard, ArrowRight } from 'lucide-react'
import RoleCard from '../components/RoleCard'

const roles = [
  {
    key: 'student',
    name: 'Student',
    icon: BookOpenCheck,
    description: 'Access your courses and track progress'
  },
  {
    key: 'instructor',
    name: 'Instructor',
    icon: GraduationCap,
    description: 'Create and manage your courses'
  },
  {
    key: 'admin',
    name: 'Admin',
    icon: ShieldCheck,
    description: 'Manage platform and users'
  },
  {
    key: 'creator',
    name: 'Content Creator',
    icon: Clapperboard,
    description: 'Upload and manage learning content'
  }
]

const RoleSelect = () => {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState(() => localStorage.getItem('selectedRole') || '')

  const selected = useMemo(() => roles.find(item => item.key === selectedRole) || null, [selectedRole])

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute -left-28 -top-20 h-80 w-80 rounded-full bg-cyan-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-violet-400/25 blur-3xl" />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-8 left-16 h-28 w-28 rounded-full bg-primary-300/25 blur-2xl"
      />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-1 text-xs font-medium text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
            <Sparkles size={14} /> Premium LMS Portal
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Welcome to Learning Management System
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Choose your role to continue
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {roles.map((role, index) => (
            <motion.div
              key={role.key}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <RoleCard
                role={role}
                selected={selectedRole === role.key}
                onClick={() => {
                  setSelectedRole(role.key)
                  localStorage.setItem('selectedRole', role.key)
                }}
              />
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selected ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-8 flex justify-center"
            >
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="btn-primary inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-base"
              >
                Continue as {selected.name} <ArrowRight size={18} />
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default RoleSelect
