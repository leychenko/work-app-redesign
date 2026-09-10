<template>
    <section class="glass-panel weather-panel">
        <div class="weather-panel__top">
            <div>
                <p class="panel-kicker">Погода зараз</p>
                <h2>{{ weather.location || 'Київ' }}</h2>
            </div>
            <span class="weather-panel__time">{{ currentTime }}</span>
        </div>

        <div class="weather-panel__main">
            <div class="weather-panel__temperature">
                <strong>{{ displayTemperature }}</strong>
                <span>°</span>
            </div>
            <div class="weather-panel__condition">
                <img v-if="weatherIcon" :src="weatherIcon" alt="" />
                <font-awesome-icon v-else :icon="['fas', 'cloud-sun']" />
                <span>{{ statusLabel }}</span>
            </div>
        </div>

        <div class="weather-panel__footer">
            <span>Відчувається як</span>
            <strong>{{ displayFeelsLike }}°</strong>
        </div>
    </section>
</template>

<script>
import { getWeatherInfo } from '@/store/helpers/globalFunction'

export default {
    name: 'WeatherComponent',
    data() {
        return {
            weather: {},
            currentTime: '',
            clockTimer: null,
        }
    },
    computed: {
        weatherIcon() {
            return this.weather.weatherIcon
                ? 'https://openweathermap.org/img/wn/' + this.weather.weatherIcon + '@2x.png'
                : ''
        },
        displayTemperature() {
            const value = this.weather.temp
            return value !== null && value !== undefined && Number.isFinite(Number(value))
                ? Math.round(Number(value))
                : '—'
        },
        displayFeelsLike() {
            const value = this.weather.feelsLike
            return value !== null && value !== undefined && Number.isFinite(Number(value))
                ? Math.round(Number(value))
                : '—'
        },
        statusLabel() {
            const statuses = {
                Clear: 'Ясно',
                Clouds: 'Хмарно',
                Rain: 'Дощ',
                Drizzle: 'Мряка',
                Snow: 'Сніг',
                Thunderstorm: 'Гроза',
                Mist: 'Туман',
                Fog: 'Туман',
            }
            return statuses[this.weather.weatherStatus] || this.weather.weatherStatus || 'Дані оновлюються'
        },
    },
    async mounted() {
        this.updateClock()
        this.clockTimer = window.setInterval(this.updateClock, 30000)
        this.weather = await getWeatherInfo()
    },
    beforeUnmount() {
        window.clearInterval(this.clockTimer)
    },
    methods: {
        updateClock() {
            this.currentTime = new Intl.DateTimeFormat('uk-UA', {
                hour: '2-digit',
                minute: '2-digit',
            }).format(new Date())
        },
    },
}
</script>
