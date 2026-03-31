<template>
  <div>
    <h2>Проекты (заглушка)</h2>

    <el-table :data="projects" style="width: 100%">
      <el-table-column prop="title" label="Название" />
      <el-table-column prop="owner" label="Владелец" />
      <el-table-column prop="version" label="Версия" />
      <el-table-column prop="status" label="Статус" />
    </el-table>
  </div>
</template>

<script setup>
import { projects } from '../data/mock'
</script>