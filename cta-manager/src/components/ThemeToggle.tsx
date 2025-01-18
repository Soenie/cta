import { Component, createEffect, createSignal } from 'solid-js';
import { Moon, Sun } from 'lucide-solid';

export const ThemeToggle: Component = () => {
  const [isDark, setIsDark] = createSignal(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  createEffect(() => {
    if (isDark()) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  });

  return (
    <button
      onClick={() => setIsDark(!isDark())}
      class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark() ? <Sun class="h-5 w-5" /> : <Moon class="h-5 w-5" />}
    </button>
  );
};