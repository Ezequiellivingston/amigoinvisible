<script setup>
import { ref } from "vue";

const users = ref([]);
const name = ref("");

const info = ref(null);

const agregarUser = event => {
  name.value && users.value.push(name.value);
};

const eliminarUser = userSelect => {
  console.log(userSelect);
  users.value = users.value.filter(user => user !== userSelect);
};

const createGame = async () => {
  await fetch("https://worker-holy-lake-d00c.pabloezelivingston.workers.dev/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      users: users.value,
    }),
  })
    .then(res => res.json())
    .then(res => {
      info.value = res;
    });
};
</script>

<template>
  <div>
    <input v-model="name" />
    <button @click="agregarUser">Agregar</button>

    <div>
      <h2>Lista</h2>

      <li v-for="user in users" :key="user">
        {{ user }}

        <button @click="eliminarUser(user)">Eliminar</button>
      </li>
    </div>

    <div>
      <button @click="createGame">Crear juego</button>
    </div>

    <div v-if="info">
      <h2>Participantes</h2>
      <li v-for="(inf, index) in info.res_participants" :key="index">
        {{ inf }}
      </li>
      <h2>Enviar cualquiera de los link a cada participante</h2>
      <li v-for="(inf, index) in info.res_tokens" :key="index">
        https://worker-holy-lake-d00c.pabloezelivingston.workers.dev/?token={{
          inf
        }}&user={{ info.res_participants[index] }}
      </li>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

input {
  height: 50px;
  font-size: 20px;
}
</style>
