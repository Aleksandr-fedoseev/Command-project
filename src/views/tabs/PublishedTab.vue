<template>
  <div class="tab-content">
    <div class="header">
      <h1>Релизная версия</h1>
    </div>

    <div class="card">
      <div class="status-row">
        <span class="label">Статус игры в каталоге:</span>
        <span class="badge bg-green">Доступна игрокам</span>
      </div>
      <div class="status-row mt-16">
        <span class="label">Текущая live-версия:</span>
        <span class="value">v1.2.0 (Сборка от 15.03.2026)</span>
      </div>

      <div class="danger-zone mt-24">
        <h4>Опасная зона</h4>
        <p class="text-sm text-muted" style="margin: 4px 0 16px 0;">Снятие игры уберет её из каталога Welwise Games.</p>
        <button class="btn-danger" @click="unpublish">Снять с публикации</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { showToast } from '../../store'
const unpublish = () => showToast('Игра снята с публикации', 'info')
</script>

<style scoped>
.tab-content { padding: 32px; max-width: 800px; }
.header { margin-bottom: 24px; }
.card { background: white; padding: 24px; border-radius: 12px; border: 1px solid #E5E7EB; }
.status-row { display: flex; gap: 12px; align-items: center; }
.label { color: #6B7280; font-weight: 500; font-size: 0.95rem;}
.value { font-weight: 600; font-size: 0.95rem;}
.mt-16 { margin-top: 16px; } .mt-24 { margin-top: 32px; }
.text-muted { color: #6B7280; }
.text-sm { font-size: 0.85rem; }
.badge { padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; }
.bg-green { background: #D1FAE5; color: #059669; }
.danger-zone { border: 1px solid #FECACA; background: #FEF2F2; padding: 20px; border-radius: 8px; }
.danger-zone h4 { margin: 0; color: #DC2626; font-size: 1.1rem;}
.btn-danger { background: white; border: 1px solid #EF4444; color: #EF4444; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.2s;}
.btn-danger:hover { background: #EF4444; color: white; }
</style>