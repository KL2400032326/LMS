import { useState } from 'react'
import { pendingContentSeed } from '../../data/adminDummyData'

const ContentApproval = () => {
  const [items, setItems] = useState(pendingContentSeed)
  const [message, setMessage] = useState('')

  const action = (id, type) => {
    const target = items.find(item => item.id === id)
    if (!target) return
    setItems(prev => prev.filter(item => item.id !== id))
    setMessage(`${target.course} ${type}`)
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Content Approval</h1>
        <p className="page-subtitle">Review and moderate pending courses</p>
      </div>

      {message ? <p className="rounded-xl bg-emerald-100 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <h3 className="font-medium">{item.course}</h3>
              <p className="text-sm text-slate-500">Instructor: {item.instructor} | Submitted: {item.submittedAt}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary" type="button" onClick={() => action(item.id, 'approved')}>Approve</button>
              <button className="btn-secondary text-rose-600" type="button" onClick={() => action(item.id, 'rejected')}>Reject</button>
            </div>
          </div>
        ))}
        {items.length === 0 ? <p className="card text-sm text-slate-500">No pending content.</p> : null}
      </div>
    </div>
  )
}

export default ContentApproval
