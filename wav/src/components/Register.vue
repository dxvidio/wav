<template>
  <div class="auth-container">
    <h1>Register</h1>
    <form @submit.prevent="handleRegister" id="form-container">
      <div class="form-field">
        <label for="username" id="username-label">Username</label>
        <input 
          type="text" 
          id="username" 
          v-model="username" 
          required
          placeholder="Choose a username"
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
          placeholder="Choose a password"
          aria-labelledby="password-label"
          aria-required="true"
        />
      </div>
      <button type="submit">Register</button>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
      <p class="account-link">
        Already have an account? <router-link to="/">Login</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUser } from '../utils/auth'

const username = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const router = useRouter()

const handleRegister = async () => {
  try {
    const user = await createUser(username.value, password.value)
    if (user) {
      success.value = 'Registration successful! Proceed to login.'
      username.value = ''
      password.value = ''
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      error.value = 'Registration failed. Try a different username.'
    }
  } catch (err) {
    error.value = 'An error occurred during registration.'
    console.error(err)
  }
}
</script>

<style>
@import "../assets/forms.css";
</style>