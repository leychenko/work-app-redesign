<template>
    <main-master-page>
        <template #main>
            <button-home-component />
            <section class="page-heading">
                <div>
                    <p class="eyebrow"><span></span> Акти</p>
                    <h1>Пошук за номером</h1>
                </div>
                <div class="page-heading__date">
                    <font-awesome-icon :icon="['fas', 'pen-to-square']" />
                    <span>Пошук та редагування</span>
                </div>
            </section>

            <div class="search-tabs">
                <router-link :to="{ name: 'payment-page' }">
                    <font-awesome-icon :icon="['fas', 'plus']" />
                    Новий акт
                </router-link>
                <router-link :to="{ name: 'searchForDate-page' }">
                    <font-awesome-icon :icon="['far', 'calendar']" />
                    За місяцем
                </router-link>
                <router-link :to="{ name: 'searchForNumberAct-page' }">
                    <font-awesome-icon :icon="['fas', 'hashtag']" />
                    За номером
                </router-link>
            </div>

            <div class="page-layout">
                <section class="glass-panel form-panel">
                    <div class="form-panel__header">
                        <div>
                            <h2>Знайти акт</h2>
                            <p>Введіть номер документа, щоб відкрити його дані.</p>
                        </div>
                        <span class="form-panel__number">LOOKUP</span>
                    </div>
                    <form class="form" @submit.prevent="searchNumberActs">
                        <div class="field">
                            <label for="act-number-search">Номер акта</label>
                            <input
                                id="act-number-search"
                                v-model="acts"
                                type="number"
                                min="0"
                                autocomplete="off"
                                placeholder="0000"
                            />
                        </div>
                        <div v-if="message" class="form-message">
                            <font-awesome-icon :icon="['fas', 'circle-info']" />
                            {{ message }}
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn">
                                Знайти
                                <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                            </button>
                            <button type="button" class="btn btn--secondary" @click="clear">Очистити</button>
                        </div>
                    </form>
                </section>

                <section class="glass-panel form-panel" :class="{ 'form-panel--muted': !hasAct }">
                    <div class="form-panel__header">
                        <div>
                            <h2>Дані акта</h2>
                            <p>Змініть потрібні поля та збережіть виправлення.</p>
                        </div>
                        <span class="form-panel__number">EDIT</span>
                    </div>

                    <div v-if="!hasAct" class="empty-state">
                        <div>
                            <font-awesome-icon :icon="['fas', 'file-circle-question']" />
                            <strong>Акт не вибрано</strong>
                            <span>Результат пошуку з’явиться у цій панелі.</span>
                        </div>
                    </div>

                    <form v-else class="form" @submit.prevent="updateData">
                        <div class="form-grid form-grid--two">
                            <div class="field">
                                <label for="edit-act-date">Дата акта</label>
                                <input id="edit-act-date" v-model.trim="actObj.date" type="text" placeholder="ДД.ММ.РРРР" />
                            </div>
                            <div class="field">
                                <label for="edit-act-number">Номер акта</label>
                                <input id="edit-act-number" v-model.number="actObj.number" type="number" />
                            </div>
                            <div class="field">
                                <label for="edit-act-sum">Сума</label>
                                <input id="edit-act-sum" v-model.number="actObj.sum" type="number" min="0" />
                            </div>
                            <div class="field">
                                <label for="edit-act-payment-date">Дата оплати</label>
                                <input
                                    id="edit-act-payment-date"
                                    v-model.trim="actObj.cashDay"
                                    type="text"
                                    placeholder="ДД.ММ.РРРР"
                                />
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn">
                                Зберегти зміни
                                <font-awesome-icon :icon="['fas', 'check']" />
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </template>
    </main-master-page>
</template>

<script>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import ButtonHomeComponent from '@/components/ButtonHomeComponent.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'SearchForNumberAct',
    components: {
        MainMasterPage,
        ButtonHomeComponent,
    },
    data() {
        return {
            acts: null,
            actObj: {},
            message: null,
        }
    },
    computed: {
        ...mapGetters('paymentList', ['getList']),
        hasAct() {
            return Boolean(this.actObj && this.actObj.id)
        },
    },
    mounted() {
        this.loadPaymentList()
    },
    methods: {
        ...mapActions('paymentList', ['loadPaymentList', 'updateItem']),
        searchNumberActs() {
            this.message = null
            if (this.acts === null || this.acts === '') {
                this.message = 'Введіть номер акта'
                return
            }
            const result = this.getList.find((item) => String(item.number) === String(this.acts))
            this.actObj = result ? { ...result } : {}
            this.message = result ? null : 'Акт із таким номером не знайдено'
        },
        updateData() {
            if (!this.hasAct) return
            const itemId = this.actObj.id
            const data = {
                date: this.actObj.date || '',
                number: Number(this.actObj.number),
                sum: Number(this.actObj.sum),
                cashDay: this.actObj.cashDay || '',
            }
            this.updateItem({ itemId, data })
            this.actObj = {}
            this.acts = null
            this.message = 'Зміни передано на збереження'
        },
        clear() {
            this.actObj = {}
            this.acts = null
            this.message = null
        },
    },
}
</script>
