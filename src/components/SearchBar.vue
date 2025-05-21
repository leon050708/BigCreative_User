<template>
  <form @submit.prevent="performSearch" class="search-bar">
    <input
        type="text"
        v-model="searchTerm"
        placeholder="搜索商品..."
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
.search-bar {
  display: flex;
  align-items: center;
}
.search-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  font-size: 1em;
  flex-grow: 1;
}
.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}
.search-button {
  padding: 8px 15px;
  background-color: #2c3e50;
  color: white;
  border: 1px solid #2c3e50;
  border-left: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 1em;
}
.search-button:hover {
  background-color: #34495e;
}
</style>