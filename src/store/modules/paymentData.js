import DbOperations from '../helpers/DbOperations'
import { getSalaryPerMonth, searchPaymentList, test2, getInfo } from '@/store/helpers/globalFunction.js'

const collectionDB = new DbOperations('paymentList')

export default {
    namespaced: true,
    state: () => ({
        paymentObjList: [],
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
        currency: [],
        tax: {
            tax2024: 0.05,
            tax2025: 0.06,
        },
        loading: false,
        isLoaded: false,
        error: null,
    }),
    getters: {
        getTargetYear: (state) => state.targetYear,
        getTaxForMonth: (state) => getInfo(state.paymentObjList, 'sum', state.tax),
        getAllTaxForThreeMonth: (state) => test2(state.paymentObjList, 'sum', state.tax),
        getDataForMonth: (state) => (data) => searchPaymentList(state.paymentObjList, 'date', data),
        getFilteredList: (state) => state.filteredList,
        hasError: (state) => state.error,
        getMonthList: (state) => state.monthList,
        getItemById: (state) => (itemId) => state.paymentObjList.find((item) => item.id == itemId),
        getTotalSum: (state) =>
            state.paymentObjList.reduce((total, item) => total + (Number(item.sum) || 0), 0),
        getCurrency: (state) => state.currency,
        getList: (state) => state.paymentObjList,
        getSalaryPerMonthMoney: (state) => (val) => getSalaryPerMonth(state.paymentObjList, 'sum', val),
    },
    mutations: {
        setItemsList(state, itemsList) {
            state.paymentObjList = Array.isArray(itemsList) ? itemsList : []
        },
        setItemFilteredList(state, itemsList) {
            state.filteredList = itemsList
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
        loadPaymentList({ commit, state }) {
            if (state.isLoaded && state.paymentObjList.length) return Promise.resolve(state.paymentObjList)
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
        addItem({ commit, dispatch }, item) {
            commit('setError', null)
            commit('setLoading', true)
            return collectionDB
                .addItem({
                    month: new Date().getMonth() + 1,
                    ...item,
                })
                .then(() => dispatch('loadPaymentList'))
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
                .then(() => dispatch('loadPaymentList'))
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
                .then(() => dispatch('loadPaymentList'))
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
                    commit('setItemFilteredList', list)
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
