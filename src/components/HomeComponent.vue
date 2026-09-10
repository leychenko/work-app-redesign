<template>
    <main-master-page>
        <template #main>
            <section class="page-heading page-heading--dashboard">
                <div>
                    <p class="eyebrow"><span></span> Фінансовий огляд</p>
                    <h1>Панель керування</h1>
                </div>
                <div class="page-heading__date">
                    <font-awesome-icon :icon="['far', 'calendar']" />
                    <span>{{ correctMonth.date }}</span>
                </div>
            </section>

            <div class="dashboard-grid">
                <weather-component class="dashboard-grid__weather" />

                <section class="glass-panel summary-panel dashboard-grid__summary">
                    <div class="panel-heading">
                        <div>
                            <p class="panel-kicker">Поточний місяць</p>
                            <h2>{{ correctMonth.month }}</h2>
                        </div>
                        <span class="panel-icon"><font-awesome-icon :icon="['fas', 'signal']" /></span>
                    </div>

                    <div class="metric-grid">
                        <router-link :to="{ name: 'bonus' }" class="metric-card">
                            <span class="metric-card__icon metric-card__icon--cyan">
                                <font-awesome-icon :icon="['fas', 'coins']" />
                            </span>
                            <span class="metric-card__label">Чиста зарплата</span>
                            <strong>{{ formatMoney(getSumSalary) }}</strong>
                            <small>грн</small>
                        </router-link>

                        <div class="metric-card">
                            <span class="metric-card__icon metric-card__icon--blue">
                                <font-awesome-icon :icon="['fas', 'bolt']" />
                            </span>
                            <span class="metric-card__label">Бонуси</span>
                            <strong>{{ formatMoney(countBonus) }}</strong>
                            <small>грн</small>
                        </div>

                        <div class="metric-card">
                            <span class="metric-card__icon metric-card__icon--violet">
                                <font-awesome-icon :icon="['fas', 'building-columns']" />
                            </span>
                            <span class="metric-card__label">Податки за місяць</span>
                            <strong>{{ formatMoney(monthTax) }}</strong>
                            <small>грн</small>
                        </div>

                        <div class="metric-card">
                            <span class="metric-card__icon metric-card__icon--mint">
                                <font-awesome-icon :icon="['fas', 'credit-card']" />
                            </span>
                            <span class="metric-card__label">Залишити на карті</span>
                            <strong>{{ formatMoney(getSumOnCardWithBonusAndTax) }}</strong>
                            <small>грн</small>
                        </div>
                    </div>

                    <div class="summary-panel__footer">
                        <span>Податки за квартал</span>
                        <strong>{{ formatMoney(getTaxForThreeMonth) }} грн</strong>
                    </div>
                </section>

                <section class="glass-panel chart-panel dashboard-grid__chart">
                    <div class="panel-heading">
                        <div>
                            <p class="panel-kicker">Динаміка</p>
                            <h2>Дохід за {{ currentYear }}</h2>
                        </div>
                        <router-link :to="{ name: 'chartPage' }" class="icon-link" aria-label="Відкрити аналітику">
                            <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" />
                        </router-link>
                    </div>
                    <chart-component compact />
                </section>

                <section class="glass-panel activity-panel dashboard-grid__activity">
                    <div class="panel-heading">
                        <div>
                            <p class="panel-kicker">База даних</p>
                            <h2>Активність</h2>
                        </div>
                        <span class="panel-icon"><font-awesome-icon :icon="['fas', 'database']" /></span>
                    </div>
                    <div class="activity-stats">
                        <div>
                            <strong>{{ declarations.length }}</strong>
                            <span>декларацій</span>
                        </div>
                        <div>
                            <strong>{{ financeEntries.length }}</strong>
                            <span>фінансових записів</span>
                        </div>
                        <div>
                            <strong>{{ payments.length }}</strong>
                            <span>актів</span>
                        </div>
                    </div>
                </section>

                <section class="quick-actions dashboard-grid__actions">
                    <router-link :to="{ name: 'addDeclaration' }" class="quick-action">
                        <span><font-awesome-icon :icon="['fas', 'file-circle-plus']" /></span>
                        <div>
                            <strong>Додати декларацію</strong>
                            <small>Новий товар і номер</small>
                        </div>
                        <font-awesome-icon class="quick-action__arrow" :icon="['fas', 'arrow-right']" />
                    </router-link>
                    <router-link :to="{ name: 'data-page' }" class="quick-action">
                        <span><font-awesome-icon :icon="['fas', 'plus']" /></span>
                        <div>
                            <strong>Записати фінанси</strong>
                            <small>Сума та декларації</small>
                        </div>
                        <font-awesome-icon class="quick-action__arrow" :icon="['fas', 'arrow-right']" />
                    </router-link>
                    <router-link :to="{ name: 'payment-page' }" class="quick-action">
                        <span><font-awesome-icon :icon="['fas', 'receipt']" /></span>
                        <div>
                            <strong>Додати акт</strong>
                            <small>Оплата і номер акта</small>
                        </div>
                        <font-awesome-icon class="quick-action__arrow" :icon="['fas', 'arrow-right']" />
                    </router-link>
                </section>
            </div>
        </template>
    </main-master-page>
</template>

<script>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import WeatherComponent from '@/components/WeatherComponent.vue'
import ChartComponent from '@/components/ChartComponent.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'HomeComponent',
    components: {
        MainMasterPage,
        WeatherComponent,
        ChartComponent,
    },
    computed: {
        ...mapGetters('declarationData', {
            declarations: 'getItemsList',
        }),
        ...mapGetters('financeData', {
            financeEntries: 'getItemsListFinance',
            getDayBonusSum: 'getDayBonusSum',
            getMonthList: 'getMonthList',
            getNightBonusSum: 'getNightBonusSum',
            getTotalTaxValue: 'getTotalTaxValue',
            getSalary: 'getSalary',
            getTaxForThreeMonth: 'getTaxForThreeMonth',
        }),
        ...mapGetters('paymentList', {
            payments: 'getList',
            getAllTaxForThreeMonth: 'getAllTaxForThreeMonth',
        }),
        countBonus() {
            return Number(this.getDayBonusSum || 0) + Number(this.getNightBonusSum || 0)
        },
        correctMonth() {
            return {
                month: this.getMonthList[new Date().getMonth()],
                date: new Intl.DateTimeFormat('uk-UA', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                }).format(new Date()),
            }
        },
        currentYear() {
            return new Date().getFullYear()
        },
        monthTax() {
            return Number(this.getTotalTaxValue && this.getTotalTaxValue.resultCorrectMonth) || 0
        },
        getSumSalary() {
            return Number(this.getSalary || 0) - this.countBonus - this.monthTax
        },
        getSumOnCardWithBonusAndTax() {
            return Number(this.getAllTaxForThreeMonth || 0) + this.countBonus
        },
    },
    created() {
        this.loadFinance()
        this.loadPayments()
        this.loadDeclarations()
    },
    methods: {
        ...mapActions('declarationData', {
            loadDeclarations: 'loadList',
        }),
        ...mapActions('financeData', {
            loadFinance: 'loadList',
        }),
        ...mapActions('paymentList', {
            loadPayments: 'loadPaymentList',
        }),
        formatMoney(value) {
            return new Intl.NumberFormat('uk-UA', {
                maximumFractionDigits: 0,
            }).format(Number(value) || 0)
        },
    },
}
</script>
