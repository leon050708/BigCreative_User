<template>
  <div class="view-container home-view">
    <header class="view-header text-center">
      <h1>欢迎来到 BigCreative</h1>
      <p class="page-subtitle">发现独一无二的创意产品，点亮生活每一刻。</p>

      <form @submit.prevent="performSearch" class="home-search-form">
        <input
            type="search"
            v-model="localSearchTerm"
            placeholder="搜索商品名称..." class="home-search-input"
            aria-label="搜索商品名称"
        />
        <button type="submit" class="btn btn-primary btn-home-search">
          <span>🔍</span>
        </button>
      </form>
    </header>

    <section class="main-view-content">
      <div v-if="productStore.isLoadingCategories" class="status-message-container loading-state">
        <p>正在加载分类信息...</p>
      </div>
      <div v-else-if="productStore.mainCategories.length" class="home-section">
        <h2 class="section-title"><span>探索主要分类</span></h2>
        <div class="parent-category-grid">
          <router-link
              v-for="pCategory in productStore.mainCategories"
              :key="pCategory.name" :to="`/main-category/${encodeURIComponent(pCategory.name)}`"
              class="parent-category-card card text-center"
          >
            <div class="parent-category-image-wrapper">
              <img
                  :src="pCategory.imageUrl || defaultParentCategoryImage(pCategory.name)"
                  :alt="pCategory.name"
                  class="parent-category-image"
                  @error="handleImageError($event, pCategory.name)"
              />
            </div>
            <h3>{{ pCategory.name }}</h3>
          </router-link>
        </div>
      </div>
      <div v-else-if="!productStore.isLoadingCategories && productStore.mainCategories.length === 0 && !productStore.error" class="status-message-container empty-state">
        <p>暂时没有主要分类可供探索。</p>
      </div>
      <div v-else-if="productStore.error" class="status-message-container error-state">
        <p>加载分类失败: {{ productStore.error }}</p>
      </div>

      <div v-if="productStore.isLoadingRecommendations" class="status-message-container loading-state">
        <p>正在加载推荐商品...</p>
      </div>
      <div v-else-if="productStore.recommendedProducts.length" class="home-section">
        <h2 class="section-title"><span>热门推荐</span></h2>
        <div class="product-grid">
          <ProductCard
              v-for="product in productStore.recommendedProducts"
              :key="product.id"
              :product="product"
          />
        </div>
      </div>
      <div v-else-if="!productStore.isLoadingRecommendations && productStore.recommendedProducts.length === 0 && !productStore.error" class="status-message-container empty-state">
        <p>暂时没有推荐商品。</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/store/products'; //
import ProductCard from '@/components/ProductCard.vue';

const productStore = useProductStore(); //
const router = useRouter();

const localSearchTerm = ref('');

const defaultParentCategoryImages = {
  '运动器材': 'https://tse4-mm.cn.bing.net/th/id/OIP-C.c9C_ShLlNu2vDjOHsPwggQHaE7?w=290&h=193&c=7&r=0&o=7&cb=iwp2&dpr=2&pid=1.7&rm=3',
  '健康监测': 'https://tse1-mm.cn.bing.net/th/id/OIP-C._856hk6r1YoFL1u4908scQAAAA?w=228&h=180&c=7&r=0&o=7&cb=iwp2&dpr=2&pid=1.7&rm=3',
  '食物': 'https://tse1-mm.cn.bing.net/th/id/OIP-C.-2ruSbmSOSKiBfCgNweU3wAAAA?w=193&h=193&c=7&r=0&o=7&cb=iwp2&dpr=2&pid=1.7&rm=3',
  '运动周边': 'https://tse2-mm.cn.bing.net/th/id/OIP-C.CH9u__7OuzNFe4zjBDx-ygHaFj?w=219&h=180&c=7&r=0&o=7&cb=iwp2&dpr=2&pid=1.7&rm=3',
  'default': '/placeholder-parent-category-image.png'
};

function defaultParentCategoryImage(mainCategoryName) {
  return defaultParentCategoryImages[mainCategoryName] || defaultParentCategoryImages['default'];
}

function handleImageError(event, mainCategoryName) {
  event.target.src = defaultParentCategoryImages['default'];
}

function performSearch() {
  if (localSearchTerm.value.trim()) {
    router.push({ name: 'Search', query: { q: localSearchTerm.value.trim() } }); // 导航和参数 'q' 保持不变
  }
}

onMounted(() => {
  productStore.fetchCategories(); //
  productStore.fetchRecommendedProducts(); //
});
</script>

<style scoped>
.view-header {
  padding: calc(var(--spacing-unit) * 3) var(--spacing-unit); /* 增加上下内边距 */
  /* background: linear-gradient(to bottom, var(--primary-color-light), var(--light-color)); */ /* 可选：渐变背景 */
  /* border-bottom: 1px solid var(--border-color); */ /* 可选：底部边框 */
}

.view-header h1 {
  font-size: 2.5rem; /* 增大主标题 */
  color: var(--dark-color);
  margin-bottom: calc(var(--spacing-unit) * 1);
}
.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-color-light);
  margin-bottom: calc(var(--spacing-unit) * 3); /* 副标题与搜索框的间距 */
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* 美化后的首页搜索栏 */
.home-search-form {
  display: flex;
  height: 50px;
  max-width: 890px;
  margin: 0 auto calc(var(--spacing-unit) * 4); /* 搜索栏与下方内容的间距 */
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-large); /* 更大的圆角 */
  background-color: var(--white-color);
  box-shadow: var(--box-shadow-light); /* 更轻的阴影 */
  transition: box-shadow 0.2s ease-in-out;
}
.home-search-form:focus-within { /* 当表单内部任一元素获取焦点时 */
  box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--primary-color) 20%, transparent), var(--box-shadow);
  border-color: color-mix(in srgb, var(--primary-color) 70%, var(--border-color));
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding-left: calc(var(--spacing-unit) * 1.5); /* 图标的左边距 */
}

.search-icon-prefix {
  font-size: 1.3rem;
  color: var(--text-color-light);
  margin-right: calc(var(--spacing-unit) * 1);
}

.home-search-input {
  margin: 0 0 0 20px;
  flex-grow: 1;
  padding: calc(var(--spacing-unit) * 1.75) calc(var(--spacing-unit) * 1.5); /* 增加输入框高度和右边距 */
  padding-left: 0; /* 因为图标已经有左边距了 */
  border: none;
  font-size: 1rem;
  color: var(--text-color);
  background-color: transparent; /* 输入框背景透明 */
  outline: none;
}
.home-search-input::placeholder {
  color: var(--text-color-light);
  opacity: 0.8;
}

.home-search-form:focus-within { /* 当表单内部任一元素获取焦点时 */
  box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--primary-color) 20%, transparent), var(--box-shadow);
  border-color: color-mix(in srgb, var(--primary-color) 70%, var(--border-color));
}

.btn-home-search {
  padding: calc(var(--spacing-unit) * 1.75) calc(var(--spacing-unit) * 3);
  background-color: var(--primary-color);
  color: var(--white-color);
  border: none;
  border-top-right-radius: var(--border-radius-large); /* 确保圆角与表单一致 */
  border-bottom-right-radius: var(--border-radius-large);
  border-top-left-radius: 0; /* 按钮左侧不加圆角 */
  border-bottom-left-radius: 0;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 0.5px; /* 轻微增加字间距 */
  transition: background-color 0.2s ease;
}
.btn-home-search:hover {
  background-color: var(--primary-color-darker);
}


/* 通用区块样式 */
.home-section {
  margin-bottom: calc(var(--spacing-unit) * 5); /* 区块之间的垂直间距 */
}
.section-title {
  font-size: 1.8rem;
  color: var(--dark-color);
  text-align: center;
  margin-bottom: calc(var(--spacing-unit) * 3); /* 标题与内容的间距 */
  position: relative; /* 用于装饰线 */
}
/* 标题装饰线（可选）*/
.section-title span {
  position: relative;
  padding-bottom: calc(var(--spacing-unit) * 0.5);
}
.section-title span::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px; /* 装饰线宽度 */
  height: 3px;  /* 装饰线厚度 */
  background-color: var(--primary-color);
  border-radius: 2px;
}


/* 大类卡片样式 (基本保持，可微调) */
.parent-category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: calc(var(--spacing-unit) * 2.5); /* 调整卡片间距 */
  /* margin-top: 0; */ /* section-title 已经有下边距了 */
}

@media (min-width: 768px) {
  .parent-category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1200px) {
  .parent-category-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.parent-category-card {
  padding: 0; /* 移除卡片内边距，让图片和文字自己控制 */
  text-decoration: none;
  display: flex;
  flex-direction: column;
  /* align-items: center; */ /* 移除，让图片宽度100% */
  background-color: var(--white-color);
  transition: transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-large);
  overflow: hidden; /* 确保图片圆角生效 */
}

.parent-category-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-6px); /* 悬浮效果更明显 */
  box-shadow: var(--box-shadow-hover);
}

.parent-category-image-wrapper {
  width: 100%;
  padding-top: 70%; /* 调整宽高比，例如 10:7 */
  position: relative;
  /* margin-bottom: 0; */ /* 移除，让标题部分有自己的padding */
  background-color: var(--light-color);
  /* border-bottom: 1px solid var(--border-color); */ /* 图片和文字之间的分隔线 */
}

.parent-category-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
}
.parent-category-card:hover .parent-category-image {
  transform: scale(1.05); /* 图片轻微放大效果 */
}

.parent-category-card h3 {
  color: var(--dark-color); /* 标题颜色调整 */
  font-size: 1.15rem; /* 调整字体大小 */
  font-weight: 600;
  line-height: 1.4;
  padding: calc(var(--spacing-unit) * 1.5) var(--spacing-unit); /* 标题的内边距 */
  width: 100%;
  text-align: center;
  background-color: var(--white-color); /* 确保标题背景是白色 */
  margin-top: auto; /* 如果卡片高度不一致，标题仍然在底部 */
}
.parent-category-card:hover h3 {
  color: var(--primary-color);
}

/* 商品网格 (推荐商品) */
.product-grid {
  gap: calc(var(--spacing-unit) * 2.5);
}

/* 状态消息容器 (保持不变或微调) */
.status-message-container {
  /* ... */
}

/* 全局内容容器 */
.main-view-content {
  padding: 0 var(--spacing-unit); /* 移除main-view-content的上下padding，由区块自己控制 */
}
</style>