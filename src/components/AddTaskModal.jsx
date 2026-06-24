import { useState } from 'react'
import { useStore } from '../lib/store.jsx'
import { todayStr } from '../lib/dateUtils.js'

const inp = (extra={}) => ({
  background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:4,
  padding:'8px 10px', color:'var(--text)', fontSize:13, outline:'none', width:'100%',
  transition:'border-color .15s', ...extra
})

const PRIORITIES = [
  { value:'none',   flag:'⚑', label:'Sin prioridad' },
  { value:'low',    flag:'🚩', label:'Baja'   },
  { value:'medium', flag:'🚩', label:'Media'  },
  { value:'high',   flag:'🚩', label:'Alta'   },
]
const P_COLOR = { none:'var(--text-dim)', low:'var(--blue)', medium:'var(--orange)', high:'var(--red)' }

export default function AddTaskModal({ onClose }) {
  const { projects, addTask, setSelected } = useStore()
  const [form, setForm] = useState({
    title:'', projectId: projects[0]?.id || '',
    priority:'none', startDate: todayStr(), endDate: todayStr(),
    startTime:'', endTime:'', notes:'',
  })

  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const submit = () => {
    if (!form.title.trim()) return
    const task = addTask(form)
    onClose()
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}
      onClick={e=>{ if(e.target===e.currentTarget) onClose() }}>
      <div style={{background:'var(--panel)',borderRadius:8,padding:24,width:460,maxWidth:'95vw',border:'1px solid var(--border)',maxHeight:'90vh',overflowY:'auto'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
          <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:22,letterSpacing:2,color:'var(--gold)'}}>Nueva Tarea</span>
          <button onClick={onClose} style={{background:'none',border:'none',color:'var(--text-muted)',fontSize:18}}>✕</button>
        </div>

        <input autoFocus placeholder="¿Qué necesitas hacer?" value={form.title} onChange={e=>set('title',e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter') submit(); if(e.key==='Escape') onClose() }}
          style={{...inp(), fontSize:14, marginBottom:14}} />

        {/* Project */}
        <div style={{marginBottom:12}}>
          <div style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--text-dim)',letterSpacing:3,textTransform:'uppercase',marginBottom:5}}>Proyecto</div>
          <select value={form.projectId} onChange={e=>set('projectId',e.target.value)} style={{...inp(),appearance:'none'}}>
            <option value=''>Sin proyecto</option>
            {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {/* Priority */}
        <div style={{marginBottom:12}}>
          <div style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--text-dim)',letterSpacing:3,textTransform:'uppercase',marginBottom:5}}>Prioridad</div>
          <div style={{display:'flex',gap:5}}>
            {PRIORITIES.map(pr=>(
              <button key={pr.value} onClick={()=>set('priority',pr.value)}
                style={{flex:1,padding:'7px 4px',borderRadius:4,border:`1px solid ${form.priority===pr.value?P_COLOR[pr.value]:'var(--border)'}`,
                  background:form.priority===pr.value?`${P_COLOR[pr.value]}22`:'var(--surface)',
                  color:form.priority===pr.value?P_COLOR[pr.value]:'var(--text-dim)',
                  fontSize:10,fontWeight:600,transition:'all .15s'}}>
                {pr.flag} {pr.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
          <div>
            <div style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--text-dim)',letterSpacing:3,textTransform:'uppercase',marginBottom:5}}>Inicio</div>
            <input type="date" value={form.startDate} onChange={e=>set('startDate',e.target.value)} style={inp()} />
          </div>
          <div>
            <div style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--text-dim)',letterSpacing:3,textTransform:'uppercase',marginBottom:5}}>Fin</div>
            <input type="date" value={form.endDate} onChange={e=>set('endDate',e.target.value)} style={inp()} />
          </div>
          <div>
            <div style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--text-dim)',letterSpacing:3,textTransform:'uppercase',marginBottom:5}}>Hora inicio</div>
            <input type="time" value={form.startTime} onChange={e=>set('startTime',e.target.value)} style={inp()} />
          </div>
          <div>
            <div style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--text-dim)',letterSpacing:3,textTransform:'uppercase',marginBottom:5}}>Hora fin</div>
            <input type="time" value={form.endTime} onChange={e=>set('endTime',e.target.value)} style={inp()} />
          </div>
        </div>

        {/* Notes */}
        <div style={{marginBottom:18}}>
          <div style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--text-dim)',letterSpacing:3,textTransform:'uppercase',marginBottom:5}}>Notas</div>
          <textarea value={form.notes} onChange={e=>set('notes',e.target.value)} rows={3} placeholder="Notas opcionales..."
            style={{...inp(),resize:'vertical',lineHeight:1.6}} />
        </div>

        <div style={{display:'flex',gap:8}}>
          <button onClick={onClose}
            style={{flex:1,padding:'10px',background:'transparent',border:'1px solid var(--border)',borderRadius:4,color:'var(--text-muted)',fontSize:13}}>
            Cancelar
          </button>
          <button onClick={submit}
            style={{flex:2,padding:'10px',background:'var(--purple)',border:'none',borderRadius:4,color:'white',fontSize:13,fontWeight:600}}>
            Crear tarea
          </button>
        </div>
      </div>
    </div>
  )
}
