<template>
    <main-master-page>
        <template #main>
            <button-home-component />
            <section class="page-heading">
                <div>
                    <p class="eyebrow"><span></span> База декларацій</p>
                    <h1>Пошук товару</h1>
                </div>
                <div class="page-heading__date">
                    <font-awesome-icon :icon="['fas', 'box-archive']" />
                    <span>{{ getItemsList.length }} записів</span>
                </div>
            </section>

            <div class="search-tabs">
                <router-link :to="{ name: 'info' }">
                    <font-awesome-icon :icon="['fas', 'wallet']" />
                    Фінанси
                </router-link>
                <router-link :to="{ name: 'searchDecl' }">
                    <font-awesome-icon :icon="['fas', 'box-archive']" />
                    Декларації
                </router-link>
                <router-link :to="{ name: 'searchForDate-page' }">
                    <font-awesome-icon :icon="['fas', 'receipt']" />
                    Акти
                </router-link>
            </div>

            <section class="glass-panel form-panel">
                <div class="form-panel__header">
                    <div>
                        <h2>Назва товару</h2>
                        <p>Введіть точну назву, під якою товар був збережений у декларації.</p>
                    </div>
                    <span class="form-panel__number">SEARCH</span>
                </div>
                <form class="form" @submit.prevent="filteredData">
                    <div class="field">
                        <label for="declaration-search">Назва товару</label>
                        <input
                            id="declaration-search"
                            v-model.trim="title"
                            type="text"
                            autocomplete="off"
                            placeholder="Введіть назву"
                        />
                    </div>
                    <div v-if="message" class="form-message">
                        <font-awesome-icon :icon="['fas', 'circle-info']" />
                        {{ message }}
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn">
                            Знайти декларації
                            <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                        </button>
                        <button type="button" class="btn btn--secondary" @click="clear">Очистити</button>
                    </div>
                </form>
            </section>

            <section v-if="hasSearched" class="glass-panel results-panel">
                <div class="results-panel__head">
                    <h2>Результати пошуку</h2>
                    <span>{{ getFilteredList.length }} записів</span>
                </div>
                <div v-if="getFilteredList.length" class="table-scroll">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Назва товару</th>
                                <th>Номер декларації</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in getFilteredList" :key="item.id">
                                <td>{{ item.date || '—' }}</td>
                                <td>{{ item.title || '—' }}</td>
                                <td class="data-table__money">{{ item.number || '—' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="empty-state">
                    <div>
                        <font-awesome-icon :icon="['fas', 'box-open']" />
                        <strong>Декларацій не знайдено</strong>
                        <span>Перевірте написання назви товару.</span>
                    </div>
                </div>
            </section>
        </template>
    </main-master-page>
</template>

<script>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import ButtonHomeComponent from '@/components/ButtonHomeComponent.vue'
import { sortData } from '@/store/helpers/globalFunction'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'SearchDeclarationComponent',
    components: {
        MainMasterPage,
        ButtonHomeComponent,
    },
    data() {
        return {
            title: '',
            message: null,
            hasSearched: false,
        }
    },
    computed: {
        ...mapGetters('declarationData', ['getFilteredDeclarationList', 'getItemsList']),
        getFilteredList() {
            return sortData(this.getFilteredDeclarationList || [])
        },
    },
    created() {
        this.loadList()
    },
    methods: {
        ...mapActions('declarationData', ['loadFilteredList', 'loadList', 'clearFilteredList']),
        async filteredData() {
            this.message = null
            if (!this.title) {
                this.message = 'Введіть назву товару'
                return
            }
            await this.loadFilteredList({
                fieldTitle: 'title',
                compareOperator: '==',
                valueToCompare: this.title,
            })
            this.hasSearched = true
            this.message = this.getFilteredDeclarationList.length ? null : 'За цією назвою нічого не знайдено'
        },
        clear() {
            this.title = ''
            this.message = null
            this.hasSearched = false
            this.clearFilteredList()
        },
    },
}
</script>
