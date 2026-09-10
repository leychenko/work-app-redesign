<template>
    <main-master-page>
        <template #main>
            <button class="back-button" type="button" @click="onBack">
                <font-awesome-icon :icon="['fas', 'arrow-left']" />
                Назад
            </button>
            <section class="page-heading">
                <div>
                    <p class="eyebrow"><span></span> Річний підсумок</p>
                    <h1>Накопичення</h1>
                </div>
                <div class="page-heading__date">
                    <font-awesome-icon :icon="['fas', 'bullseye']" />
                    <span>Особиста ціль</span>
                </div>
            </section>
            <bonus-component />
        </template>
    </main-master-page>
</template>

<script>
import BonusComponent from '@/components/BonusComponent.vue'
import MainMasterPage from '@/masterpages/MainMasterPage.vue'

export default {
    name: 'BonusView',
    components: {
        BonusComponent,
        MainMasterPage,
    },
    methods: {
        onBack() {
            this.$router.go(-1)
        },
    },
}
</script>
