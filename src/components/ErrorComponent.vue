<template>
    <div class="error-container" role="alert">
        <font-awesome-icon :icon="['fas', 'triangle-exclamation']" class="icon" />
        <h3>Не вдалося оновити дані</h3>
        <h2>{{ errorMessage }}</h2>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'ErrorComponent',
    computed: {
        ...mapGetters(['hasError']),
        errorMessage() {
            if (!this.hasError) return ''
            return this.hasError.message || String(this.hasError)
        },
    },
}
</script>
