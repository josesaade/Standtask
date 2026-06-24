import { useStore } from '../lib/store.jsx'
import { fmtDate, isOverdue, taskDurationDays } from '../lib/dateUtils.js'

const PRIORITY_COLOR = { high:'var(--red)', medium:'var(--orange)', low:'var(--blue)', none:'var(--text-dim)' }
const PRIORITY_LABEL = { high:'🚩', medium:'🚩', low:'🚩', none:'⚑' }
const PRIORITY_BG    = { high:'rgba(229,62,62,.12)', medium:'rgba(221,107,32,.12)', low:'rgba(49,130,206,.12)', none:'transparent' }

export default function TaskItem({ task }) {
  const { projects, selected, setSelected, toggleTask } = useStore()
  const project = projects.find(p => p.id === task.projectId)
  const overdue = isOverdue(task)
  const isSelected = selected === task.id
  const multiDay = taskDurationDays(task) > 1

  return (
    <div onClick={() => setSelected(isSelected ? null : task.id)}
      style={{
        display:'flex', alignItems:'flex-start', gap:10,
        padding:'10px 12px',
        background: isSelected ? 'rgba(124,58,237,.08)' : 'var(--panel)',
        border: `1px solid ${isSelected ? 'var(--purple-bright)' : overdue && !task.done ? 'rgba(229,62,62,.35)' : 'var(--border)'}`,
        borderLeft: `3px solid ${multiDay ? 'var(--purple)' : 'transparent'}`,
        borderRadius:4, marginBottom:5, cursor:'pointer',
        transition:'border-color .15s, background .15s',
        opacity: task.done ? .45 : 1,
      }}>

      {/* Checkbox */}
      <div onClick={e => { e.stopPropagation(); toggleTask(task.id) }}
        style={{
          width:16, height:16, borderRadius:3, flexShrink:0, marginTop:1,
          border: `2px solid ${task.done ? 'var(--purple)' : 'var(--border)'}`,
          background: task.done ? 'var(--purple)' : 'transparent',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:9, color:'white', transition:'all .15s',
        }}>
        {task.done && '✓'}
      </div>

      {/* Body */}
      <div style={{flex:1, minWidth:0}}>
        <div style={{
          fontSize:13, fontWeight:500,
          color: task.done ? 'var(--text-muted)' : 'var(--text)',
          textDecoration: task.done ? 'line-through' : 'none',
          lineHeight:1.35,
        }}>
          {task.title}
        </div>
        <div style={{display:'flex', alignItems:'center', gap:6, marginTop:4, flexWrap:'wrap'}}>
          {task.startDate && (
            <span style={{fontSize:10, color: overdue && !task.done ? 'rgba(229,62,62,.8)' : 'var(--text-dim)', fontFamily:'JetBrains Mono,monospace', display:'flex', alignItems:'center', gap:3}}>
              {task.startTime ? `⏰ ${task.startTime}` : `📅 ${fmtDate(task.startDate)}`}
              {multiDay && ` → ${fmtDate(task.endDate)}`}
            </span>
          )}
          {multiDay && (
            <span style={{fontSize:9, color:'var(--purple-bright)', fontFamily:'JetBrains Mono,monospace'}}>
              {taskDurationDays(task)}d
            </span>
          )}
          {project && (
            <span style={{fontSize:9, fontFamily:'JetBrains Mono,monospace', padding:'1px 6px', borderRadius:10, background:'var(--surface)', color:'var(--text-muted)', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:4}}>
              <span style={{width:6, height:6, borderRadius:'50%', background:project.color, display:'inline-block'}} />
              {project.name}
            </span>
          )}
          {task.gcalEventId && (
            <span style={{fontSize:8, fontFamily:'JetBrains Mono,monospace', padding:'1px 6px', borderRadius:10, color:'var(--gcal-green)', border:'1px solid rgba(52,168,83,.3)', background:'rgba(52,168,83,.07)'}}>
              ● GCal
            </span>
          )}
        </div>
      </div>

      {/* Flag */}
      <div style={{fontSize:12, color:PRIORITY_COLOR[task.priority], flexShrink:0, marginTop:1}}>
        {PRIORITY_LABEL[task.priority]}
      </div>
    </div>
  )
}
