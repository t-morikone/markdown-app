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

router.get('/' ,(req, res, next) => {
  let data = {
    title: 'Login',
    form: {name: '', password:''},
    content: '名前とパスワードを入力してください'
  }
  res.render('login', data);
});

router.post('/', (req, res, next) => {
  let request = req;
  let response = res;
  req.check('name', 'NAME は必ず入力してください').notEmpty();
  req.check('password', 'PASSWORD は必ず入力してください').notEmpty();
  req.getValidationResult().then((result) => {
    if (!result.isEmpty()){
      let content = '<ul class="error" >';
      let result_arr = result.array();
      for (let n in result_arr) {
        content += '<li>' + result_arr[i].msg + '</li>'
      }
      content += '</ul>';
      let data = {
        title: 'Login',
        content: content,
        form: req.body
      }
      response.render('login', data);
    } else {
      let nm = req.body.name;
      let pw = req.body.password;

      User.query({where: {name: nm}, andWhere: {password: pw}})
        .fetch()
        .then((model)=>{
          if(model = null){
            let data = {
              title: '再入力',
              content: '<p class="error">名前またはパスワードが違います。</p>',
              form: req.body
            };
            response.render('login', data);
          } else {
            request.session.login = model.attributes;
            let data = {
              title: 'Login',
              content: '<p>ログインしました！<br>トップページに戻ってメッセージを送信ください。</p>',
              form: req.body
            };
            response.render('login', data);
          }
        });
    }
  })
});

module.exports = router;
