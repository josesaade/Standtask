# STAND TASK

Tu gestor de tareas personal con identidad JoJo. Funciona 100% en local con localStorage.

## Setup local

```bash
cd stand-task
npm install
npm run dev
# Abre http://localhost:5173
```

## Estructura del proyecto

```
stand-task/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx       # Nav lateral con proyectos
│   │   ├── Topbar.jsx        # Header con logo y fecha
│   │   ├── TaskItem.jsx      # Fila de tarea con flag/prioridad
│   │   ├── DetailPanel.jsx   # Panel edición a la derecha
│   │   └── AddTaskModal.jsx  # Modal nueva tarea (+ FAB)
│   ├── views/
│   │   ├── TaskListView.jsx  # Vista Hoy / Semana / Alta / Vencidas
│   │   └── MonthView.jsx     # Vista calendario mensual
│   ├── lib/
│   │   ├── db.js             # localStorage (→ Supabase después)
│   │   ├── store.jsx         # Context global de estado
│   │   └── dateUtils.js      # Helpers de fechas
│   └── styles/globals.css    # Variables CSS + reset
├── index.html
└── vite.config.js
```

## Próximos pasos

1. [ ] Ajustes visuales / feedback
2. [ ] Migrar db.js → Supabase
3. [ ] Netlify deploy + env vars
4. [ ] Google Calendar API sync
5. [ ] Widget Scriptable (abre la webapp como PWA)
