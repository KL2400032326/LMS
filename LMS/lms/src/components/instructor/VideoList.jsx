const VideoList = ({ videos = [] }) => (
  <div className="space-y-2">
    {videos.length === 0 ? (
      <p className="rounded-xl border p-3 text-sm text-slate-500">No videos uploaded yet.</p>
    ) : (
      videos.map(video => (
        <div key={video.id} className="rounded-xl border p-3">
          <p className="font-medium">{video.title}</p>
          <p className="text-xs text-slate-500">Topic: {video.topic}</p>
          <a href={video.youtubeLink} target="_blank" rel="noreferrer" className="text-xs text-primary-600">Open Video</a>
        </div>
      ))
    )}
  </div>
)

export default VideoList
