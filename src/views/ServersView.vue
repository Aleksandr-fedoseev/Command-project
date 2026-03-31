<template>
  <div>
    <h2>Серверы (заглушка)</h2>

    <el-table :data="servers" style="width: 100%">
      <el-table-column prop="id" label="Сервер" />
      <el-table-column prop="gameTitle" label="Игра" />
      <el-table-column prop="region" label="Регион" />
      <el-table-column prop="status" label="Статус" />
      <el-table-column label="CPU">
        <template #default="scope">
          <el-progress :percentage="scope.row.cpu" />
        </template>
      </el-table-column>
      <el-table-column prop="players" label="Игроки" />
    </el-table>
  </div>
</template>

<script setup>
import { servers } from '../data/mock'
</script>