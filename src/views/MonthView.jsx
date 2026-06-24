import { useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek,
         endOfWeek, isSameDay, isToday, parseISO, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { taskOnDate, sortByPriority } from '../lib/dateUtils.js'

const DAYS_ES = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']
const P_COLOR = { high:'var(--red)', medium:'var(--orange)', low:'var(--blue)', none:'var(--purple)' }
const P_BG    = { high:'rgba(229,62,62,.18)', medium:'rgba(221,107,32,.18)', low:'rgba(49,130,206,.18)', none:'rgba(124,58,237,.18)' }

export default function MonthView() {
  const { tasks, projects, setSelected } = useStore()
  const [current, setCurrent] = useState(new Date())

  const monthStart = startOfMonth(current)
  const monthEnd   = endOfMonth(current)
  const gridStart  = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd    = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days       = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const tasksForDay = (d) => {
    const str = format(d, 'yyyy-MM-dd')
    return sortByPriority(tasks.filter(t => !t.done && taskOnDate(t, str)))
  }

  return (
    <div style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
      {/* Nav */}
      <div style={{display:'flex', alignItems:'center', gap:12, padding:'14px 24px 10px'}}>
        <button onClick={()=>setCurrent(subMonths(current,1))}
          style={{width:28,height:28,borderRadius:4,border:'1px solid var(--border)',background:'var(--panel)',color:'var(--text-muted)',fontSize:13,display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
        <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:22,color:'var(--gold)',letterSpacing:2,minWidth:200}}>
          {format(current, 'MMMM yyyy', {locale:es}).toUpperCase()}
        </span>
        <button onClick={()=>setCurrent(addMonths(current,1))}
          style={{width:28,height:28,borderRadius:4,border:'1px solid var(--border)',background:'var(--panel)',color:'var(--text-muted)',fontSize:13,display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
        <button onClick={()=>setCurrent(new Date())}
          style={{marginLeft:8,padding:'4px 12px',borderRadius:4,border:'1px solid var(--border)',background:'var(--panel)',color:'var(--text-muted)',fontSize:11,fontFamily:'JetBrains Mono,monospace',letterSpacing:1}}>
          HOY
        </button>
      </div>

      {/* Day headers */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, padding:'0 24px 6px'}}>
        {DAYS_ES.map(d => (
          <div key={d} style={{textAlign:'center', fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'var(--text-dim)', letterSpacing:2, padding:'4px 0'}}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{flex:1, overflow:'auto', padding:'0 24px 16px'}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2}}>
          {days.map(day => {
            const dayTasks = tasksForDay(day)
            const inMonth  = day.getMonth() === current.getMonth()
            const today    = isToday(day)
            return (
              <div key={day.toISOString()}
                style={{
                  minHeight:80, padding:'6px 6px', borderRadius:4,
                  background: today ? 'rgba(212,168,67,.06)' : 'var(--panel)',
                  border:`1px solid ${today?'var(--gold)':'var(--border)'}`,
                  opacity: inMonth ? 1 : 0.3,
                }}>
                {/* Day number */}
                <div style={{
                  width:today?20:undefined, height:today?20:undefined,
                  borderRadius: today?'50%':undefined,
                  background: today?'var(--gold)':undefined,
                  display: today?'flex':undefined,
                  alignItems: today?'center':undefined,
                  justifyContent: today?'center':undefined,
                  fontSize:10, fontWeight:600,
                  color: today?'var(--ink)':'var(--text-muted)',
                  fontFamily:'JetBrains Mono,monospace',
                  marginBottom:3,
                }}>
                  {format(day,'d')}
                </div>
                {/* Task pills */}
                {dayTasks.slice(0,3).map(t => (
                  <div key={t.id} onClick={()=>setSelected(t.id)}
                    style={{
                      fontSize:9, fontWeight:600, padding:'2px 5px', borderRadius:3, marginBottom:2,
                      background: P_BG[t.priority], color:P_COLOR[t.priority],
                      borderLeft:`2px solid ${P_COLOR[t.priority]}`,
                      whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                      cursor:'pointer',
                    }}>
                    {t.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div style={{fontSize:9, color:'var(--text-dim)', fontFamily:'JetBrains Mono,monospace'}}>
                    +{dayTasks.length-3} más
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
