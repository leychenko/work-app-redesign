function asList(value) {
    return Array.isArray(value) ? value : []
}

function asNumber(value) {
    const number = Number(value)
    return Number.isFinite(number) ? number : 0
}

function parseDate(value) {
    if (typeof value !== 'string') return null
    const match = value.trim().match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/)
    if (!match) return null
    return {
        day: Number(match[1]),
        month: Number(match[2]),
        year: Number(match[3]),
    }
}

function isPeriod(value, month, year) {
    const date = parseDate(value)
    return Boolean(date && date.month === Number(month) && date.year === Number(year))
}

function sumBy(list, title) {
    return asList(list).reduce((total, item) => total + asNumber(item && item[title]), 0)
}

function taxRateForYear(tax, year) {
    if (!tax || typeof tax !== 'object') return asNumber(tax)
    return Number(year) >= 2025 ? asNumber(tax.tax2025) : asNumber(tax.tax2024)
}

function currentPeriod() {
    const now = new Date()
    return {
        month: now.getMonth() + 1,
        year: now.getFullYear(),
    }
}

export function getInfo(arr, titleVal, val) {
    const period = currentPeriod()
    const rate = taxRateForYear(val, period.year)
    const correctMonth = asList(arr).filter((item) => isPeriod(item && item.date, period.month, period.year))
    const correctTaxForMonth = asList(arr).filter((item) =>
        isPeriod(item && item.cashDay, period.month, period.year)
    )

    return {
        resultCorrectMonth: Math.ceil(sumBy(correctMonth, titleVal) * rate),
        resultCorrectTaxForMonth: Math.ceil(sumBy(correctTaxForMonth, titleVal) * rate),
    }
}

export function getMySalary(arr, titleVal, val) {
    const period = currentPeriod()
    const correctMonth = asList(arr).filter((item) => isPeriod(item && item.date, period.month, period.year))
    return Math.ceil(sumBy(correctMonth, titleVal) * asNumber(val))
}

export function getSalaryPerMonth(arr, titleVal, val) {
    const year = new Date().getFullYear()
    const correctMonth = asList(arr).filter((item) => isPeriod(item && item.date, val, year))
    return Math.ceil(sumBy(correctMonth, titleVal))
}

export function test(arr, titleVal, val) {
    const period = currentPeriod()
    const quarterStart = Math.floor((period.month - 1) / 3) * 3 + 1
    const result = asList(arr).filter((item) => {
        const date = parseDate(item && item.date)
        return Boolean(
            date &&
                date.year === period.year &&
                date.month >= quarterStart &&
                date.month <= quarterStart + 2
        )
    })
    return Math.ceil(sumBy(result, titleVal) * taxRateForYear(val, period.year))
}

export function searchPaymentList(arr, titleVal, data) {
    if (!data) return []
    return asList(arr).filter((item) => isPeriod(item && item[titleVal], data.date, data.year))
}

export function sortData(arr) {
    return [...asList(arr)].sort((first, second) => {
        const firstDate = parseDate(first && first.date)
        const secondDate = parseDate(second && second.date)
        if (!firstDate && !secondDate) return 0
        if (!firstDate) return 1
        if (!secondDate) return -1
        const firstValue = firstDate.year * 10000 + firstDate.month * 100 + firstDate.day
        const secondValue = secondDate.year * 10000 + secondDate.month * 100 + secondDate.day
        return secondValue - firstValue
    })
}

export async function getWeatherInfo() {
    const server =
        'https://api.openweathermap.org/data/2.5/weather?units=metric&q=Kyiv&appid=fb85ba079f55e0cb44d67f9451503453'

    try {
        const response = await fetch(server, { method: 'GET' })
        if (!response.ok) throw new Error('Weather request failed')
        return getWeather(await response.json())
    } catch (error) {
        return {
            location: 'Київ',
            temp: null,
            feelsLike: null,
            weatherStatus: '',
            weatherIcon: '',
        }
    }
}

function getWeather(data) {
    return {
        location: data && data.name ? data.name : 'Київ',
        temp: Math.round(asNumber(data && data.main && data.main.temp)),
        feelsLike: Math.round(asNumber(data && data.main && data.main.feels_like)),
        weatherStatus:
            data && Array.isArray(data.weather) && data.weather[0] ? data.weather[0].main : '',
        weatherIcon:
            data && Array.isArray(data.weather) && data.weather[0] ? data.weather[0].icon : '',
    }
}

export function test2(arr, titleVal, val) {
    const period = currentPeriod()
    const quarterStart = Math.floor((period.month - 1) / 3) * 3 + 1
    const result = asList(arr).filter((item) => {
        const date = parseDate(item && item.cashDay)
        return Boolean(
            date &&
                date.year === period.year &&
                date.month >= quarterStart &&
                date.month <= quarterStart + 2
        )
    })
    return Math.ceil(sumBy(result, titleVal) * taxRateForYear(val, period.year))
}
