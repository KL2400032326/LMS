import { useEffect, useState } from 'react'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts'
import { getInstructorAnalytics } from '../../services/instructorApi'

const Card = ({ title, children }) => (
  <div className="card h-[330px] p-4">
    <h3 className="mb-4 font-display text-lg">{title}</h3>
    <ResponsiveContainer width="100%" height="88%">{children}</ResponsiveContainer>
  </div>
)

const Analytics = () => {
  const [data, setData] = useState({ enrollmentTrend: [], completionTrend: [] })

  useEffect(() => {
    const load = async () => {
      const next = await getInstructorAnalytics()
      setData(next)
    }
    load()
  }, [])

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Enrollment and course progress trends</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Student Enrollment Chart">
          <LineChart data={data.enrollmentTrend}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line dataKey="students" stroke="#118cff" strokeWidth={3} />
          </LineChart>
        </Card>

        <Card title="Course Progress Chart">
          <AreaChart data={data.completionTrend}>
            <defs>
              <linearGradient id="insComp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area dataKey="completion" stroke="#10b981" fill="url(#insComp)" />
          </AreaChart>
        </Card>
      </div>
    </div>
  )
}

export default Analytics
