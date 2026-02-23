import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const Profile = () => {
  const { user, login } = useAuth()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || 'Admin User')
  const [email, setEmail] = useState(user?.email || 'admin@lms.com')

  const save = () => {
    login({ role: 'admin', name, email, avatar: user?.avatar })
    setEditing(false)
  }

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Admin profile and account preferences</p>
      </div>

      <div className="card max-w-2xl space-y-4">
        <div className="flex items-center gap-4">
          <img src={user?.avatar || 'https://i.pravatar.cc/120?img=14'} alt="admin" className="h-20 w-20 rounded-2xl object-cover" />
          <div>
            <p className="font-display text-xl">{name}</p>
            <p className="text-sm text-slate-500">{email}</p>
          </div>
        </div>

        {editing ? (
          <div className="space-y-3">
            <input className="input-base" value={name} onChange={e => setName(e.target.value)} />
            <input className="input-base" value={email} onChange={e => setEmail(e.target.value)} />
            <div className="flex gap-2">
              <button className="btn-primary" type="button" onClick={save}>Save</button>
              <button className="btn-secondary" type="button" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="btn-secondary" type="button" onClick={() => setEditing(true)}>Edit Profile</button>
        )}
      </div>
    </div>
  )
}

export default Profile
