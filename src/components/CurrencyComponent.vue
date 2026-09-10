<template>
    <div class="currency-strip" aria-label="Курси валют">
        <div class="currency-strip__item">
            <span>$</span>
            <strong>{{ formatRate(currencyUSD) }}</strong>
        </div>
        <span class="currency-strip__line"></span>
        <div class="currency-strip__item">
            <span>€</span>
            <strong>{{ formatRate(currencyEURO) }}</strong>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'CurrencyComponent',
    computed: {
        ...mapGetters('financeData', ['getCurrency']),
        currencyUSD() {
            return this.getCurrency.find((item) => item.currencyCodeA === 840)
        },
        currencyEURO() {
            return this.getCurrency.find((item) => item.currencyCodeA === 978 && item.currencyCodeB === 980)
        },
    },
    created() {
        this.loadCurrency()
    },
    methods: {
        ...mapActions('financeData', ['loadCurrency']),
        formatRate(item) {
            const value = Number(item && item.rateSell)
            return Number.isFinite(value) ? value.toFixed(2) : '—'
        },
    },
}
</script>
