import { useStore } from '../lib/store.jsx'
import TaskItem from '../components/TaskItem.jsx'
import { todayStr, isOverdue, taskOnDate, sortByPriority,
         addDays, format, parseISO } from '../lib/dateUtils.js'

export default function TaskListView({ mode, filterProject }) {
  const { tasks, projects } = useStore()

  const today = todayStr()

  let filtered = tasks
  if (filterProject) filtered = filtered.filter(t => t.projectId === filterProject)

  let groups = []

  if (mode === 'today') {
    const overdue  = sortByPriority(filtered.filter(t => !t.done && isOverdue(t)))
    const todayT   = sortByPriority(filtered.filter(t => !t.done && taskOnDate(t, today) && !isOverdue(t)))
    const done     = filtered.filter(t => t.done && taskOnDate(t, today))
    if (overdue.length)  groups.push({ label:`Vencidas · ${overdue.length}`, tasks: overdue })
    if (todayT.length)   groups.push({ label:`Hoy · ${todayT.length}`, tasks: todayT })
    if (done.length)     groups.push({ label:'Completadas hoy', tasks: done })

  } else if (mode === 'week') {
    const days = Array.from({length:7}, (_,i) => {
      const d = new Date(); d.setDate(d.getDate()+i)
      return format(d,'yyyy-MM-dd')
    })
    days.forEach(d => {
      const dayTasks = sortByPriority(filtered.filter(t => !t.done && taskOnDate(t,d) && !isOverdue(t)))
      if (dayTasks.length) {
        const label = d === today ? 'Hoy' : format(parseISO(d), 'EEEE dd MMM', {locale: undefined})
        groups.push({ label, tasks: dayTasks })
      }
    })

  } else if (mode === 'high') {
    const high = sortByPriority(filtered.filter(t => !t.done && t.priority==='high'))
    if (high.length) groups.push({ label:`Alta prioridad · ${high.length}`, tasks: high })

  } else if (mode === 'overdue') {
    const over = sortByPriority(filtered.filter(t => isOverdue(t)))
    if (over.length) groups.push({ label:`Vencidas · ${over.length}`, tasks: over })

  } else if (mode === 'done') {
    const done = filtered.filter(t => t.done)
    if (done.length) groups.push({ label:`Completadas · ${done.length}`, tasks: done })
  }

  // Project filter mode
  if (filterProject && mode === 'today') {
    const proj = projects.find(p=>p.id===filterProject)
    const all  = sortByPriority(filtered.filter(t => !t.done))
    const done = filtered.filter(t => t.done)
    groups = []
    if (all.length)  groups.push({ label: proj?.name || 'Proyecto', tasks: all })
    if (done.length) groups.push({ label:'Completadas', tasks: done })
  }

  if (!groups.length) return (
    <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8}}>
      <div style={{fontSize:32}}>✅</div>
      <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'var(--text-dim)', letterSpacing:3, textTransform:'uppercase'}}>
        Sin tareas pendientes
      </div>
    </div>
  )

  return (
    <div style={{flex:1, overflowY:'auto', padding:'16px 24px'}}>
      {groups.map((g, i) => (
        <div key={i}>
          <div style={{fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'var(--text-dim)', letterSpacing:3, textTransform:'uppercase', marginBottom:8, paddingBottom:6, borderBottom:'1px solid var(--border)', marginTop: i>0?16:0}}>
            {g.label}
          </div>
          {g.tasks.map(t => <TaskItem key={t.id} task={t} />)}
        </div>
      ))}
    </div>
  )
}
