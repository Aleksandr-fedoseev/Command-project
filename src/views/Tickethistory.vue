<template>
  <div class="page-container">
    <h1>История тикетов</h1>

    <!-- Фильтр по вердикту -->
    <div class="filters-bar">
      <select v-model="verdictFilter" class="filter-select">
        <option value="all">Все вердикты</option>
        <option value="approved">Одобрено</option>
        <option value="revision">На доработку</option>
        <option value="rejected">Отклонено</option>
      </select>
    </div>

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
          <span>Приоритет: {{ ticket.priority }}</span>
          <span>Закрыт: {{ ticket.closedAt || ticket.created }}</span>
          <span v-if="ticket.moderatorName">Модератор: {{ ticket.moderatorName }}</span>
        </div>
        <div v-if="ticket.verdict && ticket.verdict.notes" class="ticket-remarks">
          📋 {{ ticket.verdict.notes }}
        </div>
      </div>
    </div>

    <div v-if="filteredTickets.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <div class="empty-text">Нет закрытых тикетов</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { tickets } from '../store'

const verdictFilter = ref('all')

const filteredTickets = computed(() => {
  let result = tickets.filter(t => t.status === 'resolved' || t.status === 'rejected')
  if (verdictFilter.value !== 'all') {
    result = result.filter(t => t.verdict && t.verdict.type === verdictFilter.value)
  }
  return result
})

const statusText = (s) => ({
  resolved: 'Решён',
  rejected: 'Отклонён',
}[s] || s)

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
h1 {
  margin-bottom: 20px;
}

.filters-bar {
  margin-bottom: 20px;
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
.status-resolved { background: #D1FAE5; color: #059669; }
.status-rejected { background: #FEF2F2; color: #EF4444; }
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
  flex-wrap: wrap;
}
.ticket-remarks {
  margin-top: 10px;
  padding: 8px 12px;
  background: var(--bg-app);
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  color: var(--text-main);
  border-left: 3px solid var(--border);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
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
}
</style>