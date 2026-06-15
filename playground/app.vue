<template>
  <div class="min-h-screen p-8 bg-[#F4F5F7] text-slate-800 font-sans flex flex-col gap-12">
    
    <section>
      <h1 class="mb-6 text-2xl font-extrabold text-slate-800">1. Tableau à 2 niveaux (Kanban)</h1>

      <TestDraggableList 
        group="columns"
        orientation="horizontal" :list="board" 
        wrapperClass="pb-4 overflow-x-auto"
        listClass="flex gap-6 items-start"
      >
        <template #indicator>
          <div class="w-full h-1 bg-blue-500 rounded-full shadow-lg"></div>
        </template>

        <template #item="{ item: column, isDragged: isColDragged }">
          <div 
            class="flex flex-col w-80 shrink-0 bg-[#EBECF0] rounded-xl cursor-grab transition-all duration-200"
            :class="isColDragged ? 'opacity-40 rotate-2 shadow-xl ring-2 ring-gray-400' : 'shadow-sm'"
          >
            <div class="px-4 py-3 bg-[#EBECF0] rounded-t-xl flex justify-between items-center">
              <h2 class="text-sm font-bold text-slate-700">{{ column.title }}</h2>
              <span class="flex items-center justify-center w-6 h-6 text-xs font-bold bg-slate-300 text-slate-600 rounded-full">
                {{ column.tasks?.length || 0 }}
              </span>
            </div>

            <TestDraggableList 
  group="tasks"
  :list="column.tasks || []" 
  wrapperClass="px-2 pb-2 min-h-[80px] rounded-b-xl"
  listClass="flex flex-col gap-2"
  dropTargetClass="bg-blue-50/40"
>
  <template #indicator>
    <div class="w-full h-16 bg-slate-200/50 border-2 border-dashed border-slate-400 rounded-lg"></div>
  </template>

  <template #item="{ item: task, isDragged: isTaskDragged }">
    <div 
      class="bg-white p-3 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:bg-slate-50 transition-all"
      :class="isTaskDragged ? 'h-0 p-0 border-0 opacity-0 overflow-hidden m-0' : 'h-auto'"
    >
      <div class="text-sm text-slate-800 pointer-events-none">{{ task.text }}</div>
      <div class="flex items-center justify-between mt-3 pointer-events-none">
        <span class="text-[10px] font-bold text-slate-400 uppercase">#{{ task.id }}</span>
        <div class="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">ME</div>
      </div>
    </div>
  </template>

  <template #empty="{ isDropTarget }">
    <div 
      class="flex items-center justify-center h-20 mt-2 text-xs font-bold transition-colors border-2 border-dashed rounded-lg"
      :class="isDropTarget ? 'border-blue-400 text-blue-500 bg-blue-50/50' : 'border-slate-300 text-slate-400'"
    >
      Déposer une tâche ici
    </div>
  </template>
</TestDraggableList>
          </div>
        </template>
      </TestDraggableList>
    </section>

    <hr class="border-slate-300" />

    <section>
      <h1 class="mb-6 text-2xl font-extrabold text-slate-800">2. Liste à 1 niveau (Ordonnancement)</h1>
      
      <TestDraggableList 
        group="simple-list"
        :list="simpleItems" 
        wrapperClass="w-full max-w-md"
        listClass="flex flex-col gap-3"
      >
        <template #indicator>
          <div class="w-full h-[74px] bg-slate-200/50 border-2 border-dashed border-slate-400 rounded-xl"></div>
        </template>

        <template #item="{ item, index, isDragged }">
          <div 
            class="bg-white transition-all overflow-hidden cursor-grab active:cursor-grabbing"
            :class="isDragged 
              ? 'h-0 p-0 border-0 opacity-0 m-0' 
              : 'flex items-center gap-4 p-4 border border-slate-200 rounded-xl shadow-sm hover:border-emerald-300 hover:shadow-md h-auto'"
          >
            <svg class="text-slate-400 pointer-events-none shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle>
              <circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle>
            </svg>
            
            <div class="flex-1 font-semibold text-slate-700 pointer-events-none">
              {{ item.title }}
            </div>

            <div class="px-2 py-1 text-xs font-bold text-slate-500 bg-slate-100 rounded-md pointer-events-none shrink-0">
              Pos: {{ index + 1 }}
            </div>
          </div>
        </template>

      </TestDraggableList>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Données pour le composant à 2 niveaux (Kanban)
const board = ref([
  {
    id: 'col-1', title: 'À FAIRE',
    tasks: [
      { id: 101, text: 'Vérifier le fantôme gris' },
      { id: 102, text: 'Tester le drop dans une zone vide' }
    ]
  },
  {
    id: 'col-2', title: 'EN COURS',
    tasks: [
      { id: 201, text: 'Admirer le design Headless' }
    ]
  },
  {
    id: 'col-3', title: 'TERMINÉ',
    tasks: []
  }
])

// Données pour le composant à 1 niveau (Liste ordonnable)
const simpleItems = ref([
  { id: 1, title: 'Optimiser le SEO' },
  { id: 2, title: 'Mettre à jour Nuxt 4' },
  { id: 3, title: 'Publier le package sur NPM' },
  { id: 4, title: 'Boire un café en terrasse' }
])
</script>