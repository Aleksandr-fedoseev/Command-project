<template>
  <div>
    <h2>Дашборд модерации</h2>

    <div class="cards">
      <el-card class="card">
        <h3>Ожидают</h3>
        <p>{{ pending }}</p>
      </el-card>

      <el-card class="card">
        <h3>На проверке</h3>
        <p>{{ inReview }}</p>
      </el-card>

      <el-card class="card">
        <h3>Одобрено</h3>
        <p>{{ approved }}</p>
      </el-card>

      <el-card class="card">
        <h3>Жалобы</h3>
        <p>{{ openReports }}</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { requests, reports } from '../data/mock'

const pending = computed(() => requests.filter(r => r.status === 'pending').length)
const inReview = computed(() => requests.filter(r => r.status === 'in_review').length)
const approved = computed(() => requests.filter(r => r.status === 'approved').length)
const openReports = computed(() => reports.filter(r => r.status === 'open').length)
</script>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.card p {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}
</style>