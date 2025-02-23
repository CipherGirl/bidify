<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogOut, User } from 'lucide-vue-next'
import { computed, onMounted } from 'vue'
import DropdownMenuSeparator from '../ui/dropdown-menu/DropdownMenuSeparator.vue'
import { connectSocket } from '@/services/websocket.ts'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  if (userStore.isAuthenticated) {
    if (userStore.token) connectSocket(userStore.token)
    userStore.fetchUserProfile()
  }
})

const firstLetter = computed(() => {
  return userStore.profile?.firstName?.[0]?.toUpperCase()
})

const firstName = computed(() => {
  const firstName = userStore.profile?.firstName || ''
  return firstName ? `${firstName}` : 'User'
})

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-14 items-center gap-16">
      <!-- Brand -->
      <div class="flex cursor-pointer">
        <h2 class="text-2xl font-bold">
          <router-link to="/items">Bidify</router-link>
        </h2>
      </div>

      <!-- Navigation -->
      <div class="flex-1">
        <ul class="flex gap-4 font-bold text-base">
          <li>
            <router-link to="/profile" class="hover:text-primary hover:underline"
              >Profile</router-link
            >
          </li>
          <li>
            <router-link to="/items" class="hover:text-primary hover:underline">Items</router-link>
          </li>
        </ul>
      </div>

      <!-- Auth Section -->
      <div v-if="userStore.isAuthenticated" class="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarFallback>
                {{ firstLetter }}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-56">
            <div class="px-2 py-1.5 text-sm">
              Hello, <span class="font-bold">{{ firstName }}</span>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="router.push('/profile')">
              <User class="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleLogout">
              <LogOut class="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div v-else class="flex items-center gap-4">
        <Button variant="ghost" @click="router.push('/login')">Login</Button>
        <Button variant="default" @click="router.push('/register')">Register</Button>
      </div>
    </div>
  </nav>
</template>
