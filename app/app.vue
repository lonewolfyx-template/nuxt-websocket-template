<template>
    <NuxtPage/>
</template>

<script setup>
const {$connectSocketServer} = useNuxtApp()
$connectSocketServer()
</script>