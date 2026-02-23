import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createCourse, getInstructorCourseById, updateCourse } from '../../services/instructorApi'

const CreateCourse = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const [form, setForm] = useState({
    title: '',
    description: '',
    thumbnail: '',
    category: 'Frontend Development'
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadForEdit = async () => {
      if (!editId) return
      const course = await getInstructorCourseById(editId)
      if (!course) return
      setForm({
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        category: course.category
      })
    }
    loadForEdit()
  }, [editId])

  const submit = async e => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) {
      setMessage('Please fill in course title and description.')
      return
    }

    const payload = {
      ...form,
      thumbnail: form.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
    }

    if (editId) {
      await updateCourse(editId, payload)
      setMessage('Course updated successfully.')
    } else {
      await createCourse(payload)
      setMessage('Course created successfully.')
    }

    setTimeout(() => navigate('/instructor/courses'), 700)
  }

  return (
    <div className="page">
      <div>
        <h1 className="page-title">{editId ? 'Edit Course' : 'Create Course'}</h1>
        <p className="page-subtitle">Create or update course metadata</p>
      </div>

      <form onSubmit={submit} className="card max-w-2xl space-y-4 p-5">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Course Title</span>
          <input className="input-base" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Course Description</span>
          <textarea className="input-base min-h-28" value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Thumbnail Upload (UI only)</span>
          <input className="input-base" placeholder="Paste image URL" value={form.thumbnail} onChange={e => setForm(prev => ({ ...prev, thumbnail: e.target.value }))} />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Category</span>
          <select className="input-base" value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}>
            <option>Frontend Development</option>
            <option>Backend Development</option>
            <option>Design</option>
            <option>Data Science</option>
          </select>
        </label>

        {message ? <p className="rounded-xl bg-sky-100 px-3 py-2 text-sm text-sky-700">{message}</p> : null}

        <button className="btn-primary" type="submit">{editId ? 'Update Course' : 'Create Course'}</button>
      </form>
    </div>
  )
}

export default CreateCourse
