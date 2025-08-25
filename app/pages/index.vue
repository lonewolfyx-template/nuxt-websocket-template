<script lang="ts" setup>

// const {$websocket, $socket} = useNuxtApp()
// console.log($websocket)
// console.log($socket)

import {useSocket} from "~~/modules/runtime/composables/socket";

const result = ref({})
const {request, status} = useSocket()

const sendPing = async () => {
    const resul = await request.value!['getUserList']();
    result.value = resul
    console.log('Server reply:', resul)
}


</script>

<template>
    <div>
        <!--        <h1>Visitors: {{ visitors }}</h1>-->
        <!--        <h2>status:{{ status }}</h2>-->
        <!--        <input v-model="content">-->
        <!--        <button @click="send(JSON.stringify(content))">Send</button>-->

        <p>Status: {{ status }}</p>
        <button @click="sendPing">Send Ping</button>
        {{result}}
    </div>
</template>
