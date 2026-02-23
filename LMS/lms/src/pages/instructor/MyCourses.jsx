import { useEffect, useState } from 'react'
import CourseCard from '../../components/instructor/CourseCard'
import { getInstructorCourses } from '../../services/instructorApi'

const MyCourses = () => {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const load = async () => {
      const data = await getInstructorCourses()
      setCourses(data)
    }
    load()
  }, [])

  return (
    <div className="page">
      <div>
        <h1 className="page-title">My Courses</h1>
        <p className="page-subtitle">Manage your published and draft courses</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map(course => <CourseCard key={course.id} course={course} />)}
      </div>
    </div>
  )
}

export default MyCourses
