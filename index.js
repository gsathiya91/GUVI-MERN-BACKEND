const express = require('express');
const app = express();
const cors = require('cors');
const dotenv= require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const RegisterRoute = require('./routes/userRoutes');

app.use(express.json());
app.use(cors());
dotenv.config();
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use('/', RegisterRoute);
app.use('/user', RegisterRoute);
//Port
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

mongoose.connect("mongodb+srv://Gsathiya:capstoneproject@cluster0.ktemn.mongodb.net/Register-Login-Profile?retryWrites=true&w=majority").then(()=>{
    console.log("Database connected successfully")
}).catch((err)=>{
    console.log("Database connection failed") 
})

