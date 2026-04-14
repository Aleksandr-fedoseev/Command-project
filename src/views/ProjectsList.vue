<template>
  <div class="page-container">
    <div class="header-row">
      <h1>Мои проекты</h1>
      <button class="btn-primary" @click="createNewGame">+ Добавить игру</button>
    </div>

    <div class="projects-grid">
      <div class="card project-card" v-for="project in projects" :key="project.id" @click="$router.push(`/projects/${project.id}`)">
        <div class="card-top">
          <span class="project-icon">{{ project.icon }}</span>
          <div class="project-info">
            <h3>{{ project.name }}</h3>
            <span class="project-version">v{{ project.version }}</span>
          </div>
        </div>
        <p class="project-desc">{{ project.description }}</p>
        <div class="card-footer">
          <span class="moderation-badge" :class="`moderation-${project.moderationStatus}`">
            {{ moderationText(project.moderationStatus) }}
          </span>
          <span v-if="project.submittedAt" class="submit-date">
            {{ project.moderationStatus === 'in_review' ? 'Отправлен: ' + project.submittedAt : '' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { projects } from '../store'

const router = useRouter()

const moderationText = (status) => ({
  draft: 'Черновик',
  in_review: 'На модерации',
  approved: 'Одобрен',
  rejected: 'Отклонён'
}[status] || 'Черновик')

const createNewGame = () => {
  const newId = Date.now()
  router.push(`/projects/${newId}/draft`)
}
</script>

<style scoped>
.page-container { padding: 32px 40px; max-width: 1200px; margin: 0 auto; width: 100%; box-sizing: border-box; }
.header-row { display: flex; justify-content: space-between; margin-bottom: 24px; }
.btn-primary { background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: var(--radius-md); cursor: pointer; font-weight: 600; transition: 0.2s; }
.btn-primary:hover { background: var(--primary-hover); }
.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.project-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; cursor: pointer; transition: 0.2s; display: flex; flex-direction: column; gap: 12px; }
.project-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); border-color: var(--primary); }

.card-top { display: flex; align-items: center; gap: 14px; }
.project-icon { font-size: 2.2rem; line-height: 1; }
.project-info { flex: 1; }
.project-info h3 { margin: 0; font-size: 1.1rem; color: var(--text-main); }
.project-version { font-size: 0.78rem; color: var(--text-muted); font-weight: 500; }
.project-desc { margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.4; }

.card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border); }

.moderation-badge { font-size: 0.78rem; padding: 4px 10px; border-radius: 20px; font-weight: 700; }
.moderation-draft { background: var(--bg-secondary); color: var(--text-muted); border: 1px solid var(--border); }
.moderation-in_review { background: #FEF3C7; color: #D97706; }
.moderation-approved { background: #D1FAE5; color: #059669; }
.moderation-rejected { background: #FEF2F2; color: #EF4444; }

.submit-date { font-size: 0.75rem; color: var(--text-muted); }
</style>