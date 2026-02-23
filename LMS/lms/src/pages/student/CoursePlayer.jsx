import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, PlayCircle } from 'lucide-react'
import Playlist from '../../components/student/Playlist'
import VideoPlayer from '../../components/student/VideoPlayer'
import CourseHeader from '../../components/student/CourseHeader'
import VideoControls from '../../components/student/VideoControls'
import { getStudentCourses } from '../../services/studentApi'
import { getCourseProgress, markVideoComplete, setLastWatchedVideo } from '../../services/studentProgressApi'

const CoursePlayer = () => {
  const { courseId } = useParams()
  const playerRef = useRef(null)

  const [course, setCourse] = useState(null)
  const [progress, setProgress] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const load = async () => {
      const allCourses = await getStudentCourses()
      const currentCourse = allCourses.find(item => item.id === courseId) || null
      setCourse(currentCourse)

      if (!currentCourse) return

      const record = await getCourseProgress(currentCourse.id)
      setProgress(record)

      const idx = currentCourse.playlist.findIndex(item => item.videoId === record?.lastWatchedVideo)
      setActiveIndex(idx >= 0 ? idx : 0)
    }

    load()
  }, [courseId])

  const activeTopic = course?.playlist?.[activeIndex]

  const summary = useMemo(() => {
    if (!course || !progress) {
      return { totalTopics: 0, completedTopics: 0, progress: 0, completed: false, lastWatchedTopic: '' }
    }

    const totalTopics = course.playlist.length
    const completedTopics = progress.completedVideos
    const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

    return {
      totalTopics,
      completedTopics,
      progress: percentage,
      completed: percentage === 100,
      lastWatchedTopic: progress.lastWatchedTopic || ''
    }
  }, [course, progress])

  if (!course || !progress) {
    return (
      <div className="page">
        <p className="card">Course not found.</p>
        <Link to="/student-dashboard" className="btn-secondary inline-block">Back</Link>
      </div>
    )
  }

  const isPlaylist = Boolean(course.playlistId)
  const resumeIndex = course.playlist.findIndex(item => item.videoId === progress.lastWatchedVideo)
  const isCurrentVideoCompleted = Boolean(activeTopic?.videoId && progress.completedVideoIds.includes(activeTopic.videoId))
  const hasNextLesson = activeIndex < course.playlist.length - 1

  const setWatched = async index => {
    const topic = course.playlist[index]
    if (!topic) return
    const next = await setLastWatchedVideo(course.id, topic.videoId)
    setProgress(next)
  }

  const selectTopic = async index => {
    setActiveIndex(index)
    await setWatched(index)

    if (!playerRef.current) return

    if (isPlaylist) {
      playerRef.current.playVideoAt(index)
    } else {
      const target = course.playlist[index]
      if (target?.videoId) playerRef.current.loadVideoById(target.videoId)
    }
  }

  const handleReady = event => {
    playerRef.current = event.target

    if (!isPlaylist) {
      if (activeTopic?.videoId) event.target.cueVideoById(activeTopic.videoId)
      return
    }

    event.target.loadPlaylist({ listType: 'playlist', list: course.playlistId, index: activeIndex })
  }

  const completeVideoByIndex = async index => {
    const video = course.playlist[index]
    if (!video) return
    const next = await markVideoComplete(course.id, video.videoId)
    setProgress(next)
  }

  const handleEnd = async event => {
    if (isPlaylist) {
      const idx = event?.target?.getPlaylistIndex?.()
      const effectiveIndex = typeof idx === 'number' && idx >= 0 ? Math.min(idx, course.playlist.length - 1) : activeIndex
      await completeVideoByIndex(effectiveIndex)
      return
    }

    await completeVideoByIndex(activeIndex)
  }

  const handleStateChange = async event => {
    const state = event.data

    if (isPlaylist && state === 1) {
      const idx = event.target.getPlaylistIndex?.()
      if (typeof idx === 'number' && idx >= 0) {
        const mapped = Math.min(idx, course.playlist.length - 1)
        setActiveIndex(mapped)
        await setWatched(mapped)
      }
    }
  }

  return (
    <div className="page">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/student-dashboard" className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Courses
        </Link>

        <button
          type="button"
          className="btn-primary inline-flex items-center gap-2"
          onClick={() => {
            const idx = resumeIndex >= 0 ? resumeIndex : 0
            selectTopic(idx)
          }}
        >
          <PlayCircle size={16} /> Continue Watching
        </button>
      </div>

      <CourseHeader
        course={course}
        currentTopic={activeTopic?.topic || 'No topic available'}
        completedTopics={summary.completedTopics}
        totalTopics={summary.totalTopics}
        progress={summary.progress}
        isCompleted={summary.completed}
      />

      <VideoControls
        isCompleted={isCurrentVideoCompleted}
        onMarkComplete={() => completeVideoByIndex(activeIndex)}
        onNextLesson={() => selectTopic(activeIndex + 1)}
        hasNextLesson={hasNextLesson}
      />

      <div className="grid gap-4 xl:grid-cols-[7fr_3fr]">
        <VideoPlayer
          isPlaylist={isPlaylist}
          playlistId={course.playlistId}
          activeVideoId={activeTopic?.videoId || ''}
          activeIndex={activeIndex}
          onReady={handleReady}
          onEnd={handleEnd}
          onStateChange={handleStateChange}
        />

        <Playlist
          items={course.playlist}
          activeIndex={activeIndex}
          completedVideos={progress.completedVideoIds}
          onSelectTopic={selectTopic}
        />
      </div>
    </div>
  )
}

export default CoursePlayer
