import { useState } from 'react'
import { StoreProvider, useStore } from './lib/store.jsx'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import TaskListView from './views/TaskListView.jsx'
import MonthView from './views/MonthView.jsx'
import DetailPanel from './components/DetailPanel.jsx'
import AddTaskModal from './components/AddTaskModal.jsx'

function App() {
  const [view, setView] = useState('today')
  const [filterProject, setFilterProject] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const { selectedTask, projects } = useStore()

  const isMonth = view === 'month'
  const showDetail = !isMonth && !!selectedTask

  return (
    <div style={{
      display:'grid',
      gridTemplateColumns:'220px 1fr',
      gridTemplateRows:'56px 1fr',
      height:'100vh',
      overflow:'hidden',
    }}>
      <Topbar view={view} filterProject={filterProject} projects={projects} />

      <Sidebar
        view={view} setView={setView}
        filterProject={filterProject} setFilterProject={setFilterProject}
      />

      {/* Main area */}
      <div style={{background:'var(--surface)', display:'flex', flexDirection:'column', overflow:'hidden'}}>
        {/* View tabs */}
        {!isMonth && (
          <div style={{borderBottom:'1px solid var(--border)', display:'flex', padding:'0 24px'}}>
            {['today','week','month','high','done'].map(v => (
              <div key={v} onClick={()=>{ setView(v); setFilterProject(null) }}
                style={{
                  padding:'10px 16px', fontSize:11, fontWeight:600, letterSpacing:1,
                  textTransform:'uppercase', cursor:'pointer',
                  color: view===v ? 'var(--gold)' : 'var(--text-muted)',
                  borderBottom: `2px solid ${view===v ? 'var(--gold)' : 'transparent'}`,
                  transition:'all .15s', fontFamily:'JetBrains Mono,monospace',
                  marginBottom:-1,
                }}>
                {v==='today'?'Hoy':v==='week'?'Semana':v==='month'?'Mes':v==='high'?'Alta prioridad':'Completadas'}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{flex:1, display:'flex', overflow:'hidden'}}>
          <div style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
            {isMonth
              ? <MonthView />
              : <TaskListView mode={view} filterProject={filterProject} />
            }
          </div>
          {showDetail && (
            <div style={{width:300, flexShrink:0, overflow:'hidden'}}>
              <DetailPanel />
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <button onClick={()=>setShowAdd(true)}
        style={{
          position:'fixed', bottom:24, right:24,
          width:52, height:52, borderRadius:'50%',
          background:'linear-gradient(135deg,var(--purple),var(--gold))',
          border:'none', color:'white', fontSize:26,
          boxShadow:'0 4px 24px rgba(124,58,237,.5),0 0 0 3px rgba(212,168,67,.15)',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:200, transition:'transform .2s',
        }}
        onMouseEnter={e=>e.target.style.transform='scale(1.08) rotate(90deg)'}
        onMouseLeave={e=>e.target.style.transform='scale(1) rotate(0deg)'}>
        +
      </button>

      {showAdd && <AddTaskModal onClose={()=>setShowAdd(false)} />}

      {/* GOGOGO bg decoration */}
      <div style={{position:'fixed',right:6,top:'50%',transform:'translateY(-50%)',writingMode:'vertical-rl',fontFamily:'Black Han Sans,sans-serif',fontSize:10,color:'var(--gold-dim)',letterSpacing:6,opacity:.1,pointerEvents:'none',zIndex:0}}>
        ゴゴゴゴゴゴゴゴゴゴゴゴゴ
      </div>
    </div>
  )
}

export default function Root() {
  return <StoreProvider><App /></StoreProvider>
}
