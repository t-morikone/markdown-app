let express = require('express');
let router = express.Router();

// DB周りのセッティング
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

// ページネーション
Bookshelf.plugin('pagination');

// Userモデルの作成
let User = Bookshelf.Model.extend({
  tableName: 'users'
});

let Markdata = Bookshelf.Model,extend({
  tableName: 'markdata',
  hasTimestamps: true,
  user: function(){
    return this.belongsTo(User);
  }
});

/* GET home page. */
router.get('/', (req, res, next) => {
  // ログインしてなかったらログインページにリダイレクト
  if (req.session.login == null){
    res.redirect('/login');
  return;
  }
  new Markdata(['title']).orderBy('created_at', 'DESC')
    .where('user_id', '=', req.session.login.id)
    .fetchPage({page: 1, pageSize: 10, withRelated: ['user']})
    .then((collection) => {
      let data = {
        title: 'Markdown Search',
        login: req.session.login,
        message: '※最近の投稿データ',
        form: {find:''},
        content: collection.toArray()
      };
      res.render('index', data);
    });
});

router.post('/', (req, res, next)=>{
  new Markdata().orderBy('created_at', 'DESC')
    .where('content', 'like', '%', req.body.find + '%')
    .fetchAll({withRelated: ['user']})
    .then((collection) => {
      let data = {
        title: 'Markdown Search',
        login: req.session.login,
        message: '※”' + req.body.find + '" で検索された最近の投稿データ',
        form: req.body,
        content: collection.toArray()
      };
      res.render('index', data);
    });
});

module.exports = router;
