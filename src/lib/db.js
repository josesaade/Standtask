const KEYS = { tasks:'st_tasks', projects:'st_projects', subtasks:'st_subtasks' }

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
function save(key, data) { localStorage.setItem(key, JSON.stringify(data)) }

const today = new Date()
const fmt = (d) => d.toISOString().split('T')[0]
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate()+n); return x }

const SEED_PROJECTS = [
  { id:'p1', name:'Consultorio Jurídico', color:'#E53E3E' },
  { id:'p2', name:'Doctorado USB',        color:'#D4A843' },
  { id:'p3', name:'Clases CUC',           color:'#7C3AED' },
  { id:'p4', name:'Clientes IP',          color:'#3182CE' },
  { id:'p5', name:'Personal',             color:'#38A169' },
]

const SEED_TASKS = [
  { id:'t1', title:'Responder PQR radicado SC-13696', projectId:'p1', priority:'high', startDate:fmt(addDays(today,-1)), endDate:fmt(addDays(today,-1)), startTime:null, endTime:null, done:false, notes:'', gcalEventId:null, createdAt:new Date().toISOString() },
  { id:'t2', title:'Enviar informe riesgo ISO 9001', projectId:'p1', priority:'medium', startDate:fmt(addDays(today,-2)), endDate:fmt(addDays(today,-2)), startTime:null, endTime:null, done:false, notes:'Dos riesgos HIGH: accesibilidad y comunicaciones', gcalEventId:null, createdAt:new Date().toISOString() },
  { id:'t3', title:'Revisar tesis insolvencia — objetivos reescritos', projectId:'p3', priority:'high', startDate:fmt(today), endDate:fmt(today), startTime:'10:00', endTime:'12:00', done:false, notes:'', gcalEventId:null, createdAt:new Date().toISOString() },
  { id:'t4', title:'Clase Protección de Datos — Moodle quiz', projectId:'p3', priority:'medium', startDate:fmt(today), endDate:fmt(today), startTime:'14:00', endTime:'17:00', done:false, notes:'Leyes 1581/2012, 1266/2008, 2157/2021', gcalEventId:null, createdAt:new Date().toISOString() },
  { id:'t5', title:'Avanzar capítulo doctorado — marco teórico', projectId:'p2', priority:'none', startDate:fmt(today), endDate:fmt(today), startTime:null, endTime:null, done:false, notes:'', gcalEventId:null, createdAt:new Date().toISOString() },
  { id:'t6', title:'Contrato BIAI — revisión cláusula licencia retorno', projectId:'p4', priority:'low', startDate:fmt(today), endDate:fmt(today), startTime:null, endTime:null, done:true, notes:'', gcalEventId:null, createdAt:new Date().toISOString() },
  { id:'t7', title:'Auditoría ISO 9001 — preparación documentos', projectId:'p1', priority:'high', startDate:fmt(today), endDate:fmt(addDays(today,7)), startTime:null, endTime:null, done:false, notes:'Foco en accesibilidad física y estrategia de comunicaciones', gcalEventId:null, createdAt:new Date().toISOString() },
]

const SEED_SUBTASKS = [
  { id:'s1', taskId:'t7', title:'Revisar lista de documentos requeridos', done:false, order:0 },
  { id:'s2', taskId:'t7', title:'Verificar accesibilidad física sede', done:false, order:1 },
  { id:'s3', taskId:'t7', title:'Actualizar estrategia de comunicaciones', done:false, order:2 },
  { id:'s4', taskId:'t7', title:'Preparar evidencias para auditor', done:false, order:3 },
  { id:'s1b', taskId:'t3', title:'Leer título y objetivos actuales', done:true, order:0 },
  { id:'s2b', taskId:'t3', title:'Reescribir pregunta de investigación', done:false, order:1 },
  { id:'s3b', taskId:'t3', title:'Ajustar objetivos específicos', done:false, order:2 },
]

export function initDB() {
  if (!localStorage.getItem(KEYS.projects)) save(KEYS.projects, SEED_PROJECTS)
  if (!localStorage.getItem(KEYS.tasks))    save(KEYS.tasks, SEED_TASKS)
  if (!localStorage.getItem(KEYS.subtasks)) save(KEYS.subtasks, SEED_SUBTASKS)
}

export const projectsDB = {
  getAll: () => load(KEYS.projects, []),
  add: (p) => { const all=load(KEYS.projects,[]); const item={...p,id:crypto.randomUUID()}; save(KEYS.projects,[...all,item]); return item },
  update: (id,c) => { save(KEYS.projects, load(KEYS.projects,[]).map(p=>p.id===id?{...p,...c}:p)) },
  delete: (id) => { save(KEYS.projects, load(KEYS.projects,[]).filter(p=>p.id!==id)) },
}

export const tasksDB = {
  getAll: () => load(KEYS.tasks, []),
  add: (t) => { const all=load(KEYS.tasks,[]); const item={...t,id:crypto.randomUUID(),createdAt:new Date().toISOString(),done:false,gcalEventId:null}; save(KEYS.tasks,[...all,item]); return item },
  update: (id,c) => { save(KEYS.tasks, load(KEYS.tasks,[]).map(t=>t.id===id?{...t,...c}:t)) },
  delete: (id) => { save(KEYS.tasks, load(KEYS.tasks,[]).filter(t=>t.id!==id)) },
  toggle: (id) => { save(KEYS.tasks, load(KEYS.tasks,[]).map(t=>t.id===id?{...t,done:!t.done}:t)) },
}

export const subtasksDB = {
  getAll: () => load(KEYS.subtasks, []),
  getByTask: (taskId) => load(KEYS.subtasks,[]).filter(s=>s.taskId===taskId).sort((a,b)=>a.order-b.order),
  add: (s) => {
    const all=load(KEYS.subtasks,[])
    const taskSubs=all.filter(x=>x.taskId===s.taskId)
    const item={...s,id:crypto.randomUUID(),done:false,order:taskSubs.length}
    save(KEYS.subtasks,[...all,item]); return item
  },
  update: (id,c) => { save(KEYS.subtasks, load(KEYS.subtasks,[]).map(s=>s.id===id?{...s,...c}:s)) },
  toggle: (id) => { save(KEYS.subtasks, load(KEYS.subtasks,[]).map(s=>s.id===id?{...s,done:!s.done}:s)) },
  delete: (id) => { save(KEYS.subtasks, load(KEYS.subtasks,[]).filter(s=>s.id!==id)) },
  deleteByTask: (taskId) => { save(KEYS.subtasks, load(KEYS.subtasks,[]).filter(s=>s.taskId!==taskId)) },
}
