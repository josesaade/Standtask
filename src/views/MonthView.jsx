import { useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek,
         endOfWeek, isToday, parseISO, addMonths, subMonths, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { taskOnDate, sortByPriority } from '../lib/dateUtils.js'

const DAYS_ES = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']
const P_COLOR = { high:'#E53E3E', medium:'#DD6B20', low:'#3182CE', none:'#7C3AED' }
const P_BG    = { high:'rgba(229,62,62,.22)', medium:'rgba(221,107,32,.22)', low:'rgba(49,130,206,.22)', none:'rgba(124,58,237,.22)' }

export default function MonthView() {
  const { tasks, projects, setSelected } = useStore()
  const [current, setCurrent] = useState(new Date())

  const monthStart = startOfMonth(current)
  const monthEnd   = endOfMonth(current)
  const gridStart  = startOfWeek(monthStart, { weekStartsOn:1 })
  const gridEnd    = endOfWeek(monthEnd,     { weekStartsOn:1 })
  const days       = eachDayOfInterval({ start:gridStart, end:gridEnd })
  const weeks      = []
  for (let i=0; i<days.length; i+=7) weeks.push(days.slice(i,i+7))

  // Build spanning rows per week
  const buildWeekRows = (weekDays) => {
    const slots = {}
    const rows  = []
    const weekTasks = sortByPriority(
      tasks.filter(t => !t.done && weekDays.some(d => taskOnDate(t, format(d,'yyyy-MM-dd'))))
    )
    weekTasks.forEach(task => {
      const startIdx = weekDays.findIndex(d => taskOnDate(t => false, '') || (() => {
        const s = parseISO(task.startDate)
        return isSameDay(d,s) || d > s
      })())
      // simpler: find first day in this week where task is active
      let s = weekDays.findIndex(d => taskOnDate(task, format(d,'yyyy-MM-dd')))
      let e = weekDays.map((d,i)=>taskOnDate(task,format(d,'yyyy-MM-dd'))?i:-1).filter(i=>i>=0)
      if (!e.length) return
      const startCol = s
      const endCol   = e[e.length-1]
      const span     = endCol - startCol + 1
      const isMulti  = span > 1
      let row = 0
      while (true) {
        const conflict = Array.from({length:span},(_,i)=>startCol+i).some(c=>slots[`${row}-${c}`])
        if (!conflict) {
          Array.from({length:span},(_,i)=>startCol+i).forEach(c=>{ slots[`${row}-${c}`]=true })
          rows.push({ task, row, startCol, endCol, span, isMulti })
          break
        }
        row++
      }
    })
    return rows
  }

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
      {/* Nav */}
      <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 24px 8px',flexShrink:0}}>
        <button onClick={()=>setCurrent(subMonths(current,1))}
          style={{width:28,height:28,borderRadius:4,border:'1px solid var(--border)',background:'var(--panel)',color:'var(--text-muted)',fontSize:13,display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
        <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:22,color:'var(--gold)',letterSpacing:2,minWidth:200}}>
          {format(current,'MMMM yyyy',{locale:es}).toUpperCase()}
        </span>
        <button onClick={()=>setCurrent(addMonths(current,1))}
          style={{width:28,height:28,borderRadius:4,border:'1px solid var(--border)',background:'var(--panel)',color:'var(--text-muted)',fontSize:13,display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
        <button onClick={()=>setCurrent(new Date())}
          style={{padding:'4px 12px',borderRadius:4,border:'1px solid var(--border)',background:'var(--panel)',color:'var(--text-muted)',fontSize:11,fontFamily:'JetBrains Mono,monospace',letterSpacing:1}}>HOY</button>
      </div>

      {/* DOW headers */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2,padding:'0 16px 4px',flexShrink:0}}>
        {DAYS_ES.map(d=>(
          <div key={d} style={{textAlign:'center',fontSize:10,fontFamily:'JetBrains Mono,monospace',color:'var(--text-dim)',letterSpacing:2,padding:'4px 0'}}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{flex:1,overflow:'auto',padding:'0 16px 16px'}}>
        {weeks.map((weekDays,wi)=>{
          const rows = buildWeekRows(weekDays)
          const maxRow = rows.length ? Math.max(...rows.map(r=>r.row))+1 : 0
          const rowH = Math.max(72, maxRow*22+36)
          return (
            <div key={wi} style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2,marginBottom:2,height:rowH,position:'relative'}}>
              {/* Day cells */}
              {weekDays.map((day,di)=>{
                const inMonth = day.getMonth()===current.getMonth()
                const today   = isToday(day)
                return (
                  <div key={di} style={{
                    padding:'4px 6px',
                    background:today?'rgba(212,168,67,.06)':'var(--panel)',
                    border:`1px solid ${today?'var(--gold)':'var(--border)'}`,
                    borderRadius:4,opacity:inMonth?1:.3,
                    position:'relative',overflow:'hidden',
                  }}>
                    <div style={{
                      width:today?20:undefined,height:today?20:undefined,
                      borderRadius:today?'50%':undefined,
                      background:today?'var(--gold)':undefined,
                      display:today?'flex':undefined,
                      alignItems:today?'center':undefined,
                      justifyContent:today?'center':undefined,
                      fontSize:10,fontWeight:600,
                      color:today?'var(--ink)':'var(--text-muted)',
                      fontFamily:'JetBrains Mono,monospace',
                    }}>
                      {format(day,'d')}
                    </div>
                  </div>
                )
              })}

              {/* Spanning task blocks (absolute over grid) */}
              {rows.map(({task,row,startCol,endCol,span,isMulti})=>{
                const colW = 100/7
                return (
                  <div key={task.id} onClick={()=>setSelected(task.id)}
                    style={{
                      position:'absolute',
                      top:28+row*22,height:18,
                      left:`calc(${startCol*colW}% + 4px)`,
                      width:`calc(${span*colW}% - ${isMulti?2:8}px)`,
                      background:P_BG[task.priority],
                      borderLeft:`3px solid ${P_COLOR[task.priority]}`,
                      border:`1px solid ${P_COLOR[task.priority]}`,
                      borderRadius: endCol<6?'3px 0 0 3px':'3px',
                      display:'flex',alignItems:'center',paddingLeft:6,
                      cursor:'pointer',fontSize:9,fontWeight:600,
                      color:P_COLOR[task.priority],
                      overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis',
                      zIndex:2,
                    }}>
                    {task.title}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
