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
        <tr v-for="user in users" :key="user.id">
          <td><strong>{{ user.name }}</strong></td>
          <td>{{ user.email }}</td>
          <td><span class="role-badge" :class="user.role === 'Модератор' ? 'bg-purple' : 'bg-blue'">{{ user.role }}</span></td>
          <td>
            <select v-model="user.role" @change="changeRole(user.id, user.role)" class="role-select">
              <option value="Разработчик">Разработчик</option>
              <option value="Модератор">Модератор</option>
            </select>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from '../store'

const users = ref([
  { id: 1, name: 'Михаил В.', email: 'mikhail@welwise.com', role: 'Разработчик' },
  { id: 2, name: 'Анна С.', email: 'anna@welwise.com', role: 'Модератор' },
  { id: 3, name: 'Дмитрий К.', email: 'dmitry@welwise.com', role: 'Разработчик' }
])

const changeRole = (userId, newRole) => {
  const user = users.value.find(u => u.id === userId)
  if (user) {
    showToast(`Роль пользователя ${user.name} изменена на "${newRole}"`, 'success')
  }
}
</script>

<style scoped>
.page-container {
  padding: 32px 40px;
  max-width: 1000px;
  margin: 0 auto;
}
h1 {
  margin-bottom: 24px;
}
.users-table {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  text-align: left;
  padding: 16px;
  border-bottom: 1px solid var(--border);
}
th {
  background: #F9FAFB;
  font-weight: 600;
  color: var(--text-muted);
}
tr:last-child td {
  border-bottom: none;
}
.role-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}
.bg-blue {
  background: #EFF6FF;
  color: var(--primary);
}
.bg-purple {
  background: #F3E8FF;
  color: #9333EA;
}
.role-select {
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: white;
  font-weight: 500;
  cursor: pointer;
}
</style>