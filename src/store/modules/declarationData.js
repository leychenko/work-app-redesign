import DbOperations from '../helpers/DbOperations'

const collectionDB = new DbOperations('declarationData')

export default {
    namespaced: true,
    state: () => ({
        declarationList: [],
        filteredList: [],
        loading: false,
        isLoaded: false,
        error: null,
    }),
    getters: {
        isLoading: (state) => state.loading,
        hasError: (state) => state.error,
        getItemsList: (state) => state.declarationList,
        getItemCurrent: (state) => (title) => state.declarationList.filter((item) => item.title === title),
        getItemById: (state) => (itemId) => state.declarationList.find((item) => item.id == itemId),
        getFilteredDeclarationList: (state) => state.filteredList,
    },
    mutations: {
        setItemsList(state, itemsList) {
            state.declarationList = Array.isArray(itemsList) ? itemsList : []
        },
        setFilteredList(state, itemsList) {
            state.filteredList = Array.isArray(itemsList) ? itemsList : []
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
            if (state.isLoaded && state.declarationList.length) return Promise.resolve(state.declarationList)
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
                .addItem(item)
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
                    commit('setFilteredList', list)
                    return list
                })
                .catch((error) => {
                    commit('setError', error)
                    commit('setFilteredList', [])
                    return []
                })
                .finally(() => {
                    commit('setLoading', false)
                })
        },
        clearFilteredList({ commit }) {
            commit('setFilteredList', [])
        },
    },
}
