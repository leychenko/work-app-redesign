import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/addDeclaration',
        name: 'addDeclaration',
        component: () => import(/* webpackChunkName: "addDeclaration" */ '../views/AddDeclarationView.vue'),
    },
    {
        path: '/data-page',
        name: 'data-page',
        component: () => import(/* webpackChunkName: "data-page" */ '../views/DataPageView.vue'),
    },
    {
        path: '/payment-page',
        name: 'payment-page',
        component: () => import(/* webpackChunkName: "data-page" */ '../views/PaymentView.vue'),
        //   children: {
        //       path: '/searchForDate-page',
        //       name: 'searchForDate-page',
        //   },
    },
    {
        path: '/searchForDate-page',
        name: 'searchForDate-page',
        component: () => import(/* webpackChunkName: "data-page" */ '../components/SearchForYearActComponent.vue'),
    },
    {
        path: '/searchForNumberAct-page',
        name: 'searchForNumberAct-page',
        component: () => import(/* webpackChunkName: "data-page" */ '../components/SearchForNumberAct.vue'),
    },
    {
        path: '/bonus',
        name: 'bonus',
        component: () => import(/* webpackChunkName: "data-page" */ '../views/BonusView.vue'),
    },

    {
        path: '/info',
        name: 'info',
        component: () => import(/* webpackChunkName: "data-page" */ '../views/SearchPageView.vue'),
    },
    {
        path: '/searchDecl',
        name: 'searchDecl',
        component: () => import(/* webpackChunkName: "data-page" */ '../views/SearchDeclarationView.vue'),
    },
    {
        path: '/chartPage',
        name: 'chartPage',
        component: () => import(/* webpackChunkName: "data-page" */ '../views/ChartInfoView.vue'),
    },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
