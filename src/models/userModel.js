'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");

var TransactionsSchema = new Schema({
  id: {
    type: String,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  tags: [],
  value: Number,
  valueAsString: {
    type: String,
    trim: true
  }
})

var ProductsSchema = new Schema({
  kernelid: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  tags: [],
  balance: Number,
  balanceAsString: String,
  transactions: [TransactionsSchema]
})

var UserSchema = new Schema({
  userid: {
    type: String,
    index: true
  },
  kernelid: String,
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    index: true,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  cellphone: Number,
  cpfcnpj: Number,
  products: [ProductsSchema]
});

// Hashing password before save it into database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

UserSchema.methods.comparePassword = function (password, cb) {
  var user = this;
  bcrypt.compare(password, user.password, function(err, isMatch){
    console.log(password);
    console.log(user.password);
    console.log("isMatch: " + isMatch)
    if (err) {
      return cb(err);
    } else {
      return cb(null, isMatch);
    }
  })
};

module.exports = mongoose.model('User', UserSchema);
module.exports = mongoose.model('Product', ProductsSchema);
module.exports = mongoose.model('Transaction', TransactionsSchema);