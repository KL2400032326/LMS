import {
  contentUsageTrend,
  courseDistribution,
  defaultCreatorProfile,
  seedCreatorContent
} from '../data/creatorContent'

const CONTENT_KEY = 'creator-content'
const PROFILE_KEY = 'creator-profile'

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms))

const readContent = () => {
  const raw = localStorage.getItem(CONTENT_KEY)
  if (!raw) return seedCreatorContent

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : seedCreatorContent
  } catch {
    return seedCreatorContent
  }
}

const writeContent = content => {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content))
}

const ensureContent = () => {
  const list = readContent()
  if (!localStorage.getItem(CONTENT_KEY)) writeContent(list)
  return list
}

export const getCreatorContent = async () => {
  await delay()
  return ensureContent()
}

export const uploadContent = async payload => {
  await delay(120)

  const current = ensureContent()
  const nextItem = {
    id: `crt-${Date.now()}`,
    title: payload.title,
    courseName: payload.courseName,
    topicName: payload.topicName,
    youtubeLink: payload.youtubeLink,
    thumbnail:
      payload.thumbnail ||
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    uploadDate: new Date().toISOString().slice(0, 10),
    usagePercent: 0
  }

  const next = [nextItem, ...current]
  writeContent(next)
  return nextItem
}

export const editContent = async (contentId, patch) => {
  await delay(100)

  const current = ensureContent()
  const next = current.map(item => (item.id === contentId ? { ...item, ...patch } : item))
  writeContent(next)

  return next.find(item => item.id === contentId) || null
}

export const deleteContent = async contentId => {
  await delay(100)

  const current = ensureContent()
  const next = current.filter(item => item.id !== contentId)
  writeContent(next)

  return true
}

export const getCreatorDashboardStats = async () => {
  const content = await getCreatorContent()
  const totalContentsCreated = content.length
  const totalCoursesUsingContent = new Set(content.map(item => item.courseName)).size
  const totalVideosUploaded = content.length
  const contentUsage = totalContentsCreated
    ? Math.round(content.reduce((sum, item) => sum + (item.usagePercent || 0), 0) / totalContentsCreated)
    : 0

  return {
    totalContentsCreated,
    totalCoursesUsingContent,
    totalVideosUploaded,
    contentUsage
  }
}

export const getCreatorAnalytics = async () => {
  await delay()

  const content = await getCreatorContent()
  const distributionMap = content.reduce((acc, item) => {
    acc[item.courseName] = (acc[item.courseName] || 0) + 1
    return acc
  }, {})

  const dynamicDistribution = Object.entries(distributionMap).map(([course, value]) => ({ course, value }))

  return {
    usageTrend: contentUsageTrend,
    distribution: dynamicDistribution.length > 0 ? dynamicDistribution : courseDistribution
  }
}

export const getCreatorProfile = async () => {
  await delay(80)
  const raw = localStorage.getItem(PROFILE_KEY)
  if (!raw) return defaultCreatorProfile

  try {
    return { ...defaultCreatorProfile, ...JSON.parse(raw) }
  } catch {
    return defaultCreatorProfile
  }
}

export const updateCreatorProfile = async payload => {
  await delay(90)
  const next = { ...defaultCreatorProfile, ...payload }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(next))
  return next
}
