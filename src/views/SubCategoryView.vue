<template>
  <div class="view-container subcategory-view">
    <header class="view-header">
      <h1>{{ decodedMainCategoryName }}</h1>
      <p v-if="currentSubcategories.length" class="subtitle">探索 {{ decodedMainCategoryName }} 下的更多精彩</p>
    </header>

    <section class="main-view-content">
      <div v-if="productStore.isLoadingCategories" class="status-message-container loading-state">
        <p>正在加载子分类...</p>
      </div>
      <div v-else-if="currentSubcategories.length" class="mt-2">
        <div class="category-grid">
          <router-link
              v-for="category in paginatedSubcategories"
              :key="category.id"
              :to="`/category/${category.id}/products`"
              class="category-card card text-center"
          >
            <div class="category-image-wrapper">
              <img
                  :src="category.imageUrl || defaultSubCategoryImage"
                  :alt="category.name"
                  class="category-image"
                  @error="handleImageError"
              />
            </div>
            <h3>{{ category.name }}</h3>
            <p v-if="category.description" class="category-description">{{ category.description }}</p>
          </router-link>
        </div>
        <div v-if="totalPages > 1" class="pagination-controls">
          <button @click="prevPage" :disabled="currentPage === 1" class="btn btn-outline-secondary btn-sm">
            上一页
          </button>
          <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="btn btn-outline-secondary btn-sm">
            下一页
          </button>
        </div>
      </div>
      <div v-else-if="!productStore.isLoadingCategories && !productStore.error" class="status-message-container empty-state">
        <p>该主要分类下暂时没有更多细分品类。</p>
        <router-link to="/" class="btn btn-secondary mt-2">返回首页</router-link>
      </div>
      <div v-else-if="productStore.error" class="status-message-container error-state">
        <p>加载子分类失败: {{ productStore.error }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useProductStore } from '@/store/products'; //

const props = defineProps({
  mainCategoryNameParam: { // 从路由接收解码后的大类名称
    type: String,
    required: true,
  },
});

const productStore = useProductStore();

const currentSubcategories = ref([]);
const defaultSubCategoryImage = '/placeholder-category-image.png';

// 分页
const currentPage = ref(1);
const itemsPerPage = 10;

// 解码一次 mainCategoryNameParam
const decodedMainCategoryName = computed(() => props.mainCategoryNameParam);

const totalPages = computed(() => {
  return Math.ceil(currentSubcategories.value.length / itemsPerPage);
});

const paginatedSubcategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return currentSubcategories.value.slice(start, end);
});

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function handleImageError(event) {
  event.target.src = defaultSubCategoryImage;
}

async function loadSubcategories() {
  // 确保所有分类数据已加载
  if (productStore.categories.length === 0 && !productStore.isLoadingCategories) {
    await productStore.fetchCategories(); //
  }
  // 等待 categories 加载完成
  if (productStore.isLoadingCategories) {
    // 可以设置一个 watcher 或者简单的延时等待，但更好的方式是确保 fetchCategories 完成
    // 简单处理：如果还在加载，稍后再试或显示加载中
    return;
  }

  currentSubcategories.value = productStore.getSubcategoriesByMainCategoryName(decodedMainCategoryName.value);
  currentPage.value = 1; // 切换大类时重置到第一页
}

onMounted(() => {
  loadSubcategories();
});

// 监听路由参数或 store 中 categories 的变化
watch(() => [props.mainCategoryNameParam, productStore.categories], () => {
  loadSubcategories();
}, { deep: true }); // deep true for productStore.categories if it's deeply nested

</script>

<style scoped>
/* 大部分样式可以复用 HomeView 中的 .category-grid, .category-card 等 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: calc(var(--spacing-unit) * 2.5);
  margin-top: var(--spacing-unit);
  margin-bottom: calc(var(--spacing-unit) * 2);
}

@media (min-width: 1024px) {
  .category-grid {
    grid-template-columns: repeat(5, 1fr); /* 小类列表也可以是5列 */
  }
}

.category-card {
  padding: var(--spacing-unit);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--white-color);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-large);
  min-height: 280px; /* 给卡片一个最小高度，以容纳描述 */
}

.category-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-4px);
  box-shadow: var(--box-shadow-hover);
}

.category-image-wrapper {
  width: 100%;
  padding-top: 75%; /* 4:3 宽高比 */
  position: relative;
  margin-bottom: var(--spacing-unit);
  overflow: hidden;
  border-radius: var(--border-radius);
  background-color: var(--light-color);
}

.category-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-card h3 {
  color: var(--primary-color);
  font-size: 1.05rem;
  margin-top: calc(var(--spacing-unit) * 0.5); /* 调整标题与图片的间距 */
  margin-bottom: calc(var(--spacing-unit) * 0.5);
  line-height: 1.3;
  /* padding: calc(var(--spacing-unit) * 0.5) var(--spacing-unit); */
  width: 100%;
}
.category-description {
  font-size: 0.85rem;
  color: var(--text-color-light);
  line-height: 1.4;
  margin-bottom: var(--spacing-unit);
  flex-grow: 1; /* 让描述占据剩余空间 */
  overflow: hidden; /* 简单处理溢出 */
  text-overflow: ellipsis; /* 简单处理溢出 */
  /* 如果需要多行省略，需要更复杂的CSS或JS */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 最多显示2行 */
  -webkit-box-orient: vertical;
  min-height: calc(1.4em * 2); /* 尝试确保两行的高度 */
}


.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: calc(var(--spacing-unit) * 1.5);
  margin-top: calc(var(--spacing-unit) * 3);
  padding: var(--spacing-unit);
}
.pagination-controls .btn-sm {
  padding: calc(var(--spacing-unit) * 0.6) var(--spacing-unit);
}

.view-header h1 {
  margin-bottom: calc(var(--spacing-unit) * 0.5); /* 调整主标题和副标题间距 */
}
.view-header .subtitle {
  font-size: 1.1rem;
  color: var(--text-color-light);
  margin-bottom: calc(var(--spacing-unit) * 1.5);
}
</style>