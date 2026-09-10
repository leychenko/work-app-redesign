<template>
    <main-master-page>
        <template #main>
            <button-home-component />
            <section class="page-heading">
                <div>
                    <p class="eyebrow"><span></span> Платежі</p>
                    <h1>Акти виконаних робіт</h1>
                </div>
                <div class="page-heading__date">
                    <font-awesome-icon :icon="['fas', 'receipt']" />
                    <span>{{ paymentList.length }} актів</span>
                </div>
            </section>

            <div class="search-tabs">
                <router-link :to="{ name: 'searchForDate-page' }">
                    <font-awesome-icon :icon="['far', 'calendar']" />
                    Пошук за місяцем
                </router-link>
                <router-link :to="{ name: 'searchForNumberAct-page' }">
                    <font-awesome-icon :icon="['fas', 'hashtag']" />
                    Пошук за номером
                </router-link>
            </div>

            <div class="page-layout">
                <section class="glass-panel form-panel">
                    <div class="form-panel__header">
                        <div>
                            <h2>Додати новий акт</h2>
                            <p>Вкажіть суму, дату документа та його номер.</p>
                        </div>
                        <span class="form-panel__number">03 / 03</span>
                    </div>

                    <form class="form" @submit.prevent="addData">
                        <div class="form-grid form-grid--two">
                            <div class="field field--wide">
                                <label for="act-sum">Сума сплати</label>
                                <input
                                    id="act-sum"
                                    v-model.number="paymentDataObj.sum"
                                    type="number"
                                    min="0"
                                    autocomplete="off"
                                    placeholder="0"
                                />
                            </div>
                            <div class="field">
                                <label for="act-date">Дата акта</label>
                                <input
                                    id="act-date"
                                    v-model.trim="paymentDataObj.date"
                                    type="text"
                                    inputmode="numeric"
                                    autocomplete="off"
                                    placeholder="ДД.ММ.РРРР"
                                />
                            </div>
                            <div class="field">
                                <label for="act-number">Номер акта</label>
                                <input
                                    id="act-number"
                                    v-model.number="paymentDataObj.number"
                                    type="number"
                                    min="0"
                                    autocomplete="off"
                                    placeholder="0000"
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
                                Зберегти акт
                                <font-awesome-icon :icon="['fas', 'arrow-right']" />
                            </button>
                            <button type="button" class="btn btn--secondary" @click="clearForm">Очистити</button>
                        </div>
                    </form>
                </section>

                <aside class="glass-panel side-panel">
                    <span class="side-panel__icon"><font-awesome-icon :icon="['fas', 'money-check-dollar']" /></span>
                    <h2>Облік платежів</h2>
                    <p>Збережені акти використовуються для розрахунку сплачених податків за місяць і квартал.</p>
                    <div class="side-list">
                        <div class="side-list__item">
                            <span>Загальна сума</span>
                            <strong>{{ formatMoney(getTotalSum) }} грн</strong>
                        </div>
                        <div class="side-list__item">
                            <span>Поточний квартал</span>
                            <strong>{{ formatMoney(getAllTaxForThreeMonth) }} грн</strong>
                        </div>
                        <div class="side-list__item">
                            <span>Кількість актів</span>
                            <strong>{{ paymentList.length }}</strong>
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
    name: 'PaymentComponent',
    components: {
        MainMasterPage,
        ButtonHomeComponent,
    },
    data() {
        return {
            message: null,
            successMessage: null,
            paymentDataObj: {},
        }
    },
    computed: {
        ...mapGetters('paymentList', {
            paymentList: 'getList',
            getTotalSum: 'getTotalSum',
            getAllTaxForThreeMonth: 'getAllTaxForThreeMonth',
        }),
    },
    mounted() {
        this.loadPaymentList()
    },
    methods: {
        ...mapActions('paymentList', ['addItem', 'loadPaymentList']),
        addData() {
            this.message = null
            this.successMessage = null
            if (
                !Number.isFinite(Number(this.paymentDataObj.sum)) ||
                Number(this.paymentDataObj.sum) <= 0 ||
                !this.paymentDataObj.date ||
                !Number.isFinite(Number(this.paymentDataObj.number))
            ) {
                this.message = 'Заповніть усі поля коректними значеннями'
                return
            }
            this.addItem({
                ...this.paymentDataObj,
                sum: Number(this.paymentDataObj.sum),
                number: Number(this.paymentDataObj.number),
            })
            this.paymentDataObj = {}
            this.successMessage = 'Акт передано на збереження'
        },
        clearForm() {
            this.paymentDataObj = {}
            this.message = null
            this.successMessage = null
        },
        formatMoney(value) {
            return new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 }).format(Number(value) || 0)
        },
    },
}
</script>
