<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import SidebarNav from './SidebarNav.vue'
</script>

<template>
  <div class="container hidden space-y-6 p-10 pb-16 md:block">
    <div class="space-y-0.5">
      <h2 class="text-2xl font-bold tracking-tight">Your Profile</h2>
      <p class="text-muted-foreground">Manage your personal information.</p>
    </div>
    <Separator class="my-6" />
    <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <aside class="-mx-4 lg:w-1/5">
        <SidebarNav />
      </aside>
      <div class="flex-1 lg:max-w-2xl">
        <router-view />
      </div>
    </div>
  </div>
</template>
