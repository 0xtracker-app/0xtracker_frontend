import Vue from "vue";
import VueRouter from "vue-router";
import DashboardLayout from "../views/Layout/DashboardLayout.vue";

// Dashboard pages
const Portfolio = () => import("../views/Dashboard/Portfolio.vue");
const SupportedNetworksAndFarms = () =>
  import("../views/Dashboard/SupportedNetworksAndFarms.vue");
const Rev0x = () => import("../views/Dashboard/Rev0x.vue");
const EditProfile = () => import("../views/Dashboard/Profiles.vue");
const Settings = () => import("../views/Dashboard/Settings.vue");
const DataCleaner = () => import("../views/Dashboard/DataCleaner.vue");
const Bridge = () => import("../views/Dashboard/Bridge.vue");
const Beacon = () => import("../views/Dashboard/Beacon.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dashboard",
    redirect: "/portfolio",
    component: DashboardLayout,
    children: [
      {
        path: "/portfolio/:wallet",
        name: "Portfolio - Wallet Address",
        component: Portfolio,
      },
      {
        path: "/portfolio",
        name: "Portfolio",
        component: Portfolio,
      },
      {
        path: "/farms",
        name: "Supported Networks and Farms",
        component: SupportedNetworksAndFarms,
      },
      {
        path: "/rev0x",
        name: "Rev0x",
        component: Rev0x,
      },
      {
        path: "/profiles",
        name: "Profiles",
        component: Settings,
      },
      {
        path: "/profiles/:id",
        name: "Edit Profile",
        component: EditProfile,
      },
      {
        path: "/cleaner",
        name: "Clean Historical Data",
        component: DataCleaner,
      },
      {
        path: "/0xbridge",
        name: "0xBridge",
        component: Bridge,
      },
      {
        path: "/beacon",
        name: "Beacon",
        component: Beacon,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
