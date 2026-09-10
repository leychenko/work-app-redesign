<template>
    <button class="back-button" type="button" @click="goHome">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
        <span>На головну</span>
    </button>
</template>

<script>
export default {
    name: 'ButtonHomeComponent',
    methods: {
        goHome() {
            this.$router.push({ name: 'home' })
        },
    },
}
</script>
