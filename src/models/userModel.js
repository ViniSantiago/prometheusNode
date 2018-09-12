'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
    required: 'Name must be supplied',
    trim: true
  },
  email: {
    type: String,
    index: true,
    required: "email must be supplied",
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  passwordConf: {
    type: String,
    required: true
  },
  cellphone: Number,
  cpfcnpj: Number,
  products: [ProductsSchema]
});

module.exports = mongoose.model('User', UserSchema);
module.exports = mongoose.model('Product', ProductsSchema);
module.exports = mongoose.model('Transaction', TransactionsSchema);