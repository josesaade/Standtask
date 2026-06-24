import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { tasksDB, projectsDB, initDB } from './db.js'

const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [tasks,    setTasks]    = useState([])
  const [projects, setProjects] = useState([])
  const [selected, setSelected] = useState(null) // selected task id

  useEffect(() => {
    initDB()
    setTasks(tasksDB.getAll())
    setProjects(projectsDB.getAll())
  }, [])

  const refresh = useCallback(() => {
    setTasks(tasksDB.getAll())
    setProjects(projectsDB.getAll())
  }, [])

  const addTask = (t) => { tasksDB.add(t); refresh() }
  const updateTask = (id, c) => { tasksDB.update(id, c); refresh() }
  const deleteTask = (id) => { tasksDB.delete(id); if (selected===id) setSelected(null); refresh() }
  const toggleTask = (id) => { tasksDB.toggle(id); refresh() }

  const addProject    = (p) => { projectsDB.add(p);         refresh() }
  const updateProject = (id,c) => { projectsDB.update(id,c); refresh() }
  const deleteProject = (id) => { projectsDB.delete(id);    refresh() }

  const selectedTask = tasks.find(t => t.id === selected) ?? null

  return (
    <StoreCtx.Provider value={{
      tasks, projects, selected, selectedTask,
      setSelected,
      addTask, updateTask, deleteTask, toggleTask,
      addProject, updateProject, deleteProject,
    }}>
      {children}
    </StoreCtx.Provider>
  )
}

export const useStore = () => useContext(StoreCtx)
