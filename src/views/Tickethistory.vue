<template>
  <header class="top-header">
    <div class="header-left">
      <div class="logo"><Layers class="logo-icon" /><span>WELWISE</span></div>

      <nav class="main-nav">
        <template v-if="user.role === 'Разработчик'">
          <router-link to="/projects" class="nav-item" active-class="active"><FolderGit2 class="icon-sm" /> Черновики</router-link>
          <a href="#" class="nav-item text-muted"><Server class="icon-sm" /> Сервера</a>
        </template>
        <template v-if="user.role === 'Модератор'">
          <router-link to="/moderator/tickets" class="nav-item" active-class="active"><Inbox class="icon-sm" /> Очередь тикетов</router-link>
          <router-link to="/moderator/history" class="nav-item" active-class="active"><History class="icon-sm" /> История тикетов</router-link>
          <router-link to="/moderator/roles" class="nav-item" active-class="active"><Users class="icon-sm" /> Управление ролями</router-link>
        </template>
      </nav>
    </div>

    <div class="header-right relative">
      <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Светлая тема' : 'Тёмная тема'">
        <transition name="icon-swap" mode="out-in">
          <Sun v-if="isDark" key="sun" class="icon-sm" />
          <Moon v-else key="moon" class="icon-sm" />
        </transition>
      </button>

      <button class="profile-btn" @click="menuOpen = !menuOpen"><User class="icon-sm" /> {{ user.name }}</button>

      <div v-if="menuOpen" class="dropdown-overlay" @click="menuOpen = false"></div>
      <div v-if="menuOpen" class="dropdown">
        <div class="dropdown-header">
          <strong>{{ user.name }}</strong>
          <div class="text-muted">{{ user.email }}</div>
        </div>
        <div class="dropdown-body">
          <div class="dropdown-item" style="cursor: default; padding-bottom: 0;">
            <select v-model="user.role" class="role-select">
              <option value="Разработчик">Роль: Разработчик</option>
              <option value="Модератор">Роль: Модератор</option>
            </select>
          </div>
          <div class="divider"></div>
          <button class="dropdown-item"><Settings class="icon-sm" /> Настройки</button>
          <button class="dropdown-item text-danger"><LogOut class="icon-sm" /> Выйти</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { user } from '../store'
import { Layers, FolderGit2, Server, User, Inbox, Settings, LogOut, Users, Sun, Moon, History } from 'lucide-vue-next'

const menuOpen = ref(false)
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<style scoped>
.top-header { height: 60px; background: var(--bg-card); border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; padding: 0 24px; position: sticky; top: 0; z-index: 50; }
.header-left, .header-right { display: flex; align-items: center; gap: 24px; }
.logo { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 1.1rem; color: var(--text-main); }
.logo-icon { color: var(--primary); }
.main-nav { display: flex; gap: 24px; }
.nav-item { display: flex; align-items: center; gap: 6px; font-weight: 500; color: var(--text-main); padding: 8px 0; border-bottom: 2px solid transparent; }
.nav-item.active { border-color: var(--primary); color: var(--primary); }
.text-muted { color: var(--text-muted); }

.theme-toggle { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border); background: transparent; cursor: pointer; color: var(--text-main); transition: background 0.2s; }
.theme-toggle:hover { background: var(--bg-app); }
.icon-swap-enter-active, .icon-swap-leave-active { transition: opacity 0.15s, transform 0.15s; }
.icon-swap-enter-from { opacity: 0; transform: rotate(-30deg) scale(0.7); }
.icon-swap-leave-to { opacity: 0; transform: rotate(30deg) scale(0.7); }

.profile-btn { display: flex; align-items: center; gap: 8px; background: transparent; border: 1px solid var(--border); padding: 6px 16px; border-radius: 20px; font-weight: 500; cursor: pointer; color: var(--text-main); transition: background 0.2s; }
.profile-btn:hover { background: var(--bg-app); }
.relative { position: relative; }
.dropdown-overlay { position: fixed; inset: 0; z-index: 90; }
.dropdown { position: absolute; top: calc(100% + 10px); right: 0; width: 220px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); box-shadow: 0 10px 25px rgba(0,0,0,0.12); z-index: 100; display: flex; flex-direction: column; }
.dropdown-header { padding: 12px; background: var(--bg-app); font-size: 0.85rem; border-bottom: 1px solid var(--border); border-radius: 8px 8px 0 0; color: var(--text-main); }
.dropdown-body { padding: 8px; display: flex; flex-direction: column; }
.dropdown-item { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border: none; background: none; text-align: left; border-radius: 6px; cursor: pointer; font-weight: 500; color: var(--text-main); }
.dropdown-item:hover { background: var(--bg-app); }
.divider { height: 1px; background: var(--border); margin: 8px 0; }
.role-select { width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border); cursor: pointer; outline: none; font-weight: 600; background: var(--bg-card); color: var(--text-main); }
.text-danger { color: #EF4444; }
.text-danger:hover { background: #FEF2F2; }
</style>