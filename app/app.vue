<template>
  <div class="flex flex-col min-h-screen">
    <SSMHeader />
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <SSMFooter />
  </div>
</template>

<script setup lang="ts">
import {SSMFooter} from "#components"
import {SSMHeader} from "#components"
</script>