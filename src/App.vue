<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">🎮 Moderation UI</div>

      <nav class="menu">
        <router-link to="/" class="menu-item">Дашборд</router-link>
        <router-link to="/requests" class="menu-item">Заявки</router-link>
        <router-link to="/reports" class="menu-item">Жалобы</router-link>

        <div class="divider"></div>

        <router-link to="/projects" class="menu-item">Проекты</router-link>
        <router-link to="/servers" class="menu-item">Серверы</router-link>
      </nav>
    </aside>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f5f7fa;
}

#app {
  min-height: 100vh;
}

.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #001529;
  color: white;
  padding: 20px 0;
}

.logo {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
}

.menu {
  display: flex;
  flex-direction: column;
}

.menu-item {
  color: white;
  text-decoration: none;
  padding: 14px 24px;
  transition: 0.2s;
}

.menu-item:hover {
  background: #1890ff;
}

.router-link-active {
  background: #1890ff;
}

.divider {
  height: 1px;
  background: rgba(255,255,255,0.2);
  margin: 10px 0;
}

.content {
  flex: 1;
  padding: 24px;
}
</style>