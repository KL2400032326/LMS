import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { usersSeed } from '../../data/adminDummyData'

const emptyForm = { name: '', email: '', role: 'student', status: 'Active' }

const ManageUsers = () => {
  const [users, setUsers] = useState(usersSeed)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [modal, setModal] = useState({ open: false, mode: 'add', user: emptyForm })

  const filtered = useMemo(() => {
    return users.filter(user => {
      const text = `${user.name} ${user.email} ${user.role}`.toLowerCase()
      const matchText = text.includes(query.toLowerCase())
      const matchFilter = filter === 'all' ? true : user.role === filter
      return matchText && matchFilter
    })
  }, [users, query, filter])

  const openModal = (mode, user = emptyForm) => setModal({ open: true, mode, user })

  const saveUser = () => {
    if (!modal.user.name || !modal.user.email) return

    if (modal.mode === 'add') {
      setUsers(prev => [...prev, { ...modal.user, id: Date.now() }])
    } else if (modal.mode === 'edit') {
      setUsers(prev => prev.map(item => (item.id === modal.user.id ? modal.user : item)))
    }

    setModal({ open: false, mode: 'add', user: emptyForm })
  }

  return (
    <div className="page">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Manage Users</h1>
          <p className="page-subtitle">Search, filter and manage all platform users</p>
        </div>
        <button className="btn-primary inline-flex items-center gap-2" onClick={() => openModal('add')} type="button">
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="card flex flex-wrap gap-3 p-4">
        <input
          className="input-base max-w-sm"
          placeholder="Search users..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select className="input-base w-48" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
          <option value="student">Student</option>
          <option value="creator">Content Creator</option>
        </select>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60">
            <tr>
              {['Name', 'Email', 'Role', 'Status', 'Actions'].map(head => (
                <th key={head} className="px-4 py-3">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 capitalize">{user.role}</td>
                <td className="px-4 py-3">{user.status}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="btn-secondary px-2" type="button" onClick={() => openModal('view', user)}><Eye size={14} /></button>
                    <button className="btn-secondary px-2" type="button" onClick={() => openModal('edit', user)}><Pencil size={14} /></button>
                    <button className="btn-secondary px-2 text-rose-600" type="button" onClick={() => setUsers(prev => prev.filter(item => item.id !== user.id))}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" onClick={() => setModal({ open: false, mode: 'add', user: emptyForm })}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl capitalize">{modal.mode} User</h3>
            <div className="mt-4 grid gap-3">
              <input className="input-base" placeholder="Name" value={modal.user.name || ''} disabled={modal.mode === 'view'} onChange={e => setModal(prev => ({ ...prev, user: { ...prev.user, name: e.target.value } }))} />
              <input className="input-base" placeholder="Email" value={modal.user.email || ''} disabled={modal.mode === 'view'} onChange={e => setModal(prev => ({ ...prev, user: { ...prev.user, email: e.target.value } }))} />
              <select className="input-base" disabled={modal.mode === 'view'} value={modal.user.role || 'student'} onChange={e => setModal(prev => ({ ...prev, user: { ...prev.user, role: e.target.value } }))}>
                <option value="admin">Admin</option>
                <option value="instructor">Instructor</option>
                <option value="student">Student</option>
                <option value="creator">Content Creator</option>
              </select>
              <select className="input-base" disabled={modal.mode === 'view'} value={modal.user.status || 'Active'} onChange={e => setModal(prev => ({ ...prev, user: { ...prev.user, status: e.target.value } }))}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button className="btn-secondary" type="button" onClick={() => setModal({ open: false, mode: 'add', user: emptyForm })}>Close</button>
              {modal.mode !== 'view' && <button className="btn-primary" type="button" onClick={saveUser}>Save</button>}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ManageUsers
