<template>
    <main-master-page>
        <template #main>
            <button-home-component />
            <section class="page-heading">
                <div>
                    <p class="eyebrow"><span></span> Декларації</p>
                    <h1>Новий товар</h1>
                </div>
                <div class="page-heading__date">
                    <font-awesome-icon :icon="['fas', 'database']" />
                    <span>{{ getItemsList.length }} записів</span>
                </div>
            </section>

            <div class="page-layout">
                <section class="glass-panel form-panel">
                    <div class="form-panel__header">
                        <div>
                            <h2>Додати декларацію</h2>
                            <p>Вкажіть назву товару, номер декларації та дату оформлення.</p>
                        </div>
                        <span class="form-panel__number">01 / 03</span>
                    </div>

                    <form class="form" @submit.prevent="addNewDecl">
                        <div class="form-grid form-grid--two">
                            <div class="field field--wide">
                                <label for="declaration-title">Назва товару</label>
                                <input
                                    id="declaration-title"
                                    v-model.trim="declaration.title"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="Наприклад: електроніка"
                                />
                            </div>
                            <div class="field">
                                <label for="declaration-number">Номер декларації</label>
                                <input
                                    id="declaration-number"
                                    v-model.trim="declaration.number"
                                    type="text"
                                    autocomplete="off"
                                    placeholder="UA-000000"
                                />
                            </div>
                            <div class="field">
                                <label for="declaration-date">Дата</label>
                                <input
                                    id="declaration-date"
                                    v-model.trim="declaration.date"
                                    type="text"
                                    inputmode="numeric"
                                    autocomplete="off"
                                    placeholder="ДД.ММ.РРРР"
                                />
                            </div>
                        </div>

                        <div v-if="message" class="form-message">
                            <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
                            {{ message }}
                        </div>
                        <div v-if="successMessage" class="form-message success-message">
                            <font-awesome-icon :icon="['fas', 'circle-check']" />
                            {{ successMessage }}
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn">
                                Зберегти декларацію
                                <font-awesome-icon :icon="['fas', 'arrow-right']" />
                            </button>
                            <button type="button" class="btn btn--secondary" @click="clearForm">Очистити</button>
                        </div>
                    </form>
                </section>

                <aside class="glass-panel side-panel">
                    <span class="side-panel__icon"><font-awesome-icon :icon="['fas', 'file-shield']" /></span>
                    <h2>Дані декларації</h2>
                    <p>Після збереження запис одразу з’явиться у загальній базі та буде доступний через пошук товарів.</p>
                    <div class="side-list">
                        <div class="side-list__item">
                            <span>Поля для заповнення</span>
                            <strong>3</strong>
                        </div>
                        <div class="side-list__item">
                            <span>Формат дати</span>
                            <strong>ДД.ММ.РРРР</strong>
                        </div>
                        <div class="side-list__item">
                            <span>Збереження</span>
                            <strong>Firebase</strong>
                        </div>
                    </div>
                </aside>
            </div>
        </template>
    </main-master-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import ButtonHomeComponent from '@/components/ButtonHomeComponent.vue'

export default {
    name: 'AddDeclarationView',
    components: {
        MainMasterPage,
        ButtonHomeComponent,
    },
    data() {
        return {
            message: null,
            successMessage: null,
            declaration: {},
        }
    },
    computed: {
        ...mapGetters('declarationData', ['getItemsList']),
    },
    created() {
        this.loadList()
    },
    methods: {
        ...mapActions('declarationData', ['addItem', 'loadList']),
        addNewDecl() {
            this.message = null
            this.successMessage = null
            if (!this.declaration.title || !this.declaration.number || !this.declaration.date) {
                this.message = 'Будь ласка, заповніть усі поля'
                return
            }
            this.addItem({ ...this.declaration })
            this.declaration = {}
            this.successMessage = 'Декларацію передано на збереження'
        },
        clearForm() {
            this.declaration = {}
            this.message = null
            this.successMessage = null
        },
    },
}
</script>
