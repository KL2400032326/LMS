import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, CircleCheckBig, Clock3, TrendingUp } from 'lucide-react'
import SummaryCard from '../../components/student/SummaryCard'
import { getRecentActivity, getStudentCourses } from '../../services/studentApi'

const StudentDashboard = () => {
  const [courses, setCourses] = useState([])
  const [activity, setActivity] = useState([])

  useEffect(() => {
    const load = async () => {
      const [courseData, recent] = await Promise.all([getStudentCourses(), getRecentActivity()])
      setCourses(courseData)
      setActivity(recent)
    }
    load()
  }, [])

  const metrics = useMemo(() => {
    const total = courses.length
    const completed = courses.filter(item => item.progress.progress === 100).length
    const inProgress = total - completed
    const overallProgress = total
      ? Math.round(courses.reduce((sum, item) => sum + item.progress.progress, 0) / total)
      : 0

    return { total, completed, inProgress, overallProgress }
  }, [courses])

  const continueLearning = useMemo(
    () => courses.filter(item => item.progress.progress < 100).slice(0, 3),
    [courses]
  )

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Student Dashboard</h1>
        <p className="page-subtitle">Your learning summary and active courses</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total Enrolled Courses" value={metrics.total} icon={BookOpen} tone="primary" />
        <SummaryCard label="Completed Courses" value={metrics.completed} icon={CircleCheckBig} tone="success" />
        <SummaryCard label="In Progress Courses" value={metrics.inProgress} icon={Clock3} tone="warning" />
        <SummaryCard label="Overall Progress %" value={`${metrics.overallProgress}%`} icon={TrendingUp} tone="info" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg">Continue Learning</h2>
            <Link to="/student/courses" className="text-sm font-medium text-primary-600">View All</Link>
          </div>

          <div className="space-y-3">
            {continueLearning.map(course => (
              <div key={course.id} className="rounded-xl border p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-xs text-slate-500">{course.progress.progress}% complete</p>
                    <p className="text-xs text-slate-500">
                      Completed Videos: {course.progress.completedVideos}/{course.progress.totalVideos}
                    </p>
                    <p className="text-xs text-slate-500">
                      Last Topic: {course.progress.lastWatchedTopic || 'Not started'}
                    </p>
                  </div>
                  <Link to={`/student/course/${course.id}`} className="btn-primary">Continue</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <h2 className="mb-3 font-display text-lg">Recent Activity</h2>
          <div className="space-y-3">
            {activity.map(item => (
              <div key={item.id} className="rounded-xl border p-3">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-slate-500">{item.text}</p>
                <p className="text-[11px] text-slate-400">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
