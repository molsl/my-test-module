<template>
  <div
    class="transition-all duration-200"
    :class="[wrapperClass, isListTarget ? dropTargetClass : '']"
    @dragover.prevent.stop="onDragOverContainer"
    @drop.prevent.stop="handleDrop"
  >
    <TransitionGroup :name="transitionName" :tag="tag" :class="listClass">
      
      <template v-for="(item, index) in list" :key="item.id">
        
        <div 
          v-if="isIndicatorVisible(index)" 
          class="pointer-events-none w-full"
        >
          <slot name="indicator"></slot>
        </div>

        <div
          draggable="true"
          @dragstart.stop="onDragStart($event, item, index)"
          @dragover.prevent.stop="onDragOverItem($event, index)"
          @dragend="onDragEnd"
          @drop.prevent.stop="handleDrop"
        >
          <slot
            name="item"
            :item="item"
            :index="index"
            :is-dragged="dragState?.item?.id === item.id"
          ></slot>
        </div>

      </template>

      <div 
        v-if="isIndicatorVisible(list.length) && list.length > 0" 
        :key="'indicator-end'"
        class="pointer-events-none w-full" 
      >
        <slot name="indicator"></slot>
      </div>

    </TransitionGroup>

    <div v-if="list.length === 0" class="w-full h-full min-h-[40px]">
      <slot name="empty" :is-drop-target="isListTarget"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'

const dragState = ref<{
  item: any,
  sourceList: any[],
  sourceIndex: number,
  group: string
} | null>(null)

const hoverState = ref<{
  targetList: any[],
  targetIndex: number
} | null>(null)
</script>

<script setup lang="ts" generic="T extends { id: string | number }">
const props = withDefaults(defineProps<{
  list: T[]
  group?: string
  orientation?: 'vertical' | 'horizontal' // 👈 Nouvelle prop cruciale !
  wrapperClass?: string
  listClass?: string
  dropTargetClass?: string
  tag?: string
  transitionName?: string
}>(), {
  group: 'default',
  orientation: 'vertical',
  wrapperClass: 'h-full',
  listClass: 'flex flex-col gap-2',
  dropTargetClass: '',
  tag: 'div',
  transitionName: 'drag-list'
})

const isListTarget = computed(() => {
  return hoverState.value?.targetList === props.list && dragState.value?.group === props.group
})

const onDragStart = (e: DragEvent, item: T, index: number) => {
  setTimeout(() => {
    dragState.value = { item, sourceList: props.list, sourceIndex: index, group: props.group }
  }, 0)
}

// LA NOUVELLE MAGIE : Calcul de la position de la souris
const onDragOverItem = (e: DragEvent, index: number) => {
  if (!dragState.value || dragState.value.group !== props.group) return

  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()

  let isSecondHalf = false
  if (props.orientation === 'horizontal') {
    // Si on est à droite du milieu de la carte
    isSecondHalf = (e.clientX - rect.left) > (rect.width / 2)
  } else {
    // Si on est en dessous du milieu de la carte
    isSecondHalf = (e.clientY - rect.top) > (rect.height / 2)
  }

  // Si on est dans la 2ème moitié, on cible l'index suivant !
  const targetIndex = isSecondHalf ? index + 1 : index
  hoverState.value = { targetList: props.list, targetIndex }
}

const onDragOverContainer = (e: DragEvent) => {
  if (!dragState.value || dragState.value.group !== props.group) return

  // Si la liste est vide, on vise toujours 0 (règle le bug de la liste vide)
  if (props.list.length === 0) {
    hoverState.value = { targetList: props.list, targetIndex: 0 }
    return
  }

  // ANTI-BUG : On ne change l'index vers "la fin" que si on vient d'une AUTRE liste.
  // Ça empêche l'indicateur de sauter quand on passe sur l'espace vide (gap) entre 2 tâches !
  if (hoverState.value?.targetList !== props.list) {
    hoverState.value = { targetList: props.list, targetIndex: props.list.length }
  }
}

// Détermine si l'indicateur bleu doit s'afficher à cet index précis
const isIndicatorVisible = (index: number) => {
  // Si ce n'est pas la bonne liste ou le bon endroit, on cache
  if (!isListTarget.value || hoverState.value?.targetIndex !== index) return false

  // Si on déplace dans la MÊME liste...
  if (dragState.value?.sourceList === props.list) {
    const srcIndex = dragState.value.sourceIndex
    // ... on cache l'indicateur si on le lâche exactement sur lui-même 
    // (à son index, ou à l'index juste en dessous qui le ferait retomber à la même place)
    if (index === srcIndex || index === srcIndex + 1) return false
  }

  return true
}

// Fonction unifiée pour lâcher l'élément
const handleDrop = () => {
  if (!dragState.value || dragState.value.group !== props.group || !hoverState.value) return resetState()

  const { sourceList, sourceIndex } = dragState.value
  const { targetList, targetIndex } = hoverState.value

  // Si on lâche l'élément exactement à l'endroit où il est déjà, on annule
  if (sourceList === targetList && (sourceIndex === targetIndex || sourceIndex === targetIndex - 1)) {
    return resetState()
  }

  const [moved] = sourceList.splice(sourceIndex, 1)
  if (!moved) return resetState()

  let finalIndex = targetIndex
  if (sourceList === targetList && sourceIndex < targetIndex) {
    finalIndex--
  }

  targetList.splice(finalIndex, 0, moved)
  resetState()
}

const onDragEnd = () => resetState()

const resetState = () => {
  dragState.value = null
  hoverState.value = null
}
</script>

<style scoped>
.drag-list-move {
  transition: transform 0.2s cubic-bezier(0.2, 1, 0.2, 1);
}
</style>