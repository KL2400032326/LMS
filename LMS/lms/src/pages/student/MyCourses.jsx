import { useEffect, useState } from 'react'
import CourseCard from '../../components/student/CourseCard'
import { getStudentCourses } from '../../services/studentApi'

const MyCourses = () => {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const load = async () => {
      const data = await getStudentCourses()
      setCourses(data)
    }
    load()
  }, [])

  return (
    <div className="page">
      <div>
        <h1 className="page-title">My Courses</h1>
        <p className="page-subtitle">Continue your enrolled courses</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map(course => <CourseCard key={course.id} course={course} />)}
      </div>
    </div>
  )
}

export default MyCourses
