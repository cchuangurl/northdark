var express = require('express');
var router = express.Router();
const set_infoController = require('../controllers/index').set_info;
//&nbsp;
/* GET home page. */
router.get('/', function(req, res, next) {
	set_infoController.list(req,res)
});
//&nbsp;
router.get('/inputpage', function(req, res, next) {
	res.render("set_info/inputpage",{
		//statusreport:req.body.statusreport
		statusreport:req.query.statusreport
	})
});
//&nbsp;
router.get('/:id', function(req, res, next) {
	set_infoController.retrieve(req,res)
});
router.get('/makeurl/:id', function(req, res, next) {
	set_infoController.makepath(req,res)
});
router.get('/find/:no', function(req, res, next) {
	set_infoController.findByNo(req,res)
});
//&nbsp;
router.post('/', function(req, res, next) {
	console.log(req.body);
	set_infoController.create(req,res)
});
//&nbsp;
router.get('/delete/:id', function(req, res, next) {
	set_infoController.destroy(req,res)
});
//&nbsp;
router.post('/update/:id', function(req, res, next) {
	set_infoController.update(req,res)
});
//測試片斷程式
router.get('/testblock', function(req, res, next) {
	set_infoController.test(req,res)
});
//&nbsp;
module.exports = router;