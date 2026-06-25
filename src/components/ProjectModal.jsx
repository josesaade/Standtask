import { useState } from 'react'
import { useStore } from '../lib/store.jsx'

const COLORS = ['#E53E3E','#DD6B20','#D4A843','#38A169','#3182CE','#7C3AED','#A855F7','#E91E8C','#00BCD4','#795548','#607D8B','#FF5722']

const inp = (extra={}) => ({
  background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:4,
  padding:'8px 10px',color:'var(--text)',fontSize:13,outline:'none',width:'100%', ...extra
})

export default function ProjectModal({ project, onClose }) {
  const { addProject, updateProject, deleteProject, tasks } = useStore()
  const isEdit = !!project
  const [name,  setName]  = useState(project?.name  || '')
  const [color, setColor] = useState(project?.color || COLORS[0])

  const save = () => {
    if (!name.trim()) return
    if (isEdit) updateProject(project.id, { name: name.trim(), color })
    else        addProject({ name: name.trim(), color })
    onClose()
  }

  const del = () => {
    const count = tasks.filter(t=>t.projectId===project.id).length
    if (confirm(`¿Eliminar "${project.name}"? ${count>0?`Tiene ${count} tareas que quedarán sin proyecto.`:''}`)) {
      deleteProject(project.id)
      onClose()
    }
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}
      onClick={e=>{ if(e.target===e.currentTarget) onClose() }}>
      <div style={{background:'var(--panel)',borderRadius:8,padding:24,width:380,maxWidth:'95vw',border:'1px solid var(--border)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
          <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:20,letterSpacing:2,color:'var(--gold)'}}>
            {isEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </span>
          <button onClick={onClose} style={{background:'none',border:'none',color:'var(--text-muted)',fontSize:18}}>✕</button>
        </div>

        <div style={{marginBottom:16}}>
          <div style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--text-dim)',letterSpacing:3,textTransform:'uppercase',marginBottom:6}}>Nombre</div>
          <input autoFocus value={name} onChange={e=>setName(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter') save(); if(e.key==='Escape') onClose() }}
            placeholder="Nombre del proyecto"
            style={inp()} />
        </div>

        <div style={{marginBottom:20}}>
          <div style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--text-dim)',letterSpacing:3,textTransform:'uppercase',marginBottom:10}}>Color</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {COLORS.map(c=>(
              <div key={c} onClick={()=>setColor(c)}
                style={{width:28,height:28,borderRadius:'50%',background:c,cursor:'pointer',
                  border:`3px solid ${color===c?'white':'transparent'}`,
                  boxShadow:color===c?`0 0 0 2px ${c}`:'none',
                  transition:'all .15s'}}>
              </div>
            ))}
          </div>
          {/* Preview */}
          <div style={{marginTop:14,display:'flex',alignItems:'center',gap:8,padding:'8px 12px',background:'var(--surface)',borderRadius:4}}>
            <div style={{width:10,height:10,borderRadius:'50%',background:color}} />
            <span style={{fontSize:13,color:'var(--text)'}}>{name||'Nombre del proyecto'}</span>
          </div>
        </div>

        <div style={{display:'flex',gap:8}}>
          {isEdit && (
            <button onClick={del}
              style={{padding:'9px 14px',background:'transparent',border:'1px solid rgba(229,62,62,.4)',borderRadius:4,color:'var(--red)',fontSize:12}}>
              🗑 Eliminar
            </button>
          )}
          <button onClick={onClose}
            style={{flex:1,padding:'9px',background:'transparent',border:'1px solid var(--border)',borderRadius:4,color:'var(--text-muted)',fontSize:12}}>
            Cancelar
          </button>
          <button onClick={save}
            style={{flex:2,padding:'9px',background:'var(--purple)',border:'none',borderRadius:4,color:'white',fontSize:12,fontWeight:600}}>
            {isEdit ? 'Guardar cambios' : 'Crear proyecto'}
          </button>
        </div>
      </div>
    </div>
  )
}
