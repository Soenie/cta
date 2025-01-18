import { Component, createSignal } from 'solid-js';
import { Lock, Mail } from 'lucide-solid';
import { signIn } from '../lib/auth';
import { ThemeToggle } from './ThemeToggle';

export const Auth: Component = () => {
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!email() || !password()) {
      setError('Email and password are required');
      return;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email())) {
      setError('Invalid email format');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await signIn(email(), password());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div>
          <div class="flex justify-center">
            <Lock class="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>

        <form onSubmit={handleSubmit} class="mt-8 space-y-6">
          {error() && (
            <div class="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
              {error()}
            </div>
          )}
          
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="email" class="sr-only">
                Email address
              </label>
              <div class="relative flex items-center">
                <div class="absolute left-3 flex items-center pointer-events-none">
                  <Mail class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Email address"
                  required
                />
              </div>
            </div>

            <div>
              <label for="password" class="sr-only">
                Password
              </label>
              <div class="relative flex items-center">
                <div class="absolute left-3 flex items-center pointer-events-none">
                  <Lock class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Password"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading()}
            class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading() ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};