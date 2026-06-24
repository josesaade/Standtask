const VIEW_TITLES = {
  today:'Hoy', week:'Esta Semana', month:'Mes',
  high:'Alta Prioridad', overdue:'Vencidas', done:'Completadas'
}

export default function Topbar({ view, filterProject, projects }) {
  const proj = projects?.find(p=>p.id===filterProject)
  const title = proj ? proj.name : (VIEW_TITLES[view] || view)
  const now = new Date()
  const days = ['DOMINGO','LUNES','MARTES','MIÉRCOLES','JUEVES','VIERNES','SÁBADO']
  const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']
  const dateStr = `${days[now.getDay()]} ${now.getDate()} / ${months[now.getMonth()]} / ${now.getFullYear()}`

  return (
    <div style={{
      background:'var(--panel)', borderBottom:'2px solid var(--gold)',
      display:'flex', alignItems:'center', padding:'0 20px', gap:16,
      position:'relative', overflow:'hidden', gridColumn:'1/-1',
    }}>
      {/* Speed lines bg */}
      <svg style={{position:'absolute',left:0,top:0,height:'100%',width:220,opacity:.04,pointerEvents:'none'}} viewBox="0 0 220 56">
        {Array.from({length:12},(_,i)=><line key={i} x1="0" y1={i*6} x2="220" y2={i*5} stroke="#D4A843" strokeWidth="1"/>)}
      </svg>

      <div style={{position:'relative'}}>
        <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:26,color:'var(--gold)',letterSpacing:3,lineHeight:1}}>
          STAND <span style={{color:'var(--purple-bright)'}}>TASK</span>
        </div>
        <div style={{fontSize:9,color:'var(--text-muted)',letterSpacing:5,textTransform:'uppercase',fontFamily:'JetBrains Mono,monospace',marginTop:1}}>
          Sistema de Productividad
        </div>
      </div>

      <div style={{width:1,height:32,background:'var(--border)',marginLeft:4}} />

      <div>
        <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:18,letterSpacing:2,color:'var(--text)',lineHeight:1}}>
          {title}
        </div>
        <div style={{fontSize:9,color:'var(--text-muted)',letterSpacing:3,fontFamily:'JetBrains Mono,monospace'}}>
          {dateStr}
        </div>
      </div>

      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:10}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--gcal-green)',border:'1px solid rgba(52,168,83,.3)',borderRadius:10,padding:'3px 8px',background:'rgba(52,168,83,.08)'}}>
          ● Google Cal
        </div>
        <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,var(--purple),var(--gold))',border:'2px solid var(--gold)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'var(--ink)'}}>
          JS
        </div>
      </div>

      <div style={{position:'absolute',right:20,fontFamily:'Black Han Sans,sans-serif',fontSize:11,color:'var(--gold-dim)',letterSpacing:4,opacity:.4,pointerEvents:'none'}}>
        ゴゴゴゴ
      </div>
    </div>
  )
}
