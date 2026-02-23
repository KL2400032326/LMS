import { useEffect, useState } from 'react'
import { getInstructorStudents } from '../../services/instructorApi'

const Students = () => {
  const [students, setStudents] = useState([])

  useEffect(() => {
    const load = async () => {
      const data = await getInstructorStudents()
      setStudents(data)
    }
    load()
  }, [])

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Students</h1>
        <p className="page-subtitle">Track student enrollments and progress</p>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60">
            <tr>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3">Course Enrolled</th>
              <th className="px-4 py-3">Progress %</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="border-t">
                <td className="px-4 py-3">{student.name}</td>
                <td className="px-4 py-3">{student.course}</td>
                <td className="px-4 py-3">{student.progress}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Students
