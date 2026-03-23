<template>
  <header class="bg-gradient-to-r from-sky-200 via-blue-300 to-blue-400 backdrop-blur-md shadow-lg border-b border-white/30">
    <nav class="container mx-auto flex items-center justify-between px-6 py-4">

      <!-- Logo / Title -->
      <div class="flex items-center gap-3">
        <span class="text-2xl">⛷️</span>
        <div class="relative">
          <h1 class="text-xl font-bold text-white tracking-wide drop-shadow">
            Swiss Ski Map
          </h1>
          <svg class="absolute top-0 -right-5 w-4 h-4" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Red background -->
            <rect width="100" height="100" fill="#FF0000"/>
            <!-- White cross -->
            <rect x="35" y="15" width="30" height="70" fill="white"/>
            <rect x="15" y="35" width="70" height="30" fill="white"/>
          </svg>
        </div>
      </div>

      <!-- Language Switch -->
      <div class="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full p-1 border border-white/30">

        <button
            @click="$i18n.setLocale('fr')"
            class="px-3 py-1 text-sm rounded-full text-white hover:bg-white hover:text-blue-600 transition"
        >
          FR
        </button>

        <button
            @click="$i18n.setLocale('en')"
            class="px-3 py-1 text-sm rounded-full text-white hover:bg-white hover:text-blue-600 transition"
        >
          EN
        </button>

        <button
            @click="$i18n.setLocale('de')"
            class="px-3 py-1 text-sm rounded-full text-white hover:bg-white hover:text-blue-600 transition"
        >
          DE
        </button>

      </div>

    </nav>
  </header>
</template>
