<template>
  <div class="ticket-detail" v-if="ticket">
    <button class="back-btn" @click="$router.push('/moderator/tickets')">
      <span class="back-arrow">←</span> Назад к тикетам
    </button>

    <div class="ticket-layout">

      <!-- Левая колонка: инфо + модерация -->
      <div class="ticket-sidebar">

        <!-- Информация о тикете -->
        <div class="sidebar-card">
          <div class="ticket-id">#{{ ticket.id }}</div>
          <h2 class="ticket-title">{{ ticket.title }}</h2>

          <span class="status-badge" :class="`status-${ticket.status}`">
            {{ statusText(ticket.status) }}
          </span>

          <div class="meta-list">
            <div class="meta-item">
              <span class="meta-label">Приоритет</span>
              <span class="meta-value" :class="`priority-${ticket.priority}`">{{ ticket.priority }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Создан</span>
              <span class="meta-value">{{ ticket.created }}</span>
            </div>
            <div class="meta-item" v-if="ticket.developerName">
              <span class="meta-label">Разработчик</span>
              <span class="meta-value">{{ ticket.developerName }}</span>
            </div>
            <div class="meta-item" v-if="ticket.moderatorName">
              <span class="meta-label">Модератор</span>
              <span class="meta-value">{{ ticket.moderatorName }}</span>
            </div>
          </div>

          <div class="description-block">
            <div class="description-label">Описание</div>
            <p class="description-text">{{ ticket.description }}</p>
          </div>
        </div>

        <!-- Быстрые действия -->
        <div class="ticket-actions">
          <button v-if="ticket.status === 'new'" class="btn-action btn-primary" @click="takeTicket">
            Взять в работу
          </button>
          <button v-if="ticket.status === 'in_progress' || ticket.status === 'waiting_for_response'" class="btn-action btn-warning" @click="handleWaiting">
            ⏳ Ожидать ответ разработчика
          </button>
          <template v-if="ticket.status === 'resolved'">
            <div class="ticket-resolved">✓ Тикет закрыт</div>
            <button class="btn-action btn-reopen" @click="handleReopen">
              ↩ Открыть повторно
            </button>
          </template>
          <template v-if="ticket.status === 'rejected'">
            <div class="ticket-rejected">✕ Тикет отклонён</div>
            <button class="btn-action btn-reopen" @click="handleReopen">
              ↩ Открыть повторно
            </button>
          </template>
        </div>

        <!-- ПАНЕЛЬ МОДЕРАЦИИ (use-case: MODERATE, TEST, VERDICT) -->
        <div v-if="ticket.status === 'in_progress' || ticket.status === 'waiting_for_response'" class="moderation-panel sidebar-card">
          <div class="panel-header">
            <span class="panel-icon">🔍</span>
            <h3>Панель модерации</h3>
          </div>

          <!-- Чек-лист проверки -->
          <div class="checklist-section">
            <div class="section-label">Чек-лист проверки</div>
            <label v-for="item in checklist" :key="item.id" class="checklist-item" :class="{ optional: item.optional }">
              <input type="checkbox" v-model="item.checked" />
              <span class="checkmark"></span>
              <span class="check-label">{{ item.label }}</span>
              <span v-if="item.optional" class="optional-badge">опц.</span>
            </label>
          </div>

          <!-- Тестирование (use-case: TEST) -->
          <div class="test-section">
            <button class="btn-test" @click="handleTest">
              🎮 Тестировать в dev-окружении
            </button>
            <div v-if="testSessionActive" class="test-session">
              <div class="test-status">
                <span class="test-dot"></span>
                Тестирование запущено
              </div>
              <div class="test-timer">{{ testTimeElapsed }}</div>
            </div>
          </div>

          <!-- Вердикт (use-case: VERDICT, APPROVE, REMARKS) -->
          <div class="verdict-section">
            <div class="section-label">Вердикт</div>

            <div class="verdict-options">
              <label class="verdict-radio" :class="{ active: verdictType === 'approved' }">
                <input type="radio" v-model="verdictType" value="approved" />
                <span class="verdict-dot verdict-approved"></span>
                <span>Одобрить к публикации</span>
              </label>
              <label class="verdict-radio" :class="{ active: verdictType === 'revision' }">
                <input type="radio" v-model="verdictType" value="revision" />
                <span class="verdict-dot verdict-revision"></span>
                <span>На доработку</span>
              </label>
              <label class="verdict-radio" :class="{ active: verdictType === 'rejected' }">
                <input type="radio" v-model="verdictType" value="rejected" />
                <span class="verdict-dot verdict-rejected"></span>
                <span>Отклонить</span>
              </label>
            </div>

            <div v-if="verdictType === 'revision' || verdictType === 'rejected'" class="remarks-field">
              <label class="remarks-label">Замечания <span class="required">*</span></label>
              <textarea v-model="verdictRemarks" rows="4" placeholder="Опишите замечания..."></textarea>
            </div>

            <button class="btn-verdict" @click="handleSubmitVerdict" :disabled="isVerdictDisabled">
              ✓ Вынести вердикт
            </button>
          </div>
        </div>

        <!-- ЖУРНАЛ МОДЕРАЦИИ (use-case: MODERATE log) -->
        <div class="moderation-log sidebar-card" v-if="ticket.moderationLog && ticket.moderationLog.length">
          <div class="panel-header">
            <span class="panel-icon">📋</span>
            <h3>Журнал модерации</h3>
          </div>
          <div class="log-timeline">
            <div v-for="log in ticket.moderationLog" :key="log.id" class="log-entry" :class="`log-${log.type}`">
              <div class="log-dot"></div>
              <div class="log-content">
                <div class="log-action">{{ log.action }}</div>
                <div class="log-meta">
                  <span class="log-author">{{ log.author }}</span>
                  <span class="log-time">{{ log.timestamp }}</span>
                </div>
                <div v-if="log.remarks" class="log-remarks">{{ log.remarks }}</div>
              </div>
            </div>
          </div>
        </div>

        <button class="history-link" @click="$router.push('/moderator/history')">
          📋 История тикетов
        </button>
      </div>

      <!-- Правая колонка: чат -->
      <div class="chat-column">
        <div class="chat-header">
          <h3>Обсуждение</h3>
          <span class="messages-count">{{ visibleMessages.length }} сообщений</span>
        </div>

        <div class="chat-messages" ref="chatContainer">
          <div v-if="visibleMessages.length === 0" class="chat-empty">
            Сообщений пока нет. Начните обсуждение.
          </div>
          <div v-for="msg in visibleMessages" :key="msg.id" class="message-wrap" :class="[msg.role, { 'message-private': msg.isPrivate }]">
            <div class="message-bubble" :class="msg.role">
              <div v-if="msg.isPrivate" class="private-badge">🔒 Приватная заметка</div>
              <div class="message-meta">
                <span class="message-author">{{ msg.author }}</span>
                <span class="message-time">{{ msg.timestamp }}</span>
              </div>
              <div class="message-text">{{ msg.text }}</div>
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <textarea
              v-model="newMessage"
              placeholder="Напишите сообщение... Ctrl+Enter для отправки"
              rows="3"
              @keyup.ctrl.enter="sendMessage"
          ></textarea>
          <div class="input-footer">
            <label class="private-toggle">
              <input type="checkbox" v-model="isPrivateNote" />
              <span class="toggle-slider"></span>
              <span class="toggle-label">🔒 Приватная заметка</span>
            </label>
            <button class="send-btn" @click="sendMessage" :disabled="!newMessage.trim()">Отправить</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  tickets, addMessage, updateTicketStatus, assignTicketToModerator,
  reopenTicket, user, submitVerdict, setWaitingForResponse, startTestSession,
  DEFAULT_CHECKLIST
} from '../store'

const route = useRoute()
const router = useRouter()
const ticketId = parseInt(route.params.id)
const ticket = computed(() => tickets.find(t => t.id === ticketId))

if (!ticket.value) router.push('/moderator/tickets')

const newMessage = ref('')
const isPrivateNote = ref(false)
const chatContainer = ref(null)

// --- Moderation Panel State ---
const checklist = ref(DEFAULT_CHECKLIST.map(item => ({ ...item })))
const verdictType = ref('approved')
const verdictRemarks = ref('')

// --- Test Session State ---
const testSessionActive = ref(false)
const testTimeElapsed = ref('00:00')
let testTimer = null

const statusText = (s) => ({
  new: 'Новый',
  in_progress: 'В работе',
  resolved: 'Решён',
  rejected: 'Отклонён',
  waiting_for_response: 'Ожидает ответа'
}[s] || s)

// --- Computed: visible messages (hide private from developer if needed) ---
const visibleMessages = computed(() => {
  if (!ticket.value) return []
  // В текущей логике модератор видит всё, разработчик — только публичные
  // Так как мы в роли модератора, показываем все
  return ticket.value.messages
})

const isVerdictDisabled = computed(() => {
  if (verdictType.value === 'approved') return false
  // Для revision/rejected замечания обязательны
  return !verdictRemarks.value.trim()
})

const scrollToBottom = () => nextTick(() => {
  if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight
})

watch(() => ticket.value?.messages.length, scrollToBottom)
onMounted(scrollToBottom)

// --- Cleanup timer on unmount ---
onUnmounted(() => {
  if (testTimer) clearInterval(testTimer)
})

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  addMessage(ticketId, newMessage.value, 'moderator', isPrivateNote.value)
  newMessage.value = ''
  isPrivateNote.value = false
}

const takeTicket = () => assignTicketToModerator(ticketId, user.name)
const handleReopen = () => reopenTicket(ticketId)
const handleWaiting = () => setWaitingForResponse(ticketId)

const handleTest = () => {
  startTestSession(ticketId)
  testSessionActive.value = true
  let seconds = 0
  testTimeElapsed.value = '00:00'
  if (testTimer) clearInterval(testTimer)
  testTimer = setInterval(() => {
    seconds++
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    testTimeElapsed.value = `${mins}:${secs}`
  }, 1000)
}

const handleSubmitVerdict = () => {
  if (isVerdictDisabled.value) return

  const checklistState = {}
  checklist.value.forEach(item => {
    checklistState[item.id] = item.checked
  })

  submitVerdict(ticketId, verdictType.value, verdictRemarks.value, checklistState)

  // Stop test timer if running
  if (testTimer) {
    clearInterval(testTimer)
    testTimer = null
  }
  testSessionActive.value = false

  // Reset form
  verdictType.value = 'approved'
  verdictRemarks.value = ''
}
</script>

<style scoped>
.ticket-detail { padding: 28px 40px; max-width: 1300px; margin: 0 auto; width: 100%; box-sizing: border-box; }
.back-btn { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.9rem; margin-bottom: 20px; padding: 6px 0; font-weight: 500; transition: color 0.2s; }
.back-btn:hover { color: var(--text-main); }
.back-arrow { font-size: 1.1rem; }
.ticket-layout { display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start; }

.ticket-sidebar { display: flex; flex-direction: column; gap: 12px; }
.sidebar-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.ticket-id { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); letter-spacing: 0.05em; }
.ticket-title { margin: 0; font-size: 1.2rem; font-weight: 700; color: var(--text-main); line-height: 1.4; }
.status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 700; width: fit-content; }
.status-new { background: #FEF3C7; color: #D97706; }
.status-in_progress { background: #EFF6FF; color: var(--primary); }
.status-resolved { background: #D1FAE5; color: #059669; }
.status-rejected { background: #FEF2F2; color: #EF4444; }
.status-waiting_for_response { background: #F5F3FF; color: #7C3AED; }
.meta-list { display: flex; flex-direction: column; gap: 10px; padding: 16px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.meta-item { display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem; }
.meta-label { color: var(--text-muted); }
.meta-value { font-weight: 600; color: var(--text-main); }
.priority-Высокий { color: #EF4444; }
.priority-Средний { color: #F59E0B; }
.priority-Низкий { color: #10B981; }
.description-label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
.description-text { margin: 0; font-size: 0.9rem; color: var(--text-main); line-height: 1.6; }

.ticket-actions { display: flex; flex-direction: column; gap: 8px; }
.btn-action { width: 100%; padding: 11px; border-radius: var(--radius-md); font-weight: 600; font-size: 0.95rem; border: none; cursor: pointer; transition: opacity 0.2s; }
.btn-action:hover { opacity: 0.85; }
.btn-primary { background: var(--primary); color: white; }
.btn-success { background: #10B981; color: white; }
.btn-warning { background: #F59E0B; color: white; }
.btn-reopen { background: var(--bg-app); color: var(--text-main); border: 1px solid var(--border) !important; }
.ticket-resolved { text-align: center; padding: 10px; font-size: 0.9rem; font-weight: 600; color: #059669; background: #D1FAE5; border-radius: var(--radius-md); }
.ticket-rejected { text-align: center; padding: 10px; font-size: 0.9rem; font-weight: 600; color: #EF4444; background: #FEF2F2; border-radius: var(--radius-md); }

.history-link { width: 100%; padding: 10px; border-radius: var(--radius-md); background: none; border: 1px dashed var(--border); color: var(--text-muted); font-size: 0.88rem; font-weight: 500; cursor: pointer; transition: 0.2s; text-align: center; box-sizing: border-box; }
.history-link:hover { border-color: var(--primary); color: var(--primary); background: var(--bg-app); }

/* ═══════════════════════════════════════════
   MODERATION PANEL
   ═══════════════════════════════════════════ */
.moderation-panel { border-color: var(--primary); border-width: 2px; }
.panel-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.panel-header h3 { margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--text-main); }
.panel-icon { font-size: 1.1rem; }
.section-label { font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; }

/* Checklist */
.checklist-section { display: flex; flex-direction: column; gap: 8px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
.checklist-item { display: flex; align-items: flex-start; gap: 8px; cursor: pointer; font-size: 0.85rem; padding: 4px 0; transition: opacity 0.2s; }
.checklist-item.optional { opacity: 0.7; }
.checklist-item input[type="checkbox"] { display: none; }
.checkmark { width: 18px; height: 18px; min-width: 18px; border: 2px solid var(--border); border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: 0.2s; margin-top: 1px; }
.checklist-item input:checked + .checkmark { background: var(--primary); border-color: var(--primary); }
.checklist-item input:checked + .checkmark::after { content: '✓'; color: white; font-size: 0.7rem; font-weight: 700; }
.check-label { flex: 1; color: var(--text-main); line-height: 1.4; }
.optional-badge { font-size: 0.7rem; padding: 2px 6px; background: var(--bg-app); color: var(--text-muted); border-radius: 10px; font-weight: 600; }

/* Test Section */
.test-section { padding: 16px 0; border-bottom: 1px solid var(--border); }
.btn-test { width: 100%; padding: 10px; border-radius: var(--radius-md); background: var(--bg-app); color: var(--text-main); border: 1px dashed var(--border); font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: 0.2s; }
.btn-test:hover { border-color: var(--primary); color: var(--primary); background: var(--bg-hover); }
.test-session { margin-top: 12px; padding: 10px 14px; background: #EFF6FF; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; }
.test-status { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: var(--primary); }
.test-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); animation: pulse 1.5s infinite; }
.test-timer { font-size: 0.9rem; font-weight: 700; color: var(--primary); font-variant-numeric: tabular-nums; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

/* Verdict Section */
.verdict-section { padding-top: 4px; }
.verdict-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.verdict-radio { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--border); cursor: pointer; transition: 0.2s; font-size: 0.88rem; }
.verdict-radio:hover { background: var(--bg-hover); }
.verdict-radio.active { border-color: var(--primary); background: rgba(37, 99, 235, 0.05); }
.verdict-radio input[type="radio"] { display: none; }
.verdict-dot { width: 16px; height: 16px; min-width: 16px; border-radius: 50%; border: 2px solid var(--border); transition: 0.2s; }
.verdict-radio.active .verdict-dot { border-width: 5px; }
.verdict-approved.active, .verdict-radio.active .verdict-approved { border-color: #10B981; }
.verdict-radio.active .verdict-approved { background: #10B981; border-color: #10B981; }
.verdict-revision { background: #F59E0B; }
.verdict-radio.active .verdict-revision { background: #F59E0B; border-color: #F59E0B; }
.verdict-rejected { background: #EF4444; }
.verdict-radio.active .verdict-rejected { background: #EF4444; border-color: #EF4444; }

.remarks-field { margin-bottom: 14px; }
.remarks-label { display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; }
.required { color: #EF4444; }
.remarks-field textarea { width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: var(--radius-md); font-family: inherit; font-size: 0.88rem; resize: vertical; background: var(--bg-app); color: var(--text-main); box-sizing: border-box; outline: none; transition: border-color 0.2s; }
.remarks-field textarea:focus { border-color: #F59E0B; }

.btn-verdict { width: 100%; padding: 12px; border-radius: var(--radius-md); font-weight: 700; font-size: 0.95rem; border: none; cursor: pointer; transition: 0.2s; background: var(--primary); color: white; }
.btn-verdict:hover:not(:disabled) { background: var(--primary-hover); }
.btn-verdict:disabled { opacity: 0.4; cursor: not-allowed; }

/* ═══════════════════════════════════════════
   MODERATION LOG (Timeline)
   ═══════════════════════════════════════════ */
.moderation-log { }
.log-timeline { display: flex; flex-direction: column; gap: 0; }
.log-entry { display: flex; gap: 12px; padding: 10px 0; position: relative; }
.log-entry:not(:last-child)::after { content: ''; position: absolute; left: 11px; top: 30px; bottom: 0; width: 2px; background: var(--border); }
.log-dot { width: 24px; height: 24px; min-width: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; border: 2px solid var(--border); background: var(--bg-card); }
.log-created .log-dot { border-color: #6B7280; background: #F3F4F6; }
.log-created .log-dot::after { content: '📝'; font-size: 0.6rem; }
.log-taken .log-dot { border-color: var(--primary); background: #EFF6FF; }
.log-taken .log-dot::after { content: '👤'; font-size: 0.6rem; }
.log-verdict .log-dot { border-color: #10B981; background: #D1FAE5; }
.log-verdict .log-dot::after { content: '✓'; font-size: 0.65rem; font-weight: 700; color: #059669; }
.log-reopened .log-dot { border-color: #F59E0B; background: #FEF3C7; }
.log-reopened .log-dot::after { content: '↩'; font-size: 0.6rem; }
.log-waiting .log-dot { border-color: #7C3AED; background: #F5F3FF; }
.log-waiting .log-dot::after { content: '⏳'; font-size: 0.6rem; }
.log-testing .log-dot { border-color: #06B6D4; background: #ECFEFF; }
.log-testing .log-dot::after { content: '🎮'; font-size: 0.6rem; }
.log-content { flex: 1; }
.log-action { font-size: 0.85rem; font-weight: 600; color: var(--text-main); }
.log-meta { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }
.log-author { }
.log-time { font-variant-numeric: tabular-nums; }
.log-remarks { margin-top: 6px; padding: 6px 10px; background: var(--bg-app); border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--text-muted); border-left: 3px solid var(--border); }

/* ═══════════════════════════════════════════
   CHAT (with private notes)
   ═══════════════════════════════════════════ */
.chat-column { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); display: flex; flex-direction: column; min-height: 580px; max-height: calc(100vh - 160px); }
.chat-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px 16px; border-bottom: 1px solid var(--border); }
.chat-header h3 { margin: 0; font-size: 1rem; color: var(--text-main); }
.messages-count { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
.chat-messages { flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; background: var(--bg-app); }
.chat-empty { margin: auto; color: var(--text-muted); font-size: 0.9rem; text-align: center; }
.message-wrap { display: flex; }
.message-wrap.moderator { justify-content: flex-end; }
.message-wrap.developer { justify-content: flex-start; }
.message-wrap.message-private { opacity: 0.85; }
.message-wrap.message-private .message-bubble { border: 2px solid #F59E0B; background: #FFFBEB; }
[data-theme="dark"] .message-wrap.message-private .message-bubble { border-color: #F59E0B; background: rgba(245, 158, 11, 0.1); }
.message-bubble { max-width: 68%; padding: 10px 14px; border-radius: 14px; font-size: 0.9rem; line-height: 1.5; }
.message-bubble.moderator { background: var(--primary); color: white; border-bottom-right-radius: 4px; }
.message-bubble.developer { background: var(--bg-card); border: 1px solid var(--border); color: var(--text-main); border-bottom-left-radius: 4px; }
.private-badge { display: inline-block; font-size: 0.68rem; padding: 2px 8px; background: rgba(245, 158, 11, 0.15); color: #D97706; border-radius: 10px; font-weight: 700; margin-bottom: 4px; }
.message-bubble.moderator .private-badge { background: rgba(255, 255, 255, 0.2); color: rgba(255,255,255,0.9); }
.message-meta { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 5px; }
.message-author { font-size: 0.72rem; font-weight: 700; }
.message-bubble.moderator .message-author { color: rgba(255,255,255,0.75); }
.message-bubble.developer .message-author { color: var(--text-muted); }
.message-time { font-size: 0.7rem; opacity: 0.6; }
.chat-input-area { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 10px; }
.chat-input-area textarea { width: 100%; padding: 12px 14px; border: 1px solid var(--border); border-radius: var(--radius-md); font-family: inherit; font-size: 0.9rem; resize: none; background: var(--bg-app); color: var(--text-main); box-sizing: border-box; outline: none; transition: border-color 0.2s; }
.chat-input-area textarea:focus { border-color: var(--primary); }
.input-footer { display: flex; justify-content: space-between; align-items: center; }
.private-toggle { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.82rem; color: var(--text-muted); }
.private-toggle input[type="checkbox"] { display: none; }
.toggle-slider { width: 32px; height: 18px; border-radius: 10px; background: var(--border); position: relative; transition: 0.2s; }
.toggle-slider::after { content: ''; position: absolute; left: 2px; top: 2px; width: 14px; height: 14px; border-radius: 50%; background: white; transition: 0.2s; }
.private-toggle input:checked + .toggle-slider { background: #F59E0B; }
.private-toggle input:checked + .toggle-slider::after { left: 16px; }
.toggle-label { font-weight: 500; }
.send-btn { background: var(--primary); color: white; border: none; padding: 9px 22px; border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: background 0.2s, opacity 0.2s; }
.send-btn:hover:not(:disabled) { background: var(--primary-hover); }
.send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>