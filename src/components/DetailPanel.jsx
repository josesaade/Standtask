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

export default function DetailPanel() {
  const { selectedTask, projects, updateTask, deleteTask, setSelected } = useStore()
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (selectedTask) setForm({ ...selectedTask })
    else setForm(null)
  }, [selectedTask])

  if (!form) return (
    <div style={{background:'var(--panel)', display:'flex', alignItems:'center', justifyContent:'center', height:'100%', padding:20}}>
      <div style={{textAlign:'center', color:'var(--text-dim)'}}>
        <div style={{fontSize:32, marginBottom:8}}>⚑</div>
        <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:10, letterSpacing:3, textTransform:'uppercase'}}>Selecciona una tarea</div>
      </div>
    </div>
  )

  const set = (k, v) => setForm(f => ({...f, [k]: v}))

  const save = () => {
    updateTask(form.id, form)
  }

  const label = (txt) => (
    <div style={{fontSize:9, fontFamily:'JetBrains Mono,monospace', color:'var(--text-dim)', letterSpacing:3, textTransform:'uppercase', marginBottom:5}}>
      {txt}
    </div>
  )

  const field = (children, extra={}) => (
    <div style={{marginBottom:14, ...extra}}>{children}</div>
  )

  return (
    <div style={{background:'var(--panel)', padding:20, overflowY:'auto', height:'100%', borderLeft:'1px solid var(--border)'}}>
      {/* Header */}
      <div style={{display:'flex', alignItems:'flex-start', gap:8, marginBottom:20, paddingBottom:14, borderBottom:'1px solid var(--border)'}}>
        <div style={{fontSize:14, color: PRIORITIES.find(p=>p.value===form.priority)?.color, flexShrink:0, marginTop:2}}>
          {PRIORITIES.find(p=>p.value===form.priority)?.flag}
        </div>
        <textarea value={form.title} onChange={e=>set('title',e.target.value)}
          rows={2} onBlur={save}
          style={{...inp(), fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:'1.5px', resize:'none', lineHeight:1.2, flex:1, border:'none', background:'transparent', padding:0}} />
        <button onClick={()=>setSelected(null)}
          style={{background:'none', border:'none', color:'var(--text-dim)', fontSize:16, padding:'0 4px', flexShrink:0}}>✕</button>
      </div>

      {/* Proyecto */}
      {field(<>
        {label('Proyecto')}
        <select value={form.projectId||''} onChange={e=>{set('projectId',e.target.value); save()}}
          style={{...inp(), appearance:'none'}}>
          <option value=''>Sin proyecto</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </>)}

      {/* Prioridad */}
      {field(<>
        {label('Prioridad')}
        <div style={{display:'flex', gap:5}}>
          {PRIORITIES.map(pr => (
            <button key={pr.value} onClick={()=>{ set('priority',pr.value); }}
              style={{
                flex:1, padding:'6px 4px', borderRadius:4, border:`1px solid ${form.priority===pr.value ? pr.color : 'var(--border)'}`,
                background: form.priority===pr.value ? `${pr.color}22` : 'var(--surface)',
                color: form.priority===pr.value ? pr.color : 'var(--text-dim)',
                fontSize:10, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:3,
                transition:'all .15s',
              }}>
              <span style={{fontSize:11}}>{pr.flag}</span>
              <span style={{fontSize:9, fontFamily:'JetBrains Mono,monospace'}}>{pr.label}</span>
            </button>
          ))}
        </div>
      </>)}

      {/* Fechas */}
      {field(<>
        {label('Fecha inicio')}
        <input type="date" value={form.startDate||''} onChange={e=>set('startDate',e.target.value)} onBlur={save}
          style={inp()} />
      </>)}

      {field(<>
        {label('Hora inicio')}
        <input type="time" value={form.startTime||''} onChange={e=>set('startTime',e.target.value)} onBlur={save}
          style={inp()} />
      </>)}

      {field(<>
        {label('Fecha fin')}
        <input type="date" value={form.endDate||form.startDate||''} onChange={e=>set('endDate',e.target.value)} onBlur={save}
          style={inp()} />
      </>)}

      {field(<>
        {label('Hora fin')}
        <input type="time" value={form.endTime||''} onChange={e=>set('endTime',e.target.value)} onBlur={save}
          style={inp()} />
      </>)}

      {/* Notas */}
      {field(<>
        {label('Notas')}
        <textarea value={form.notes||''} onChange={e=>set('notes',e.target.value)} onBlur={save}
          rows={5} placeholder="Agregar notas..."
          style={{...inp(), resize:'vertical', lineHeight:1.6}} />
      </>)}

      {/* Google Cal indicator */}
      {form.gcalEventId && field(
        <div style={{display:'flex', alignItems:'center', gap:6, fontSize:11, color:'var(--gcal-green)', fontFamily:'JetBrains Mono,monospace'}}>
          ● Sincronizado con Google Calendar
        </div>
      )}

      {/* Actions */}
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button onClick={save}
          style={{flex:1, padding:'9px', background:'var(--purple)', border:'none', borderRadius:4, color:'white', fontSize:12, fontWeight:600, transition:'background .15s'}}>
          Guardar
        </button>
        <button onClick={()=>{ if(confirm('¿Eliminar esta tarea?')) deleteTask(form.id) }}
          style={{padding:'9px 14px', background:'transparent', border:'1px solid var(--border)', borderRadius:4, color:'var(--text-muted)', fontSize:14, transition:'all .15s'}}>
          🗑
        </button>
      </div>
    </div>
  )
}
