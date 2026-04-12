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

      <!-- СКРЫТЫЕ ИНПУТЫ ДЛЯ МЕДИА И БИЛДОВ -->
      <input type="file" ref="fileIcon" accept="image/png" hidden @change="handleFile('icon', $event)" />
      <input type="file" ref="fileCoverMain" accept="image/png" hidden @change="handleFile('coverMain', $event)" />
      <input type="file" ref="fileCoverVert" accept="image/png" hidden @change="handleFile('coverVert', $event)" />
      <input type="file" ref="fileVideo" accept="video/mp4" hidden @change="handleFile('video', $event)" />
      <input type="file" ref="fileZip" accept=".zip,.tar.gz" hidden @change="handleZipUpload" />

      <!-- БЛОК 2: ПРОМО -->
      <div class="card form-section">
        <div class="section-head"><h3>2. Промо-материалы</h3></div>
        <div class="media-grid">
          <!-- Иконка -->
          <div class="media-box square" :class="{ uploaded: media.icon }" @click="$refs.fileIcon.click()">
            <CheckCircle v-if="media.icon" class="icon-md text-green" />
            <ImageIcon v-else class="icon-md" />
            <span class="m-title">{{ media.icon ? 'Загружено' : 'Иконка' }}</span>
            <span class="m-req">512 x 512, png</span>
          </div>
          <!-- Главная обложка -->
          <div class="media-box horizontal" :class="{ uploaded: media.coverMain }" @click="$refs.fileCoverMain.click()">
            <CheckCircle v-if="media.coverMain" class="icon-md text-green" />
            <ImageIcon v-else class="icon-md" />
            <span class="m-title">{{ media.coverMain ? 'Загружено' : 'Главная обложка' }}</span>
            <span class="m-req">1280 x 720, png</span>
          </div>
          <!-- Вертикальная обложка -->
          <div class="media-box vertical" :class="{ uploaded: media.coverVert }" @click="$refs.fileCoverVert.click()">
            <CheckCircle v-if="media.coverVert" class="icon-md text-green" />
            <ImageIcon v-else class="icon-md" />
            <span class="m-title">{{ media.coverVert ? 'Загружено' : 'Вертикальная' }}</span>
            <span class="m-req">650 x 820, png</span>
          </div>
          <!-- Видео -->
          <div class="media-box video" :class="{ uploaded: media.video }" @click="$refs.fileVideo.click()">
            <CheckCircle v-if="media.video" class="icon-md text-green" />
            <Film v-else class="icon-md" />
            <span class="m-title">{{ media.video ? 'Загружено' : 'Видео' }}</span>
            <span class="m-req">До 12 МБ, без звука</span>
          </div>
        </div>
      </div>

      <!-- БЛОК 3: БИЛД -->
      <div class="card form-section">
        <div class="section-head"><h3>3. Тестирование и Билд</h3></div>
        <div class="dev-env-box">
          <div class="dev-header"><MonitorPlay class="icon-sm text-primary" /> <strong>Dev-среда</strong></div>
          <p class="text-sm text-muted mb-16">Используйте эти данные для входа в игру:</p>
          <div class="credentials-row">
            <div class="cred-item"><span class="text-muted">Логин:</span> <code class="code-val">welwise</code></div>
            <div class="cred-item"><span class="text-muted">Пароль:</span> <code class="code-val">1txqmYkZ-R</code></div>
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

        <!-- РУЧНАЯ ЗАГРУЗКА БИЛДА -->
        <div v-if="buildMethod === 'upload'" style="margin-top: 16px;">
          <!-- Ожидание загрузки -->
          <div v-if="buildStatus === 'idle'" class="dropzone" @click="$refs.fileZip.click()">
            <UploadCloud style="width:32px; height:32px; color: var(--text-muted); margin-bottom:8px;" />
            <span style="display:block; font-weight:600;">Нажмите для загрузки .zip архива</span>
          </div>

          <!-- Идет загрузка -->
          <div v-if="buildStatus === 'uploading'" class="upload-progress-box">
            <div class="prog-info">
              <span style="font-weight: 600; color: var(--text-main);">Загрузка и распаковка архива...</span>
              <span style="font-weight: 600; color: var(--primary);">{{ buildProgress }}%</span>
            </div>
            <div class="prog-bg">
              <div class="prog-fill" :style="{ width: buildProgress + '%' }"></div>
            </div>
          </div>

          <!-- Загрузка завершена -->
          <div v-if="buildStatus === 'done'" class="upload-success-box">
            <CheckCircle class="icon-md text-green" />
            <div>
              <span style="display:block; font-weight:600;">Билд успешно загружен и развернут!</span>
              <button class="btn-text mt-8" @click="buildStatus = 'idle'">Загрузить новую версию</button>
            </div>
          </div>
        </div>

        <!-- GITHUB -->
        <div v-if="buildMethod === 'github'" style="margin-top: 16px;">
          <label style="font-size:0.85rem; font-weight:600;">Ваш ник на GitHub:</label>
          <div style="display:flex; margin-top:8px;">
            <span style="background:var(--bg-secondary); border:1px solid var(--border); border-right:none; padding:10px; border-radius:8px 0 0 8px; color:var(--text-muted);">github.com/</span>
            <input type="text" class="input-control" style="border-radius:0 8px 8px 0;" placeholder="username" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Rocket, Image as ImageIcon, Film, MonitorPlay, UploadCloud, Github, CheckCircle } from 'lucide-vue-next'
import { showToast } from '../../store'

const buildMethod = ref('upload')

const media = ref({
  icon: false,
  coverMain: false,
  coverVert: false,
  video: false
})

const handleFile = (type, event) => {
  const file = event.target.files[0]
  if (!file) return
  showToast('Файл загружается...', 'info')
  setTimeout(() => {
    media.value[type] = true
    showToast('Медиафайл успешно сохранен', 'success')
  }, 1000)
}

const buildStatus = ref('idle')
const buildProgress = ref(0)

const handleZipUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  buildStatus.value = 'uploading'
  buildProgress.value = 0
  const interval = setInterval(() => {
    buildProgress.value += Math.floor(Math.random() * 15) + 5
    if (buildProgress.value >= 100) {
      buildProgress.value = 100
      clearInterval(interval)
      setTimeout(() => {
        buildStatus.value = 'done'
        showToast('Билд развернут в Dev-среде!', 'success')
      }, 500)
    }
  }, 300)
}
</script>

<style scoped>
.tab-fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.content-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
.actions { display: flex; gap: 12px; }
.status-badge { padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; display: inline-block;}
.bg-yellow { background: var(--warning-light); color: var(--warning); }

.form-grid { display: flex; flex-direction: column; gap: 24px; max-width: 800px; padding-bottom: 60px; }
.section-head { margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 12px; }
.section-head h3 { margin: 0; font-size: 1.1rem; }

.input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.input-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; display: flex; justify-content: space-between;}
.req { color: var(--danger); }
.char-count { font-weight: 400; color: var(--text-muted); }
.input-control { width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--bg-input); font-family: inherit; box-sizing: border-box; resize: vertical; color: var(--text-main); }
.input-control:focus { outline: none; border-color: var(--primary); background: var(--bg-card); }

.media-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.media-box { border: 1px dashed var(--border); border-radius: var(--radius-md); background: var(--bg-secondary); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--text-muted); text-align: center; cursor: pointer; padding: 16px; transition: 0.2s;}
.media-box:hover { border-color: var(--primary); background: var(--bg-hover); color: var(--primary); }
.media-box.uploaded { border: 1px solid var(--success); background: var(--success-light); color: var(--success); }
.text-green { color: var(--success); }
.m-title { font-size: 0.85rem; font-weight: 600; color: var(--text-main); }
.media-box.uploaded .m-title { color: var(--success); }
.m-req { font-size: 0.7rem; }
.square { aspect-ratio: 1; }
.horizontal, .video { grid-column: span 2; aspect-ratio: 16/9; }
.vertical { grid-row: span 2; }

.dev-env-box { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; }
.dev-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 1.1rem; }
.text-primary { color: var(--primary); }
.text-muted { color: var(--text-muted); }
.text-sm { font-size: 0.85rem; }
.mb-16 { margin-bottom: 16px; margin-top: 0; }

.credentials-row { display: flex; gap: 16px; flex-wrap: wrap; }
.cred-item { background: var(--bg-card); border: 1px solid var(--border); padding: 8px 16px; border-radius: 6px; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;}
.code-val { font-family: monospace; font-weight: 600; color: var(--text-main); background: var(--bg-secondary); padding: 2px 6px; border-radius: 4px; letter-spacing: 0.5px;}

.build-methods { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;}
.method-card { border: 1px solid var(--border); padding: 16px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 12px; font-weight: 600; cursor: pointer; background: var(--bg-secondary); transition: 0.2s;}
.method-radio input:checked + .method-card { border-color: var(--primary); background: var(--bg-hover); color: var(--primary); }

.dropzone { border: 2px dashed var(--border); border-radius: var(--radius-md); padding: 32px; text-align: center; cursor: pointer; background: var(--bg-secondary); transition: 0.2s;}
.dropzone:hover { border-color: var(--primary); background: var(--bg-hover);}
.upload-progress-box, .upload-success-box { padding: 24px; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--bg-secondary); }
.prog-info { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.95rem; }
.prog-bg { background: var(--border); height: 8px; border-radius: 4px; overflow: hidden; }
.prog-fill { background: var(--primary); height: 100%; transition: width 0.3s ease; }
.upload-success-box { display: flex; align-items: center; gap: 16px; border-color: var(--success); background: var(--success-light); }
.btn-text { background: none; border: none; color: var(--primary); font-weight: 600; cursor: pointer; text-decoration: underline; padding: 0; }
.mt-8 { margin-top: 8px; }
</style>