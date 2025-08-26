<script lang="ts" setup>
import {useSocketInfo, useWebSocket} from "~~/modules/socket.io/composables/socket";

const rpc = useWebSocket()
const sendPing = () => {
    rpc('asd')
}
const socket = useSocketInfo();

// 注册一个消息监听器
socket.value.message((message) => {
    console.log('收到消息:', message);
});

// 可以注册多个
socket.value.message((message) => {
    console.log('另一个监听器:', message);
});

</script>

<template>
    <div>
        <!--        <h1>Visitors: {{ visitors }}</h1>-->
        <!--        <h2>status:{{ status }}</h2>-->
        <!--        <input v-model="content">-->
        <!--        <button @click="send(JSON.stringify(content))">Send</button>-->

        <!--        <p>Status: {{ status }}</p>-->
        <button @click="sendPing">Send Ping</button>
        <!--        {{result}}-->
    </div>
</template>
