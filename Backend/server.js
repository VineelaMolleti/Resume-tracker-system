const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT||5000;

// mongoose.connect(process.env.MONGO_URL,{
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
// }).then(()=>{
//     console.log('MongoDB connected');
//     app.listen(PORT,()=> console.log(`Server running on port ${PORT}`));
// }).catch(err=> console.log(err));

//The above code is used for the mongodb version lesser than 5 to avoid depreciated warnings
//But in newer versions useNewUrlParser,useUnifiedTopology is enabled defaultly.
//so we can use the following code

mongoose.connect(process.env.MONGO_URL).
then(()=>{
    console.log("Mongo Db Connected")
    app.listen(PORT,()=>console.log(`Server is running on ${PORT}`));
}).catch(err=>console.log(err));

const candidateRoutes = require('./routes/CandidateRoutes');
app.use('/api/candidates',candidateRoutes);