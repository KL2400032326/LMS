import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCreatorContent, getCreatorDashboardStats } from '../../services/creatorApi'

const StatCard = ({ label, value }) => (
  <div className="card p-4">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="mt-2 font-display text-2xl">{value}</p>
  </div>
)

const CreatorDashboard = () => {
  const [stats, setStats] = useState({
    totalContentsCreated: 0,
    totalCoursesUsingContent: 0,
    totalVideosUploaded: 0,
    contentUsage: 0
  })
  const [recent, setRecent] = useState([])

  useEffect(() => {
    const load = async () => {
      const [statsData, content] = await Promise.all([getCreatorDashboardStats(), getCreatorContent()])
      setStats(statsData)
      setRecent(content.slice(0, 5))
    }
    load()
  }, [])

  return (
    <div className="page">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Content Creator Dashboard</h1>
          <p className="page-subtitle">Manage and optimize your reusable learning assets</p>
        </div>
        <Link to="/creator/upload" className="btn-primary">Upload Content</Link>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Contents Created" value={stats.totalContentsCreated} />
        <StatCard label="Total Courses Using Content" value={stats.totalCoursesUsingContent} />
        <StatCard label="Total Videos Uploaded" value={stats.totalVideosUploaded} />
        <StatCard label="Content Usage %" value={`${stats.contentUsage}%`} />
      </div>

      <div className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg">Recent Uploaded Content</h2>
          <Link to="/creator/content" className="text-sm font-medium text-primary-600">Open My Content</Link>
        </div>

        <div className="space-y-3">
          {recent.map(item => (
            <motion.div key={item.id} whileHover={{ x: 3 }} className="rounded-xl border p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.courseName} | {item.topicName} | {item.uploadDate}</p>
                </div>
                <Link to={`/creator/edit/${item.id}`} className="btn-secondary">Edit</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CreatorDashboard
