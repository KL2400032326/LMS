import { UserCog } from 'lucide-react'

const roleOptions = [
  { value: 'student', label: 'Student' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'admin', label: 'Admin' },
  { value: 'creator', label: 'Content Creator' }
]

const RoleSelector = ({ value, onChange }) => (
  <label className="block">
    <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Select Role</span>
    <div className="relative">
      <UserCog size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <select
        value={value}
        onChange={onChange}
        className="input-base pl-9"
      >
        {roleOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  </label>
)

export default RoleSelector
