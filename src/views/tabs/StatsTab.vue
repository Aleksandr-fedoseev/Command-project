<template>
  <div class="tab-content">
    <h1>Статистика</h1>
    <div class="stats-grid">
      <div class="stat-card">
        <span class="label">Игроков за сутки</span>
        <span class="value">9,341</span>
      </div>
      <div class="stat-card">
        <span class="label">Среднее время</span>
        <span class="value">13m</span>
      </div>
      <div class="stat-card">
        <span class="label">Примерный доход</span>
        <span class="value">$380</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.tab-content { padding: 32px; max-width: 1000px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 24px;}
.stat-card { background: white; padding: 24px; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; flex-direction: column; gap: 8px;}
.label { color: #6B7280; font-weight: 500; font-size: 0.9rem;}
.value { font-size: 2rem; font-weight: 800; color: #111827;}
</style>