<template>
    <main-master-page>
        <template #main>
            <button-home-component />
            <section class="page-heading">
                <div>
                    <p class="eyebrow"><span></span> Акти</p>
                    <h1>Пошук за місяцем</h1>
                </div>
                <div class="page-heading__date">
                    <font-awesome-icon :icon="['far', 'calendar']" />
                    <span>Архів платежів</span>
                </div>
            </section>

            <div class="search-tabs">
                <router-link :to="{ name: 'payment-page' }">
                    <font-awesome-icon :icon="['fas', 'plus']" />
                    Новий акт
                </router-link>
                <router-link :to="{ name: 'searchForDate-page' }">
                    <font-awesome-icon :icon="['far', 'calendar']" />
                    За місяцем
                </router-link>
                <router-link :to="{ name: 'searchForNumberAct-page' }">
                    <font-awesome-icon :icon="['fas', 'hashtag']" />
                    За номером
                </router-link>
            </div>

            <section class="glass-panel form-panel">
                <div class="form-panel__header">
                    <div>
                        <h2>Оберіть період</h2>
                        <p>Система покаже акти та дати їх оплати за вказаний місяць.</p>
                    </div>
                    <span class="form-panel__number">FILTER</span>
                </div>
                <form class="form" @submit.prevent="searchData">
                    <div class="form-grid form-grid--two">
                        <div class="field">
                            <label for="act-search-month">Місяць</label>
                            <input
                                id="act-search-month"
                                v-model.number="userData.date"
                                type="number"
                                min="1"
                                max="12"
                                autocomplete="off"
                                placeholder="1–12"
                            />
                        </div>
                        <div class="field">
                            <label for="act-search-year">Рік</label>
                            <input
                                id="act-search-year"
                                v-model.number="userData.year"
                                type="number"
                                min="2000"
                                autocomplete="off"
                                placeholder="2026"
                            />
                        </div>
                    </div>
                    <div v-if="message" class="form-message">
                        <font-awesome-icon :icon="['fas', 'circle-info']" />
                        {{ message }}
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn">
                            Знайти акти
                            <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                        </button>
                        <button type="button" class="btn btn--secondary" @click="clear">Очистити</button>
                    </div>
                </form>
            </section>

            <section v-if="arr !== null" class="glass-panel results-panel">
                <div class="results-panel__head">
                    <h2>Знайдені акти</h2>
                    <span>{{ getSortListActs.length }} записів</span>
                </div>
                <div v-if="getSortListActs.length" class="table-scroll">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Дата акта</th>
                                <th>Номер акта</th>
                                <th>Дата оплати</th>
                                <th>Сума</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in getSortListActs" :key="item.id">
                                <td>{{ item.date || '—' }}</td>
                                <td>№ {{ item.number || '—' }}</td>
                                <td>{{ item.cashDay || 'Очікує оплати' }}</td>
                                <td class="data-table__money">{{ formatMoney(item.sum) }} грн</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="empty-state">
                    <div>
                        <font-awesome-icon :icon="['fas', 'receipt']" />
                        <strong>Актів не знайдено</strong>
                        <span>Спробуйте інший місяць або рік.</span>
                    </div>
                </div>
            </section>
        </template>
    </main-master-page>
</template>

<script>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import ButtonHomeComponent from '@/components/ButtonHomeComponent.vue'
import { mapActions, mapGetters } from 'vuex'
import { sortData } from '@/store/helpers/globalFunction'

export default {
    name: 'SearchForYearActComponent',
    components: {
        MainMasterPage,
        ButtonHomeComponent,
    },
    data() {
        return {
            userData: {
                date: null,
                year: new Date().getFullYear(),
            },
            arr: null,
            message: null,
        }
    },
    computed: {
        ...mapGetters('paymentList', ['getDataForMonth']),
        getSortListActs() {
            return sortData(this.arr || [])
        },
    },
    mounted() {
        this.loadPaymentList()
    },
    methods: {
        ...mapActions('paymentList', ['loadPaymentList']),
        searchData() {
            const month = Number(this.userData.date)
            const year = Number(this.userData.year)
            if (!month || month < 1 || month > 12 || !year) {
                this.message = 'Вкажіть місяць від 1 до 12 та повний рік'
                return
            }
            this.arr = this.getDataForMonth({ date: month, year })
            this.message = this.arr.length ? null : 'За цим періодом нічого не знайдено'
        },
        clear() {
            this.userData = {
                date: null,
                year: new Date().getFullYear(),
            }
            this.arr = null
            this.message = null
        },
        formatMoney(value) {
            return new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 }).format(Number(value) || 0)
        },
    },
}
</script>
