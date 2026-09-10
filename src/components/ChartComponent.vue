<template>
    <div class="chart-body" :class="{ 'chart-body--compact': compact }">
        <canvas ref="chartCanvas"></canvas>
    </div>
</template>

<script>
import { Chart } from 'chart.js/auto'
import { mapActions, mapGetters } from 'vuex'
import { markRaw } from 'vue'

export default {
    name: 'ChartComponent',
    props: {
        compact: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            chart: null,
            months: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
        }
    },
    computed: {
        ...mapGetters('financeData', ['getTest', 'getSalaryPerMonthMoney']),
        monthlyValues() {

    const values = this.months.map((month, index) => {

        return Number(
            this.getSalaryPerMonthMoney(index + 1)
        ) || 0

    })

    return JSON.parse(JSON.stringify(values))

},
    },
    watch: {
        monthlyValues: {
            deep: true,
            handler(values) {
                if (!this.chart) return
                this.chart.data.datasets[0].data = Array.from(values)
                this.chart.update('none')
            },
        },
    },
    mounted() {

    if (!this.getTest || !this.getTest.length) {
        this.loadList()
    }

    this.$nextTick(() => {
        this.renderChart()
    })

},
    beforeUnmount() {
        if (this.chart) this.chart.destroy()
    },
    methods: {
        ...mapActions('financeData', ['loadList']),
        renderChart() {
				if (this.chart) {
					this.chart.destroy()
					this.chart = null
				}

            const context = this.$refs.chartCanvas
            const gradient = context.getContext('2d').createLinearGradient(0, 0, 0, 320)
            gradient.addColorStop(0, 'rgba(70, 224, 239, .7)')
            gradient.addColorStop(1, 'rgba(48, 114, 208, .04)')

            this.chart = markRaw(new Chart(context, {
                type: 'line',
                data: {
                    labels: this.months,
                    datasets: [
                        {
                            label: String(new Date().getFullYear()),
                            data: [...this.monthlyValues],
                            borderColor: '#59e0e8',
                            backgroundColor: gradient,
                            borderWidth: 2,
                            pointRadius: 0,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: '#ffffff',
                            pointHoverBorderColor: '#59e0e8',
                            fill: true,
                            tension: 0.38,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index',
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            backgroundColor: '#0a1c35',
                            titleColor: '#91a8c7',
                            bodyColor: '#ffffff',
                            borderColor: 'rgba(104, 224, 235, .28)',
                            borderWidth: 1,
                            displayColors: false,
                            callbacks: {
                                label(context) {
                                    return new Intl.NumberFormat('uk-UA').format(context.parsed.y) + ' грн'
                                },
                            },
                        },
                    },
                    scales: {
                        x: {
                            border: {
                                display: false,
                            },
                            grid: {
                                display: false,
                            },
                            ticks: {
                                color: '#7388a8',
                                maxRotation: 0,
                                font: {
                                    size: this.compact ? 10 : 12,
                                },
                            },
                        },
                        y: {
                            beginAtZero: true,
                            border: {
                                display: false,
                            },
                            grid: {
                                color: 'rgba(132, 169, 208, .09)',
                            },
                            ticks: {
                                color: '#7388a8',
                                maxTicksLimit: this.compact ? 4 : 6,
                                callback(value) {
                                    if (Math.abs(value) >= 1000) return Math.round(value / 1000) + 'k'
                                    return value
                                },
                            },
                        },
                    },
                },
            }))
        },
    },
}
</script>
