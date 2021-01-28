const Country = require('../models/country')

module.exports.get_countries = async function (req, res) {
    try {
        let countriesList = await Country.find();
        if(countriesList && countriesList.length > 0) {
            res.status(200).send(countriesList);
        } else if(countriesList && countriesList.length == 0) {
            let msg = { country: "No Countries Available", key: "" }
            countriesList.push(msg);
            res.status(200).send(countriesList);
        } else {
            res.status(500).send({});
        }
        
    } catch (error) {
        res.status(500).send(error);
    }
}