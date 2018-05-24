let express = require('express');
let router = express.Router();
let sqlite3 = require('sqlite3').verbose();

//function from myself
let promises_module = require('../self_wrote_module/promise');
let format_module = require('../self_wrote_module/format_func');

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.success = null;
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
    let title_table = format_module.title_table(data_arr[0]);
    let people_table = format_module.people_table(data_arr[1]);

    res.render('search', { keyWord: key_words ,title_result: title_table, people_result: people_table});
  });


});

router.get('/individual/:uid', function (req, res, next) {
  let uid = req.params.uid.split(' ').join('');
  let sql;

  //conditional statement
  //check if the uid is for title or person
  if(uid.substring(0,2) === "tt"){
    //is title
    sql = "SELECT DISTINCT Titles.tconst, Titles.primary_title, Titles.title_type, Titles.start_year, " +
        "Titles.end_year, Titles.runtime_minutes, Titles.genres, Principals.ordering, Principals.nconst, " +
        "Ratings.average_rating, Ratings.num_votes, Names.primary_name, Crew.directors, Crew.writers " +
        "FROM Titles, Principals, Ratings, Names, Crew " +
        "WHERE Titles.tconst = Principals.tconst AND Principals.tconst = Ratings.tconst AND Titles.tconst = Crew.tconst " +
        " AND Titles.tconst = \"" + uid + "\"" +
        " AND Principals.nconst = Names.nconst " +
        " ORDER BY Principals.ordering;";
  }else if (uid.substring(0,2) === "nm"){
    sql = "SELECT * FROM Names WHERE nconst = \"" + uid +"\"";
  }else{
    res.redirect('/');
  }

  var db_p = promises_module.db_promise(sql);

  db_p.then( (data) => {

    if(data.length === 0){
      res.render('individual', { html_code: 'no information for this movie'});
    }else{
      let html_code = "";
      let returnObj = {};

      if(uid.substring(0,2) === "tt"){
        returnObj = format_module.title_individual(data);
        html_code = returnObj.html_code;

        let directors_db_p = promises_module.db_promise(returnObj.directors_sql);
        let writers_db_p = promises_module.db_promise(returnObj.directors_sql);

        Promise.all([directors_db_p, writers_db_p]).then((data_arr) => {

          let directors_list = format_module.people_list(data_arr[0]);
          let writers_list = format_module.people_list(data_arr[1]);

          html_code = html_code.replace('***directors***', directors_list);
          html_code = html_code.replace('***writers***', writers_list);

          res.render('individual', { html_code: html_code});
        });
      }else{
        returnObj = format_module.people_individual(data[0]);
        html_code = returnObj.html_code;

        let known_title_promise = promises_module.db_promise(returnObj.titles_name_sql);

        known_title_promise.then((data) => {
            var title_list = format_module.title_list(data);
            html_code = html_code.replace('***known_titles***', title_list);
            res.render('individual', { html_code: html_code});
        });
      }

    }
  }).catch((error) => {
    console.log(error);
  });

});

module.exports = router;
