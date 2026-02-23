import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getInstructorProfile, updateInstructorProfile } from '../../services/instructorApi'

const Profile = () => {
  const { user, login } = useAuth()
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({ name: '', email: '', avatar: '' })

  useEffect(() => {
    const load = async () => {
      const data = await getInstructorProfile()
      setProfile(data)
    }
    load()
  }, [])

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your instructor profile</p>
      </div>

      <div className="card max-w-xl space-y-4">
        <div className="flex items-center gap-4">
          <img src={profile.avatar || user?.avatar || 'https://i.pravatar.cc/120?img=13'} alt="instructor" className="h-20 w-20 rounded-2xl object-cover" />
          <div>
            <p className="font-display text-xl">{profile.name}</p>
            <p className="text-sm text-slate-500">{profile.email}</p>
          </div>
        </div>

        {editing ? (
          <div className="space-y-3">
            <input className="input-base" value={profile.name} onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))} />
            <input className="input-base" value={profile.email} onChange={e => setProfile(prev => ({ ...prev, email: e.target.value }))} />
            <input className="input-base" value={profile.avatar} onChange={e => setProfile(prev => ({ ...prev, avatar: e.target.value }))} placeholder="Avatar URL" />
            <div className="flex gap-2">
              <button
                className="btn-primary"
                type="button"
                onClick={async () => {
                  const updated = await updateInstructorProfile(profile)
                  login({ role: 'instructor', name: updated.name, email: updated.email, avatar: updated.avatar })
                  setEditing(false)
                }}
              >
                Save
              </button>
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
