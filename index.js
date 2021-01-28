const express = require('express');
const app = express();
require('dotenv').config();
const http = require('http').createServer(app);
const cors = require("cors");
const helmet = require("helmet");
const { dbConnect } = require('./src/config/database');


const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.use(cors());
app.use(helmet());

dbConnect();

app.get('/', (req, res) => {
    res.status(200).send({
        error: false,
        status: 200,
        message: "Node Setup is done!!"
    })
});
 
try {
    require('./src/routes/routes')(app, http);
} catch (err) {
    console.log('Error in Routing Connection', err);
}

app.all('*', (req, res) => {
    res.send({
        error: true,
        status: 404,
        message: "API not found"
    })
});

http.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})