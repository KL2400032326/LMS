import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area } from 'recharts'
import { analyticsGrowth } from '../../data/adminDummyData'

const ChartCard = ({ title, children }) => (
  <div className="card h-[320px] p-4">
    <h3 className="mb-3 font-display text-lg">{title}</h3>
    <ResponsiveContainer width="100%" height="88%">{children}</ResponsiveContainer>
  </div>
)

const Analytics = () => (
  <div className="page">
    <div>
      <h1 className="page-title">Analytics</h1>
      <p className="page-subtitle">User growth, course growth and revenue insights</p>
    </div>

    <div className="grid gap-4 xl:grid-cols-3">
      <ChartCard title="User Growth Chart">
        <LineChart data={analyticsGrowth}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line dataKey="users" stroke="#118cff" strokeWidth={3} />
        </LineChart>
      </ChartCard>

      <ChartCard title="Course Growth Chart">
        <BarChart data={analyticsGrowth}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="courses" fill="#06b6d4" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ChartCard>

      <ChartCard title="Revenue Chart">
        <AreaChart data={analyticsGrowth}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.06} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area dataKey="revenue" stroke="#10b981" fill="url(#revGrad)" />
        </AreaChart>
      </ChartCard>
    </div>
  </div>
)

export default Analytics
