<template>
  <div class="page-container">
    <div class="header-row">
      <h1>Мои проекты</h1>
      <button class="btn-primary" @click="createNewGame">+ Добавить игру</button>
    </div>

    <div class="projects-grid">
      <div class="card" v-for="game in games" :key="game.id" @click="$router.push(`/projects/${game.id}`)">
        <h3>{{ game.title }}</h3>
        <span class="badge">{{ game.status }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const games = ref([
  { id: 1, title: 'RIVALS', status: 'Опубликована' },
  { id: 2, title: 'Новый проект', status: 'Черновик' }
])

const createNewGame = () => {
  const newId = Date.now()
  router.push(`/projects/${newId}/draft`)
}
</script>
<style scoped>
.page-container { padding: 32px 40px; max-width: 1200px; margin: 0 auto; width: 100%;}
.header-row { display: flex; justify-content: space-between; margin-bottom: 24px; }
.btn-primary { background: #2563EB; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;}
.projects-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.card { background: white; padding: 24px; border-radius: 12px; border: 1px solid #E5E7EB; cursor: pointer; transition: 0.2s;}
.card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px rgba(0,0,0,0.05);}
.badge { background: #F3F4F6; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; margin-top: 12px; display: inline-block;}
</style>