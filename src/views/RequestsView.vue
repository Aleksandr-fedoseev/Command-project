<template>
  <div>
    <h2>Заявки на модерацию</h2>

    <el-table :data="requests" style="width: 100%">
      <el-table-column prop="gameTitle" label="Игра" />
      <el-table-column prop="version" label="Версия" />
      <el-table-column prop="developer" label="Разработчик" />
      <el-table-column label="Статус">
        <template #default="scope">
          <el-tag :type="statusType(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="Приоритет" />
      <el-table-column prop="createdAt" label="Дата" />
      <el-table-column label="Действия">
        <template #default="scope">
          <router-link :to="`/requests/${scope.row.id}`">
            <el-button type="primary" size="small">Открыть</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { requests } from '../data/mock'

function statusType(status) {
  if (status === 'approved') return 'success'
  if (status === 'rejected') return 'danger'
  if (status === 'pending') return 'warning'
  return 'primary'
}
</script>