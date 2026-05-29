import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['my-test-module'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  myTestModule: {},
  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      fs: {
        allow: ['..'] // Autorise Vite à scanner en dehors du dossier playground
      }
    }
  },
  css: ['~/assets/css/main.css'],
})
