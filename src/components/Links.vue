<script setup>
import { onMounted, ref } from "vue";

const links = ref([]);
const linkUrl = ref("");

async function getLinks(link) {
  console.log(link);
  await fetch(
    `https://worker-holy-lake-d00c.pabloezelivingston.workers.dev/?link=${link}`
  )
    .then(res => res.json())
    .then(res => {
      links.value = res.subtitles.es;
    });
}

const searchNextItem = index => {
  if (links.value[index + 1]?.timestamp) {
    return links.value[index + 1]?.timestamp;
  }
};
</script>

<template>
  <div>
    <div class="d-flex">
      <input v-model="linkUrl" />
      <button @click="getLinks(linkUrl)">Buscar</button>
    </div>

    <div>
      <a
        target="_blank"
        rel="noopener noreferrer"
        class="link_media"
        v-for="(item, index) in links"
        :key="item.timestamp"
        :href="`http://localhost:3000/download?url=${linkUrl}&start=${
          item.timestamp
        }&end=${searchNextItem(index)}`"
      >
        {{ item.text }} {{ " " }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.link_media:hover {
  background: #7d7dae;
  color: black;
}
</style>
