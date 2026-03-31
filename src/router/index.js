import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import RequestsView from '../views/RequestsView.vue'
import RequestDetailView from '../views/RequestDetailView.vue'
import ReportsView from '../views/ReportsView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ServersView from '../views/ServersView.vue'

const routes = [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/requests', name: 'requests', component: RequestsView },
    { path: '/requests/:id', name: 'request-detail', component: RequestDetailView },
    { path: '/reports', name: 'reports', component: ReportsView },
    { path: '/projects', name: 'projects', component: ProjectsView },
    { path: '/servers', name: 'servers', component: ServersView },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router