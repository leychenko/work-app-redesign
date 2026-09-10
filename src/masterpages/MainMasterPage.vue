<template>
    <div class="app-shell">
        <div class="ambient ambient--one"></div>
        <div class="ambient ambient--two"></div>
        <header-component />
        <loading-component v-if="isLoading" />
        <error-component v-if="hasError" />

        <main class="workspace">
            <slot name="button-home"></slot>
            <slot name="main"></slot>
        </main>
    </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import { mapGetters } from 'vuex'

export default {
    name: 'MainMasterPage',
    components: {
        HeaderComponent,
        LoadingComponent,
        ErrorComponent,
    },
    computed: {
        ...mapGetters(['isLoading', 'hasError']),
    },
}
</script>
