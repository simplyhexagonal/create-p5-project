<script setup lang="ts">
import { ref } from 'vue';
import p5 from 'p5';

import { design } from './design';

const nodeRef = ref();
const started = ref(false);

const run = () => {
  new p5(
    design,
    nodeRef.value,
  );

  started.value = true;
};
</script>

<template>
  <div id="canvasContainer" ref="nodeRef">
    <h1 v-if="!started" @click="run">
      Click here to run
    </h1>
  </div>
</template>
