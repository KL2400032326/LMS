import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const CourseCard = ({ course }) => (
  <motion.article whileHover={{ y: -4 }} className="glass rounded-3xl p-4 shadow-glow">
    <Link to={`/instructor/upload-video/${course.id}`}>
      <img src={course.thumbnail} alt={course.title} className="h-40 w-full rounded-2xl object-cover" />
    </Link>

    <div className="mt-4 space-y-2">
      <Link to={`/instructor/upload-video/${course.id}`} className="block font-display text-lg leading-tight hover:text-primary-600">
        {course.title}
      </Link>
      <p className="text-sm text-slate-500">Students: {course.totalStudents}</p>
      <p className="text-sm text-slate-500">Videos: {course.videos.length}</p>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-slate-500">Completion</span>
          <span className="font-semibold text-primary-600">{course.completion}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-cyan-400" style={{ width: `${course.completion}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-3">
        <Link to={`/instructor/upload-video/${course.id}?mode=view`} className="btn-secondary text-center">View Course</Link>
        <Link to={`/instructor/create-course?edit=${course.id}`} className="btn-secondary text-center">Edit Course</Link>
        <Link to={`/instructor/upload-video/${course.id}`} className="btn-primary text-center">Upload Video</Link>
      </div>
    </div>
  </motion.article>
)

export default CourseCard
