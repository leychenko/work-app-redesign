<template>
    <main-master-page>
        <template #main>
            <button-home-component />
            <section class="page-heading">
                <div>
                    <p class="eyebrow"><span></span> Аналітика</p>
                    <h1>Динаміка доходу</h1>
                </div>
                <div class="page-heading__date">
                    <font-awesome-icon :icon="['fas', 'chart-line']" />
                    <span>{{ currentYear }} рік</span>
                </div>
            </section>

            <section class="glass-panel analytics-panel chart-page-panel">
                <div class="panel-heading">
                    <div>
                        <p class="panel-kicker">Фінансові записи</p>
                        <h2>Сума за кожен місяць</h2>
                    </div>
                    <span class="panel-icon"><font-awesome-icon :icon="['fas', 'wave-square']" /></span>
                </div>
                <chart-component />
            </section>
        </template>
    </main-master-page>
</template>

<script>
import ChartComponent from '@/components/ChartComponent.vue'
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import ButtonHomeComponent from '@/components/ButtonHomeComponent.vue'

export default {
    name: 'ChartInfoView',
    components: {
        ChartComponent,
        MainMasterPage,
        ButtonHomeComponent,
    },
    computed: {
        currentYear() {
            return new Date().getFullYear()
        },
    },
}
</script>
