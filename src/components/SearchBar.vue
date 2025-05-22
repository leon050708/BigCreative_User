<template>
  <form @submit.prevent="performSearch" class="search-bar">
    <input
        type="text"
        v-model="searchTerm"
        placeholder="搜索您想要的商品..."
        class="search-input"
    />
    <button type="submit" class="search-button">搜索</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const searchTerm = ref('');
const emit = defineEmits(['search']);

const performSearch = () => {
  emit('search', searchTerm.value);
};
</script>

<style scoped>
/* 使用 CSS 变量，如果全局定义了的话 */
:root {
  --grey-color-light: #ccc;
  --grey-color-medium: #999;
}

.search-bar {
  display: flex;
  align-items: center;
  width: 100%;
  gap: calc(var(--spacing-unit, 8px) * 2);
  padding: calc(var(--spacing-unit, 8px) * 1) 0;
}

.search-input {
  flex-grow: 1;
  border: none;
  border-bottom: 2px solid var(--grey-color-light, #ccc);
  border-radius: 0;
  padding: calc(var(--spacing-unit, 8px) * 1) calc(var(--spacing-unit, 8px) * 0.5);
  font-size: 1rem;
  color: var(--text-color, #333);
  background-color: transparent;
  line-height: 1.5;
  transition: border-bottom-color 0.3s ease-in-out; /* 虽然不改变颜色了，但保留这个以备将来可能需要 */
  min-height: 38px;
}

.search-input::placeholder {
  color: var(--grey-color-medium, #999);
  opacity: 1;
}

.search-input:focus {
  outline: none; /* 移除默认的浏览器焦点轮廓 */
  /* 移除了 border-bottom-color 的改变，下划线颜色在聚焦时将保持不变 */
  /* border-bottom-color: var(--primary-color, #3498db); */
}

.search-button {
  padding: calc(var(--spacing-unit, 8px) * 1.15) calc(var(--spacing-unit, 8px) * 2);
  background-color: var(--primary-color, #3498db);
  color: white;
  border: 1px solid var(--primary-color, #3498db);
  border-radius: var(--border-radius, 6px);
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.5;
  white-space: nowrap;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  box-shadow: var(--box-shadow-light, 0 1px 2px rgba(0,0,0,0.04));
  min-height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--primary-color, #3498db) 85%, black);
  border-color: color-mix(in srgb, var(--primary-color, #3498db) 80%, black);
  box-shadow: var(--box-shadow-hover, 0 2px 5px rgba(0,0,0,0.08));
}

.search-button:active:not(:disabled) {
  background-color: color-mix(in srgb, var(--primary-color, #3498db) 70%, black);
  border-color: color-mix(in srgb, var(--primary-color, #3498db) 65%, black);
}

.search-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  box-shadow: none;
}
</style>