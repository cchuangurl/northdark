var express = require('express');
var router = express.Router();
const dictionaryController = require('../controllers/index').dictionary;
//&nbsp;
/* GET home page. */
router.get('/', function(req, res, next) {
	dictionaryController.list(req,res)
});
//&nbsp;
router.get('/inputpage', function(req, res, next) {
	res.render("dictionary/inputpage",{
		//statusreport:req.body.statusreport
		statusreport:req.query.statusreport
	})
});
//&nbsp;
router.get('/:id', function(req, res, next) {
	dictionaryController.retrieve(req,res)
});
router.get('/find/:no', function(req, res, next) {
	dictionaryController.findByNo(req,res)
});
//&nbsp;
router.post('/', function(req, res, next) {
	console.log(req.body);
	dictionaryController.create(req,res)
});
//&nbsp;
router.get('/delete/:id', function(req, res, next) {
	dictionaryController.destroy(req,res)
});
//&nbsp;
//&nbsp;
router.post('/update/:id', function(req, res, next) {
	dictionaryController.update(req,res)
});
//&nbsp;
module.exports = router;