<template>
  <header class="bg-gradient-to-r from-sky-200 via-blue-300 to-blue-400 backdrop-blur-md shadow-lg border-b border-white/30">
    <nav class="container mx-auto flex items-center justify-between px-6 py-4">

      <!-- Logo / Title -->
      <div class="flex items-center gap-3">
        <span class="text-2xl">⛷️</span>
        <h1 class="text-xl font-bold text-white tracking-wide drop-shadow">
          Swiss Ski Map
        </h1>
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