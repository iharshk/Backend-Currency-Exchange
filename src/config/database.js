const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

module.exports.dbConnect = function() {
    mongoose.connect(process.env.DB_URL, options).then(() => {
        console.log('Connected with Database!!')
    }).catch((err) => {
        console.log('Database connection failed!!', err);
        process.exit(1);
    })
}