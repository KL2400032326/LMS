import { CheckCircle2, StepForward } from 'lucide-react'

const VideoControls = ({ isCompleted, onMarkComplete, onNextLesson, hasNextLesson }) => (
  <div className="card flex flex-wrap items-center justify-end gap-2 p-3">
    <button
      type="button"
      onClick={onMarkComplete}
      disabled={isCompleted}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
        isCompleted
          ? 'cursor-not-allowed bg-emerald-100 text-emerald-700'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      <CheckCircle2 size={16} /> {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
    </button>

    <button
      type="button"
      onClick={onNextLesson}
      disabled={!hasNextLesson}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
        hasNextLesson
          ? 'bg-primary-500 text-white hover:bg-primary-600'
          : 'cursor-not-allowed bg-slate-200 text-slate-500'
      }`}
    >
      <StepForward size={16} /> Next Lesson
    </button>
  </div>
)

export default VideoControls
