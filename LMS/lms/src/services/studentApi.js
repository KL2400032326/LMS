import { courses } from '../data/courses'

const PROGRESS_KEY = 'studentProgressData'
const PROFILE_KEY = 'studentProfileData'

const defaultProfile = {
  name: 'Student User',
  email: 'student@lms.com',
  avatar: 'https://i.pravatar.cc/120?img=31'
}

const delay = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms))

const readProgressStore = () => {
  const raw = localStorage.getItem(PROGRESS_KEY)
  if (!raw) return {}

  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const writeProgressStore = store => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(store))
}

const normalizeRecord = (course, existing = {}) => {
  const completedVideoIds = Array.isArray(existing.completedVideoIds) ? existing.completedVideoIds : []
  const totalVideos = course.playlist.length
  const completedVideos = completedVideoIds.length
  const progress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0

  return {
    courseId: course.id,
    totalVideos,
    completedVideos,
    progress,
    completedVideoIds,
    lastWatchedVideo: existing.lastWatchedVideo || course.playlist[0]?.videoId || '',
    lastWatchedTopic: existing.lastWatchedTopic || course.playlist[0]?.topic || '',
    updatedAt: existing.updatedAt || new Date().toISOString()
  }
}

const readLegacyCourseProgress = course => {
  const legacyRaw = localStorage.getItem(`${course.id}-progress`)
  if (!legacyRaw) return null

  try {
    const parsed = JSON.parse(legacyRaw)
    const completedVideoIds = Array.isArray(parsed.completedVideos)
      ? parsed.completedVideos
      : course.playlist
          .filter(item => Array.isArray(parsed.completedTopics) && parsed.completedTopics.includes(item.topic))
          .map(item => item.videoId)

    const lastWatchedVideo =
      parsed.lastWatchedVideo ||
      course.playlist.find(item => item.topic === parsed.lastWatchedTopic)?.videoId ||
      ''

    return {
      completedVideoIds,
      lastWatchedVideo,
      lastWatchedTopic: parsed.lastWatchedTopic || ''
    }
  } catch {
    return null
  }
}

const ensureProgressInitialized = () => {
  const current = readProgressStore()
  const next = { ...current }
  let changed = false

  courses.forEach(course => {
    const base = next[course.id] ? normalizeRecord(course, next[course.id]) : normalizeRecord(course)
    const legacy = readLegacyCourseProgress(course)

    if (!next[course.id]) {
      next[course.id] = normalizeRecord(course, legacy || base)
      changed = true
      return
    }

    if (legacy) {
      const mergedCompleted = Array.from(new Set([...(base.completedVideoIds || []), ...(legacy.completedVideoIds || [])]))
      const mergedLastVideo = legacy.lastWatchedVideo || base.lastWatchedVideo
      const mergedLastTopic = legacy.lastWatchedTopic || base.lastWatchedTopic
      const merged = normalizeRecord(course, {
        ...base,
        completedVideoIds: mergedCompleted,
        lastWatchedVideo: mergedLastVideo,
        lastWatchedTopic: mergedLastTopic,
        updatedAt: new Date().toISOString()
      })

      if (JSON.stringify(base) !== JSON.stringify(merged)) {
        next[course.id] = merged
        changed = true
      } else {
        next[course.id] = base
      }
    } else {
      next[course.id] = base
    }
  })

  if (changed) writeProgressStore(next)
  return next
}

export const getStudentCourses = async () => {
  await delay()
  const store = ensureProgressInitialized()

  return courses.map(course => {
    const progress = store[course.id] || normalizeRecord(course)
    return {
      ...course,
      progress
    }
  })
}

export const getStudentProgress = async () => {
  await delay()
  const store = ensureProgressInitialized()
  return Object.values(store)
}

export const getCourseProgress = async courseId => {
  await delay(60)
  const course = courses.find(item => item.id === courseId)
  if (!course) return null

  const store = ensureProgressInitialized()
  return normalizeRecord(course, store[courseId])
}

export const markVideoCompleted = async (courseId, videoId) => {
  await delay(60)

  const course = courses.find(item => item.id === courseId)
  if (!course) return null

  const topic = course.playlist.find(item => item.videoId === videoId)
  const store = ensureProgressInitialized()
  const existing = normalizeRecord(course, store[courseId])

  const next = normalizeRecord(course, {
    ...existing,
    completedVideoIds: Array.from(new Set([...existing.completedVideoIds, videoId])),
    lastWatchedVideo: videoId,
    lastWatchedTopic: topic?.topic || existing.lastWatchedTopic,
    updatedAt: new Date().toISOString()
  })

  store[courseId] = next
  writeProgressStore(store)
  return next
}

export const updateLastWatchedVideo = async (courseId, videoId) => {
  await delay(40)

  const course = courses.find(item => item.id === courseId)
  if (!course) return null

  const topic = course.playlist.find(item => item.videoId === videoId)
  const store = ensureProgressInitialized()
  const existing = normalizeRecord(course, store[courseId])

  const next = normalizeRecord(course, {
    ...existing,
    lastWatchedVideo: videoId,
    lastWatchedTopic: topic?.topic || existing.lastWatchedTopic,
    updatedAt: new Date().toISOString()
  })

  store[courseId] = next
  writeProgressStore(store)
  return next
}

export const getStudentProfile = async () => {
  await delay()
  const raw = localStorage.getItem(PROFILE_KEY)
  if (!raw) return defaultProfile

  try {
    const parsed = JSON.parse(raw)
    return { ...defaultProfile, ...parsed }
  } catch {
    return defaultProfile
  }
}

export const updateStudentProfile = async payload => {
  await delay()
  const next = { ...defaultProfile, ...payload }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(next))
  return next
}

export const getCertificates = async () => {
  await delay()
  const coursesWithProgress = await getStudentCourses()
  return coursesWithProgress.filter(item => item.progress.progress === 100)
}

export const getRecentActivity = async () => {
  await delay()
  const coursesWithProgress = await getStudentCourses()

  return coursesWithProgress
    .filter(item => item.progress.completedVideos > 0)
    .slice(0, 4)
    .map(item => ({
      id: item.id,
      title: item.title,
      text: `Watched ${item.progress.completedVideos}/${item.progress.totalVideos} videos`,
      time: 'Recently'
    }))
}
