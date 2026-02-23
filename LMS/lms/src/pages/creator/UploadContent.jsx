import { useNavigate } from 'react-router-dom'
import ContentForm from '../../components/creator/ContentForm'
import { uploadContent } from '../../services/creatorApi'

const UploadContent = () => {
  const navigate = useNavigate()

  const handleUpload = async values => {
    await uploadContent(values)
    setTimeout(() => navigate('/creator/content'), 500)
  }

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Upload Content</h1>
        <p className="page-subtitle">Create reusable media for courses</p>
      </div>

      <ContentForm heading="Upload New Content" submitLabel="Upload Content" onSubmit={handleUpload} />
    </div>
  )
}

export default UploadContent
