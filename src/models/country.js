const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
mongoose.set('useCreateIndex', true);
const countrySchema = new mongoose.Schema(
  {
    country: { type: String, unique: true },
    key: { type: String },
  },
  { timestamps: true }
);

countrySchema.plugin(uniqueValidator, {
    message: '{VALUE} already taken!'
});

countrySchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      country: this.country,
      key: this.key
    };
  }
};

module.exports = mongoose.model('Country', countrySchema);
