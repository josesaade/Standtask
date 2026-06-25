import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { tasksDB, projectsDB, subtasksDB, initDB } from './db.js'

const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [tasks,    setTasks]    = useState([])
  const [projects, setProjects] = useState([])
  const [subtasks, setSubtasks] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => { initDB(); refresh() }, [])

  const refresh = useCallback(() => {
    setTasks(tasksDB.getAll())
    setProjects(projectsDB.getAll())
    setSubtasks(subtasksDB.getAll())
  }, [])

  const addTask    = (t)    => { tasksDB.add(t); refresh() }
  const updateTask = (id,c) => { tasksDB.update(id,c); refresh() }
  const deleteTask = (id)   => { tasksDB.delete(id); subtasksDB.deleteByTask(id); if(selected===id) setSelected(null); refresh() }
  const toggleTask = (id)   => { tasksDB.toggle(id); refresh() }

  const addProject    = (p)    => { projectsDB.add(p);          refresh() }
  const updateProject = (id,c) => { projectsDB.update(id,c);   refresh() }
  const deleteProject = (id)   => { projectsDB.delete(id);      refresh() }

  const addSubtask    = (s)    => { subtasksDB.add(s);          refresh() }
  const toggleSubtask = (id)   => { subtasksDB.toggle(id);      refresh() }
  const deleteSubtask = (id)   => { subtasksDB.delete(id);      refresh() }
  const updateSubtask = (id,c) => { subtasksDB.update(id,c);   refresh() }

  const subtasksForTask = (taskId) => subtasks.filter(s=>s.taskId===taskId).sort((a,b)=>a.order-b.order)

  const selectedTask = tasks.find(t=>t.id===selected) ?? null

  return (
    <StoreCtx.Provider value={{
      tasks, projects, subtasks, selected, selectedTask,
      setSelected,
      addTask, updateTask, deleteTask, toggleTask,
      addProject, updateProject, deleteProject,
      addSubtask, toggleSubtask, deleteSubtask, updateSubtask,
      subtasksForTask,
    }}>
      {children}
    </StoreCtx.Provider>
  )
}

export const useStore = () => useContext(StoreCtx)
