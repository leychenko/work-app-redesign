import axios from 'axios'

export const HTTP = axios.create({
   //  baseURL: `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json`,
    baseURL: `https://api.monobank.ua/bank/currency`,
})

