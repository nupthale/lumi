<template>
  <div class="window-controls" v-if="isElectron">
    <button class="control-btn minimize" @click="minimize" title="最小化">
      <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor">
        <rect width="10" height="1"/>
      </svg>
    </button>
    <button class="control-btn maximize" @click="maximize" title="最大化">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
        <rect x="0" y="0" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1"/>
      </svg>
    </button>
    <button class="control-btn close" @click="close" title="关闭">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
        <path d="M0,0 L10,10 M10,0 L0,10" stroke="currentColor" stroke-width="1"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const isElectron = computed(() => {
  return typeof window !== 'undefined' && window.clientAPI;
});

const minimize = () => {
  if (window.clientAPI) {
    window.clientAPI.windowMinimize();
  }
};

const maximize = () => {
  if (window.clientAPI) {
    window.clientAPI.windowMaximize();
  }
};

const close = () => {
  if (window.clientAPI) {
    window.clientAPI.windowClose();
  }
};
</script>

<style scoped>
.window-controls {
  position: fixed;
  top: 2px;
  right: 8px;
  display: flex;
  z-index: 9999;
  -webkit-app-region: no-drag;
}

.control-btn {
  width: 32px;
  height: 32px;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 2px;
  border-radius: 4px;
  transition: all 0.2s;
}

.control-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.control-btn.close:hover {
  background: #e81123;
  color: white;
}

.control-btn svg {
  width: 10px;
  height: 10px;
}

/* 深色主题 */
[data-theme="dark"] .control-btn {
  background: rgba(0, 0, 0, 0.2);
  color: #ccc;
}

[data-theme="dark"] .control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>