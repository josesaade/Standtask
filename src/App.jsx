import { useState } from 'react'
import { StoreProvider, useStore } from './lib/store.jsx'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import TaskListView from './views/TaskListView.jsx'
import WeekView from './views/WeekView.jsx'
import MonthView from './views/MonthView.jsx'
import DetailPanel from './components/DetailPanel.jsx'
import AddTaskModal from './components/AddTaskModal.jsx'

function App() {
  const [view, setView] = useState('today')
  const [filterProject, setFilterProject] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const { selectedTask, projects } = useStore()

  const isMonth = view === 'month'
  const isWeek  = view === 'week'
  const showDetail = !isMonth && !isWeek && !!selectedTask

  // Also show detail panel when clicking a task in week/month
  // by rendering it as a floating panel
  const showFloatingDetail = (isMonth || isWeek) && !!selectedTask

  return (
    <div style={{display:'grid',gridTemplateColumns:'220px 1fr',gridTemplateRows:'56px 1fr',height:'100vh',overflow:'hidden'}}>
      <Topbar view={view} filterProject={filterProject} projects={projects} />

      <Sidebar view={view} setView={setView} filterProject={filterProject} setFilterProject={setFilterProject} />

      {/* Main area */}
      <div style={{background:'var(--surface)',display:'flex',flexDirection:'column',overflow:'hidden',position:'relative'}}>
        {/* Tabs — hide on week/month since they have their own nav */}
        <div style={{borderBottom:'1px solid var(--border)',display:'flex',padding:'0 24px',flexShrink:0}}>
          {[
            {id:'today',label:'Hoy'},
            {id:'week', label:'Semana'},
            {id:'month',label:'Mes'},
            {id:'high', label:'Alta prioridad'},
            {id:'done', label:'Completadas'},
          ].map(v=>(
            <div key={v.id} onClick={()=>{ setView(v.id); setFilterProject(null) }}
              style={{padding:'10px 16px',fontSize:11,fontWeight:600,letterSpacing:1,textTransform:'uppercase',cursor:'pointer',
                color:view===v.id?'var(--gold)':'var(--text-muted)',
                borderBottom:`2px solid ${view===v.id?'var(--gold)':'transparent'}`,
                transition:'all .15s',fontFamily:'JetBrains Mono,monospace',marginBottom:-1}}>
              {v.label}
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{flex:1,display:'flex',overflow:'hidden'}}>
          <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
            {isMonth ? <MonthView />
              : isWeek ? <WeekView />
              : <TaskListView mode={view} filterProject={filterProject} />
            }
          </div>
          {showDetail && (
            <div style={{width:300,flexShrink:0,overflow:'hidden'}}>
              <DetailPanel />
            </div>
          )}
        </div>

        {/* Floating detail for month/week */}
        {showFloatingDetail && (
          <div style={{
            position:'absolute',right:0,top:0,bottom:0,width:320,
            background:'var(--panel)',borderLeft:'1px solid var(--border)',
            zIndex:50,overflow:'hidden',
          }}>
            <DetailPanel />
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={()=>setShowAdd(true)}
        style={{position:'fixed',bottom:24,right:24,width:52,height:52,borderRadius:'50%',
          background:'linear-gradient(135deg,var(--purple),var(--gold))',
          border:'none',color:'white',fontSize:26,
          boxShadow:'0 4px 24px rgba(124,58,237,.5),0 0 0 3px rgba(212,168,67,.15)',
          display:'flex',alignItems:'center',justifyContent:'center',
          zIndex:200,transition:'transform .2s'}}
        onMouseEnter={e=>e.currentTarget.style.transform='scale(1.08) rotate(90deg)'}
        onMouseLeave={e=>e.currentTarget.style.transform='scale(1) rotate(0deg)'}>
        +
      </button>

      {showAdd && <AddTaskModal onClose={()=>setShowAdd(false)} />}

      <div style={{position:'fixed',right:6,top:'50%',transform:'translateY(-50%)',writingMode:'vertical-rl',fontFamily:'Black Han Sans,sans-serif',fontSize:10,color:'var(--gold-dim)',letterSpacing:6,opacity:.1,pointerEvents:'none',zIndex:0}}>
        ゴゴゴゴゴゴゴゴゴゴゴゴゴ
      </div>
    </div>
  )
}

export default function Root() {
  return <StoreProvider><App /></StoreProvider>
}
