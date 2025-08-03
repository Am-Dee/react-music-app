const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require("cors")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Grid = require('gridfs-stream');
const multer = require('multer');

// Connection (url from mongooseodm)
mongoose.connect('mongodb://127.0.0.1:27017/music-app')
.then(() => {
    console.log('MongoDB connected')
}).catch(err => {
    console.error('MongoDB connection error:', err)
})

// Schema and model
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    address: String,
    email: String,
    password: String
})

const MusicSchema = new mongoose.Schema({
  title: String,
  artist: String,
});

//connected to collection
const User = mongoose.model('User', userSchema) 
const Music = mongoose.model('Music', MusicSchema)

// Middleware setup
app.use(cors()) // Enable CORS
app.use(bodyParser.json()) // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })) // Parse URL-encoded bodies
app.use(express.static('public')) // Serve static files from 'public' directory

// User Register
app.post('/signup', async (req, res) => {
    const { name, age, address, email, password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ name, age, address, email, password: hashedPassword })
        await user.save()
        res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        console.error('Signup error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' })
        }
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' })
        res.status(200).json({ message: 'Login successful', token, name: user.name })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' })
        }
        res.status(200).json({ message: 'Protected data', userId: decoded.userId })
    })
}
app.get('/protected', authenticateJWT, (req, res) => {
    res.status(200).json({ message: 'This is protected data' })
})

// Music by category
app.get('/api/music/:category', async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const songs = await Music.find({ category }); // 'category' field in MongoDB
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching music.' });
  }
});

// Get user profile
app.get('/me', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('name email');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ name: user.name, email: user.email });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  
// Fetch all users
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Fetch all music
app.get('/music', async (req, res) => {
  const music = await Music.find();
  res.json(music);
});

// Fetch music by ID
// app.get('/music/:id', async (req, res) => {
//   try {
//     const music = await Music.findById(req.params.id);
//     if (!music) return res.status(404).json({ error: 'Music not found' });
//     res.json(music);
//   } catch (error) {
//     console.error('Fetch music by ID error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Fetch user by ID
// app.get('/users/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     res.json(user);
//   } catch (error) {
//     console.error('Fetch user by ID error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// POST new user
// app.post('/users', async (req, res) => {  
//   const { name, age, address, email, password } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, age, address, email, password: hashedPassword });
//     await newUser.save();
//     res.status(201).json(newUser);
//   } catch (error) {
//     console.error('Create user error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// POST new music
// app.post('/music', async (req, res) => {
//   const { title, artist, album, year, genre } = req.body;
//   try {
//     const newMusic = new Music({ title, artist, album, year, genre });
//     await newMusic.save();
//     res.status(201).json(newMusic);
//   } catch (error) {
//     console.error('Create music error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// DELETE user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted successfully' });
} catch (error) {
  console.error('Delete user error:', error);
  res.status(500).json({ error: 'Internal server error' });
}
});

// PUT user by ID (Edit)
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE music by ID
app.delete('/music/:id', async (req, res) => {
  try {
    const result = await Music.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Music not found' });
    res.json({ message: 'Music deleted successfully' });
  } catch (error) {
    console.error('Delete music error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT music by ID (Edit)
app.put('/music/:id', async (req, res) => {
  try {
    const updatedMusic = await Music.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMusic) return res.status(404).json({ error: 'Music not found' });
    res.json(updatedMusic);
  } catch (error) {
    console.error('Update music error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})