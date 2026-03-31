import { reactive } from 'vue'

export const user = reactive({
    name: 'Михаил В.',
    email: 'mikhail@welwise.com',
    role: 'Разработчик' // Добавили реактивную роль
})

export const toast = reactive({ show: false, message: '', type: 'success' })

export const showToast = (message, type = 'success') => {
    toast.message = message
    toast.type = type
    toast.show = true
    setTimeout(() => { toast.show = false }, 3000)
}