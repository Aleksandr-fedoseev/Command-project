<template>
  <div class="tab-content tab-fade-in">
    <div class="header">
      <h1 style="margin: 0 0 24px 0; font-size: 1.5rem;">Релизная версия</h1>
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
      <div class="mt-32 border-top">
        <p class="text-sm text-muted mb-16">Снятие игры уберет её из каталога Welwise Games.</p>
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
.tab-fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.tab-content { padding: 32px; max-width: 800px; }
.card { background: var(--bg-card); padding: 24px; border-radius: 12px; border: 1px solid var(--border); }
.status-row { display: flex; gap: 12px; align-items: center; }
.label { color: var(--text-muted); font-weight: 500; font-size: 0.95rem;}
.value { font-weight: 600; font-size: 0.95rem; color: var(--text-main); }
.mt-16 { margin-top: 16px; }
.mt-32 { margin-top: 32px; }
.mb-16 { margin-bottom: 16px; }
.border-top { border-top: 1px solid var(--border); padding-top: 24px; }
.text-muted { color: var(--text-muted); }
.text-sm { font-size: 0.85rem; }
.badge { padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; }
.bg-green { background: var(--success-light); color: var(--success); }
.btn-danger { background: var(--bg-card); border: 1px solid var(--danger); color: var(--danger); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.2s;}
.btn-danger:hover { background: var(--danger); color: white; }
</style>