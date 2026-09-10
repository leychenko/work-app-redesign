import { createStore } from 'vuex'
import declarationData from '@/store/modules/declarationData.js'
import financeData from '@/store/modules/financeData.js'
import paymentList from '@/store/modules/paymentData'

export default createStore({
    state: {
        loading: false,
        error: null,
    },
    getters: {
        isLoading: (state) => {
            return Boolean(
                state.loading ||
                    state.declarationData.loading ||
                    state.financeData.loading ||
                    state.paymentList.loading
            )
        },
        hasError: (state) => {
            return state.error || state.declarationData.error || state.financeData.error || state.paymentList.error
        },
    },
    mutations: {
        setLoading(state, value) {
            state.loading = value
        },
        setError(state, error) {
            state.error = error
        },
    },
    actions: {
        startLoading({ commit }) {
            commit('setLoading', true)
            commit('setError', null)
        },
        setError({ commit }, error) {
            commit('setError', error)
        },
        async generalApiOperation({ commit, dispatch }, { operation, successCallback, errorCallBack }) {
            dispatch('startLoading')
            try {
                const response = await operation()
                if (successCallback) successCallback(response)
                return response
            } catch (error) {
                commit('setError', error)
                if (errorCallBack) errorCallBack(error)
                return null
            } finally {
                commit('setLoading', false)
            }
        },
    },
    modules: {
        declarationData,
        financeData,
        paymentList,
    },
})
