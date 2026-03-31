<template>
  <div class="tab-fade-in">
    <div class="content-header">
      <div class="title-block">
        <h1 style="margin: 0 0 8px 0; font-size: 1.5rem;">Настройка черновика</h1>
        <span class="status-badge bg-yellow">Заполнение данных</span>
      </div>
      <div class="actions">
        <button class="btn-outline" @click="showToast('Сохранено!', 'success')">Сохранить</button>
        <button class="btn-primary" @click="showToast('Отправлено модератору!', 'success')"><Rocket class="icon-sm" /> На модерацию</button>
      </div>
    </div>

    <div class="form-grid">
      <!-- БЛОК 1: МЕТАДАННЫЕ -->
      <div class="card form-section">
        <div class="section-head"><h3>1. Основная информация</h3></div>

        <div class="input-row">
          <div class="input-group">
            <label>Название игры на русском <span class="req">*</span></label>
            <input type="text" class="input-control" />
          </div>
          <div class="input-group">
            <label>Название игры на английском <span class="req">*</span></label>
            <input type="text" class="input-control" />
          </div>
        </div>

        <div class="input-row">
          <div class="input-group">
            <label>SEO Описание (RU) <span class="req">*</span> <span class="char-count">0/180</span></label>
            <textarea class="input-control" rows="2" maxlength="180"></textarea>
          </div>
          <div class="input-group">
            <label>SEO Описание (EN) <span class="req">*</span> <span class="char-count">0/180</span></label>
            <textarea class="input-control" rows="2" maxlength="180"></textarea>
          </div>
        </div>

        <div class="input-group" style="margin-top: 16px;">
          <label>Описание "Об Игре" <span class="req">*</span> <span class="char-count">0/800</span></label>
          <textarea class="input-control" rows="4" maxlength="800"></textarea>
        </div>
      </div>

      <!-- БЛОК 2: ПРОМО -->
      <div class="card form-section">
        <div class="section-head">
          <h3>2. Промо-материалы</h3>
          <p style="color: #DC2626; font-size: 0.85rem; margin-top: 4px;">Внимание! Изображения должны быть строго указанного формата. Обрезка на сайте недоступна.</p>
        </div>

        <div class="media-grid">
          <div class="media-box square">
            <ImageIcon class="icon-md" /><span class="m-title">Иконка</span><span class="m-req">512 x 512, png</span>
          </div>
          <div class="media-box horizontal">
            <ImageIcon class="icon-md" /><span class="m-title">Главная обложка</span><span class="m-req">1280 x 720, png</span>
          </div>
          <div class="media-box vertical">
            <ImageIcon class="icon-md" /><span class="m-title">Вертикальная</span><span class="m-req">650 x 820, png</span>
          </div>
          <div class="media-box video">
            <Film class="icon-md" /><span class="m-title">Видео</span><span class="m-req">До 12 МБ, без звука</span>
          </div>
        </div>
      </div>

      <!-- БЛОК 3: БИЛД -->
      <div class="card form-section">
        <div class="section-head"><h3>3. Тестирование и Билд</h3></div>

        <div class="dev-env-box">
          <div style="display:flex; align-items:center; gap:8px; font-size:1.1rem; margin-bottom:8px;"><MonitorPlay class="icon-sm" /> <strong>Dev-среда</strong></div>
          <p style="font-size:0.85rem; color:#9CA3AF; margin-bottom:16px;">Используйте эти данные для входа в игру:</p>
          <div style="display:flex; gap:24px;">
            <div class="cred-item"><span>Логин:</span> <code>welwise</code></div>
            <div class="cred-item"><span>Пароль:</span> <code>1txqmYkZ-R</code></div>
          </div>
        </div>

        <div class="build-methods" style="margin-top: 24px;">
          <label class="method-radio">
            <input type="radio" v-model="buildMethod" value="upload" hidden />
            <div class="method-card"><UploadCloud class="icon-sm" /> 1. Ручная загрузка .zip</div>
          </label>
          <label class="method-radio">
            <input type="radio" v-model="buildMethod" value="github" hidden />
            <div class="method-card"><Github class="icon-sm" /> 2. GitHub Синхронизация</div>
          </label>
        </div>

        <div v-if="buildMethod === 'upload'" class="dropzone">
          <UploadCloud style="width:32px; height:32px; color:#6B7280; margin-bottom:8px;" />
          <span style="display:block; font-weight:600;">Нажмите для загрузки .zip архива</span>
        </div>

        <div v-if="buildMethod === 'github'" style="margin-top: 16px;">
          <label style="font-size:0.85rem; font-weight:600;">Ваш ник на GitHub:</label>
          <div style="display:flex; margin-top:8px;">
            <span style="background:#F3F4F6; border:1px solid #E5E7EB; border-right:none; padding:10px; border-radius:8px 0 0 8px; color:#6B7280;">github.com/</span>
            <input type="text" class="input-control" style="border-radius:0 8px 8px 0;" placeholder="username" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Rocket, Image as ImageIcon, Film, MonitorPlay, UploadCloud, Github } from 'lucide-vue-next'
import { showToast } from '../../store'
const buildMethod = ref('upload')
</script>

<style scoped>
.tab-fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.content-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
.actions { display: flex; gap: 12px; }
.status-badge { padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; display: inline-block;}
.bg-yellow { background: #FEF3C7; color: #D97706; }
.form-grid { display: flex; flex-direction: column; gap: 24px; max-width: 800px; padding-bottom: 60px; }
.section-head { margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 12px; }
.section-head h3 { margin: 0; font-size: 1.1rem; }
.input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.input-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; display: flex; justify-content: space-between;}
.req { color: #DC2626; }
.char-count { font-weight: 400; color: var(--text-muted); }
.input-control { width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: var(--radius-md); background: #F9FAFB; font-family: inherit; box-sizing: border-box; resize: vertical; }

.media-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.media-box { border: 1px dashed var(--border); border-radius: var(--radius-md); background: #F9FAFB; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--text-muted); text-align: center; cursor: pointer; padding: 16px; }
.media-box:hover { border-color: var(--primary); background: #EFF6FF; color: var(--primary); }
.m-title { font-size: 0.85rem; font-weight: 600; color: var(--text-main); }
.m-req { font-size: 0.7rem; }
.square { aspect-ratio: 1; }
.horizontal, .video { grid-column: span 2; aspect-ratio: 16/9; }
.vertical { grid-row: span 2; }

.dev-env-box { background: #111827; color: white; border-radius: var(--radius-md); padding: 20px; }
.cred-item { background: #374151; padding: 8px 16px; border-radius: 6px; font-size: 0.9rem;}
.cred-item span { color: #9CA3AF; margin-right: 8px; }
.cred-item code { font-family: monospace; font-weight: 600; color: #60A5FA; }

.build-methods { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;}
.method-card { border: 1px solid var(--border); padding: 16px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 12px; font-weight: 600; cursor: pointer; background: #F9FAFB; transition: 0.2s;}
.method-radio input:checked + .method-card { border-color: var(--primary); background: #EFF6FF; color: var(--primary); }

.dropzone { border: 2px dashed #D1D5DB; border-radius: var(--radius-md); padding: 32px; text-align: center; cursor: pointer; background: #F9FAFB; }
.dropzone:hover { border-color: var(--primary); }
</style>