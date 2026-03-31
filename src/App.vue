<template>
  <div class="app-layout">
    <transition name="toast-fade">
      <div v-if="toast.show" class="toast" :class="toast.type">{{ toast.message }}</div>
    </transition>

    <GlobalHeader />

    <main class="page-content">
      <div v-if="user.role === 'Модератор' && $route.path.includes('/projects')" class="moderator-stub">
        <h2>Режим модератора</h2>
        <p>Перейдите во вкладку "Очередь тикетов". Просмотр проектов недоступен.</p>
      </div>
      <router-view v-else />
    </main>
  </div>
</template>

<script setup>
import GlobalHeader from './components/GlobalHeader.vue'
import { toast, user } from './store'
</script>

<style>
/* ВОЗВРАЩАЕМ КРАСИВЫЙ ДИЗАЙН */
:root {
  --bg-app: #F3F4F6;
  --bg-card: #FFFFFF;
  --text-main: #111827;
  --text-muted: #6B7280;
  --border: #E5E7EB;
  --primary: #2563EB;
  --primary-hover: #1D4ED8;
  --radius-lg: 12px;
  --radius-md: 8px;
}
body { margin: 0; background: var(--bg-app); color: var(--text-main); font-family: 'Inter', sans-serif; }
a { text-decoration: none; }
.app-layout { display: flex; flex-direction: column; min-height: 100vh; }
.page-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

/* Общие элементы UI */
.card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; }
.btn-primary { display: flex; align-items: center; gap: 8px; background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; transition: 0.2s;}
.btn-primary:hover { background: var(--primary-hover); }
.btn-outline { display: flex; align-items: center; gap: 8px; background: white; border: 1px solid var(--border); padding: 8px 16px; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; transition: 0.2s;}
.btn-outline:hover { background: #F9FAFB; }
.icon-sm { width: 18px; height: 18px; }
.icon-md { width: 24px; height: 24px; }

/* Уведомления */
.toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); padding: 12px 24px; border-radius: var(--radius-md); font-weight: 600; color: white; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.1);}
.toast.success { background: #10B981; } .toast.error { background: #EF4444; } .toast.info { background: #3B82F6; }
.toast-fade-enter-active, .toast-fade-leave-active { transition: all 0.3s; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translate(-50%, -20px); }

.moderator-stub { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60vh; text-align: center; color: #6B7280;}
.moderator-stub h2 { color: #8B5CF6; font-size: 2rem; margin-bottom: 8px;}
</style>