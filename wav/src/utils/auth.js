export async function authenticateUser(username, password) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    const data = await response.json()
    if (data.success) {
      return {
        success: true,
        userId: data.user.id,  
        user: data.user       
      }
    }
    return { success: false }
  } catch (error) {
    console.error('Authentication error:', error)
    return { success: false }
  }
}

export async function createUser(username, password) {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    const data = await response.json()
    return data.success
  } catch (error) {
    console.error('Registration error:', error)
    return false
  }
}