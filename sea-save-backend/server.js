const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const uri = 'mongodb+srv://seasave:seasave@sea-save.tdpyp5m.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, {});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB connection established successfully');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

app.use("/animal", require("./routes/animal"));
