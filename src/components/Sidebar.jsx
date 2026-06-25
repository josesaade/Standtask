import { useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { isOverdue, todayStr, taskOnDate } from '../lib/dateUtils.js'
import ProjectModal from './ProjectModal.jsx'
import SettingsModal from './SettingsModal.jsx'

const s = {
  sidebar: { background:'var(--panel)', borderRight:'2px solid var(--border)', display:'flex', flexDirection:'column', overflow:'hidden', userSelect:'none' },
  sectionLabel: { fontSize:9, fontFamily:'JetBrains Mono,monospace', color:'var(--text-dim)', letterSpacing:3, textTransform:'uppercase', padding:'14px 16px 5px' },
  navItem: (active) => ({ display:'flex', alignItems:'center', gap:10, padding:'8px 16px', cursor:'pointer', borderLeft:`3px solid ${active?'var(--gold)':'transparent'}`, fontSize:13, fontWeight:500, color:active?'var(--gold)':'var(--text-muted)', background:active?'var(--purple-glow)':'transparent', transition:'all .15s', whiteSpace:'nowrap' }),
  badge: (gold) => ({ marginLeft:'auto', background:gold?'var(--gold-dim)':'var(--purple)', color:gold?'var(--ink)':'white', fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:10, fontFamily:'JetBrains Mono,monospace' }),
  divider: { height:1, background:'var(--border)', margin:'6px 0' },
}

export default function Sidebar({ view, setView, filterProject, setFilterProject }) {
  const { tasks, projects } = useStore()
  const [projectModal, setProjectModal] = useState(null) // null | 'new' | project obj
  const [showSettings, setShowSettings] = useState(false)

  const today = todayStr()
  const todayCount   = tasks.filter(t=>!t.done && taskOnDate(t,today)).length
  const overdueCount = tasks.filter(t=>isOverdue(t)).length
  const highCount    = tasks.filter(t=>!t.done && t.priority==='high').length
  const projCount    = (pid) => tasks.filter(t=>!t.done && t.projectId===pid).length

  const navItems = [
    { id:'today', icon:'📅', label:'Hoy',          badge:todayCount,  gold:true },
    { id:'week',  icon:'📆', label:'Esta semana' },
    { id:'month', icon:'🗓️', label:'Mes' },
    { id:'high',  icon:'🚩', label:'Alta prioridad', badge:highCount },
    { id:'done',  icon:'✅', label:'Completadas' },
    ...(overdueCount>0 ? [{ id:'overdue', icon:'⚠️', label:'Vencidas', badge:overdueCount }] : []),
  ]

  return (
    <div style={s.sidebar}>
      <div style={s.sectionLabel}>Vistas</div>
      {navItems.map(n=>(
        <div key={n.id} style={s.navItem(view===n.id && !filterProject)}
          onClick={()=>{ setView(n.id); setFilterProject(null) }}>
          <span style={{fontSize:15,width:18,textAlign:'center'}}>{n.icon}</span>
          {n.label}
          {n.badge>0 && <span style={s.badge(n.gold)}>{n.badge}</span>}
        </div>
      ))}

      <div style={s.divider} />
      <div style={{...s.sectionLabel, display:'flex', alignItems:'center', justifyContent:'space-between', paddingRight:12}}>
        <span>Proyectos</span>
        <span onClick={()=>setProjectModal('new')} style={{cursor:'pointer',color:'var(--purple-bright)',fontSize:14,lineHeight:1}}>+</span>
      </div>

      {projects.map(p=>(
        <div key={p.id}
          style={{display:'flex',alignItems:'center',gap:8,padding:'6px 16px 6px 20px',fontSize:12,
            color:filterProject===p.id?'var(--text)':'var(--text-muted)',
            background:filterProject===p.id?'var(--purple-glow)':'transparent',
            borderLeft:`3px solid ${filterProject===p.id?p.color:'transparent'}`,
            cursor:'pointer',transition:'all .15s'}}
          onClick={()=>{ setFilterProject(p.id); setView('today') }}>
          <div style={{width:8,height:8,borderRadius:'50%',background:p.color,flexShrink:0}} />
          <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</span>
          <span style={{fontSize:9,color:'var(--text-dim)',fontFamily:'JetBrains Mono,monospace'}}>{projCount(p.id)||''}</span>
          {/* Edit btn on hover */}
          <span onClick={e=>{ e.stopPropagation(); setProjectModal(p) }}
            style={{fontSize:10,color:'var(--text-dim)',opacity:0,transition:'opacity .15s',cursor:'pointer'}}
            onMouseEnter={e=>e.currentTarget.style.opacity=1}
            onMouseLeave={e=>e.currentTarget.style.opacity=0}>
            ✏️
          </span>
        </div>
      ))}

      <div onClick={()=>setProjectModal('new')}
        style={{display:'flex',alignItems:'center',gap:8,padding:'6px 16px 6px 20px',fontSize:12,color:'var(--purple-bright)',cursor:'pointer'}}>
        + Nuevo proyecto
      </div>

      <div style={{...s.divider, marginTop:'auto'}} />
      <div style={s.navItem(false)} onClick={()=>setShowSettings(true)}>
        <span style={{fontSize:15,width:18,textAlign:'center'}}>⚙️</span> Ajustes
      </div>
      <div style={{padding:'6px 16px 10px',fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--text-dim)',letterSpacing:2}}>
        ゴゴゴ STAND TASK v1.0
      </div>

      {projectModal && projectModal !== 'new' && (
        <ProjectModal project={projectModal} onClose={()=>setProjectModal(null)} />
      )}
      {projectModal === 'new' && (
        <ProjectModal project={null} onClose={()=>setProjectModal(null)} />
      )}
      {showSettings && <SettingsModal onClose={()=>setShowSettings(false)} />}
    </div>
  )
}
