import { reactive } from 'vue'

// --- USER & TOAST ---
export const user = reactive({
    name: 'Михаил В.',
    email: 'mikhail@welwise.com',
    role: 'Разработчик'
})

export const toast = reactive({ show: false, message: '', type: 'success' })
export const showToast = (message, type = 'success') => {
    toast.message = message
    toast.type = type
    toast.show = true
    setTimeout(() => { toast.show = false }, 3000)
}

// --- TICKET STATUSES (расширено по use-case) ---
// new → in_progress → waiting_for_response → resolved (approved) / rejected
export const TICKET_STATUS = {
    NEW: 'new',
    IN_PROGRESS: 'in_progress',
    WAITING_FOR_RESPONSE: 'waiting_for_response',
    RESOLVED: 'resolved',
    REJECTED: 'rejected'
}

// --- VERDICT TYPES ---
export const VERDICT_TYPE = {
    APPROVED: 'approved',
    REVISION: 'revision',
    REJECTED: 'rejected'
}

// --- MODERATION CHECKLIST ---
export const DEFAULT_CHECKLIST = [
    { id: 'content', label: 'Контент соответствует правилам платформы', checked: false },
    { id: 'technical', label: 'Технические требования выполнены', checked: false },
    { id: 'metadata', label: 'Метаданные заполнены корректно', checked: false },
    { id: 'age_rating', label: 'Возрастные ограничения указаны', checked: false },
    { id: 'network', label: 'Сетевая безопасность проверена', checked: false, optional: true },
]

// --- TICKETS ---
export const tickets = reactive([
    {
        id: 1, title: 'Некорректное отображение иконки', description: 'Иконка игры не отображается в каталоге на мобильных устройствах.', status: 'resolved', priority: 'Высокий', created: '2026-03-30', closedAt: '2026-03-31', developerName: 'Михаил В.', moderatorName: 'Анна С.',
        verdict: { type: 'approved', notes: '', checklist: { content: true, technical: true, metadata: true, age_rating: true } },
        messages: [
            { id: 1, author: 'Разработчик', text: 'Помогите разобраться с иконкой.', timestamp: '2026-03-30 10:00', role: 'developer', isPrivate: false },
            { id: 2, author: 'Модератор', text: 'Принято в работу.', timestamp: '2026-03-30 10:30', role: 'moderator', isPrivate: false }
        ],
        moderationLog: [
            { id: 1, timestamp: '2026-03-30 10:00', action: 'Тикет создан', author: 'Разработчик', type: 'created' },
            { id: 2, timestamp: '2026-03-30 10:30', action: 'Взят в работу', author: 'Модератор', type: 'taken' },
            { id: 3, timestamp: '2026-03-31 14:00', action: 'Вердикт: Одобрено', author: 'Модератор', type: 'verdict' },
        ]
    },
    {
        id: 2, title: 'Проблема с авторизацией через VK', description: 'Пользователи не могут войти через VK.', status: 'in_progress', priority: 'Средний', created: '2026-03-29', developerName: 'Михаил В.', moderatorName: 'Анна С.',
        verdict: null,
        messages: [
            { id: 1, author: 'Модератор', text: 'Жалобы на VK.', timestamp: '2026-03-29 09:00', role: 'moderator', isPrivate: false },
            { id: 2, author: 'Разработчик', text: 'Проверим ключи.', timestamp: '2026-03-29 09:45', role: 'developer', isPrivate: false }
        ],
        moderationLog: [
            { id: 1, timestamp: '2026-03-29 09:00', action: 'Тикет создан', author: 'Разработчик', type: 'created' },
            { id: 2, timestamp: '2026-03-29 09:30', action: 'Взят в работу', author: 'Модератор', type: 'taken' },
        ]
    },
    {
        id: 3, title: 'Запрос на модерацию игры "RIVALS"', description: 'Новый билд, требуется проверка.', status: 'new', priority: 'Низкий', created: '2026-03-28', developerName: null, moderatorName: null,
        verdict: null,
        messages: [],
        moderationLog: [
            { id: 1, timestamp: '2026-03-28 15:00', action: 'Тикет создан', author: 'Разработчик', type: 'created' },
        ]
    }
])

// --- MESSAGE ACTIONS ---
export const addMessage = (ticketId, text, role, isPrivate = false) => {
    const ticket = tickets.find(t => t.id === ticketId)
    if (ticket) {
        const author = role === 'moderator' ? 'Модератор' : 'Разработчик'
        ticket.messages.push({ id: Date.now(), author, text, timestamp: new Date().toLocaleString(), role, isPrivate })
        if (!isPrivate) {
            showToast(`Сообщение отправлено в тикет #${ticketId}`, 'success')
        }
    }
}

// --- STATUS CHANGE ---
export const updateTicketStatus = (ticketId, status) => {
    const ticket = tickets.find(t => t.id === ticketId)
    if (ticket) {
        ticket.status = status
        if (status === 'resolved') ticket.closedAt = new Date().toISOString().slice(0,10)
        showToast(`Статус тикета #${ticketId} изменён`, 'info')
    }
}

export const assignTicketToModerator = (ticketId, moderatorName) => {
    const ticket = tickets.find(t => t.id === ticketId)
    if (ticket && ticket.status === 'new') {
        ticket.status = 'in_progress'
        ticket.moderatorName = moderatorName
        ticket.moderationLog.push({
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            action: `Взят в работу (Модератор: ${moderatorName})`,
            author: moderatorName,
            type: 'taken'
        })
        showToast(`Тикет #${ticketId} взят в работу`, 'success')
    }
}

export const reopenTicket = (ticketId) => {
    const ticket = tickets.find(t => t.id === ticketId)
    if (ticket && ticket.status === 'resolved') {
        ticket.status = 'in_progress'
        ticket.closedAt = null
        ticket.verdict = null
        ticket.moderationLog.push({
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            action: 'Открыт повторно',
            author: 'Модератор',
            type: 'reopened'
        })
        showToast(`Тикет #${ticketId} открыт повторно`, 'info')
    }
}

// --- VERDICT ---
export const submitVerdict = (ticketId, verdictType, remarks, checklist) => {
    const ticket = tickets.find(t => t.id === ticketId)
    if (!ticket) return

    const newStatus = verdictType === 'approved' ? 'resolved' : (verdictType === 'rejected' ? 'rejected' : 'in_progress')
    ticket.status = newStatus
    ticket.verdict = {
        type: verdictType,
        notes: remarks,
        checklist: { ...checklist },
        timestamp: new Date().toLocaleString()
    }

    if (verdictType === 'resolved') {
        ticket.closedAt = new Date().toISOString().slice(0, 10)
    }

    const verdictText = {
        approved: 'Одобрено к публикации',
        revision: 'На доработку',
        rejected: 'Отклонено'
    }[verdictType]

    ticket.moderationLog.push({
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        action: `Вердикт: ${verdictText}`,
        author: 'Модератор',
        type: 'verdict',
        remarks: remarks
    })

    if (remarks) {
        ticket.messages.push({
            id: Date.now() + 1,
            author: 'Модератор',
            text: `📋 Замечания по тикету:\n${remarks}`,
            timestamp: new Date().toLocaleString(),
            role: 'moderator',
            isPrivate: false
        })
    }

    showToast(`Вердикт по тикету #${ticketId}: ${verdictText}`, verdictType === 'approved' ? 'success' : 'error')
}

// --- WAITING FOR RESPONSE ---
export const setWaitingForResponse = (ticketId) => {
    const ticket = tickets.find(t => t.id === ticketId)
    if (ticket && ticket.status === 'in_progress') {
        ticket.status = 'waiting_for_response'
        ticket.moderationLog.push({
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            action: 'Ожидается ответ от разработчика',
            author: 'Модератор',
            type: 'waiting'
        })
        showToast(`Тикет #${ticketId}: ожидается ответ от разработчика`, 'info')
    }
}

// --- TEST SESSION ---
export const startTestSession = (ticketId) => {
    const ticket = tickets.find(t => t.id === ticketId)
    if (ticket) {
        ticket.moderationLog.push({
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            action: 'Запущено тестирование в dev-окружении',
            author: 'Модератор',
            type: 'testing'
        })
        showToast(`Тестирование запущено для тикета #${ticketId}`, 'info')
    }
}

// --- PROJECTS (mock для статуса модерации) ---
export const projects = reactive([
    {
        id: 1, name: 'RIVALS', version: '1.2.3', status: 'moderation',
        moderationStatus: 'in_review', // draft, in_review, approved, rejected
        submittedAt: '2026-03-28',
        description: 'Многопользовательский шутер',
        icon: '🎮'
    },
    {
        id: 2, name: 'Space Odyssey', version: '0.9.1', status: 'draft',
        moderationStatus: 'draft',
        submittedAt: null,
        description: 'Космическая стратегия',
        icon: '🚀'
    },
    {
        id: 3, name: 'Pixel Quest', version: '2.0.0', status: 'published',
        moderationStatus: 'approved',
        submittedAt: '2026-02-15',
        approvedAt: '2026-02-20',
        description: 'Пиксельный платформер',
        icon: '⚔️'
    }
])

export const submitForModeration = (projectId) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
        project.moderationStatus = 'in_review'
        project.status = 'moderation'
        project.submittedAt = new Date().toISOString().slice(0, 10)
        showToast(`Проект "${project.name}" отправлен на модерацию`, 'success')
    }
}

export const MODERATION_STATUS_TEXT = {
    draft: 'Черновик',
    in_review: 'На модерации',
    approved: 'Одобрен',
    rejected: 'Отклонён'
}

export const MODERATION_STATUS_COLOR = {
    draft: 'gray',
    in_review: 'yellow',
    approved: 'green',
    rejected: 'red'
}