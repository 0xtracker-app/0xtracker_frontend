import Vue from "vue";
import VueRouter from "vue-router";
import DashboardLayout from "../views/Layout/DashboardLayout.vue";
import SinglePageLayout from "@/views/Layout/SinglePageLayout";

// Dashboard pages
const Dashboard = () => import("../views/Dashboard/Dashboard.vue");

// Pages
const Home = () =>
  import(/* webpackChunkName: "pages" */ "@/views/Pages/Home.vue");
const Settings = () =>
  import(/* webpackChunkName: "pages" */ "@/views/Pages/Settings.vue");

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
        component: Dashboard,
      },
      {
        path: "/portfolio/",
        name: "Portfolio",
        component: Dashboard,
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
