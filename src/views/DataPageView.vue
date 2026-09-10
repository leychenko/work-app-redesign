<template>
    <main-master-page>
        <template #main>
            <button-home-component />
            <section class="page-heading">
                <div>
                    <p class="eyebrow"><span></span> Фінанси</p>
                    <h1>Новий запис</h1>
                </div>
                <div class="page-heading__date">
                    <font-awesome-icon :icon="['fas', 'wallet']" />
                    <span>{{ getItemsListFinance.length }} операцій</span>
                </div>
            </section>

            <div class="page-layout">
                <section class="glass-panel form-panel">
                    <div class="form-panel__header">
                        <div>
                            <h2>Додати фінансові дані</h2>
                            <p>Сума буде записана поточною датою та врахована у зарплаті, податках і аналітиці.</p>
                        </div>
                        <span class="form-panel__number">02 / 03</span>
                    </div>

                    <form class="form" @submit.prevent="addData">
                        <div class="form-grid form-grid--two">
                            <div class="field field--wide">
                                <label for="finance-sum">Сума сплати</label>
                                <input
                                    id="finance-sum"
                                    v-model.number="financeDataObj.sum"
                                    type="number"
                                    min="0"
                                    autocomplete="off"
                                    placeholder="0"
                                />
                                <span class="field__hint">Сума у гривнях</span>
                            </div>
                            <div class="field">
                                <label for="finance-day">Декларацій за день</label>
                                <input
                                    id="finance-day"
                                    v-model.number="financeDataObj.dayDeclaration"
                                    type="number"
                                    min="0"
                                    autocomplete="off"
                                    placeholder="0"
                                />
                            </div>
                            <div class="field">
                                <label for="finance-night">Декларацій за ніч</label>
                                <input
                                    id="finance-night"
                                    v-model.number="financeDataObj.nightDeclaration"
                                    type="number"
                                    min="0"
                                    autocomplete="off"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div v-if="message" class="form-message">
                            <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
                            {{ message }}
                        </div>
                        <div v-if="successMessage" class="form-message success-message">
                            <font-awesome-icon :icon="['fas', 'circle-check']" />
                            {{ successMessage }}
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn">
                                Зберегти дані
                                <font-awesome-icon :icon="['fas', 'arrow-right']" />
                            </button>
                            <button type="button" class="btn btn--secondary" @click="clearForm">Очистити</button>
                        </div>
                    </form>
                </section>

                <aside class="glass-panel side-panel">
                    <span class="side-panel__icon"><font-awesome-icon :icon="['fas', 'chart-pie']" /></span>
                    <h2>Розрахунок місяця</h2>
                    <p>Новий запис автоматично впливає на загальну суму, денний і нічний бонус та податок.</p>
                    <div class="side-list">
                        <div class="side-list__item">
                            <span>Поточна зарплата</span>
                            <strong>{{ formatMoney(getSalary) }} грн</strong>
                        </div>
                        <div class="side-list__item">
                            <span>Денний бонус</span>
                            <strong>{{ formatMoney(getDayBonusSum) }} грн</strong>
                        </div>
                        <div class="side-list__item">
                            <span>Податок</span>
                            <strong>{{ formatMoney(monthTax) }} грн</strong>
                        </div>
                    </div>
                </aside>
            </div>
        </template>
    </main-master-page>
</template>

<script>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import ButtonHomeComponent from '@/components/ButtonHomeComponent.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'DataPageView',
    components: {
        MainMasterPage,
        ButtonHomeComponent,
    },
    data() {
        return {
            message: null,
            successMessage: null,
            financeDataObj: {},
        }
    },
    computed: {
        ...mapGetters('financeData', [
            'getTotalTaxValue',
            'getDayBonusSum',
            'getItemsListFinance',
            'getSalary',
        ]),
        monthTax() {
            return Number(this.getTotalTaxValue && this.getTotalTaxValue.resultCorrectMonth) || 0
        },
    },
    created() {
        this.loadList()
    },
    methods: {
        ...mapActions('financeData', ['addItem', 'loadList']),
        addData() {
            this.message = null
            this.successMessage = null
            const data = this.financeDataObj
            if (
                !Number.isFinite(Number(data.sum)) ||
                Number(data.sum) <= 0 ||
                !Number.isFinite(Number(data.dayDeclaration)) ||
                Number(data.dayDeclaration) < 0 ||
                !Number.isFinite(Number(data.nightDeclaration)) ||
                Number(data.nightDeclaration) < 0
            ) {
                this.message = 'Заповніть усі поля коректними значеннями'
                return
            }
            this.addItem({
                sum: Number(data.sum),
                dayDeclaration: Number(data.dayDeclaration),
                nightDeclaration: Number(data.nightDeclaration),
            })
            this.financeDataObj = {}
            this.successMessage = 'Фінансовий запис передано на збереження'
        },
        clearForm() {
            this.financeDataObj = {}
            this.message = null
            this.successMessage = null
        },
        formatMoney(value) {
            return new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 }).format(Number(value) || 0)
        },
    },
}
</script>
