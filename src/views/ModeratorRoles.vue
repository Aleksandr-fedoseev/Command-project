<template>
  <div class="page-container">
    <h1>Управление ролями</h1>

    <div class="users-table">
      <table>
        <thead>
        <tr>
          <th>Пользователь</th>
          <th>Email</th>
          <th>Текущая роль</th>
          <th>Действие</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="u in users"
            :key="u.id"
            class="user-row"
            @click="openUser(u)"
        >
          <td>
            <div class="user-cell">
              <div class="avatar" :class="u.role === 'Модератор' ? 'avatar-purple' : 'avatar-blue'">
                {{ u.name[0] }}
              </div>
              <strong>{{ u.name }}</strong>
            </div>
          </td>
          <td class="text-muted">{{ u.email }}</td>
          <td>
              <span class="role-badge" :class="u.role === 'Модератор' ? 'bg-purple' : 'bg-blue'">
                {{ u.role }}
              </span>
          </td>
          <td @click.stop>
            <select v-model="u.role" @change="changeRole(u)" class="role-select">
              <option value="Разработчик">Разработчик</option>
              <option value="Модератор">Модератор</option>
            </select>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно с профилем пользователя -->
    <transition name="modal-fade">
      <div v-if="selectedUser" class="modal-overlay" @click.self="selectedUser = null">
        <div class="modal-card">
          <button class="modal-close" @click="selectedUser = null">✕</button>

          <div class="modal-avatar" :class="selectedUser.role === 'Модератор' ? 'avatar-purple' : 'avatar-blue'">
            {{ selectedUser.name[0] }}
          </div>

          <h2 class="modal-name">{{ selectedUser.name }}</h2>
          <span class="role-badge" :class="selectedUser.role === 'Модератор' ? 'bg-purple' : 'bg-blue'">
            {{ selectedUser.role }}
          </span>

          <div class="modal-info">
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">{{ selectedUser.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ID</span>
              <span class="info-value">#{{ selectedUser.id }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Зарегистрирован</span>
              <span class="info-value">{{ selectedUser.registered }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Проектов</span>
              <span class="info-value">{{ selectedUser.projects }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Тикетов закрыто</span>
              <span class="info-value">{{ selectedUser.ticketsClosed }}</span>
            </div>
          </div>

          <div class="modal-actions">
            <div class="action-label">Сменить роль</div>
            <div class="role-buttons">
              <button
                  v-for="role in ['Разработчик', 'Модератор']"
                  :key="role"
                  class="role-btn"
                  :class="{ active: selectedUser.role === role, 'role-btn-purple': role === 'Модератор', 'role-btn-blue': role === 'Разработчик' }"
                  @click="changeRoleFromModal(selectedUser, role)"
              >
                {{ role }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from '../store'

const users = ref([
  { id: 1, name: 'Михаил В.', email: 'mikhail@welwise.com', role: 'Разработчик', registered: '2025-01-15', projects: 3, ticketsClosed: 0 },
  { id: 2, name: 'Анна С.',   email: 'anna@welwise.com',    role: 'Модератор',    registered: '2024-11-02', projects: 1, ticketsClosed: 12 },
  { id: 3, name: 'Дмитрий К.',email: 'dmitry@welwise.com',  role: 'Разработчик',  registered: '2025-03-07', projects: 5, ticketsClosed: 0 },
])

const selectedUser = ref(null)

const openUser = (u) => {
  selectedUser.value = { ...u }
}

const changeRole = (u) => {
  showToast(`Роль ${u.name} изменена на "${u.role}"`, 'success')
  if (selectedUser.value?.id === u.id) selectedUser.value.role = u.role
}

const changeRoleFromModal = (u, role) => {
  if (u.role === role) return
  u.role = role
  const original = users.value.find(x => x.id === u.id)
  if (original) original.role = role
  showToast(`Роль ${u.name} изменена на "${role}"`, 'success')
}
</script>

<style scoped>
.page-container { padding: 32px 40px; max-width: 1000px; margin: 0 auto; }
h1 { margin-bottom: 24px; color: var(--text-main); }

.users-table { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 16px; border-bottom: 1px solid var(--border); }
th { background: var(--bg-app); font-weight: 600; color: var(--text-muted); font-size: 0.85rem; }
tr:last-child td { border-bottom: none; }

.user-row { cursor: pointer; transition: background 0.15s; }
.user-row:hover td { background: var(--bg-app); }

.user-cell { display: flex; align-items: center; gap: 10px; }
.avatar {
  width: 34px; height: 34px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.85rem; flex-shrink: 0;
}
.avatar-blue { background: #EFF6FF; color: var(--primary); }
.avatar-purple { background: #F3E8FF; color: #9333EA; }
.text-muted { color: var(--text-muted); font-size: 0.9rem; }

.role-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: 700; }
.bg-blue { background: #EFF6FF; color: var(--primary); }
.bg-purple { background: #F3E8FF; color: #9333EA; }

.role-select {
  padding: 6px 12px; border: 1px solid var(--border);
  border-radius: var(--radius-md); background: var(--bg-card);
  color: var(--text-main); font-weight: 500; cursor: pointer;
}

/* Модальное окно */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  z-index: 200; display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(3px);
}
.modal-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 32px 28px;
  width: 340px; position: relative;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}
.modal-close {
  position: absolute; top: 14px; right: 14px;
  background: none; border: none; font-size: 1rem;
  color: var(--text-muted); cursor: pointer; line-height: 1;
}
.modal-close:hover { color: var(--text-main); }

.modal-avatar {
  width: 64px; height: 64px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 1.4rem;
}
.modal-name { margin: 0; font-size: 1.2rem; color: var(--text-main); }

.modal-info {
  width: 100%; border: 1px solid var(--border);
  border-radius: var(--radius-md); overflow: hidden; margin-top: 4px;
}
.info-row {
  display: flex; justify-content: space-between;
  padding: 10px 14px; border-bottom: 1px solid var(--border);
  font-size: 0.88rem;
}
.info-row:last-child { border-bottom: none; }
.info-label { color: var(--text-muted); }
.info-value { font-weight: 600; color: var(--text-main); }

.modal-actions { width: 100%; margin-top: 4px; }
.action-label { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.04em; }
.role-buttons { display: flex; gap: 8px; }
.role-btn {
  flex: 1; padding: 9px; border-radius: var(--radius-md);
  border: 1px solid var(--border); background: var(--bg-app);
  color: var(--text-muted); font-weight: 600; cursor: pointer;
  font-size: 0.88rem; transition: 0.15s;
}
.role-btn-blue.active { background: #EFF6FF; color: var(--primary); border-color: var(--primary); }
.role-btn-purple.active { background: #F3E8FF; color: #9333EA; border-color: #9333EA; }

/* Анимация модалки */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(0.95); }
</style>