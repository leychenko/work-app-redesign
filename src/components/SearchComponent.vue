<template>
    <main-master-page>
        <template #main>
            <button-home-component />
            <section class="page-heading">
                <div>
                    <p class="eyebrow"><span></span> Фінансові записи</p>
                    <h1>Пошук за періодом</h1>
                </div>
                <div class="page-heading__date">
                    <font-awesome-icon :icon="['fas', 'magnifying-glass-chart']" />
                    <span>Місяць + рік</span>
                </div>
            </section>

            <div class="search-tabs">
                <router-link :to="{ name: 'info' }">
                    <font-awesome-icon :icon="['fas', 'wallet']" />
                    Фінанси
                </router-link>
                <router-link :to="{ name: 'searchDecl' }">
                    <font-awesome-icon :icon="['fas', 'box-archive']" />
                    Декларації
                </router-link>
                <router-link :to="{ name: 'searchForDate-page' }">
                    <font-awesome-icon :icon="['fas', 'receipt']" />
                    Акти
                </router-link>
            </div>

            <section class="glass-panel form-panel">
                <div class="form-panel__header">
                    <div>
                        <h2>Оберіть звітний період</h2>
                        <p>Пошук покаже всі фінансові записи за вказаний місяць поточного або минулого року.</p>
                    </div>
                    <span class="form-panel__number">FILTER</span>
                </div>
                <form class="form" @submit.prevent="filteredData">
                    <div class="form-grid form-grid--two">
                        <div class="field">
                            <label for="finance-search-month">Місяць</label>
                            <input
                                id="finance-search-month"
                                v-model.number="userData.date"
                                type="number"
                                min="1"
                                max="12"
                                autocomplete="off"
                                placeholder="1–12"
                            />
                        </div>
                        <div class="field">
                            <label for="finance-search-year">Рік</label>
                            <input
                                id="finance-search-year"
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
                            Знайти записи
                            <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                        </button>
                        <button type="button" class="btn btn--secondary" @click="clear">Очистити</button>
                    </div>
                </form>
            </section>

            <section v-if="arr !== null" class="glass-panel results-panel">
                <div class="results-panel__head">
                    <h2>Результати пошуку</h2>
                    <span>{{ getFilteredList.length }} записів</span>
                </div>

                <div v-if="getFilteredList.length" class="table-scroll">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Декларацій за день</th>
                                <th>Декларацій за ніч</th>
                                <th>Сума</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in getFilteredList" :key="item.id">
                                <td>{{ item.date || '—' }}</td>
                                <td>{{ item.dayDeclaration || 0 }}</td>
                                <td>{{ item.nightDeclaration || 0 }}</td>
                                <td class="data-table__money">{{ formatMoney(item.sum) }} грн</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="empty-state">
                    <div>
                        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                        <strong>Записів не знайдено</strong>
                        <span>Змініть місяць або рік та виконайте пошук ще раз.</span>
                    </div>
                </div>

                <div v-if="getFilteredList.length" class="results-panel__total">
                    <span>Разом за період</span>
                    <strong>{{ formatMoney(totalFound) }} грн</strong>
                </div>
            </section>
        </template>
    </main-master-page>
</template>

<script>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import ButtonHomeComponent from '@/components/ButtonHomeComponent.vue'
import { sortData } from '@/store/helpers/globalFunction'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'SearchComponent',
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
        ...mapGetters('financeData', ['getList']),
        getFilteredList() {
            return sortData(this.arr || [])
        },
        totalFound() {
            return this.getFilteredList.reduce((total, item) => total + (Number(item.sum) || 0), 0)
        },
    },
    mounted() {
        this.loadList()
    },
    methods: {
        ...mapActions('financeData', ['loadList']),
        filteredData() {
            const month = Number(this.userData.date)
            const year = Number(this.userData.year)
            if (!month || month < 1 || month > 12 || !year) {
                this.message = 'Вкажіть місяць від 1 до 12 та повний рік'
                return
            }
            this.arr = this.getList({ date: month, year })
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
