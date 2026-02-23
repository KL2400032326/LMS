import { useEffect, useState } from 'react'
import ContentCard from '../../components/creator/ContentCard'
import { deleteContent, getCreatorContent } from '../../services/creatorApi'

const MyContent = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    const load = async () => {
      const data = await getCreatorContent()
      setItems(data)
    }

    load()
  }, [])

  const handleDelete = async contentId => {
    await deleteContent(contentId)
    setItems(prev => prev.filter(item => item.id !== contentId))
  }

  return (
    <div className="page">
      <div>
        <h1 className="page-title">My Content</h1>
        <p className="page-subtitle">View, edit, and manage all uploaded assets</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map(item => (
          <ContentCard key={item.id} item={item} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}

export default MyContent
