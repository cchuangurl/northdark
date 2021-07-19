//載入相對應的model
const Layer_info = require('../models/index').layer_info;
const Set_info = require('../models/index').set_info;
const Field_info = require('../models/index').field_info30;
var axios = require('axios');
//const Author = require('../models/author');
module.exports = {
    //創建
    create(req, res) {
        let new_layer_info = new Layer_info(req.body);
        console.log(new_layer_info);
        new_layer_info.save(function(err, layer_info) {
        if (err)
            res.send(err);
            console.log("Saving new_layer_info....")
        statusreport="儲存layer_info後進入本頁";
        res.redirect("/api/layer_info/?statusreport="+statusreport)
        //res.redirect("/api/layer_info")        
    })
    },

    //依:id找出原layer_info, 然後送去editpage編輯頁
    edit(req, res) {
        let editreport=req.body.statusreport;
        Layer_info.findById(req.params.id, function(err, info) {
            if (err)
                res.send(err);
            //res.json(parameter);
            let layer_info=encodeURIComponent(JSON.stringify(info));
            res.render("layerinfo/editpage",{
                statusreport:editreport,
                layer_info:layer_info
            })
        });
    },

    //列表項
    list(req, res) {
        let listreport=req.query.statusreport;
        Layer_info.find({},function(err, layer_info) {
            if (err)
            res.send(err);
            //res.json(layer_info);
            console.log("status report during list"+listreport);
            /*for(let info of layer_info){
                console.log(info)
            }*/
            let layer_info_list=encodeURIComponent(JSON.stringify(layer_info));
            //res.setHeader('Cache-Control', 'no-cache');
            console.log("going to layer info list page....");
            res.render("layer_info/listpage",{
                statusreport:listreport,
                layer_info_list:layer_info_list
            })
        })
    },

    //依所選layer_info_ids挑出欄位資料
    getcontent(req,res){
        let listreport=req.body.statusreport;
        console.log("executing getcontent()....");
        console.log("req.body.statusreport:"+req.body.statusreport);
        let set_info_ids=req.body.set_info_ids;
        console.log("recepted set_info_ids:"+set_info_ids);
        let chosen_ids=req.body.chosen_ids;
        console.log("recepted chosen_ids:"+chosen_ids);
        let select_layer_info=new Array();
        let select_field_info;
        let promise0=((set_info_ids)=>{
            return new Promise((resolve,reject)=>{
            Layer_info.find({a05set_info_ids:set_info_ids},function(err,layer_info_list){
                for(let info of layer_info_list){
                    for(let ids of chosen_ids){
                    if(info._id.toString()===ids.toString()){
                        console.log("selected layer: "+info.a20key_name)
                        select_layer_info.push(info)
                    }
                }
                }
            });  
            resolve(select_layer_info)
            })//EOF return Promise
        });//EOF promise0
        let promise1=((select_layer_info)=>{
            return new Promise((resolve,reject)=>{
                Field_info.find({a91set_info_ids:set_info_ids},function(err,field_info_list){
                    let listlength=field_info_list.length;
                    let no_field=chosen_ids.length;
                    select_field_info=new Array(listlength);
                    for(let i=0;i<listlength;i++){
                        select_field_info[i]=new Array(no_field)
                    }
                    let m=0,n=0;
                    for(let field_info of field_info_list){
                        for(let info of select_layer_info){
                            for(let key in field_info){
                                if(info.a50field_name===key){
                                    select_field[m][n]=field_info[key];
                                    n=n+1
                                }
                        }
                    }
                    m=m+1
                    }
                    console.log("caugth n: "+n);                    
                    let first20_info=select_field_info.slice(0,20);
                    let outcome="取得所選欄位內容成功！";
                    console.log("the no of first20: "+first20_info.length);
                    console.log("the no of eack field_info: "+first20_info[0].length);
                    console.log("content of 1st conten of 1st ingo: "+first20_info[0][0]);
                    res.send({
                        select_layer_info,
                        select_field_info:first20_info,
                        outcome
                    })
                })       
            resolve()
            })//EOF return Promise
        });//EOF promise1
        promise0(set_info_ids)
        .then((select_layer_info)=>{
            return promise1(select_layer_info)
        })
        .catch((err)=>{
            console.log(err)
        })
    },//EOF getcontent

    //更新
    update(req, res) {
        Layer_info.findOneAndUpdate({_id:req.params.id}, req.body, { new: true }, function(err, layer_info) {
            if (err)
                res.send(err);
            //res.json(layer_info);
            var statusreport=req.query.statusreport;
            res.redirect("/api/layer_info?statusrepot="+statusreport);
        });
    },
    //刪除
    destroy(req, res) {
        Layer_info.remove({_id: req.params.id}, function(err, layer_info) {
        //layer_info.findByIdAndRemove(req.params.id, function(err, layer_info) {
            if (err)
                res.send(err);
            //res.json({ message: 'layer_info successfully deleted' });
            let statusreport=req.query.statusreport;
            res.redirect("/api/layer_info?statusrepot="+statusreport);
        });
    },

    //取得某項
    retrieve(req, res) {
        let editreport=req.body.statusreport;
        Layer_info.findById(req.params.id, function(err, layer_info) {
            if (err)
                res.send(err);
            //res.json(layer_info);
            res.render("layer_info/editpage",{
                statusreport:editreport,
                layer_info:layer_info                
            })
        });
    },

    //取得對應號碼之項
     findByNo(req, res) {
        return Layer_info.find({a35waterno:req.params.no}, function(err, layer_info) {
            if (err)
                res.send(err);
            return layer_info
        });
    }
    
}//EOF export