let express = require('express');
let router = express.Router();
let sqlite3 = require('sqlite3').verbose();

//function from myself
let promises_module = require('../self_wrote_module/promise');
let format_module = require('../self_wrote_module/format_func');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Movie Wiki', success: req.session.success, errors: req.session.errors });
  req.session.errors = null;
  req.session.success = null;
});

router.post('/submit', function(req, res, next){
  req.check('content', 'Invalid character in this words').isString();

  let errors = req.validationErrors();
  if(errors){
    req.session.errors = errors;
    req.session.success = false;
    res.redirect('/')
  }else{
    req.session.success = true;

    let content = req.body.content;

    res.redirect('/search/' + content);
  }


});

router.get('/search/:content', function (req, res, next) {
  let key_words = req.params.content;

  let title_sql = "SELECT * FROM Titles WHERE primary_title LIKE $searchTerm";
  let people_sql = "SELECT * FROM Names WHERE primary_name LIKE $searchTerm";

  let searchTerm = key_words.replace(/(\(|\)|\;)/g, '');
  searchTerm = '%' + searchTerm.replace(/\*/g, '%') + '%';

  let title_db_promise = promises_module.db_promise_like(title_sql, searchTerm);
  let people_db_promise = promises_module.db_promise_like(people_sql, searchTerm);

  Promise.all([title_db_promise, people_db_promise]).then((data_arr) => {
    console.log(data_arr);
  });

  res.render('search', {output: key_words});
});

module.exports = router;
