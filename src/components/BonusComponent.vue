<template>
    <section class="glass-panel goal-panel">
        <div class="panel-heading">
            <div>
                <p class="panel-kicker">Накопичення</p>
                <h2>Фінансова ціль {{ getTargetYear }}</h2>
            </div>
            <span class="panel-icon"><font-awesome-icon :icon="['fas', 'bullseye']" /></span>
        </div>

        <div class="goal-grid">
            <div class="goal-stat">
                <span>Чистий дохід</span>
                <strong>{{ formatMoney(totalNetIncome) }}</strong>
                <small>грн</small>
            </div>
            <div class="goal-stat">
                <span>У доларах</span>
                <strong>{{ formatCurrency(convertedUSD, 'USD') }}</strong>
                <small>за поточним курсом</small>
            </div>
            <div class="goal-stat">
                <span>У євро</span>
                <strong>{{ formatCurrency(convertedEUR, 'EUR') }}</strong>
                <small>за поточним курсом</small>
            </div>
            <div class="goal-stat">
                <span>Залишилось до цілі</span>
                <strong>{{ formatMoney(moneyLeft) }}</strong>
                <small>грн</small>
            </div>
        </div>

        <div class="goal-progress">
            <div class="goal-progress__labels">
                <span>Виконано {{ progress }}%</span>
                <span>{{ formatMoney(goal) }} грн</span>
            </div>
            <div class="goal-progress__track">
                <div class="goal-progress__value" :style="{ width: progress + '%' }"></div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'BonusComponent',
    data() {
        return {
            goal: 2500000,
        }
    },
    computed: {
        ...mapGetters('financeData', ['getItemsListFinance', 'getTargetYear', 'getCurrency']),
        currentYearItems() {
            const year = String(this.getTargetYear)
            return this.getItemsListFinance.filter((item) => {
                return typeof item.date === 'string' && item.date.endsWith(year)
            })
        },
        totalNetIncome() {
            const gross = this.currentYearItems.reduce((total, item) => total + (Number(item.sum) || 0), 0)
            const bonusCount = this.currentYearItems.reduce((total, item) => {
                return total + (Number(item.nightDeclaration) || 0) + (Number(item.dayDeclaration) || 0)
            }, 0)
            const taxRate = Number(this.getTargetYear) >= 2025 ? 0.06 : 0.05
            return Math.max(0, Math.ceil(gross - gross * taxRate - bonusCount * 1000))
        },
        usdRate() {
            const item = this.getCurrency.find((currency) => currency.currencyCodeA === 840)
            return Number(item && item.rateSell) || 0
        },
        eurRate() {
            const item = this.getCurrency.find(
                (currency) => currency.currencyCodeA === 978 && currency.currencyCodeB === 980
            )
            return Number(item && item.rateSell) || 0
        },
        convertedUSD() {
            return this.usdRate ? this.totalNetIncome / this.usdRate : 0
        },
        convertedEUR() {
            return this.eurRate ? this.totalNetIncome / this.eurRate : 0
        },
        moneyLeft() {
            return Math.max(0, this.goal - this.totalNetIncome)
        },
        progress() {
            return Math.min(100, Math.round((this.totalNetIncome / this.goal) * 100))
        },
    },
    created() {
        this.loadList()
        this.loadCurrency()
    },
    methods: {
        ...mapActions('financeData', ['loadList', 'loadCurrency']),
        formatMoney(value) {
            return new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 }).format(Number(value) || 0)
        },
        formatCurrency(value, currency) {
            return new Intl.NumberFormat('uk-UA', {
                style: 'currency',
                currency,
                maximumFractionDigits: 0,
            }).format(Number(value) || 0)
        },
    },
}
</script>
