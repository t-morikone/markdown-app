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
    charset: 'utf8'
  }
});

let Bookshelf = require('bookshelf')(knex);

Bookshelf.plugin('pagination');

let User = Bookshelf.Model.extend({
  tableName: 'users'
});

let Markdata = Bookshelf.Model.extend({
  tableName: 'markdata',
  hasTimestamp: true,
  user: function(){
    returun this.belongsTo(User);
  }
});

router.get('/', (req, res, next) => {
  if (req.session.login == null){
    res.redirect('/login');
    return;
  }
  res.render('add', {title: 'Add'});
});

router.post('/', (req, res, next) => {
  let rec = {
    title: 'req.body.title',
    content: req.body.content,
    user_id: req.session.login.id
  }
  new Markdata(rec).save().then((model) => {
    res.redirect('/');
  });
});

module.exports = router;