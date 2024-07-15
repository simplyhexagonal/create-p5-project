<script setup lang="ts">
import { ref, onMounted } from 'vue';
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

onMounted(run);

const downloadSVG = () => {
  const svg = nodeRef.value.querySelector('svg');

  if (!svg) {
    return;
  }

  const svgData = new XMLSerializer().serializeToString(svg);

  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = svgUrl;
  downloadLink.download = 'design.svg';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};
</script>

<template>
  <div id="canvasContainer" ref="nodeRef">
    <h1 v-if="!started" @click="run">
      Click here to run
    </h1>
  </div>
  <div v-if="started">
    <button @click="downloadSVG">
      Download SVG
    </button>
  </div>
</template>
