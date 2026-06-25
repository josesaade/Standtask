import { useState } from 'react'

export default function SettingsModal({ onClose }) {
  const [name,   setName]   = useState(() => localStorage.getItem('st_username') || 'José Saade')
  const [initials, setInitials] = useState(() => localStorage.getItem('st_initials') || 'JS')
  const [weekStart, setWeekStart] = useState(() => localStorage.getItem('st_weekstart') || 'monday')
  const [saved, setSaved] = useState(false)

  const save = () => {
    localStorage.setItem('st_username', name)
    localStorage.setItem('st_initials', initials.slice(0,2).toUpperCase())
    localStorage.setItem('st_weekstart', weekStart)
    setSaved(true)
    setTimeout(()=>setSaved(false), 1500)
  }

  const clearData = () => {
    if (confirm('⚠️ Esto borrará TODAS las tareas, proyectos y subtareas. ¿Continuar?')) {
      localStorage.removeItem('st_tasks')
      localStorage.removeItem('st_projects')
      localStorage.removeItem('st_subtasks')
      window.location.reload()
    }
  }

  const inp = (extra={}) => ({
    background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:4,
    padding:'8px 10px',color:'var(--text)',fontSize:13,outline:'none',width:'100%', ...extra
  })
  const label = (txt) => <div style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--text-dim)',letterSpacing:3,textTransform:'uppercase',marginBottom:6}}>{txt}</div>
  const field = (children) => <div style={{marginBottom:16}}>{children}</div>

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}
      onClick={e=>{ if(e.target===e.currentTarget) onClose() }}>
      <div style={{background:'var(--panel)',borderRadius:8,padding:24,width:420,maxWidth:'95vw',border:'1px solid var(--border)',maxHeight:'90vh',overflowY:'auto'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,paddingBottom:14,borderBottom:'1px solid var(--border)'}}>
          <span style={{fontFamily:'Bebas Neue,sans-serif',fontSize:22,letterSpacing:2,color:'var(--gold)'}}>Ajustes</span>
          <button onClick={onClose} style={{background:'none',border:'none',color:'var(--text-muted)',fontSize:18}}>✕</button>
        </div>

        {/* Perfil */}
        <div style={{fontSize:10,fontFamily:'JetBrains Mono,monospace',color:'var(--gold-dim)',letterSpacing:3,marginBottom:12,textTransform:'uppercase'}}>— Perfil</div>

        {field(<>
          {label('Nombre')}
          <input value={name} onChange={e=>setName(e.target.value)} style={inp()} />
        </>)}

        {field(<>
          {label('Iniciales (avatar)')}
          <input value={initials} onChange={e=>setInitials(e.target.value.slice(0,2))} maxLength={2} style={inp({width:80})} />
          <div style={{marginTop:8,display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,var(--purple),var(--gold))',border:'2px solid var(--gold)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'var(--ink)'}}>
              {initials.slice(0,2).toUpperCase()||'??'}
            </div>
            <span style={{fontSize:11,color:'var(--text-muted)'}}>Preview del avatar</span>
          </div>
        </>)}

        {/* Preferencias */}
        <div style={{fontSize:10,fontFamily:'JetBrains Mono,monospace',color:'var(--gold-dim)',letterSpacing:3,marginBottom:12,marginTop:4,textTransform:'uppercase'}}>— Preferencias</div>

        {field(<>
          {label('Inicio de semana')}
          <select value={weekStart} onChange={e=>setWeekStart(e.target.value)} style={{...inp(),appearance:'none'}}>
            <option value="monday">Lunes</option>
            <option value="sunday">Domingo</option>
          </select>
        </>)}

        {/* Info */}
        <div style={{fontSize:10,fontFamily:'JetBrains Mono,monospace',color:'var(--gold-dim)',letterSpacing:3,marginBottom:12,marginTop:4,textTransform:'uppercase'}}>— Acerca de</div>
        <div style={{background:'var(--surface)',borderRadius:4,padding:'10px 12px',marginBottom:16,fontSize:11,color:'var(--text-muted)',lineHeight:1.8,fontFamily:'JetBrains Mono,monospace'}}>
          <div>STAND TASK v1.0</div>
          <div style={{color:'var(--text-dim)'}}>Storage: localStorage (local)</div>
          <div style={{color:'var(--text-dim)'}}>Google Cal: pendiente</div>
          <div style={{color:'var(--text-dim)'}}>Supabase: pendiente</div>
        </div>

        {/* Danger zone */}
        <div style={{borderTop:'1px solid rgba(229,62,62,.2)',paddingTop:14,marginBottom:16}}>
          <div style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'rgba(229,62,62,.6)',letterSpacing:3,textTransform:'uppercase',marginBottom:10}}>— Zona peligrosa</div>
          <button onClick={clearData}
            style={{width:'100%',padding:'9px',background:'transparent',border:'1px solid rgba(229,62,62,.4)',borderRadius:4,color:'var(--red)',fontSize:12,fontWeight:600}}>
            ⚠️ Borrar todos los datos
          </button>
        </div>

        <div style={{display:'flex',gap:8}}>
          <button onClick={onClose}
            style={{flex:1,padding:'9px',background:'transparent',border:'1px solid var(--border)',borderRadius:4,color:'var(--text-muted)',fontSize:12}}>
            Cancelar
          </button>
          <button onClick={save}
            style={{flex:2,padding:'9px',background: saved?'var(--green)':'var(--purple)',border:'none',borderRadius:4,color:'white',fontSize:12,fontWeight:600,transition:'background .3s'}}>
            {saved ? '✓ Guardado' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
