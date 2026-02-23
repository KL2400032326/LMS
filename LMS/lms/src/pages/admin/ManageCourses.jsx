import { useState } from 'react'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { coursesSeed } from '../../data/adminDummyData'

const ManageCourses = () => {
  const [courses, setCourses] = useState(coursesSeed)
  const [message, setMessage] = useState('')

  const handleAction = (text) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 1800)
  }

  return (
    <div className="page">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Manage Courses</h1>
          <p className="page-subtitle">Manage course catalog and lifecycle states</p>
        </div>
        <button className="btn-primary inline-flex items-center gap-2" onClick={() => handleAction('Add Course clicked')} type="button">
          <Plus size={16} /> Add Course
        </button>
      </div>

      {message ? <p className="rounded-xl bg-emerald-100 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}

      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60">
            <tr>{['Course Name', 'Instructor', 'Students Count', 'Status', 'Actions'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id} className="border-t">
                <td className="px-4 py-3">{course.name}</td>
                <td className="px-4 py-3">{course.instructor}</td>
                <td className="px-4 py-3">{course.students}</td>
                <td className="px-4 py-3">{course.status}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="btn-secondary px-2" onClick={() => handleAction(`Viewing ${course.name}`)} type="button"><Eye size={14} /></button>
                    <button className="btn-secondary px-2" onClick={() => handleAction(`Editing ${course.name}`)} type="button"><Pencil size={14} /></button>
                    <button className="btn-secondary px-2 text-rose-600" onClick={() => setCourses(prev => prev.filter(item => item.id !== course.id))} type="button"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageCourses
