<template>
    <header class="topbar">
        <div class="topbar__inner">
            <router-link class="brand" :to="{ name: 'home' }" aria-label="На головну" @click="closeMenu">
                <span class="brand__mark"><span></span></span>
                <span class="brand__text">
                    <strong>WORK</strong>
                    <small>FINANCE</small>
                </span>
            </router-link>

            <button
                type="button"
                class="nav-toggle"
                :class="{ 'is-active': isMenuActive }"
                :aria-expanded="isMenuActive"
                aria-label="Відкрити меню"
                @click="toggleMenu"
            >
                <span></span>
                <span></span>
            </button>

            <nav class="primary-nav" :class="{ 'is-open': isMenuActive }" aria-label="Основна навігація">
                <router-link
                    v-for="menuItem in menuItemsList"
                    :key="menuItem.titleLabel"
                    class="primary-nav__link"
                    :to="menuItem.to"
                    @click="closeMenu"
                >
                    <font-awesome-icon :icon="['fas', menuItem.icon]" />
                    <span>{{ menuItem.titleLabel }}</span>
                </router-link>
            </nav>

            <div class="topbar__meta">
                <div class="live-date">
                    <span class="live-date__dot"></span>
                    <span>{{ currentDate }}</span>
                </div>
                <currency-component />
            </div>
        </div>
        <button
            v-if="isMenuActive"
            type="button"
            class="nav-backdrop"
            aria-label="Закрити меню"
            @click="closeMenu"
        ></button>
    </header>
</template>

<script>
import CurrencyComponent from '@/components/CurrencyComponent.vue'

export default {
    name: 'HeaderComponent',
    components: {
        CurrencyComponent,
    },
    data() {
        return {
            menuItemsList: [
                { to: { name: 'home' }, titleLabel: 'Огляд', icon: 'border-all' },
                { to: { name: 'addDeclaration' }, titleLabel: 'Декларації', icon: 'file-circle-plus' },
                { to: { name: 'data-page' }, titleLabel: 'Фінанси', icon: 'wallet' },
                { to: { name: 'info' }, titleLabel: 'Пошук', icon: 'magnifying-glass-chart' },
                { to: { name: 'searchDecl' }, titleLabel: 'Товари', icon: 'box-archive' },
                { to: { name: 'payment-page' }, titleLabel: 'Акти', icon: 'receipt' },
                { to: { name: 'chartPage' }, titleLabel: 'Аналітика', icon: 'chart-line' },
            ],
            isMenuActive: false,
        }
    },
    computed: {
        currentDate() {
            return new Intl.DateTimeFormat('uk-UA', {
                day: '2-digit',
                month: 'short',
            }).format(new Date())
        },
    },
    watch: {
        $route() {
            this.closeMenu()
        },
    },
    methods: {
        toggleMenu() {
            this.isMenuActive = !this.isMenuActive
        },
        closeMenu() {
            this.isMenuActive = false
        },
    },
}
</script>
