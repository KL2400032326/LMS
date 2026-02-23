import { courses } from '../data/courses'

const PROGRESS_KEY = 'studentProgressData'
const delay = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms))

const readStore = () => {
  const raw = localStorage.getItem(PROGRESS_KEY)
  if (!raw) return {}

  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const writeStore = store => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(store))
}

const normalizeRecord = (course, existing = {}) => {
  const validVideoIds = new Set(course.playlist.map(item => item.videoId))
  const completedVideoIds = Array.from(new Set(Array.isArray(existing.completedVideoIds) ? existing.completedVideoIds : []))
    .filter(videoId => validVideoIds.has(videoId))

  const totalVideos = course.playlist.length
  const completedVideos = completedVideoIds.length
  const progress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0

  const fallbackVideoId = course.playlist[0]?.videoId || ''
  const lastWatchedVideo = validVideoIds.has(existing.lastWatchedVideo) ? existing.lastWatchedVideo : fallbackVideoId
  const lastTopicFromVideo = course.playlist.find(item => item.videoId === lastWatchedVideo)?.topic || ''

  return {
    courseId: course.id,
    totalVideos,
    completedVideos,
    progress,
    completedVideoIds,
    lastWatchedVideo,
    lastWatchedTopic: existing.lastWatchedTopic || lastTopicFromVideo,
    updatedAt: new Date().toISOString()
  }
}

const ensureRecord = courseId => {
  const course = courses.find(item => item.id === courseId)
  if (!course) return { course: null, store: null, record: null }

  const store = readStore()
  const current = normalizeRecord(course, store[courseId])

  if (!store[courseId] || JSON.stringify(store[courseId]) !== JSON.stringify(current)) {
    store[courseId] = current
    writeStore(store)
  }

  return { course, store, record: current }
}

export const getCourseProgress = async courseId => {
  await delay()
  const { record } = ensureRecord(courseId)
  return record
}

export const markVideoComplete = async (courseId, videoId) => {
  await delay()
  const { course, store, record } = ensureRecord(courseId)
  if (!course || !store || !record) return null

  const video = course.playlist.find(item => item.videoId === videoId)
  if (!video) return record

  const next = normalizeRecord(course, {
    ...record,
    completedVideoIds: Array.from(new Set([...record.completedVideoIds, videoId])),
    lastWatchedVideo: videoId,
    lastWatchedTopic: video.topic
  })

  store[courseId] = next
  writeStore(store)
  return next
}

export const setLastWatchedVideo = async (courseId, videoId) => {
  await delay(50)
  const { course, store, record } = ensureRecord(courseId)
  if (!course || !store || !record) return null

  const video = course.playlist.find(item => item.videoId === videoId)
  if (!video) return record

  const next = normalizeRecord(course, {
    ...record,
    lastWatchedVideo: videoId,
    lastWatchedTopic: video.topic
  })

  store[courseId] = next
  writeStore(store)
  return next
}
