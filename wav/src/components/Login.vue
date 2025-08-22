<template>
  <main>
    <div class="auth-container">
      <h1>WAV Login</h1>
      <form @submit.prevent="handleLogin" id="form-container">
        <div class="form-field">
          <label for="username" id="username-label">Username</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required
            placeholder="Enter your username"
            aria-labelledby="username-label"
            aria-required="true"
          />
        </div>
        <div class="form-field">
          <label for="password" id="password-label">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            placeholder="Enter your password"
            aria-labelledby="password-label"
            aria-required="true"
          />
        </div>
        <button type="submit">Login</button>
        <p v-if="error" class="error">{{ error }}</p>
        <p class="account-link">
          Create an Account: <router-link to="/register">Register</router-link>
        </p>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authenticateUser } from '../utils/auth'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = async() => {
  error.value = ''
  try {
    const result = await authenticateUser(username.value, password.value)
    if (result.success) {
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userId', result.userId)
      router.push('/visualizer')
    } else {
      error.value = result.error || 'Login failed.'
    }
  } catch (err) {
    error.value = 'Network error, please try again.'
    console.error('Login error:', err)
  }
}
</script>

<style>
@import "../assets/forms.css";
</style>