import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config()
const prisma = new PrismaClient()
const app = express()
const port = process.env.PORT || 3001

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

// Serve static files from ../dist (now copied to server/public)
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json())

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Oops! Something broke.')
})

// User registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username and password are required.' 
      })
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { 
        username, 
        password: hashedPassword 
      }
    })
    const { password: _, ...userWithoutPassword } = user
    res.status(201).json({ 
      success: true, 
      user: userWithoutPassword 
    })
  } catch (error) {
    console.error('Registration error:', error)
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        success: false, 
        error: 'Username already exists. Please try again.' 
      })
    }
    res.status(500).json({ 
      success: false, 
      error: error.toString()
    })
  }
})

// User login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username and password are required' 
      })
    }
    const user = await prisma.user.findUnique({
      where: { username }
    })
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials.' 
      })
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials.' 
      })
    }
    const { password: _, ...userWithoutPassword } = user
    res.json({ 
      success: true, 
      user: userWithoutPassword 
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Login failed.' 
    })
  }
})

// Track creation endpoint
app.post('/api/tracks', async (req, res) => {
  try {
    const { userId, title, artist, duration, filePath } = req.body
    const track = await prisma.track.create({
      data: {
        title,
        artist,
        duration,
        filePath,
        userId
      }
    })
    res.status(201).json({ success: true, track })
  } catch (error) {
    console.error('Track creation error:', error)
    res.status(500).json({ success: false, error: 'Could not save track.' })
  }
})

// Track fetch endpoint
app.get('/api/tracks/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const tracks = await prisma.track.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { uploadDate: 'desc' }
    })
    res.json({ success: true, tracks })
  } catch (error) {
    console.error('Error fetching tracks:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch tracks.' })
  }
})
// SPA fallback
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
    if (err) {
      console.error('Failed to send index.html:', err);
      res.status(404).send('Not found');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})
