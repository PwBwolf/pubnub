var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
  console.log('checking if user exists')
  next();
});
/* GET users listing. */
router.get('/metadata', function(req, res, next) {
  res.send('getting teh users metadata');
});

router.post('/metadata', function (req, res, next) {
  res.send('saving user metadata')
})
module.exports = router;
