<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Очередь тикетов</h1>
      <span class="ticket-count">{{ filteredTickets.length }} из {{ tickets.length }}</span>
    </div>

    <!-- Фильтры и поиск -->
    <div class="filters-bar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" v-model="searchQuery" placeholder="Поиск по ID, заголовку, описанию..." class="search-input" />
      </div>

      <div class="filter-group">
        <select v-model="statusFilter" class="filter-select">
          <option value="all">Все статусы</option>
          <option value="new">Новый</option>
          <option value="in_progress">В работе</option>
          <option value="waiting_for_response">Ожидает ответа</option>
          <option value="resolved">Решён</option>
          <option value="rejected">Отклонён</option>
        </select>

        <select v-model="priorityFilter" class="filter-select">
          <option value="all">Все приоритеты</option>
          <option value="Высокий">Высокий</option>
          <option value="Средний">Средний</option>
          <option value="Низкий">Низкий</option>
        </select>

        <select v-model="sortBy" class="filter-select">
          <option value="date_desc">Сначала новые</option>
          <option value="date_asc">Сначала старые</option>
          <option value="priority">По приоритету</option>
        </select>
      </div>
    </div>

    <!-- Тикеты -->
    <div class="tickets-list">
      <div
          v-for="ticket in filteredTickets"
          :key="ticket.id"
          class="ticket-card"
          @click="$router.push(`/moderator/tickets/${ticket.id}`)"
      >
        <div class="ticket-header">
          <span class="ticket-id">#{{ ticket.id }}</span>
          <div class="ticket-badges">
            <span class="ticket-status" :class="`status-${ticket.status}`">
              {{ statusText(ticket.status) }}
            </span>
            <span v-if="ticket.verdict" class="ticket-verdict" :class="`verdict-${ticket.verdict.type}`">
              {{ verdictText(ticket.verdict.type) }}
            </span>
          </div>
        </div>
        <h3 class="ticket-title">{{ ticket.title }}</h3>
        <p class="ticket-desc">{{ ticket.description }}</p>
        <div class="ticket-meta">
          <span class="priority-badge" :class="`priority-${ticket.priority}`">{{ ticket.priority }}</span>
          <span>Создан: {{ ticket.created }}</span>
          <span v-if="ticket.moderatorName">Модератор: {{ ticket.moderatorName }}</span>
        </div>
        <div v-if="ticket.messages.length > 0" class="ticket-messages-count">
          💬 {{ ticket.messages.length }} сообщ.
        </div>
      </div>
    </div>

    <div v-if="filteredTickets.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <div class="empty-text">Тикеты не найдены</div>
      <div class="empty-hint">Попробуйте изменить фильтры</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { tickets } from '../store'

const searchQuery = ref('')
const statusFilter = ref('all')
const priorityFilter = ref('all')
const sortBy = ref('date_desc')

const priorityWeight = { 'Высокий': 3, 'Средний': 2, 'Низкий': 1 }

const filteredTickets = computed(() => {
  let result = [...tickets]

  // Search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(t =>
        t.id.toString().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    )
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    result = result.filter(t => t.status === statusFilter.value)
  }

  // Priority filter
  if (priorityFilter.value !== 'all') {
    result = result.filter(t => t.priority === priorityFilter.value)
  }

  // Sort
  if (sortBy.value === 'date_desc') {
    result.sort((a, b) => b.id - a.id)
  } else if (sortBy.value === 'date_asc') {
    result.sort((a, b) => a.id - b.id)
  } else if (sortBy.value === 'priority') {
    result.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority])
  }

  return result
})

const statusText = (status) => ({
  new: 'Новый',
  in_progress: 'В работе',
  resolved: 'Решён',
  rejected: 'Отклонён',
  waiting_for_response: 'Ожидает ответа'
}[status] || status)

const verdictText = (type) => ({
  approved: '✓ Одобрено',
  revision: '↩ Доработка',
  rejected: '✕ Отклонено'
}[type] || '')
</script>

<style scoped>
.page-container {
  padding: 32px 40px;
  max-width: 1000px;
  margin: 0 auto;
}
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
h1 {
  margin: 0;
}
.ticket-count {
  font-size: 0.88rem;
  color: var(--text-muted);
  font-weight: 500;
  padding: 4px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
}

/* ═══════════════════════════════════════════
   FILTERS BAR
   ═══════════════════════════════════════════ */
.filters-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 10px 14px 10px 36px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  background: var(--bg-card);
  color: var(--text-main);
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.search-input:focus {
  border-color: var(--primary);
}
.filter-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.filter-select {
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  background: var(--bg-card);
  color: var(--text-main);
  cursor: pointer;
  outline: none;
  font-weight: 500;
  transition: border-color 0.2s;
}
.filter-select:focus {
  border-color: var(--primary);
}

/* ═══════════════════════════════════════════
   TICKETS LIST
   ═══════════════════════════════════════════ */
.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ticket-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  cursor: pointer;
  transition: 0.2s;
}
.ticket-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-color: var(--primary);
}
.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.ticket-id {
  font-weight: 600;
  color: var(--text-muted);
  font-size: 0.85rem;
}
.ticket-badges {
  display: flex;
  gap: 8px;
  align-items: center;
}
.ticket-status {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
}
.status-new { background: #FEF3C7; color: #D97706; }
.status-in_progress { background: #EFF6FF; color: var(--primary); }
.status-resolved { background: #D1FAE5; color: #059669; }
.status-rejected { background: #FEF2F2; color: #EF4444; }
.status-waiting_for_response { background: #F5F3FF; color: #7C3AED; }
.ticket-verdict {
  font-size: 0.72rem;
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 700;
}
.verdict-approved { background: #D1FAE5; color: #059669; }
.verdict-revision { background: #FEF3C7; color: #D97706; }
.verdict-rejected { background: #FEF2F2; color: #EF4444; }
.ticket-title {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
}
.ticket-desc {
  color: var(--text-muted);
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.ticket-meta {
  display: flex;
  gap: 16px;
  font-size: 0.8rem;
  color: var(--text-muted);
  align-items: center;
  flex-wrap: wrap;
}
.priority-badge {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.72rem;
  font-weight: 700;
}
.priority-Высокий { background: #FEF2F2; color: #EF4444; }
.priority-Средний { background: #FEF3C7; color: #D97706; }
.priority-Низкий { background: #D1FAE5; color: #059669; }
.ticket-messages-count {
  margin-top: 10px;
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 500;
}

/* ═══════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════ */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--border);
}
.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}
.empty-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 6px;
}
.empty-hint {
  font-size: 0.88rem;
  color: var(--text-muted);
}
</style>