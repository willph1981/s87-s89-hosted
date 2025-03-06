const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: "https://s87-s89-hosted.vercel.app", // Allow frontend domain
    methods: "GET,POST,PATCH,DELETE",
    credentials: true // Allow cookies/auth headers if needed
}));

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Routes
app.use('/api/posts', require('./routes/post'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/auth', require('./routes/auth'));


app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
