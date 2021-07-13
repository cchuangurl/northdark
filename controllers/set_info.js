//載入相對應的model
const Set_info = require('../models/index').set_info;
//const Author = require('../models/author');
module.exports = {
    //創建
    create(req, res) {
        var new_set_info = new Set_info(req.body);
        console.log(new_set_info);
        new_set_info.save(function(err, set_info) {
        if (err)
            res.send(err);
            console.log("Saving new_set_info....")
        statusreport="儲存批次metadata後進入本頁";
        res.redirect("/api/set_info/?statusreport="+statusreport)
        //res.redirect("/api/set_info")        
    })
    },
    //列表項
    list(req, res) {
        var listreport=req.query.statusreport;
        Set_info.find({},function(err, set_info) {
            if (err)
            res.send(err);
            //res.json(set_info);
            let set_info_list=encodeURIComponent(JSON.stringify(set_info));
            res.render("set_info/listpage",{
                statusreport:listreport,
                set_info_list:set_info_list
            })
        })
    },
    //取得某項
    retrieve(req, res) {
        var editreport=req.body.statusreport;
        Set_info.findById(req.params.id, function(err, set_info) {
            if (err)
                res.send(err);
            //res.json(set_info);
            res.render("set_info/editpage",{
                statusreport:editreport,
                set_info:set_info
            })
        });
    },
    //取得某項並組成url (用axios會自給組成，則此程式可不用)
   /*  makepath(req, res) {
        var editreport=req.body.statusreport;
        console.log(req.params.id);
        Set_info.findById(req.params.id, function(err, set_info) {
            if (err)
                res.send(err);
        let dataurl;
        let webAddress=set_info.a05web_path;
		let dataVolumn=set_info.a10data_volume;
		let skip=set_info.a15skip;
	   	let filter=set_info.a20filter;
	   	let dataOrder=set_info.a25order;
	   	let criter1,criter2,criter3,criter4;
	   	let criteria;
	   	if(dataVolumn!=""||dataVolumm!=null) {
	   		criter1="$top="+dataVolumn;
	   			}
        criteria=criter1;            
	   	if(skip!=""||skip!=null) {
	   		criter2="$skip="+skip;
	   		if(criteria!=""||criteria!=null) {
   				criteria=criteria+"&"+criter2;
	   		}else {
	   		criteria=criter2;
	   			}}
	   	if(filter!=""||filter!=null) {
	   		criter3="$filter="+filter;
	   		if(criteria!=""||criteria!=null) {
   				criteria=criteria+"&"+criter3;
	   	}else {
	   		criteria=criter3;
	   		}}
	   	if(dataOrder!=""||dataOrder!=null) {
	   		criter4="$orderby="+dataOrder;
	   		if(criteria!=""||criteria!=null) {
   				criteria=criteria+"&"+criter4;
	   	}else {
	   		criteria=criter4;
	   		}}
	   	if(criteria!=""||criteria!=null) {
	   		criteria="?"+criteria;
	   		}
	   	dataurl=webAddress+criteria;
        res.redirect("/api/layer_info/fetch/?dataurl="+dataurl);
        });
    },*/
     //取得對應號碼之項
     findByNo(req, res) {
        return Set_info.find({a35waterno:req.params.no}, function(err, set_info) {
            if (err)
                res.send(err);
            return set_info
        });
    },
    //更新
    update(req, res) {
        Set_info.findOneAndUpdate({_id:req.params.id}, req.body, { new: true }, function(err, set_info) {
            if (err)
                res.send(err);
            //res.json(set_info);
            res.redirect("/api/set_info");
        });
    },
    //刪除
    destroy(req, res) {
        Set_info.remove({_id: req.params.id}, function(err, set_info) {
        //Set_info.findByIdAndRemove(req.params.id, function(err, set_info) {
            if (err)
                res.send(err);
            //res.json({ message: 'Set_info successfully deleted' });
            res.redirect("/api/set_info");
        });
    },

    //測試片斷程式
    test(req,res){
        let var_string="string";
        let var_number=10;
        let var_boolean=true;
        let var_array=[a, 10];
        let var_json={
            "key1":"text",
            "key2":20,
            "key3":false,
            "key4":[b,20]
        };
        let var_jsonlist=[
            {
            "key1":"text",
            "key2":20,
            "key3":false,
            "key4":[b,20]
            },
            {
                "key1":"text2",
                "key2":30,
                "key3":true,
                "key4":[c,40]
                }
            ];
        console.log("the type of var_string is:"+var_string.constructor);
        console.log("the type of var_number is:"+var_number.constructor);
        console.log("the type of var_boolean is:"+var_boolean.constructor);
        console.log("the type of var_array is:"+var_array.constructor);
        console.log("the type of var_json is:"+var_json.constructor);
        console.log("the type of var_jsonlist is:"+var_jsonlist.constructor);
        if (err)
            res.send(err);
        res.redirect("/");
    }

}//EOF export