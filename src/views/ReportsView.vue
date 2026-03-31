<template>
  <div>
    <h2>Жалобы</h2>

    <el-table :data="reports" style="width: 100%">
      <el-table-column prop="gameTitle" label="Игра" />
      <el-table-column prop="user" label="Пользователь" />
      <el-table-column prop="reason" label="Причина" />
      <el-table-column label="Статус">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'open' ? 'warning' : 'success'">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Дата" />
      <el-table-column label="Действия">
        <template #default>
          <el-button type="primary" size="small">Решить</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { reports } from '../data/mock'
</script>