<template>
  <div class="ticket-detail" v-if="ticket">
    <button class="back-btn" @click="$router.push('/moderator/tickets')">← Назад</button>

    <div class="detail-card">
      <div class="ticket-header">
        <h1>{{ ticket.title }}</h1>
        <span class="status-badge" :class="`status-${ticket.status}`">
          {{ statusText(ticket.status) }}
        </span>
      </div>

      <div class="ticket-meta">
        <span><strong>Приоритет:</strong> {{ ticket.priority }}</span>
        <span><strong>Создан:</strong> {{ ticket.created }}</span>
        <span v-if="ticket.developerName"><strong>Разработчик:</strong> {{ ticket.developerName }}</span>
      </div>

      <div class="ticket-description">
        <h3>Описание</h3>
        <p>{{ ticket.description }}</p>
      </div>

      <div class="chat-section">
        <h3>Обсуждение</h3>
        <div class="chat-messages" ref="chatContainer">
          <div v-for="msg in ticket.messages" :key="msg.id" class="message" :class="msg.role">
            <div class="message-author">{{ msg.author }}</div>
            <div class="message-text">{{ msg.text }}</div>
            <div class="message-time">{{ msg.timestamp }}</div>
          </div>
        </div>

        <div class="chat-input">
          <textarea v-model="newMessage" placeholder="Напишите сообщение... Ctrl+Enter для отправки" rows="2" @keyup.ctrl.enter="sendMessage"></textarea>
          <button class="send-btn" @click="sendMessage">Отправить</button>
        </div>
      </div>

      <div class="ticket-actions" v-if="ticket.status !== 'resolved'">
        <button v-if="ticket.status === 'new'" class="btn-primary" @click="takeTicket">Взять в работу</button>
        <button v-if="ticket.status === 'in_progress'" class="btn-success" @click="resolveTicket">Закрыть тикет</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tickets, addMessage, updateTicketStatus, assignTicketToModerator, user } from '../store'

const route = useRoute()
const router = useRouter()
const ticketId = parseInt(route.params.id)
const ticket = computed(() => tickets.find(t => t.id === ticketId))

if (!ticket.value) {
  router.push('/moderator/tickets')
}

const newMessage = ref('')
const chatContainer = ref(null)

const statusText = (status) => {
  const map = { new: 'Новый', in_progress: 'В работе', resolved: 'Решён' }
  return map[status] || status
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  })
}

watch(() => ticket.value.messages.length, () => scrollToBottom())
onMounted(scrollToBottom)

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  addMessage(ticketId, newMessage.value, 'moderator')
  newMessage.value = ''
}

const takeTicket = () => assignTicketToModerator(ticketId, user.name)
const resolveTicket = () => updateTicketStatus(ticketId, 'resolved')
</script>

<style scoped>
.ticket-detail {
  padding: 32px 40px;
  max-width: 900px;
  margin: 0 auto;
}
.back-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 0.9rem;
}
.detail-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  padding: 28px;
}
.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.ticket-header h1 {
  margin: 0;
  font-size: 1.5rem;
}
.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}
.status-new { background: #FEF3C7; color: #D97706; }
.status-in_progress { background: #EFF6FF; color: var(--primary); }
.status-resolved { background: #D1FAE5; color: #059669; }
.ticket-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
  font-size: 0.9rem;
  color: var(--text-muted);
}
.ticket-description h3 {
  margin: 0 0 12px;
  font-size: 1.1rem;
}
.chat-section {
  margin: 32px 0;
  border-top: 1px solid var(--border);
  padding-top: 24px;
}
.chat-section h3 {
  margin: 0 0 16px;
}
.chat-messages {
  max-height: 400px;
  overflow-y: auto;
  background: #F9FAFB;
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.message {
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 80%;
}
.message.moderator {
  background: var(--primary);
  color: white;
  align-self: flex-end;
}
.message.developer {
  background: white;
  border: 1px solid var(--border);
  align-self: flex-start;
}
.message-author {
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 4px;
}
.message.moderator .message-author { color: rgba(255,255,255,0.8); }
.message.developer .message-author { color: var(--text-muted); }
.message-text { font-size: 0.9rem; word-break: break-word; }
.message-time { font-size: 0.7rem; margin-top: 4px; opacity: 0.7; }
.chat-input {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}
.chat-input textarea {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-family: inherit;
  resize: vertical;
}
.send-btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
  height: 40px;
}
.ticket-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.btn-success {
  background: #10B981;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
}
.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
}
</style>