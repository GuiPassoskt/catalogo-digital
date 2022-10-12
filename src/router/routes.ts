import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'loginDefault', component: () => import('src/pages/user/Login.vue') },
      { path: 'login', name: 'login', component: () => import('src/pages/user/Login.vue') },
      { path: 'register', name: 'register', component: () => import('src/pages/user/Register.vue') },
      {
        path: 'email-confirmation',
        name: 'email-confirmation',
        component: () => import('src/pages/user/EmailConfirmation.vue'),
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('src/pages/user/ForgotPassword.vue'),
      },
      { path: 'reset-password', name: 'reset-password', component: () => import('src/pages/user/ResetPassword.vue') },
      { path: 'product-public/:id', name: 'product-public', component: () => import('pages/product/Public.vue') },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'me', name: 'me', component: () => import('src/pages/user/Me.vue') },
      { path: 'category', name: 'category', component: () => import('pages/category/List.vue') },
      { path: 'form-category/:id?', name: 'form-category', component: () => import('pages/category/Form.vue') },
      { path: 'product', name: 'product', component: () => import('pages/product/List.vue') },
      { path: 'form-product/:id?', name: 'form-product', component: () => import('pages/product/Form.vue') },
      { path: 'form-config/:id?', name: 'form-config', component: () => import('pages/config/Form.vue') },
      // { path: '', component: () => import('pages/Index.vue') }
    ],
    meta: {
      requiresAuth: true,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/error/Error404.vue'),
  },
];

export default routes;
