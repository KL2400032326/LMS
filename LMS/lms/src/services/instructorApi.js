import {
  completionTrend,
  defaultInstructorProfile,
  enrollmentTrend,
  instructorActivity,
  instructorStudents,
  seedInstructorCourses
} from '../data/instructorCourses'

const COURSES_KEY = 'instructor-courses'
const PROFILE_KEY = 'instructor-profile'

const delay = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms))

const readCourses = () => {
  const raw = localStorage.getItem(COURSES_KEY)
  if (!raw) return seedInstructorCourses

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : seedInstructorCourses
  } catch {
    return seedInstructorCourses
  }
}

const writeCourses = courses => {
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses))
}

export const getInstructorCourses = async () => {
  await delay()
  const courses = readCourses()
  if (!localStorage.getItem(COURSES_KEY)) writeCourses(courses)
  return courses
}

export const getInstructorCourseById = async courseId => {
  await delay(80)
  const courses = await getInstructorCourses()
  return courses.find(item => item.id === courseId) || null
}

export const getPrimaryInstructorCourseId = async () => {
  const courses = await getInstructorCourses()
  return courses[0]?.id || null
}

export const createCourse = async payload => {
  await delay(100)
  const courses = readCourses()
  const nextCourse = {
    id: `ins-${Date.now()}`,
    title: payload.title,
    description: payload.description,
    thumbnail: payload.thumbnail,
    category: payload.category,
    totalStudents: 0,
    completion: 0,
    videos: []
  }
  const next = [nextCourse, ...courses]
  writeCourses(next)
  return nextCourse
}

export const updateCourse = async (courseId, patch) => {
  await delay(90)
  const courses = readCourses()
  const next = courses.map(course => (course.id === courseId ? { ...course, ...patch } : course))
  writeCourses(next)
  return next.find(item => item.id === courseId) || null
}

export const uploadVideo = async (courseId, video) => {
  await delay(90)
  const courses = readCourses()
  const next = courses.map(course => {
    if (course.id !== courseId) return course
    return {
      ...course,
      videos: [...course.videos, { id: `vid-${Date.now()}`, ...video }]
    }
  })
  writeCourses(next)
  return next.find(item => item.id === courseId) || null
}

export const getInstructorStudents = async () => {
  await delay()
  return instructorStudents
}

export const getInstructorAnalytics = async () => {
  await delay()
  return {
    enrollmentTrend,
    completionTrend
  }
}

export const getInstructorActivity = async () => {
  await delay(80)
  return instructorActivity
}

export const getInstructorMetrics = async () => {
  const courses = await getInstructorCourses()
  const totalCourses = courses.length
  const totalStudents = courses.reduce((sum, item) => sum + item.totalStudents, 0)
  const totalVideos = courses.reduce((sum, item) => sum + item.videos.length, 0)
  const completionRate = totalCourses ? Math.round(courses.reduce((sum, item) => sum + item.completion, 0) / totalCourses) : 0

  return {
    totalCourses,
    totalStudents,
    totalVideos,
    completionRate
  }
}

export const getInstructorProfile = async () => {
  await delay(80)
  const raw = localStorage.getItem(PROFILE_KEY)
  if (!raw) return defaultInstructorProfile

  try {
    return { ...defaultInstructorProfile, ...JSON.parse(raw) }
  } catch {
    return defaultInstructorProfile
  }
}

export const updateInstructorProfile = async payload => {
  await delay(90)
  const next = { ...defaultInstructorProfile, ...payload }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(next))
  return next
}
