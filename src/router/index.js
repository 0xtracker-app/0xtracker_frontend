import Vue from "vue";
import VueRouter from "vue-router";
import DashboardLayout from "../views/Layout/DashboardLayout.vue";
import SinglePageLayout from "@/views/Layout/SinglePageLayout";

// Dashboard pages
const Portfolio = () => import("../views/Dashboard/Portfolio.vue");
const Farms = () => import("../views/Dashboard/FarmsAll.vue");
const Settings = () => import("../views/Dashboard/Settings.vue");

// Pages
const Home = () => import(/* webpackChunkName: "pages" */ "@/views/Pages/Home.vue");

Vue.use(VueRouter);

let singlePages = {
  path: "/",
  component: SinglePageLayout,
  name: "SinglePage",
  children: [
    {
      path: "/home",
      name: "Home",
      component: Home,
    },
  ],
};

const routes = [
  {
    path: "/",
    name: "Dashboard",
    redirect: "/home",
    component: DashboardLayout,
    children: [
      {
        path: "/portfolio/:wallet",
        name: "Portfolio",
        component: Portfolio,
      },
      {
        path: "/portfolio/",
        name: "Portfolio",
        component: Portfolio,
      },
      {
        path: "/farms",
        name: "Farms",
        component: Farms,
        meta: {
          groupName: "Dashboards",
        },
      },
      {
        path: "/settings",
        name: "Settings",
        component: Settings,
        meta: {
          groupName: "Dashboards",
        },
      },
    ],
  },
  singlePages,
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
