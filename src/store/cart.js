// src/store/cart.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
    const items = ref([]); // 存放 { product, quantity }

    const cartItemCount = computed(() => {
        return items.value.reduce((total, item) => total + item.quantity, 0);
    });

    const cartTotalPrice = computed(() => {
        return items.value.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2);
    });

    function addItem(product, quantity = 1) {
        const existingItem = items.value.find(item => item.product.id === product.id);
        if (existingItem) {
            if (existingItem.quantity + quantity <= product.stock) {
                existingItem.quantity += quantity;
            } else {
                alert(`库存不足！${product.name} 仅剩 ${product.stock} 件, 您已添加 ${existingItem.quantity} 件。`);
            }
        } else {
            if (quantity <= product.stock) {
                items.value.push({ product, quantity });
            } else {
                alert(`库存不足！${product.name} 仅剩 ${product.stock} 件。`);
            }
        }
    }

    function removeItem(productId) {
        items.value = items.value.filter(item => item.product.id !== productId);
    }

    function updateQuantity(productId, newQuantity) {
        const item = items.value.find(item => item.product.id === productId);
        if (item) {
            if (newQuantity > 0 && newQuantity <= item.product.stock) {
                item.quantity = newQuantity;
            } else if (newQuantity <= 0) {
                removeItem(productId);
            } else {
                alert(`库存不足！${item.product.name} 仅剩 ${item.product.stock} 件。`);
                item.quantity = item.product.stock; // 或者保持原样不修改
            }
        }
    }

    function clearCart() {
        items.value = [];
    }

    return {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartItemCount,
        cartTotalPrice
    };
});