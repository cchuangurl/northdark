var express = require('express');
var router = express.Router();
const field_infoController = require('../controllers/index').field_info;
//&nbsp;
/* GET home page. */
router.get('/', function(req, res, next) {
	field_infoController.list(req,res)
});

//本router，導到依所選layer_info_ids挑出欄位資料
router.post('/getchosen', function(req, res, next) {
	field_infoController.getcontent(req,res);	
});

//&nbsp;
router.get('/inputpage', function(req, res, next) {
	res.render("field_info/inputpage",{
		//statusreport:req.body.statusreport
		statusreport:req.query.statusreport
	})
});
//&nbsp;
router.get('/:id', function(req, res, next) {
	field_infoController.retrieve(req,res)
});
router.get('/find/:no', function(req, res, next) {
	field_infoController.findByNo(req,res)
});
//&nbsp;
router.post('/', function(req, res, next) {
	console.log(req.body);
	field_infoController.create(req,res)
});
//&nbsp;
router.get('/delete/:id', function(req, res, next) {
	field_infoController.destroy(req,res)
});
//&nbsp;
//&nbsp;
router.post('/update/:id', function(req, res, next) {
	field_infoController.update(req,res)
});
//&nbsp;
module.exports = router;