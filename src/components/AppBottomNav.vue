<template>
  <nav class="bottom-nav" aria-label="Мобільна навігація">
    <router-link v-for="item in items" :key="item.name" :to="{ name: item.name }" class="bottom-nav__item">
      <font-awesome-icon :icon="['fas', item.icon]" />
      <span>{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'AppBottomNav',
  data() {
    return {
      items: [
        { name: 'home', label: 'Головна', icon: 'house' },
        { name: 'data-page', label: 'Доходи', icon: 'wallet' },
        { name: 'payment-page', label: 'Акти', icon: 'file-invoice' },
        { name: 'chartPage', label: 'Статистика', icon: 'chart-line' },
      ],
    }
  },
}
</script>
