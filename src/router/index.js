import { createRouter, createWebHistory } from 'vue-router'
import ProjectsList from '../views/ProjectsList.vue'
import ProjectWorkspace from '../views/ProjectWorkspace.vue'
import DraftTab from '../views/tabs/DraftTab.vue'
import StatsTab from '../views/tabs/StatsTab.vue'
import PublishedTab from '../views/tabs/PublishedTab.vue'
import ServersTab from '../views/tabs/ServersTab.vue'

const routes = [
    { path: '/', redirect: '/projects' },
    { path: '/projects', component: ProjectsList },
    {
        path: '/projects/:id',
        component: ProjectWorkspace,
        props: true,
        children: [
            { path: '', redirect: to => `/projects/${to.params.id}/draft` },
            { path: 'draft', name: 'draft', component: DraftTab },
            { path: 'stats', name: 'stats', component: StatsTab },
            { path: 'published', name: 'published', component: PublishedTab },
            { path: 'servers', name: 'servers', component: ServersTab }
        ]
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})