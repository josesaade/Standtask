// LOCAL-FIRST storage using localStorage
// Later: swap SUPABASE_URL + SUPABASE_KEY env vars and uncomment supabase calls

const KEYS = {
  tasks:    'st_tasks',
  projects: 'st_projects',
}

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// ── SEED DATA ──────────────────────────────────────────────
const SEED_PROJECTS = [
  { id: 'p1', name: 'Consultorio Jurídico', color: '#E53E3E' },
  { id: 'p2', name: 'Doctorado USB',        color: '#D4A843' },
  { id: 'p3', name: 'Clases CUC',           color: '#7C3AED' },
  { id: 'p4', name: 'Clientes IP',          color: '#3182CE' },
  { id: 'p5', name: 'Personal',             color: '#38A169' },
]

const today = new Date()
const fmt = (d) => d.toISOString().split('T')[0]
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate()+n); return x }

const SEED_TASKS = [
  {
    id: 't1', title: 'Responder PQR radicado SC-13696',
    projectId: 'p1', priority: 'high',
    startDate: fmt(addDays(today,-1)), endDate: fmt(addDays(today,-1)),
    startTime: null, endTime: null,
    done: false, notes: '', gcalEventId: null, createdAt: new Date().toISOString()
  },
  {
    id: 't2', title: 'Enviar informe riesgo ISO 9001',
    projectId: 'p1', priority: 'medium',
    startDate: fmt(addDays(today,-2)), endDate: fmt(addDays(today,-2)),
    startTime: null, endTime: null,
    done: false, notes: 'Dos riesgos HIGH: accesibilidad y comunicaciones', gcalEventId: null, createdAt: new Date().toISOString()
  },
  {
    id: 't3', title: 'Revisar tesis insolvencia — objetivos reescritos',
    projectId: 'p3', priority: 'high',
    startDate: fmt(today), endDate: fmt(today),
    startTime: '10:00', endTime: '12:00',
    done: false, notes: '', gcalEventId: null, createdAt: new Date().toISOString()
  },
  {
    id: 't4', title: 'Clase Protección de Datos — Moodle quiz',
    projectId: 'p3', priority: 'medium',
    startDate: fmt(today), endDate: fmt(today),
    startTime: '14:00', endTime: '17:00',
    done: false, notes: 'Leyes 1581/2012, 1266/2008, 2157/2021\nWorkshop + caso estudio habeas data\nExportar quiz Moodle XML', gcalEventId: null, createdAt: new Date().toISOString()
  },
  {
    id: 't5', title: 'Avanzar capítulo doctorado — marco teórico',
    projectId: 'p2', priority: 'none',
    startDate: fmt(today), endDate: fmt(today),
    startTime: null, endTime: null,
    done: false, notes: '', gcalEventId: null, createdAt: new Date().toISOString()
  },
  {
    id: 't6', title: 'Contrato BIAI — revisión cláusula licencia retorno',
    projectId: 'p4', priority: 'low',
    startDate: fmt(today), endDate: fmt(today),
    startTime: null, endTime: null,
    done: true, notes: '', gcalEventId: null, createdAt: new Date().toISOString()
  },
  {
    id: 't7', title: 'Auditoría ISO 9001 — preparación documentos',
    projectId: 'p1', priority: 'high',
    startDate: fmt(today), endDate: fmt(addDays(today,7)),
    startTime: null, endTime: null,
    done: false, notes: 'Foco en accesibilidad física y estrategia de comunicaciones', gcalEventId: null, createdAt: new Date().toISOString()
  },
]

// ── INITIALIZE ─────────────────────────────────────────────
export function initDB() {
  if (!localStorage.getItem(KEYS.projects)) save(KEYS.projects, SEED_PROJECTS)
  if (!localStorage.getItem(KEYS.tasks))    save(KEYS.tasks, SEED_TASKS)
}

// ── PROJECTS ───────────────────────────────────────────────
export const projectsDB = {
  getAll: () => load(KEYS.projects, []),
  add: (p) => {
    const all = load(KEYS.projects, [])
    const item = { ...p, id: crypto.randomUUID() }
    save(KEYS.projects, [...all, item])
    return item
  },
  update: (id, changes) => {
    const all = load(KEYS.projects, []).map(p => p.id === id ? {...p,...changes} : p)
    save(KEYS.projects, all)
  },
  delete: (id) => {
    save(KEYS.projects, load(KEYS.projects, []).filter(p => p.id !== id))
  },
}

// ── TASKS ──────────────────────────────────────────────────
export const tasksDB = {
  getAll: () => load(KEYS.tasks, []),
  add: (t) => {
    const all = load(KEYS.tasks, [])
    const item = { ...t, id: crypto.randomUUID(), createdAt: new Date().toISOString(), done: false, gcalEventId: null }
    save(KEYS.tasks, [...all, item])
    return item
  },
  update: (id, changes) => {
    const all = load(KEYS.tasks, []).map(t => t.id === id ? {...t,...changes} : t)
    save(KEYS.tasks, all)
  },
  delete: (id) => {
    save(KEYS.tasks, load(KEYS.tasks, []).filter(t => t.id !== id))
  },
  toggle: (id) => {
    const all = load(KEYS.tasks, []).map(t => t.id === id ? {...t, done: !t.done} : t)
    save(KEYS.tasks, all)
  },
}
