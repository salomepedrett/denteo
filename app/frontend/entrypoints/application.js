// To see this message, add the following to the `<head>` section in your
// views/layouts/application.html.erb
//
//    <%= vite_client_tag %>
//    <%= vite_javascript_tag 'application' %>
console.log('Vite ⚡️ Rails')

// If using a TypeScript entrypoint file:
//     <%= vite_typescript_tag 'application' %>
//
// If you want to use .jsx or .tsx, add the extension:
//     <%= vite_javascript_tag 'application.jsx' %>

console.log('Visit the guide for more information: ', 'https://vite-ruby.netlify.app/guide/rails')

// Example: Load Rails libraries in Vite.
//
// import * as Turbo from '@hotwired/turbo'
// Turbo.start()
//
// import ActiveStorage from '@rails/activestorage'
// ActiveStorage.start()
//
// // Import all channels.
// const channels = import.meta.globEager('./**/*_channel.js')

// Example: Import a stylesheet in app/frontend/index.css
// import '~/index.css'


import { createApp } from "vue";       
// https://vueschool.io/lessons/installing-and-setting-up-vue-router-with-vite-vite-only
import { createRouter, createWebHistory } from "vue-router/dist/vue-router.esm-bundler.js";
import App from "../App.vue";          
import Home from "../components/Home.vue"
import Slots from "../components/Slots.vue"


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: "/", name: "Home", component: Home},
    {path: "/slots", name: "Slots", component: Slots}
  ]
})

createApp(App)
  .use(router)
  .mount('#app');          


