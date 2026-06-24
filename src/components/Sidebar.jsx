import { useStore } from '../lib/store.jsx'
import { isOverdue, todayStr, taskOnDate } from '../lib/dateUtils.js'
import { useState } from 'react'

const s = {
  sidebar: { background:'var(--panel)', borderRight:'2px solid var(--border)', display:'flex', flexDirection:'column', overflow:'hidden', userSelect:'none' },
  sectionLabel: { fontSize:9, fontFamily:'JetBrains Mono,monospace', color:'var(--text-dim)', letterSpacing:3, textTransform:'uppercase', padding:'14px 16px 5px' },
  navItem: (active) => ({ display:'flex', alignItems:'center', gap:10, padding:'8px 16px', cursor:'pointer', borderLeft:`3px solid ${active?'var(--gold)':'transparent'}`, fontSize:13, fontWeight:500, color: active?'var(--gold)':'var(--text-muted)', background: active?'var(--purple-glow)':'transparent', transition:'all .15s', whiteSpace:'nowrap' }),
  icon: { fontSize:15, width:18, textAlign:'center' },
  badge: (gold) => ({ marginLeft:'auto', background: gold?'var(--gold-dim)':'var(--purple)', color: gold?'var(--ink)':'white', fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:10, fontFamily:'JetBrains Mono,monospace' }),
  divider: { height:1, background:'var(--border)', margin:'6px 0' },
  projItem: { display:'flex', alignItems:'center', gap:8, padding:'6px 16px 6px 24px', fontSize:12, color:'var(--text-muted)', cursor:'pointer' },
  dot: (c) => ({ width:8, height:8, borderRadius:'50%', background:c, flexShrink:0 }),
  projCount: { marginLeft:'auto', fontSize:9, color:'var(--text-dim)', fontFamily:'JetBrains Mono,monospace' },
}

export default function Sidebar({ view, setView, filterProject, setFilterProject }) {
  const { tasks, projects } = useStore()
  const [addingProject, setAddingProject] = useState(false)
  const [newProjName, setNewProjName] = useState('')

  const today = todayStr()
  const todayCount  = tasks.filter(t => !t.done && taskOnDate(t, today)).length
  const overdueCount= tasks.filter(t => isOverdue(t)).length
  const highCount   = tasks.filter(t => !t.done && t.priority==='high').length

  const projTaskCount = (pid) => tasks.filter(t => !t.done && t.projectId===pid).length

  const navItems = [
    { id:'today',    icon:'📅', label:'Hoy',         badge: todayCount,   gold:true },
    { id:'week',     icon:'📆', label:'Esta semana'  },
    { id:'month',    icon:'🗓️', label:'Mes'          },
    { id:'high',     icon:'🚩', label:'Alta prioridad', badge: highCount  },
    { id:'done',     icon:'✅', label:'Completadas'  },
  ]

  return (
    <div style={s.sidebar}>
      <div style={s.sectionLabel}>Vistas</div>
      {navItems.map(n => (
        <div key={n.id} style={s.navItem(view===n.id && !filterProject)}
          onClick={() => { setView(n.id); setFilterProject(null) }}>
          <span style={s.icon}>{n.icon}</span>
          {n.label}
          {n.badge > 0 && <span style={s.badge(n.gold)}>{n.badge}</span>}
        </div>
      ))}
      {overdueCount > 0 && (
        <div style={s.navItem(view==='overdue' && !filterProject)}
          onClick={() => { setView('overdue'); setFilterProject(null) }}>
          <span style={s.icon}>⚠️</span> Vencidas
          <span style={s.badge(false)}>{overdueCount}</span>
        </div>
      )}

      <div style={s.divider} />
      <div style={s.sectionLabel}>Proyectos</div>

      {projects.map(p => (
        <div key={p.id} style={{...s.projItem, color: filterProject===p.id?'var(--text)':'var(--text-muted)', background: filterProject===p.id?'var(--purple-glow)':'transparent'}}
          onClick={() => { setFilterProject(p.id); setView('today') }}>
          <div style={s.dot(p.color)} />
          <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</span>
          <span style={s.projCount}>{projTaskCount(p.id)||''}</span>
        </div>
      ))}

      {addingProject ? (
        <div style={{padding:'6px 16px 6px 24px', display:'flex', gap:6}}>
          <input autoFocus value={newProjName} onChange={e=>setNewProjName(e.target.value)}
            placeholder="Nombre..." onKeyDown={e=>{
              if(e.key==='Enter' && newProjName.trim()) {
                const colors=['#E53E3E','#D4A843','#7C3AED','#3182CE','#38A169','#DD6B20','#E91E8C']
                // addProject call would go here — for now just close
                setAddingProject(false); setNewProjName('')
              }
              if(e.key==='Escape'){ setAddingProject(false); setNewProjName('') }
            }}
            style={{flex:1,background:'var(--surface)',border:'1px solid var(--border)',borderRadius:4,padding:'3px 6px',color:'var(--text)',fontSize:12,outline:'none'}} />
        </div>
      ) : (
        <div style={{...s.projItem, color:'var(--purple-bright)'}}
          onClick={()=>setAddingProject(true)}>
          + Nuevo proyecto
        </div>
      )}

      <div style={{...s.divider, marginTop:'auto'}} />
      <div style={s.navItem(false)}>
        <span style={s.icon}>⚙️</span> Ajustes
      </div>
      <div style={{padding:'8px 16px', fontSize:9, fontFamily:'JetBrains Mono,monospace', color:'var(--text-dim)', letterSpacing:2}}>
        ゴゴゴ STAND TASK v1.0
      </div>
    </div>
  )
}
