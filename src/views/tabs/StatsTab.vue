<template>
  <div class="tab-content tab-fade-in">
    <h1 style="margin: 0 0 24px 0;">Статистика</h1>
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
        <span class="value">₽ 34 500</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.tab-content { padding: 32px; max-width: 1000px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;}
.stat-card { background: var(--bg-card); padding: 24px; border-radius: 12px; border: 1px solid var(--border); display: flex; flex-direction: column; gap: 8px;}
.label { color: var(--text-muted); font-weight: 500; font-size: 0.9rem;}
.value { font-size: 2rem; font-weight: 800; color: var(--text-main);}
</style>