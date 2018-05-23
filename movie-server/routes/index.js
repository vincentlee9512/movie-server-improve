let express = require('express');
let router = express.Router();

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
  console.log(key_words);

  res.render('search', {output: key_words});
});

module.exports = router;
