import { useState } from 'react'
import { Download } from 'lucide-react'
import { reportSeed } from '../../data/adminDummyData'

const Reports = () => {
  const [status, setStatus] = useState('')

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">Downloadable reports and system exports</p>
      </div>

      {status ? <p className="rounded-xl bg-sky-100 px-3 py-2 text-sm text-sky-700">{status}</p> : null}

      <div className="space-y-3">
        {reportSeed.map(report => (
          <div key={report.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium">{report.name}</p>
              <p className="text-xs text-slate-500">{report.format} | Generated {report.generated}</p>
            </div>
            <button className="btn-secondary inline-flex items-center gap-2" type="button" onClick={() => setStatus(`Downloaded: ${report.name}`)}>
              <Download size={15} /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Reports
