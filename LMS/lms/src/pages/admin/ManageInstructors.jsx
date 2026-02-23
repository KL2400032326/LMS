import { useState } from 'react'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { instructorsSeed } from '../../data/adminDummyData'

const ManageInstructors = () => {
  const [instructors, setInstructors] = useState(instructorsSeed)
  const [message, setMessage] = useState('')

  return (
    <div className="page">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Manage Instructors</h1>
          <p className="page-subtitle">Monitor instructor performance and profiles</p>
        </div>
        <button className="btn-primary inline-flex items-center gap-2" type="button" onClick={() => setMessage('Add Instructor clicked')}>
          <Plus size={16} /> Add Instructor
        </button>
      </div>

      {message ? <p className="rounded-xl bg-sky-100 px-3 py-2 text-sm text-sky-700">{message}</p> : null}

      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60">
            <tr>{['Name', 'Expertise', 'Courses', 'Status', 'Actions'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {instructors.map(item => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.expertise}</td>
                <td className="px-4 py-3">{item.courses}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="btn-secondary px-2" onClick={() => setMessage(`Viewing ${item.name}`)} type="button"><Eye size={14} /></button>
                    <button className="btn-secondary px-2" onClick={() => setMessage(`Editing ${item.name}`)} type="button"><Pencil size={14} /></button>
                    <button className="btn-secondary px-2 text-rose-600" onClick={() => setInstructors(prev => prev.filter(row => row.id !== item.id))} type="button"><Trash2 size={14} /></button>
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

export default ManageInstructors
