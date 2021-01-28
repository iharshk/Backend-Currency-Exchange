const Router = require("express");
const routes = new Router();
const country = require('../controller/country')

module.exports = function(app, http) {

    app.use('', routes);

    app.all('*', (req, res) => {
        res.send({
            error: true,
            status: 404,
            message: "API not found"
        })
    });
};

routes.get('/get-countries', country.get_countries);




