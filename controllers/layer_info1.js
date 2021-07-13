//載入相對應的model
const Layer_info = require('../models/index').layer_info;
const Set_info = require('../models/index').set_info;
const Field_info = require('../models/index').field_info;
var axios = require('axios');
//const Author = require('../models/author');
module.exports = {
    //創建
    create(req, res) {
        var new_layer_info = new Layer_info(req.body);
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
    //列表項
    list(req, res) {
        var listreport=req.query.statusreport;
        Layer_info.find({},function(err, layer_info) {
            if (err)
            res.send(err);
            //res.json(layer_info);
            let layer_info_list=encodeURIComponent(JSON.stringify(layer_info));
            res.render("layer_info/listpage",{
                statusreport:listreport,
                layer_info_list:layer_info_list
            })
        })
    },
    //取得某項
    retrieve(req, res) {
        var editreport=req.body.statusreport;
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
    //依url取得指定資料批次
    fetchdata(req, res) {
        let statusreport=req.query.statusreport;
        let setinfoid=req.query.set_info_id;
        console.log("statusreport:"+statusreport);
        console.log("set_info_id:"+setinfoid)
        let promise0=((id)=>{
            return new Promise((resolve, reject)=>{                
                Set_info.findById(id, function(err, set_info) {
                    if (err)
                        res.send(err);
                    console.log("Set_info was found!")
                    resolve(set_info)
                })//EOF Set_info.findById
            })//EOF Promise
        })//EOF promise0
        let savelayerinfo=((new_layer_info)=>{
            return new Promise((resolve,reject)=>{
                new_layer_info.save(function(err, newlayerinfo) {
                    console.log("saved layer info:"+newlayerinfo.a25orignal_key)    
                })//EOF save
                resolve()
            })//EOF Promise
        })//EOF savelayerinfo
        let savefieldinfo=((new_field_info)=>{
            return new Promise((resolve,reject)=>{
                new_field_info.save(function(err, newfieldinfo) {
                    console.log("saved field info:"+newfieldinfo.a40content)    
                })//EOF save
                resolve()
            })//EOF Promise
        })//EOF savefieldinfo
        let anaylzelayer=((jsonlist,set_info)=>{
            let layer_info_list=new Array();
            let locator=new Array();
            let nodeofdepth=new Array();
            let childflag,sibleflag,todoflag,cousinflag,childlistflag,siblelistflag,cousinlistflag;
            //let deepest=4;            
            let stackkey=new Array();
            let stackno=new Array();
            let stacklist=new Array();
            let shiftstackkey;
            let nowstackkey,shiftstackno;
            /* for(let i=0;i<deepest;i++){
                stackkey[i]=new Array();
                stacklist[i]=new Array()
            }//EOF for deepest */
            let maxdepth,nextnode,nextdepth;
            let sameelement;
            let whattype=((element)=>{
                let type_temp;
                    if(element==null||element==undefined){
                        type_temp="Null"
                    }else{
                        type_temp=element.constructor;
                        if(type_temp=="Object"){
                            if(element.toString.indexof("{",0)>0&&element.toString.indexof(":",0)>0){
                                type_temp="Json"
                            }
                        }//EOF if type_temp
                    }//EOF else
                    console.log("the type is: "+type_temp);
                    return type_temp
                });//EOF whattype
            let add_layer_info=((depth,thiskey,no_subkey, no_container, upper_layer_id, upper_key,footnote)=>{
                    new_layer_info=new Layer_info({
                        a05set_info_ids:set_info._id,
                        a10dataset_name:set_info.a30dataset_name,
                        a15data_layer:depth,
                        a20key_name:thiskey,
                        a25no_subkey:no_subkey,
                        a30no_container:no_container,
                        a35upper_layer_id:upper_layer_id,
                        a40upper_key:upper_key,
                        a99footnote:footnode
                    })//EOF Layer_info
                    layer_info_list.push(new_layer_info);
                });//EOF add_layer_info
            let decideelement=((depth,node,uppernode)=>{
                switch(depth){
                    case 0:element=jsonlist[0];break;
                    case 1:element=jsonlist[0].stackkey[1][node];break;
                    case 2:element=jsonlist[0].stackkey[1][uppernode].stackkey[2][uppernode][node];break;

                }//EOF swith
                    return element
            })//EOF decideelement
            let getupperid=((depth,key,upper_key)=>{
                for(let info of layer_info_list){
                    if(info.a15data_layer==depth){
                        if(info.a40upper_key==upper_key&&info.a20key_name==key){
                            return info._id
                        }
                    }                    
                }//EOF for of layer_info_list
            });//EOF getupperid
            let setsiblelocator=(()=>{
                shiftstackno=stackno[0];
                let testdepth=locator.length;
                let noyet=true;
                while(notyet){
                for(let l=1;l<testdepth;l++){
                    shiftstackno=shiftstackno[locator[l]]
                    }
                if(locator[testdepth-1]+1<shiftstackno[locator[testdepth]]){
                        locator.splice(testdepth-1,1,locator[testdepth-1]+1);
                        notyet=false
                    }else{
                        locator.splice(testdepth-1,1,0);
                        testdepth=testdepth-1
                    }                    
                }
            });
            let setchildlocator=(()=>{
                let templocator=new Array();                
                for(let l=0;l<maxdepth;l++){
                    templocator.push(0)
                }
                testdepth=templocator.length;
                let notyet=true;
                shiftstackno=stackno[0];
                while(notyet){                 
                for(let l=0;l<testdepth-2;l++){
                    shiftstackno=shiftstackno[locator[l]]
                    shiftshiftstackno=shiftstackno[locator[l+1]]
                    }
                    let nextnode=true;
                while(nextnode){
                for(let n=0;n<shiftshiftstackno.length;n++){
                    if(shiftshiftstackno[n]>0){
                        templocator.splice(testdepth,1,n);
                        nextnode=false
                        notyet=false;                        
                        break
                    }
                    }
                if(notyet&&templocator[testdepth-2]<shiftstackno.length){
                    templocator.splice(testdepth-2,1,templocator[testdepth]+1);
                    }
                }
                testdepth=testdepth-1
            }
            });
            let getsibleflag=(()=>{
                shiftstackno=stackno[0];
                for(let l=0;l<locator.length;l++){
                    if(locator[l+1]+1<shiftstackno[locator[l]]){
                        sibleflag=true;
                        break
                    }else{
                        sibleflag=false;
                    }
                    shiftstackno=shiftstackno[locator[l]]
                    }
                    return sibleflag
            });
            let getchildflag=(()=>{
                    if(locator.length<maxdepth){
                        childflag=true;
                    }else{
                        childflag=false;
                    }
                    return childflag
            });
            let getnodewidth=((locator)=>{
                if(locator.length>1){
                    let tempstack=stackkey;
                    for(let d=0;d<locator.length-1;d++){
                        tempstack=tempstack[locator[d]]
                    }
                    return tempstack.length
                }else{
                    return 0
                }
            });  
            let dealjson=((thisjson,depth,key,upper_id,upper_key,nodeorder)=>{
                let subkeylist=thisjson.keys;
                let no_subkey=subkeylist.length;
                let no_container;
                let sublistnode=0;
                shiftstackkey[nodeorder]=new Array();
                shiftstackno[nodeorder]=new Array();
                for(let subkey in thisjson){
                    let thistype=whattype(thisjson.subkey);
                    switch(thistype){
                        case "Json":
                            shiftstackkey[nodeorder].push(subkey);
                            if(depth+1>maxdepth){
                                maxdepth=depth+1
                            }
                            break;
                        case "Array":
                            //will be dealed later
                            break;
                        default:continue                            
                    }//EOF switch thistype
                    }//EOF for in thisjson
                    no_container=shiftstackkey[nodeorder].length;
                    if(no_container>0){
                    shiftstackno[nodeorder].push(no_container)
                    }
                //no_container=shiftstackkey[nodeorder].length+stacklist[depth+1].length;
                let footnote="";
                add_layer_info(depth,key,no_subkey, no_container, upper_id, upper_key,footnote)
                for(let subkey in thisjson){
                    let thistype=whattype(thisjson.subkey);
                    if(thisytpe!="Json"&&thistype!="Array"){
                        footnote="";
                        let thisupperid=getupperid(depth,key,upper_key);
                        add_layer_info(depth+1,subkey,0,0,thisupperid, key,footnote);
                    }//EOF if thistype
                    }//EOF for in thisjson
                sibleflag=getsibleflag();
                if(sibleflag==true||childflag==true){
                    todoflag=true
                }
            });//EOF deajson
            let dealarray=((templist,depth,upper_id,nodeorder)=>{
                templist1=templist[0];
                dispatcher(templist1,depth,upper_id,nodeorder)
            });//EOF dealarray
            let dealothertype=((element,depth,upper_id,nodeorder)=>{
                thisdepth=
                thiskey=
                upperkey=
                footnote="";                
                add_layer_info(thisdepth,thiskey,0,0,upper_id,upper_key,footnote)
            });//EOF dealothertype
            let dispatcher=((element,depth,upper_id,nodeorder)=>{
                let thetype=whattype(element);
                switch(thetype){
                    case "Json":                      
                        dealjson(element,depth,upper_id,nodeorder);
                        break;                    
                    case "Array":
                        dealarray(element,depth,upper_id,nodeorder);
                        break;
                    default:
                        dealothertype(element,depth,upper_id,nodeorder);
                        break;
                    }//EOF switch thetype
            });//EOF dispatcher
            let upnodewidth=getnodewidth(locator);
                if(upnodewidth>nodeorder){
                        nextnode=nodeorder+1;
                        samedepth=depth;
                        upperjson=getupperjson(locator);
                        sameupper_id=upper_id;
                        sameupper_key=upper_key;                      
                        sibleflag=true
                    }else{
                        nextnode=0;
                        sibleflag=false
                    }//EOF if-else
                /* let sequence=Promise.resolve();                
                sequence=sequence.then(()=>{
                return savelayerinfo(new_layer_info).then()
                .catch(err=>{
                    console.log(err)
                })
                })//EOF sequence   */ 
        //以下實際執行anaylzelayer
            let upperjson=jsonlist;
            let json0=jsonlist[0];
            let element=json0;
            let layer_depth=0;
            let upper_id=set_info._id;
            let upper_key=set_info.a45filename_part;
            maxdepth=0;
            depth=0;
            let nodeorder=0;
            let rootkey="rootjson";
            stackkey.push(rootkey);
            stackno.push(1);
            //nowstackkey=stackkey[0];
            shiftstackkey=stackkey;
            shiftstackno=stackno;
            locator.push(nodeorder);
            nodeofdepth.push(nodeorder);
            childflag=false;
            sibleflag=false;
            cousinflag=false;
            todoflag=false;
            dealjson(element,depth,rootkey,upper_id,upper_key,nodeorder);
            while(todoflag){
                while(sibleflag){
                setsiblelocator();
                siblekey=stackkey[samedepth][nextnode];
                sibleelement=decideelement(samedepth,nextnode);
                dealjson(sibleelement,samedepth,siblekey,sameupper_id,sameupper_key,nextnode);
                }//EOF while sibleflay
                childflag=getchildflag();
                if(childflag){
                    setchildlocator();
                    element=
                    key=
                    upperid=
                    upperkey=
                    noderorder=0;
                    childflag=false;
                    dealjson(element,maxdepth,key,upper_id,upper_key,nodeorder);
                    continue
                }else{
                    todoflag=false
                }
            }//EOF while todoflag
        });//EOF anaylzelayer
        let anaylzefield=((jsonlist,set_info, layer_info)=>{
            let json1=jsonlist[0];
            let layer1_keylist=Object.keys();
            let layer1_len=layer1_keylist.length;
            for(let key in json1){
                if(typeOf(json1.key)=='object'){
                    console.log("data type:"+typeOf(json1.key));
                    let is_con=true
                }
                new_field_info=new Field_info({
                    a05layer_info_ids:layer_info._id,
                    a10common_field:"",
                    a15orignal_key:layer_info.a25orignal_key,
                    a20key_info:"",
                    a25is_container:layer_info.a35is_container,
                    a30field_type:"",
                    a35filed_unit:"",
                    a40content:"",
                    a99footnote:""
                })
                let sequence=Promise.resolve();                
                sequence=sequence.then(()=>{
                return savefieldinfo(new_field_info).then()
                .catch(err=>{
                    console.log(err)
                })
                })//EOF sequence                
            }//EOF for key in json1
        });//EOF anaylzefield
        promise0(setinfoid)
        .then((set_info)=>{
            //axios.get(set_info.a05web_path,{
            axios.get('https://data.coa.gov.tw/service/opendata/OpenDataServiceList.aspx',{
                params:{
                    $top:set_info.a10data_volume,
                    $skip:set_info.a15skip,
                    //$filter:set_info.a20filter,
                    $orderBy:set_info.a25order
                }
                }).then(function(resByApi,set_info){
                    console.log("got respond!");
                    anaylzelayer(resByApi.data,set_info);
                    

              })
              .catch((err)=>{
                console.log(err)
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    },//EOF fetchdata
     //取得對應號碼之項
     findByNo(req, res) {
        return Layer_info.find({a35waterno:req.params.no}, function(err, layer_info) {
            if (err)
                res.send(err);
            return layer_info
        });
    },
    //更新
    update(req, res) {
        Layer_info.findOneAndUpdate({_id:req.params.id}, req.body, { new: true }, function(err, layer_info) {
            if (err)
                res.send(err);
            //res.json(layer_info);
            res.redirect("/api/layer_info");
        });
    },
    //刪除
    destroy(req, res) {
        Layer_info.remove({_id: req.params.id}, function(err, layer_info) {
        //layer_info.findByIdAndRemove(req.params.id, function(err, layer_info) {
            if (err)
                res.send(err);
            //res.json({ message: 'layer_info successfully deleted' });
            res.redirect("/api/layer_info");
        });
    }
}//EOF export