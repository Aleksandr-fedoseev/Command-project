<template>
  <div class="tab-fade-in">
    <div class="content-header">
      <div class="title-block">
        <h1 style="margin: 0 0 8px 0; font-size: 1.5rem;">Настройка черновика</h1>
        <span class="status-badge" :class="moderationStatusClass">{{ moderationStatusText }}</span>
      </div>
      <div class="actions">
        <button class="btn-outline" @click="showToast('Сохранено!', 'success')">Сохранить</button>
        <button class="btn-primary" @click="handleSendToModeration" :disabled="isInModeration">
          <Rocket class="icon-sm" /> {{ isInModeration ? 'На модерации...' : 'На модерацию' }}
        </button>
      </div>
    </div>

    <!-- Модалка подтверждения (use-case: SEND) -->
    <transition name="modal-fade">
      <div v-if="showConfirmModal" class="modal-overlay" @click.self="showConfirmModal = false">
        <div class="modal-card">
          <div class="modal-icon">📤</div>
          <h2 class="modal-title">Отправить на модерацию?</h2>
          <p class="modal-desc">
            Проект будет заблокирован до проверки модератором.
            Вы не сможете вносить изменения, пока тикет не будет рассмотрен.
          </p>
          <div class="modal-checklist">
            <div class="check-item" :class="{ done: formComplete }">
              <span class="check-icon">{{ formComplete ? '✓' : '○' }}</span>
              <span>Метаданные заполнены</span>
            </div>
            <div class="check-item" :class="{ done: mediaUploaded }">
              <span class="check-icon">{{ mediaUploaded ? '✓' : '○' }}</span>
              <span>Промо-материалы загружены</span>
            </div>
            <div class="check-item" :class="{ done: buildReady }">
              <span class="check-icon">{{ buildReady ? '✓' : '○' }}</span>
              <span>Билд загружен</span>
            </div>
          </div>
          <div class="modal-actions-row">
            <button class="btn-modal-cancel" @click="showConfirmModal = false">Отменить</button>
            <button class="btn-modal-send" @click="confirmSendToModeration">Отправить</button>
          </div>
        </div>
      </div>
    </transition>

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
import { ref, computed } from 'vue'
import { Rocket, Image as ImageIcon, Film, MonitorPlay, UploadCloud, Github, CheckCircle } from 'lucide-vue-next'
import { showToast, submitForModeration, MODERATION_STATUS_TEXT, MODERATION_STATUS_COLOR } from '../../store'

// Moderation state
const moderationStatus = ref('draft') // draft, in_review, approved, rejected
const showConfirmModal = ref(false)

const isInModeration = computed(() => moderationStatus.value === 'in_review')

const moderationStatusText = computed(() => {
  return MODERATION_STATUS_TEXT[moderationStatus.value] || 'Черновик'
})

const moderationStatusClass = computed(() => {
  const color = MODERATION_STATUS_COLOR[moderationStatus.value] || 'gray'
  return `bg-${color}`
})

const formComplete = ref(true)
const mediaUploaded = computed(() => media.value.icon && media.value.coverMain)
const buildReady = computed(() => buildStatus.value === 'done')

const handleSendToModeration = () => {
  if (isInModeration.value) return
  showConfirmModal.value = true
}

const confirmSendToModeration = () => {
  submitForModeration(1) // projectId = 1 для мока
  moderationStatus.value = 'in_review'
  showConfirmModal.value = false
  showToast('Проект отправлен на модерацию', 'success')
}

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

/* ═══════════════════════════════════════════
   MODERATION STATUS BADGES
   ═══════════════════════════════════════════ */
.bg-gray { background: var(--bg-secondary); color: var(--text-muted); border: 1px solid var(--border); }
.bg-yellow { background: var(--warning-light); color: var(--warning); }
.bg-green { background: var(--success-light); color: var(--success); }
.bg-red { background: var(--danger-light); color: var(--danger); }

/* ═══════════════════════════════════════════
   SEND TO MODERATION MODAL
   ═══════════════════════════════════════════ */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 200; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px); }
.modal-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px 28px; width: 400px; max-width: 90vw; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.modal-icon { font-size: 2.5rem; margin-bottom: 4px; }
.modal-title { margin: 0; font-size: 1.2rem; font-weight: 700; color: var(--text-main); text-align: center; }
.modal-desc { margin: 0; font-size: 0.88rem; color: var(--text-muted); text-align: center; line-height: 1.5; }
.modal-checklist { width: 100%; display: flex; flex-direction: column; gap: 8px; padding: 16px 0; border-top: 1px solid var(--border); }
.check-item { display: flex; align-items: center; gap: 10px; font-size: 0.88rem; color: var(--text-muted); padding: 6px 0; }
.check-item.done { color: var(--success); font-weight: 600; }
.check-icon { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid var(--border); font-size: 0.7rem; }
.check-item.done .check-icon { background: var(--success); border-color: var(--success); color: white; }
.modal-actions-row { display: flex; gap: 12px; width: 100%; }
.btn-modal-cancel, .btn-modal-send { flex: 1; padding: 11px; border-radius: var(--radius-md); font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: 0.2s; border: none; }
.btn-modal-cancel { background: var(--bg-app); color: var(--text-main); border: 1px solid var(--border); }
.btn-modal-cancel:hover { background: var(--bg-hover); }
.btn-modal-send { background: var(--primary); color: white; }
.btn-modal-send:hover { background: var(--primary-hover); }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(0.95); }
</style>