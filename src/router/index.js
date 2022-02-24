import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router'
const player = () => import(/* webpackChunkName: "index-main" */ '@/pages/player/children/player')
const routes = [
    {
        path     : '/',
        component: player,
        name     : ''
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});


export default router;

