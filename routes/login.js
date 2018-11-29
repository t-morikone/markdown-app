let express = require('express');
let router = express.Router();

let mysql = require('mysql');
let knex = require('knex')({
  dialect: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'markdown',
    charset:'utf8'
  }
});

let Bookshelf = require('bookshelf')(knex);

let User = Bookshelf.Model.extend({
  tableName: 'users'
});