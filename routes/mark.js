let express = require('express');
let router = express.Router();

let MarkdownIt = require('markdown-it');
let markdown = new MarkdownIt();

let mysql = require('mysql');

let knex = require('kenx')({
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
  hasTimestamps: true,
  user: function(){
    return this.belongsTo(User);
  }
});

router.get('/', (req, res, next) => {
  res.redirect('/');
  return;
});

router.get('/:id', (req, res, next) => {
  let request = req;
  let response = res;
  if (req.session.login == null){
    res.redirect('/login');
    return;
  }
  Markdata.query({where: {user_id: req.session.login.id}, andWhere: {id: req.params.id}})
    .fetch()
    .then((model) => {
      makepage(request, response, model, true);
    });
});

router.post('/:id', (req, res, next) => {
  let request = req;
  let response = res;
  let obj = new Markdata({id:req.params.id})
    .save({content: req.body.source}, {patch: true})
    .then((model) => {
      makepage(request, response, model, false);
    });
});

function makepage(req, res, model, flg){
  let footer;
  if(flg){
    let d1 = new Data(model.attributes.created_at);
    let dstr1 = d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + d1.getDate();

    let d2 = new Data(model.attributes.created_at);
    let dstr2 = d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + d2.getDate();

    footer = '(created: '+ dstr1 + ', updated: '+ dstr2 + ')';
  } else {
    footer = '(Updating data and time information...)'
  }
  let data = {
    title: 'Markdown',
    id: req.params.id,
    head: model.attributes.title,
    footer: footer,
    content: markdown.render(model.attributes.content),
    source: model.attributes.content
  };
  res.render('mark', data);
}

module.exports = router;
