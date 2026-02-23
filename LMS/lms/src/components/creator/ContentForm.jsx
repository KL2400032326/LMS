import { useEffect, useState } from 'react'

const defaultValues = {
  title: '',
  courseName: '',
  topicName: '',
  youtubeLink: '',
  thumbnail: ''
}

const ContentForm = ({ initialValues, onSubmit, submitLabel = 'Save Content', heading = 'Content Form' }) => {
  const [form, setForm] = useState(defaultValues)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (initialValues) {
      setForm({ ...defaultValues, ...initialValues })
    }
  }, [initialValues])

  const handleSubmit = async e => {
    e.preventDefault()

    if (!form.title.trim() || !form.courseName.trim() || !form.topicName.trim() || !form.youtubeLink.trim()) {
      setMessage('Please fill all required fields.')
      return
    }

    await onSubmit(form)
    setMessage('Saved successfully.')
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4 p-5">
      <h2 className="font-display text-xl">{heading}</h2>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Content Title</span>
        <input className="input-base" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Course Name</span>
        <input className="input-base" value={form.courseName} onChange={e => setForm(prev => ({ ...prev, courseName: e.target.value }))} />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Topic Name</span>
        <input className="input-base" value={form.topicName} onChange={e => setForm(prev => ({ ...prev, topicName: e.target.value }))} />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">YouTube Link</span>
        <input className="input-base" value={form.youtubeLink} onChange={e => setForm(prev => ({ ...prev, youtubeLink: e.target.value }))} />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Thumbnail Upload (UI only)</span>
        <input className="input-base" placeholder="Paste image URL" value={form.thumbnail} onChange={e => setForm(prev => ({ ...prev, thumbnail: e.target.value }))} />
      </label>

      {message ? <p className="rounded-xl bg-emerald-100 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}

      <button type="submit" className="btn-primary">{submitLabel}</button>
    </form>
  )
}

export default ContentForm
