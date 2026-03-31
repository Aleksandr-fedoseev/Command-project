<template>
  <div class="tab-content">
    <div class="header">
      <h1>Игровые сервера (Оркестратор)</h1>
      <button class="btn-primary" @click="addServer">Развернуть новый</button>
    </div>

    <div class="servers-list">
      <div v-for="srv in servers" :key="srv.id" class="server-card">
        <div class="info">
          <h3>Инстанс #{{ srv.id }}</h3>
          <span class="status text-green">Работает</span>
        </div>
        <!-- Переход в подсистему Оркестратора -->
        <button class="btn-outline" @click="goToConsole(srv.id)">Перейти в консоль сервера →</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { showToast } from '../../store'
const servers = ref([{ id: 'srv-8821' }, { id: 'srv-9910' }])
const addServer = () => showToast('Запрос на выделение сервера отправлен')
const goToConsole = (id) => alert(`Редирект в Подсистему Оркестрации для сервера ${id}`)
</script>
<style scoped>
.tab-content { padding: 32px; max-width: 800px; }
.header { display: flex; justify-content: space-between; margin-bottom: 24px;}
.servers-list { display: flex; flex-direction: column; gap: 16px; }
.server-card { display: flex; justify-content: space-between; align-items: center; background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB;}
.info h3 { margin: 0 0 4px 0; }
.text-green { color: #10B981; font-size: 0.85rem; font-weight: 600;}
.btn-primary { background: #2563EB; color: white; padding: 8px 16px; border: none; border-radius: 8px; cursor: pointer;}
.btn-outline { background: white; border: 1px solid #D1D5DB; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 500;}
</style>