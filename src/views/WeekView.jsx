import { useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { format, startOfWeek, endOfWeek, eachDayOfInterval,
         isToday, parseISO, addWeeks, subWeeks, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { taskOnDate, sortByPriority } from '../lib/dateUtils.js'

const P_COLOR = { high:'#E53E3E', medium:'#DD6B20', low:'#3182CE', none:'#7C3AED' }
const P_BG    = { high:'rgba(229,62,62,.22)', medium:'rgba(221,107,32,.22)', low:'rgba(49,130,206,.22)', none:'rgba(124,58,237,.22)' }
const HOURS   = Array.from({length:17}, (_,i)=>i+7) // 7am–11pm

export default function WeekView() {
  const { tasks, setSelected } = useStore()
  const [current, setCurrent] = useState(new Date())

  const weekStart = startOfWeek(current, { weekStartsOn: 1 })
  const weekEnd   = endOfWeek(current,   { weekStartsOn: 1 })
  const days      = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Split tasks: timed vs all-day/multi-day
  const allDayTasks = tasks.filter(t => {
    if (t.done) return false
    const inWeek = days.some(d => taskOnDate(t, format(d,'yyyy-MM-dd')))
    return inWeek && !t.startTime
  })

  const timedTasks = tasks.filter(t => {
    if (t.done || !t.startTime) return false
    return days.some(d => taskOnDate(t, format(d,'yyyy-MM-dd')))
  })

  // For multi-day all-day tasks, calculate span
  const getSpan = (task) => {
    const start = parseISO(task.startDate)
    const end   = task.endDate ? parseISO(task.endDate) : start
    const startCol = days.findIndex(d => isSameDay(d, start) || d > start)
    const endCol   = days.findIndex(d => isSameDay(d, end))
    return {
      startCol: Math.max(0, startCol),
      endCol:   endCol === -1 ? 6 : Math.min(6, endCol),
      isMulti:  task.endDate && task.endDate !== task.startDate,
    }
  }

  // Group all-day tasks by row (avoid overlap)
  const allDayRows = []
  const usedSlots  = {}
  const sortedAllDay = sortByPriority(allDayTasks)
  sortedAllDay.forEach(task => {
    const {startCol, endCol} = getSpan(task)
    let row = 0
    while (true) {
      const hasConflict = Array.from({length: endCol-startCol+1},(_,i)=>startCol+i)
        .some(col => usedSlots[`${row}-${col}`])
      if (!hasConflict) {
        Array.from({length: endCol-startCol+1},(_,i)=>startCol+i)
          .forEach(col => { usedSlots[`${row}-${col}`] = true })
        allDayRows.push({ task, row, startCol, endCol })
        break
      }
      row++
    }
  })
  const maxRow = allDayRows.length ? Math.max(...allDayRows.map(r=>r.row)) + 1 : 0
  const allDayHeight = Math.max(32, maxRow * 26 + 8)

  const CELL_W = `${100/7}%`
  const HOUR_H = 56

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
      {/* Nav */}
      <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 24px 8px',flexShrink:0}}>
        <button onClick={()=>setCurrent(subWeeks(current,1))}
          style={{width:28,height:28,borderRadius:4,border:'1px solid var(--border)',background:'var(--panel)',color:'var(--text-muted)',fontSize:13,display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
        <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:20,color:'var(--gold)',letterSpacing:2}}>
          {format(weekStart,'dd MMM',{locale:es}).toUpperCase()} – {format(weekEnd,'dd MMM yyyy',{locale:es}).toUpperCase()}
        </span>
        <button onClick={()=>setCurrent(addWeeks(current,1))}
          style={{width:28,height:28,borderRadius:4,border:'1px solid var(--border)',background:'var(--panel)',color:'var(--text-muted)',fontSize:13,display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
        <button onClick={()=>setCurrent(new Date())}
          style={{padding:'4px 12px',borderRadius:4,border:'1px solid var(--border)',background:'var(--panel)',color:'var(--text-muted)',fontSize:11,fontFamily:'JetBrains Mono,monospace',letterSpacing:1}}>
          HOY
        </button>
      </div>

      {/* Day headers */}
      <div style={{display:'grid',gridTemplateColumns:'48px repeat(7,1fr)',borderBottom:'1px solid var(--border)',flexShrink:0}}>
        <div />
        {days.map(d=>{
          const today = isToday(d)
          return (
            <div key={d} style={{padding:'6px 0',textAlign:'center',borderLeft:'1px solid var(--border)'}}>
              <div style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--text-dim)',letterSpacing:2,textTransform:'uppercase'}}>
                {format(d,'EEE',{locale:es})}
              </div>
              <div style={{
                width:today?26:undefined,height:today?26:undefined,borderRadius:today?'50%':undefined,
                background:today?'var(--gold)':undefined,
                display:'inline-flex',alignItems:'center',justifyContent:'center',
                fontSize:14,fontWeight:700,color:today?'var(--ink)':'var(--text)',marginTop:2,
              }}>
                {format(d,'d')}
              </div>
            </div>
          )
        })}
      </div>

      {/* All-day strip */}
      {maxRow > 0 && (
        <div style={{display:'grid',gridTemplateColumns:'48px repeat(7,1fr)',borderBottom:'1px solid var(--border)',flexShrink:0,height:allDayHeight,position:'relative'}}>
          <div style={{fontSize:8,fontFamily:'JetBrains Mono,monospace',color:'var(--text-dim)',padding:'4px 4px 0',textAlign:'right',letterSpacing:1}}>TODO DÍA</div>
          <div style={{gridColumn:'2/9',position:'relative'}}>
            {allDayRows.map(({task,row,startCol,endCol})=>{
              const span = endCol - startCol + 1
              return (
                <div key={task.id} onClick={()=>setSelected(task.id)}
                  style={{
                    position:'absolute',
                    top: row*26+4, height:20,
                    left:`calc(${startCol/7*100}% + 2px)`,
                    width:`calc(${span/7*100}% - 4px)`,
                    background: P_BG[task.priority],
                    border:`1px solid ${P_COLOR[task.priority]}`,
                    borderRadius: endCol===6?'3px':'3px 0 0 3px',
                    borderLeft:`3px solid ${P_COLOR[task.priority]}`,
                    display:'flex',alignItems:'center',paddingLeft:6,
                    cursor:'pointer',fontSize:10,fontWeight:600,
                    color:P_COLOR[task.priority],
                    overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis',
                  }}>
                  {task.title}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Timed grid */}
      <div style={{flex:1,overflow:'auto',position:'relative'}}>
        <div style={{display:'grid',gridTemplateColumns:'48px repeat(7,1fr)',minHeight:HOURS.length*HOUR_H}}>
          {/* Hours column */}
          <div style={{position:'relative'}}>
            {HOURS.map(h=>(
              <div key={h} style={{position:'absolute',top:HOURS.indexOf(h)*HOUR_H,right:6,fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--text-dim)',lineHeight:1}}>
                {h<10?`0${h}`:h}h
              </div>
            ))}
          </div>
          {/* Day columns */}
          {days.map((d,colIdx)=>{
            const dayStr  = format(d,'yyyy-MM-dd')
            const dayTimed = timedTasks.filter(t=>taskOnDate(t,dayStr))
            const today   = isToday(d)
            return (
              <div key={d} style={{position:'relative',borderLeft:'1px solid var(--border)',minHeight:HOURS.length*HOUR_H,background:today?'rgba(212,168,67,.03)':'transparent'}}>
                {/* Hour lines */}
                {HOURS.map(h=>(
                  <div key={h} style={{position:'absolute',top:HOURS.indexOf(h)*HOUR_H,left:0,right:0,borderTop:'1px solid var(--border)',opacity:.4}} />
                ))}
                {/* Timed tasks */}
                {dayTimed.map(t=>{
                  const [sh,sm] = (t.startTime||'08:00').split(':').map(Number)
                  const [eh,em] = (t.endTime||(sh+1+':00')).split(':').map(Number)
                  const top     = (sh - 7 + sm/60) * HOUR_H
                  const height  = Math.max(28, ((eh-sh)+(em-sm)/60)*HOUR_H - 2)
                  return (
                    <div key={t.id} onClick={()=>setSelected(t.id)}
                      style={{
                        position:'absolute', top, left:3, right:3, height,
                        background:P_BG[t.priority],
                        border:`1px solid ${P_COLOR[t.priority]}`,
                        borderLeft:`3px solid ${P_COLOR[t.priority]}`,
                        borderRadius:4, padding:'3px 5px',
                        cursor:'pointer', overflow:'hidden',
                        transition:'border-color .15s',
                      }}>
                      <div style={{fontSize:10,fontWeight:600,color:P_COLOR[t.priority],lineHeight:1.2}}>
                        {t.title}
                      </div>
                      <div style={{fontSize:9,color:P_COLOR[t.priority],opacity:.8,fontFamily:'JetBrains Mono,monospace',marginTop:2}}>
                        {t.startTime}{t.endTime?` – ${t.endTime}`:''}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
