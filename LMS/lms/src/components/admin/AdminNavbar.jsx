import { Bell, LogOut, Menu, UserCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import SearchBar from '../common/SearchBar'
import { logoutUser } from '../../services/authService'

const AdminNavbar = ({ onMenuClick, search, setSearch }) => {
  const { user } = useAuth()

  return (
    <header className="glass sticky top-0 z-20 mb-5 flex items-center gap-3 rounded-2xl p-3 md:px-5">
      <button className="btn-secondary px-3 lg:hidden" onClick={onMenuClick} type="button">
        <Menu size={16} />
      </button>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search..."
      />

      <div className="ml-auto flex items-center gap-2">
        <button className="btn-secondary px-3" type="button"><Bell size={16} /></button>
        <button
          type="button"
          onClick={logoutUser}
          className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
        >
          <LogOut size={14} /> Logout
        </button>
        <div className="hidden items-center gap-2 rounded-xl border bg-white/80 px-3 py-1 text-xs dark:bg-slate-900/70 sm:flex">
          <UserCircle2 size={16} className="text-primary-500" />
          <div>
            <p className="font-semibold">{user?.name || 'Admin'}</p>
            <p className="text-[11px] text-slate-500">{user?.email || 'admin@lms.com'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminNavbar
