import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import VideoList from '../../components/instructor/VideoList'
import { getInstructorCourseById, getInstructorCourses, getPrimaryInstructorCourseId, uploadVideo } from '../../services/instructorApi'

const UploadVideo = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || 'upload'

  const [allCourses, setAllCourses] = useState([])
  const [activeCourse, setActiveCourse] = useState(null)
  const [form, setForm] = useState({ title: '', topic: '', youtubeLink: '' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const courses = await getInstructorCourses()
      setAllCourses(courses)

      const resolvedId = courseId === 'default' ? await getPrimaryInstructorCourseId() : courseId
      const course = resolvedId ? await getInstructorCourseById(resolvedId) : null

      if (courseId === 'default' && resolvedId) {
        navigate(`/instructor/upload-video/${resolvedId}`, { replace: true })
      }

      setActiveCourse(course)
    }

    load()
  }, [courseId, navigate])

  const videos = useMemo(() => activeCourse?.videos || [], [activeCourse])

  if (!activeCourse) {
    return (
      <div className="page">
        <p className="card">Course not found.</p>
        <Link className="btn-secondary inline-block" to="/instructor/courses">Back to My Courses</Link>
      </div>
    )
  }

  const submit = async e => {
    e.preventDefault()
    if (!form.title.trim() || !form.topic.trim() || !form.youtubeLink.trim()) {
      setMessage('Please complete all video fields.')
      return
    }

    const updated = await uploadVideo(activeCourse.id, form)
    setActiveCourse(updated)
    setMessage('Video uploaded successfully.')
    setForm({ title: '', topic: '', youtubeLink: '' })
  }

  return (
    <div className="page">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">{mode === 'view' ? 'Course Details' : 'Upload Video'}</h1>
          <p className="page-subtitle">{activeCourse.title}</p>
        </div>

        <select
          className="input-base w-72"
          value={activeCourse.id}
          onChange={e => navigate(`/instructor/upload-video/${e.target.value}`)}
        >
          {allCourses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </div>

      {mode !== 'view' ? (
        <form onSubmit={submit} className="card max-w-2xl space-y-4 p-5">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Video Title</span>
            <input className="input-base" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Topic Name</span>
            <input className="input-base" value={form.topic} onChange={e => setForm(prev => ({ ...prev, topic: e.target.value }))} />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">YouTube Link</span>
            <input className="input-base" value={form.youtubeLink} onChange={e => setForm(prev => ({ ...prev, youtubeLink: e.target.value }))} />
          </label>

          {message ? <p className="rounded-xl bg-emerald-100 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}

          <button className="btn-primary" type="submit">Upload</button>
        </form>
      ) : null}

      <div className="card p-5">
        <h2 className="mb-3 font-display text-lg">Video List</h2>
        <VideoList videos={videos} />
      </div>
    </div>
  )
}

export default UploadVideo
