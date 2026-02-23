import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, BookOpen, UserSquare2, GraduationCap, DollarSign, ClipboardCheck } from 'lucide-react'
import { adminStats } from '../../data/adminDummyData'

const iconMap = {
  users: Users,
  courses: BookOpen,
  students: UserSquare2,
  instructors: GraduationCap,
  revenue: DollarSign,
  pending: ClipboardCheck
}

const Skeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="card animate-pulse p-5">
        <div className="h-5 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 h-8 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    ))}
  </div>
)

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(id)
  }, [])

  const cards = useMemo(() => adminStats, [])

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Command center for users, courses, approvals and operations</p>
      </div>

      {loading ? (
        <Skeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = iconMap[card.key]
            return (
              <motion.button
                key={card.key}
                type="button"
                onClick={() => navigate(card.route)}
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card group relative overflow-hidden text-left"
              >
                <div className={`absolute right-0 top-0 h-24 w-24 bg-gradient-to-br ${card.color} opacity-20 blur-2xl transition group-hover:opacity-30`} />
                <div className="mb-3 inline-flex rounded-xl bg-primary-500/10 p-2 text-primary-600 dark:bg-primary-500/20 dark:text-primary-300">
                  <Icon size={18} />
                </div>
                <p className="text-sm text-slate-500">{card.title}</p>
                <p className="mt-1 font-display text-3xl font-semibold">{card.value}</p>
                <p className="mt-3 text-xs text-primary-600">Open details</p>
              </motion.button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
