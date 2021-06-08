const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
require('dotenv').config();
// Connect to the database
mongoose.connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(() => console.log('connected to the databae successfully'))
    .catch(error => console.log('Error while conecting to the database ', error));

app.get('/', (req, res, next) => {
    res.json('This is home page');
})
app.get('/home', (req, res, next) => {
    res.send('This is /home page of the our application');
})

app.use('/auth', require('./routes/userMapper.js'));
app.use((req, res, next) => {
    res.json({
        msg: 'Invalid url',
        status: 400
    })
})
app.listen(PORT, (error, done) => {
    if (error) {
        console.log('Something went wrong while listening to the port');
    } else {
        console.log(`Application is listening successfully at port no ${PORT}`)
    }
})