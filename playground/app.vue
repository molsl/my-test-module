<script setup>
const { test } = useTest()
test()
helloWorld()
</script>

<template>
  <div>
    <div class="p-10 mb-5 text-white bg-red-500 rounded-xl">
      Si ce bloc est rouge, Tailwind fonctionne !
    </div>
    <h1>Mon module de test</h1>
    <div>TEST</div>
    <TestButton label="Cliquez moi" />
    
    <TestButton>
      <div>Morgan LOUAISIL</div>
      <div>Front end developper</div>
    </TestButton>
  </div>
</template>
