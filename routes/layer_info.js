var express = require('express');
var router = express.Router();
const layer_infoController = require('../controllers/index').layer_info;
//本router執行list後，導到清單列表頁
router.get('/', function(req, res, next) {
	layer_infoController.list(req,res)
});

//本router，導到待單筆輸入頁
router.get('/inputpage', function(req, res, next) {
	res.render("layer_info/inputpage",{
		//statusreport:req.body.statusreport
		statusreport:req.query.statusreport
	})
});

//本router執行edit:id後，導到待單筆修正頁
router.get('/edit/:id', function(req, res, next) {
	layer_infoController.edit(req,res)
});

//依set_info id去取回該批次的資料
router.get('/fetch/:id', function(req, res, next) {
	layer_infoController.fetchdata(req,res);
});

//依set_info id去取回該批次的資料
router.get('/layerpage/:id', function(req, res, next) {
	layer_infoController.showfield(req,res);
});

//本router，導到待輸入各欄位計數單位頁
router.get('/unitpage', function(req, res, next) {
	layer_infoController.unitinput(req,res);	
});

//本router，導到儲存各欄位計數單位頁
router.post('/addunit', function(req, res, next) {
	console.log("executing router /addunit...");
	layer_infoController.saveaddunit(req,res);	
});

//&nbsp;
router.get('/:id', function(req, res, next) {
	layer_infoController.retrieve(req,res)
});
router.get('/find/:no', function(req, res, next) {
	layer_infoController.findByNo(req,res)
});
//&nbsp;
router.post('/', function(req, res, next) {
	console.log(req.body);
	layer_infoController.create(req,res)
});
//&nbsp;
router.get('/delete/:id', function(req, res, next) {
	layer_infoController.destroy(req,res)
});
//&nbsp;
//&nbsp;
router.post('/update/:id', function(req, res, next) {
	layer_infoController.update(req,res)
});
//&nbsp;
module.exports = router;