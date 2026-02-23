import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ContentForm from '../../components/creator/ContentForm'
import { editContent, getCreatorContent } from '../../services/creatorApi'

const EditContent = () => {
  const { contentId } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)

  useEffect(() => {
    const load = async () => {
      const data = await getCreatorContent()

      if (contentId === 'default') {
        const firstId = data[0]?.id
        if (firstId) {
          navigate(`/creator/edit/${firstId}`, { replace: true })
        }
        return
      }

      const current = data.find(entry => entry.id === contentId) || null
      setItem(current)
    }

    load()
  }, [contentId, navigate])

  if (!item) {
    return (
      <div className="page">
        <p className="card">Content not found.</p>
        <Link to="/creator/content" className="btn-secondary inline-block">Back to My Content</Link>
      </div>
    )
  }

  const handleUpdate = async values => {
    await editContent(contentId, values)
    setTimeout(() => navigate('/creator/content'), 500)
  }

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Edit Content</h1>
        <p className="page-subtitle">Update content title, topic, and link</p>
      </div>

      <ContentForm heading="Update Content" submitLabel="Save Changes" initialValues={item} onSubmit={handleUpdate} />
    </div>
  )
}

export default EditContent
