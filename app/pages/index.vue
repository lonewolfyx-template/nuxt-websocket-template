<script lang="ts" setup>

// const {$websocket, $socket} = useNuxtApp()
// console.log($websocket)
// console.log($socket)

import {useSocket} from "~~/modules/runtime/composables/socket";

const {request, status} = useSocket()

const sendPing = async () => {
    const result = await request.value!['getUserList']();
    console.log('Server reply:', result)
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

    </div>
</template>
