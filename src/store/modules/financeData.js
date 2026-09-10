import DbOperations from '../helpers/DbOperations'
import { HTTP } from '@/store/helpers/http-common.js'
import {
    getInfo,
    test,
    getSalaryPerMonth,
    searchPaymentList,
    getMySalary,
} from '@/store/helpers/globalFunction.js'

const collectionDB = new DbOperations('financeData')

export default {
    namespaced: true,
    state: () => ({
        financeObjList: [],
        monthList: [
            'Січень',
            'Лютий',
            'Березень',
            'Квітень',
            'Травень',
            'Червень',
            'Липень',
            'Серпень',
            'Вересень',
            'Жовтень',
            'Листопад',
            'Грудень',
        ],
        filteredList: null,
        targetYear: new Date().getFullYear(),
        targetMonth: new Date().getMonth() + 1,
        tax: {
            tax2024: 0.05,
            tax2025: 0.06,
        },
        dayBonus: 1000,
        nightBonus: 1000,
        currency: [],
        loading: false,
        isLoaded: false,
        error: null,
    }),
    getters: {
        getTargetYear: (state) => state.targetYear,
        getList: (state) => (data) => searchPaymentList(state.financeObjList, 'date', data),
        getTaxForThreeMonth: (state) => test(state.financeObjList, 'sum', state.tax),
        getFilteredList: (state) => state.filteredList,
        getTotalTaxValue: (state) => getInfo(state.financeObjList, 'sum', state.tax),
        getDayBonusSum: (state) => getMySalary(state.financeObjList, 'dayDeclaration', state.dayBonus),
        getNightBonusSum: (state) => getMySalary(state.financeObjList, 'nightDeclaration', state.nightBonus),
        getSalary: (state) => getMySalary(state.financeObjList, 'sum', 1),
        getTotalSum: (state) =>
            state.financeObjList.reduce((total, item) => total + (Number(item.sum) || 0), 0),
        hasError: (state) => state.error,
        getMonthList: (state) => state.monthList,
        getItemsListFinance: (state) => state.financeObjList,
        getItemById: (state) => (itemId) => state.financeObjList.find((item) => item.id == itemId),
        getCorrectCurrency: (state) => state.currency,
        getCurrency: (state) => state.currency,
        getTest: (state) => state.financeObjList,
        getSalaryPerMonthMoney: (state) => (val) => getSalaryPerMonth(state.financeObjList, 'sum', val),
    },
    mutations: {
        setItemsList(state, itemsList) {
            state.financeObjList = Array.isArray(itemsList) ? itemsList : []
        },
        setItemFilteredList(state, itemsList) {
            state.filteredList = itemsList
        },
        setCurrency(state, currency) {
            state.currency = Array.isArray(currency) ? currency : []
        },
        setLoading(state, value) {
            state.loading = value
        },
        setError(state, error) {
            state.error = error
        },
        setLoaded(state, value) {
            state.isLoaded = value
        },
    },
    actions: {
        loadList({ commit, state }) {
            if (state.isLoaded && state.financeObjList.length) return Promise.resolve(state.financeObjList)
            commit('setError', null)
            commit('setLoading', true)
            return collectionDB
                .loadItemsList()
                .then((list) => {
                    commit('setItemsList', list)
                    commit('setLoaded', true)
                    return list
                })
                .catch((error) => {
                    commit('setError', error)
                    return []
                })
                .finally(() => {
                    commit('setLoading', false)
                })
        },
        loadCurrency({ commit, state }) {
            if (state.currency.length) return Promise.resolve(state.currency)
            return HTTP.get()
                .then((response) => {
                    const currency = Array.isArray(response.data) ? response.data : []
                    commit('setCurrency', currency)
                    return currency
                })
                .catch(() => {
                    commit('setCurrency', [])
                    return []
                })
        },
        addItem({ commit, dispatch }, item) {
            commit('setError', null)
            commit('setLoading', true)
            return collectionDB
                .addItem({
                    month: new Date().getMonth() + 1,
                    date: new Date().toLocaleDateString('uk-UA'),
                    ...item,
                })
                .then(() => dispatch('loadList'))
                .catch((error) => {
                    commit('setError', error)
                    return false
                })
                .finally(() => {
                    commit('setLoading', false)
                })
        },
        deleteItem({ commit, dispatch }, itemId) {
            commit('setError', null)
            commit('setLoading', true)
            return collectionDB
                .deleteItem(itemId)
                .then(() => dispatch('loadList'))
                .catch((error) => {
                    commit('setError', error)
                    return false
                })
                .finally(() => {
                    commit('setLoading', false)
                })
        },
        updateItem({ commit, dispatch }, { itemId, data }) {
            commit('setError', null)
            commit('setLoading', true)
            return collectionDB
                .updateItem(itemId, data)
                .then(() => dispatch('loadList'))
                .catch((error) => {
                    commit('setError', error)
                    return false
                })
                .finally(() => {
                    commit('setLoading', false)
                })
        },
        loadFilteredList({ commit }, { fieldTitle, compareOperator, valueToCompare }) {
            commit('setError', null)
            commit('setLoading', true)
            return collectionDB
                .loadFilteredData(fieldTitle, compareOperator, valueToCompare)
                .then((list) => {
                    commit('setItemsList', list)
                    commit('setLoaded', true)
                    return list
                })
                .catch((error) => {
                    commit('setError', error)
                    return []
                })
                .finally(() => {
                    commit('setLoading', false)
                })
        },
    },
}
