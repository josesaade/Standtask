import { useState, useEffect } from 'react'
import { useStore } from '../lib/store.jsx'

const PRIORITIES = [
  { value:'none',   label:'Sin prioridad', flag:'⚑', color:'var(--text-dim)' },
  { value:'low',    label:'Baja',          flag:'🚩', color:'var(--blue)'  },
  { value:'medium', label:'Media',         flag:'🚩', color:'var(--orange)'},
  { value:'high',   label:'Alta',          flag:'🚩', color:'var(--red)'  },
]
const inp = (extra={}) => ({
  background:'var(--surface)', border:'1px solid var(--border)', borderRadius:4,
  padding:'7px 10px', color:'var(--text)', fontSize:12, outline:'none', width:'100%',
  transition:'border-color .15s', ...extra
})

function SubtasksSection({ taskId }) {
  const { subtasksForTask, addSubtask, toggleSubtask, deleteSubtask } = useStore()
  const subs = subtasksForTask(taskId)
  const [newTitle, setNewTitle] = useState('')
  const done  = subs.filter(s=>s.done).length
  const total = subs.length
  const pct   = total ? Math.round((done/total)*100) : 0

  const add = () => {
    if (!newTitle.trim()) return
    addSubtask({ taskId, title: newTitle.trim() })
    setNewTitle('')
  }

  return (
    <div style={{marginBottom:14}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6}}>
        <div style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--text-dim)',letterSpacing:3,textTransform:'uppercase'}}>
          Subtareas
        </div>
        {total > 0 && (
          <span style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color: pct===100?'var(--green)':'var(--text-muted)'}}>
            {done}/{total} · {pct}%
          </span>
        )}
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div style={{height:4, background:'var(--border)', borderRadius:2, marginBottom:8, overflow:'hidden'}}>
          <div style={{height:'100%', width:`${pct}%`, background: pct===100?'var(--green)':'var(--purple)', borderRadius:2, transition:'width .3s ease'}} />
        </div>
      )}

      {/* Subtask list */}
      {subs.map(s => (
        <div key={s.id} style={{display:'flex', alignItems:'center', gap:8, padding:'5px 0', borderBottom:'1px solid var(--border)'}}>
          <div onClick={()=>toggleSubtask(s.id)}
            style={{width:14,height:14,borderRadius:3,border:`2px solid ${s.done?'var(--purple)':'var(--border)'}`,background:s.done?'var(--purple)':'transparent',flexShrink:0,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,color:'white',transition:'all .15s'}}>
            {s.done && '✓'}
          </div>
          <span style={{flex:1,fontSize:12,color:s.done?'var(--text-dim)':'var(--text)',textDecoration:s.done?'line-through':'none'}}>
            {s.title}
          </span>
          <button onClick={()=>deleteSubtask(s.id)}
            style={{background:'none',border:'none',color:'var(--text-dim)',fontSize:11,cursor:'pointer',opacity:.5,padding:'0 2px'}}>✕</button>
        </div>
      ))}

      {/* Add subtask */}
      <div style={{display:'flex',gap:6,marginTop:8}}>
        <input value={newTitle} onChange={e=>setNewTitle(e.target.value)}
          placeholder="+ Agregar subtarea..."
          onKeyDown={e=>{ if(e.key==='Enter') add(); }}
          style={{...inp(), fontSize:11, padding:'5px 8px', flex:1}} />
        <button onClick={add}
          style={{padding:'5px 10px',background:'var(--purple)',border:'none',borderRadius:4,color:'white',fontSize:11,flexShrink:0}}>
          +
        </button>
      </div>
    </div>
  )
}

export default function DetailPanel() {
  const { selectedTask, projects, updateTask, deleteTask, setSelected } = useStore()
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (selectedTask) setForm({...selectedTask})
    else setForm(null)
  }, [selectedTask])

  if (!form) return (
    <div style={{background:'var(--panel)',display:'flex',alignItems:'center',justifyContent:'center',height:'100%',padding:20}}>
      <div style={{textAlign:'center',color:'var(--text-dim)'}}>
        <div style={{fontSize:32,marginBottom:8}}>⚑</div>
        <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,letterSpacing:3,textTransform:'uppercase'}}>Selecciona una tarea</div>
      </div>
    </div>
  )

  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  const save = () => updateTask(form.id, form)

  const label = (txt) => <div style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--text-dim)',letterSpacing:3,textTransform:'uppercase',marginBottom:5}}>{txt}</div>
  const field = (children) => <div style={{marginBottom:14}}>{children}</div>

  return (
    <div style={{background:'var(--panel)',padding:20,overflowY:'auto',height:'100%',borderLeft:'1px solid var(--border)'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:20,paddingBottom:14,borderBottom:'1px solid var(--border)'}}>
        <div style={{fontSize:14,color:PRIORITIES.find(p=>p.value===form.priority)?.color,flexShrink:0,marginTop:2}}>
          {PRIORITIES.find(p=>p.value===form.priority)?.flag}
        </div>
        <textarea value={form.title} onChange={e=>set('title',e.target.value)} rows={2} onBlur={save}
          style={{...inp(),fontFamily:'Bebas Neue,sans-serif',fontSize:18,letterSpacing:'1.5px',resize:'none',lineHeight:1.2,flex:1,border:'none',background:'transparent',padding:0}} />
        <button onClick={()=>setSelected(null)}
          style={{background:'none',border:'none',color:'var(--text-dim)',fontSize:16,padding:'0 4px',flexShrink:0}}>✕</button>
      </div>

      {field(<>
        {label('Proyecto')}
        <select value={form.projectId||''} onChange={e=>{set('projectId',e.target.value); save()}}
          style={{...inp(),appearance:'none'}}>
          <option value=''>Sin proyecto</option>
          {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </>)}

      {field(<>
        {label('Prioridad')}
        <div style={{display:'flex',gap:5}}>
          {PRIORITIES.map(pr=>(
            <button key={pr.value} onClick={()=>{ set('priority',pr.value); setTimeout(save,0) }}
              style={{flex:1,padding:'6px 4px',borderRadius:4,border:`1px solid ${form.priority===pr.value?pr.color:'var(--border)'}`,background:form.priority===pr.value?`${pr.color}22`:'var(--surface)',color:form.priority===pr.value?pr.color:'var(--text-dim)',fontSize:10,fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',gap:3,transition:'all .15s'}}>
              <span style={{fontSize:11}}>{pr.flag}</span>
              <span style={{fontSize:9,fontFamily:'JetBrains Mono,monospace'}}>{pr.label}</span>
            </button>
          ))}
        </div>
      </>)}

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
        <div>{label('Inicio')}<input type="date" value={form.startDate||''} onChange={e=>set('startDate',e.target.value)} onBlur={save} style={inp()} /></div>
        <div>{label('Fin')}<input type="date" value={form.endDate||form.startDate||''} onChange={e=>set('endDate',e.target.value)} onBlur={save} style={inp()} /></div>
        <div>{label('Hora inicio')}<input type="time" value={form.startTime||''} onChange={e=>set('startTime',e.target.value)} onBlur={save} style={inp()} /></div>
        <div>{label('Hora fin')}<input type="time" value={form.endTime||''} onChange={e=>set('endTime',e.target.value)} onBlur={save} style={inp()} /></div>
      </div>

      {/* SUBTASKS */}
      <SubtasksSection taskId={form.id} />

      {field(<>
        {label('Notas')}
        <textarea value={form.notes||''} onChange={e=>set('notes',e.target.value)} onBlur={save}
          rows={4} placeholder="Agregar notas..."
          style={{...inp(),resize:'vertical',lineHeight:1.6}} />
      </>)}

      {form.gcalEventId && (
        <div style={{marginBottom:14,fontSize:11,color:'var(--gcal-green)',fontFamily:'JetBrains Mono,monospace'}}>
          ● Sincronizado con Google Calendar
        </div>
      )}

      <div style={{display:'flex',gap:8}}>
        <button onClick={save}
          style={{flex:1,padding:'9px',background:'var(--purple)',border:'none',borderRadius:4,color:'white',fontSize:12,fontWeight:600}}>
          Guardar
        </button>
        <button onClick={()=>{ if(confirm('¿Eliminar esta tarea?')) deleteTask(form.id) }}
          style={{padding:'9px 14px',background:'transparent',border:'1px solid var(--border)',borderRadius:4,color:'var(--text-muted)',fontSize:14}}>
          🗑
        </button>
      </div>
    </div>
  )
}
