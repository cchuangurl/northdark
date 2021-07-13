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
    //依url取得指定資料批次
    fetchdata(req, res) {
        let statusreport=req.query.statusreport;
        //let statusreport="jump test!"
        let setinfoid=req.params.id;        
        let layer_info_list=new Array();
        let field_info_list=new Array();
        console.log("statusreport:"+statusreport);
        console.log("set_info_id:"+setinfoid)
        
        //res.setHeader("Access-Control-Allow-Origin","http://localhost/");
        //res.setHeader("Access-Control-Allow-Credentials",true);

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
            let locator=new Array();
            let childflag,sibleflag,todoflag;
            let stackkey=new Array();
            let stackno=new Array();
            let nowstackkey,shiftstackno;
            /* for(let i=0;i<deepest;i++){
                stackkey[i]=new Array();
                stacklist[i]=new Array()
            }//EOF for deepest */
            let maxdepth,depth;
            let whattype=((element)=>{
                console.log(element);
                let type_temp;
                    if(element==null||typeof(element)=="undefined"){
                        type_temp="Null"
                    }else{
                        type_temp=element.constructor.toString();
                        if(type_temp.indexOf("Object")>0){
                            if(element.toString.indexOf("{",0)>0&&element.toString.indexOf(":",0)>0){
                                type_temp="Json"
                            }
                        }//EOF if type_temp
                    }//EOF if-else
                    console.log("the type is: "+type_temp);
                    return type_temp
                });//EOF whattype
            
            let add_layer_info=((depth,thiskey,no_subkey, no_container, upper_layer_id, upper_key,footnote)=>{
                    var new_layer_info=new Layer_info({
                        a05set_info_ids:set_info._id,
                        a10dataset_name:set_info.a30dataset_name,
                        a15data_layer:depth,
                        a20key_name:thiskey,
                        a25no_subkey:no_subkey,
                        a30no_container:no_container,
                        a35upper_layer_id:upper_layer_id,
                        a40upper_key:upper_key,
                        a99footnote:footnote
                    })//EOF Layer_info
                    layer_info_list.push(new_layer_info);                    
                });//EOF add_layer_info
            let getupperid=((depth,key,upper_key)=>{
                for(let info of layer_info_list){
                    if(info.a15data_layer===depth){
                        if((info.a40upper_key===upper_key||info.a40upper_key==="rootjson")&&info.a20key_name===key){
                            return info._id
                        }
                    }                    
                }//EOF for of layer_info_list
            });//EOF getupperid
          
            let getindex=((anylocate)=>{
                let locatorindex=[0];
                let eldestindex=[0];
                if(anylocate.length<2){
                    index=0;
                }else{
                    if(anylocate.length===2){
                        eldestindex.push(1);
                        locatorindex.push(anylocate[1]+1);
                    }else{
                        let bigcousinno;
                        let lastlayerno=1;
                        let startindex=0;
                        let endindex=startindex+lastlayerno;
                        for(let l=1;l<anylocate.length;l++){
                            eldestindex.push(endindex);
                            lastlayerno=stackno.slice(startindex,endindex).reduce((sum,ele)=>sum+ele);
                            startindex=endindex;
                            endindex=startindex+lastlayerno;
                        };
                        for(let l=2;l<anylocate.length;l++){
                            startindex=eldestindex[l-1];
                            endindex=locatorindex[l-1];
                            bigcousinno=stackno.slice(startindex,endindex).reduce((sum,ele)=>sum+ele);
                            currentindex=eldestindex[l]+bigcousinno+locator[l]+1;
                            locatorindex.push(currentindex)
                        }                         
                    }//EOF if-else 2
                    index=locatorindex[locatorindex.length-1]
                }//EOF if-else 1
                return index
            });
            let getsibleflag=(()=>{
                if(locator.length===1){
                    sibleflag=false;
                }else{
                    if(locator.length===2){
                        if(locator[1]+1<stackno[0]){
                            sibleflag=true
                        }else{
                            sibleflag=false
                        }//EOF if-else
                    }else{
                        for(let l=2;l<locator.length;l++){
                            let templocate=[].concat(locator);
                            let upperlocate=templocate.splice(l-1);
                            let upperindex=getindex(upperlocate);
                            if(locator[l]+1<stackno[upperindex]){
                                sibleflag=true;
                                break
                            }else{
                                sibleflag=false;
                            }//EOF if-else
                        }//EOF for locator,length
                    }//EOF if-else
                }//EOF if-else        
                    return sibleflag
            });
           
            let dealjson=((thisjson,depth,key,upper_id,upper_key)=>{
                let subkeylist=Object.keys(thisjson);
                //console.log(subkeylist);
                let no_subkey=subkeylist.length;
                let no_container=0;
                //let sublistnode=0;
                for(let subkey in thisjson){
                    console.log(thisjson[subkey]);
                    let thistype=whattype(thisjson[subkey]);
                    switch(thistype){
                        case "Json":
                            stackkey.push(subkey);
                            no_container++;
                            break;
                        case "Array":
                            //will be dealed later
                            break;
                        default:continue                            
                    }//EOF switch thistype
                    }//EOF for in thisjson
                    stackno.push(no_container);
                    console.log(stackno);
                    if(no_container>0&&maxdepth<depth+1){
                        maxdepth++
                    }
                //no_container=shiftstackkey[nodeorder].length+stacklist[depth+1].length;
                let footnote="";
                //console.log("Key input:"+key);
                add_layer_info(depth,key,no_subkey, no_container, upper_id, upper_key,footnote)
                for(let subkey in thisjson){
                    let thistype=whattype(thisjson[subkey]);
                    if(thistype!="Json"&&thistype!="Array"){
                        footnote="";
                        let thisupperid=getupperid(depth,key,upper_key);
                        console.log("Key input and its subkey:"+key+" and "+subkey);
                        add_layer_info(depth+1,subkey,0,0,thisupperid, key,footnote);
                    }//EOF if thistype
                    }//EOF for in thisjson
                sibleflag=getsibleflag();
                if(maxdepth>depth){
                    childflag=true
                }
                console.log("the sibleflag:"+sibleflag);
                console.log("the childflag:"+childflag);
                if(sibleflag==true||childflag==true){                    
                    todoflag=true;
                }
            });//EOF deajson
            /* let dealarray=((templist,depth,upper_id,nodeorder)=>{
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
            });//EOF dispatcher  */
            let setsiblelocator=(()=>{
                let LN=locator.length-1
                for(let l=LN;l<2;l--){
                    let templocate=[].concat(locator);
                    let upperlocate=templocate.splice(l-1);
                    let upperindex=getindex(upperlocate);
                    let ln=locator[l];
                    if(ln+1<stackno[upperindex]){
                        locator.splice(l,1,ln+1);
                        if(l===LN){
                            break
                        }else{
                            for(let r=0;r<LN-l;r++){
                                locator.splice(l+1+r,1,0)
                            }
                            break
                        }
                    }//EOF if
                }//EOF for locator,length
            });
            let setchildlocator=(()=>{
                let LN=locator.length-1;
                let youngestindex=[0];
                let eldestindex=[0];                              
                for(let l=1;l<LN+1;l++){
                    if(l===1){
                        eldestindex.push(1);
                        youngestindex.push(stackno[0])
                    }else{
                        eldestindex.push(youngestindex[l-1]+1);
                        let layerno=stackno.slice(eldestindex[l-1],eldestindex[l]).reduce((sum,ele)=>sum+ele);
                        let endindex=eldestindex[l]+layerno;
                        youngestindex.push(endindex);
                    }//EOF if-else
                }//EOF for LN
                let thislayer=stackno.slice(eldestindex[LN],youngestindex[LN]+1);
                let newparentorder=thislayer.findIndex(e=>e>0);
                //let parentindex=thislayer[newparentorder];
                //locator=getlocator(parentindex);
                residue=newparentorder;
                //接著需由newparentorder減去lastlayer各元素，逐一反推child的locator元素
                let childlocator=[]; 
                for(let l=LN;l<2;l--){               
                    let lastlayer=stackno.slice(eldestindex[l-1],youngestindex[l-1]+1);
                    biguncleno=0;
                    for(let no of lastlayer){
                        if(residue>no){
                            residue=residue-no;
                            biguncleno++;
                        }
                    }//EOF for lastlayer
                    childlocator.unshift(residue);
                    residue=biguncleno+1
                }//EOF for LN
                childlocator.unshift(0);
                childlocator.splice(LN,0,0);
                return childlocator
            });
            let decideelement=(()=>{
                let LN=locator.length-1;
                let templocator=[].concat(locator);
                let element=jsonlist[0];
                if(LN=1){
                    let tempindex=getidex(templocator);
                    let tempkey=stackkey[tempindex];
                    element=element.tempkey; 
                }else{
                    for(let l=0;l<LN;l++){
                        let slice=templocator.slice(0,l+2);
                        let tempindex=getidex(slice);
                        let tempkey=stackkey[tempindex];
                        element=element.tempkey;
                    }//EOF for LN
                }//EOF if-else
                    return element
            });//EOF decideelement
        //以下實際執行anaylzelayer
            let json0=jsonlist[0];
            let element=json0;
            let upper_id=set_info._id;
            let upper_key=set_info.a45filename_part;
            maxdepth=0;
            depth=0;
            let rootkey="rootjson";
            stackkey.push(rootkey);
            locator.push(0);
            childflag=false;
            sibleflag=false;
            todoflag=false;
            dealjson(element,depth,rootkey,upper_id,upper_key);
            while(todoflag){
                while(sibleflag){
                    setsibleocator();
                    sibleindex=getindex(locator);
                    siblekey=stackkey[sibleindex];
                    sibleelement=decideelement();
                    let templocator=[].concat(locator);
                    templocator.splice(LN,1);
                    uppeerindex=getindex(templocator);
                    upper_key=stackkey[upperindex];
                    upper_id=getupperid(depth,siblekey, upper_key);                   
                    dealjson(sibleelement,depth,siblekey,upper_id,upper_key);
                }//EOF while sibleflay
                if(childflag){
                    locator=setchildlocator();
                    let LN=locator.length-1;
                    element=decideelement();
                    childindex=getindex(locator);
                    key=stackkey[childindex];
                    let templocator=[].concat(locator);
                    templocator.splice(LN,1);
                    uppeerindex=getindex(templocator);
                    upper_key=stackkey[upperindex];
                    templocator.splice(LN-1,1);
                    grandindex=getindex(templocator);
                    grand_key=stackkey(grandindex);
                    upper_id=getupperid(maxdepth-1,upper_key, grand_key);
                    childflag=false;
                    depth=maxdepth;
                    dealjson(element,depth,key,upper_id,upper_key)
                }else{
                    todoflag=false;
                }
            }//EOF while todoflag
            console.log("be analyzed!")
        });//EOF anaylzelayer
        let getbloodkey=((layer_info)=>{
            let bloodkey=new Array();
            let currentkey=layer_info.a20key_name;
            let upperkey=layer_info.a40upper_key;
            let depth=layer_info.a15data_layer;
            do{
                bloodkey.unshift(currentkey);
                if(depth<2){
                    break
                }else{
                let upperid=getupperid(depth,currentkey, upperkey);
                currentkey=upperkey;
                upperinfo=layer_info_list.find({_id:upperid},function(err,upper_layer_info){
                    upperkey=upper_layer_info.a40upper_key
                })
                depth=depth-1
                }
            }while(layer_info.a20key_name!="rootjson");
            return bloodkey
        });//EOF getbloodkey 
        
        let getfigure=((jsonx,bloodkey)=>{
            let figure=jsonx;
            for(let l=0;l<bloodkey.length;l++){
                let key4value=bloodkey[l];
                figure=figure[key4value]
            }
            return figure
        });//EOF getfigure

        let anaylzefield=((jsonlist,set_info, layer_info_list)=>{
            console.log("Executing analyzefield.....");
            console.log("1st json keys: "+Object.keys(jsonlist[0]));            
            for(let jsonx of jsonlist){
                let figure_array=new Array(30);
                let figureindex=0;
                for(let layer_info of layer_info_list){
                    if(layer_info.a25no_subkey===0){
                    let bloodkey=getbloodkey(layer_info);
                    let figure=getfigure(jsonx,bloodkey);
                    figure_array[figureindex]=figure;
                    figureindex++
                    }//EOF if
                    }//EOF for layer_info_list
                console.log("the 1st figure of figure_array is:"+figure_array[0]);            
                var new_field_info=new Field_info({
                    a12content:figure_array[0],
                    a14content:figure_array[1],
                    a16content:figure_array[2],
                    a18content:figure_array[3],
                    a20content:figure_array[4],
                    a22content:figure_array[5],
                    a24content:figure_array[6],
                    a26content:figure_array[7],
                    a28content:figure_array[8],
                    a30content:figure_array[9],
                    a32content:figure_array[10],
                    a34content:figure_array[11],
                    a36content:figure_array[12],
                    a38content:figure_array[13],
                    a40content:figure_array[14],
                    a42content:figure_array[15],
                    a44content:figure_array[16],
                    a46content:figure_array[17],
                    a48content:figure_array[18],
                    a50content:figure_array[19],
                    a52content:figure_array[20],
                    a54content:figure_array[21],
                    a56content:figure_array[22],
                    a58content:figure_array[23],
                    a60content:figure_array[24],
                    a62content:figure_array[25],
                    a64content:figure_array[26],
                    a66content:figure_array[27],
                    a68content:figure_array[28],
                    a70content:figure_array[29],
                    a91set_info_ids:set_info._id,
                    a99footnote:""
                })//EOF new_field_info
                /* let sequence=Promise.resolve();                
                sequence=sequence.then(()=>{
                return savefieldinfo(new_field_info).then()
                .catch(err=>{
                    console.log(err)
                })
                })//EOF sequence   */              
            
            field_info_list.push(new_field_info)
            }//EOF for jsonlist

            console.log("No. of field_info_list:"+field_info_list.length);
            console.log("Finished analyzefield !")
        });//EOF anaylzefield
        let promise1=((set_info)=>{
            return new Promise((resolve, reject)=>{
                console.log("web_path:"+set_info.a05web_path);                                
                axios.get(set_info.a05web_path,{
            //axios.get('https://data.coa.gov.tw/service/opendata/OpenDataServiceList.aspx',{
                params:{
                    UnitId:set_info.a08UnitId,
                    $top:set_info.a10data_volume,
                    $skip:set_info.a15skip,
                    //$filter:set_info.a20filter,
                    //$orderBy:set_info.a25order
                }
                })
                //.then(function(resByApi,set_info){
                .then(function(resByApi){
                    console.log("the 1st datus:"+resByApi.data[0]);
                    let jsonlist=resByApi.data;
                    console.log("the 1st datus:"+jsonlist[0]);
                    anaylzelayer(jsonlist,set_info);
                    anaylzefield(jsonlist,set_info,layer_info_list);
                    console.log("1st content of 1st field_info: "+field_info_list[0].a20content);
                    let field_order=10;
                    for(let layer_info of layer_info_list){
                        if(layer_info.a25no_subkey===0){
                        field_order=field_order+2;
                        let field_name="a"+field_order+"content";
                        layer_info.a50fied_name=field_name;
                        }
                    }
                    let arraylist=[layer_info_list,field_info_list];
                    resolve(arraylist)
                })
                .catch((err)=>{
                    console.log(err)
                })
            })//EOF Promise
        })//EOF promise1
        
        let promise2=((layer_info)=>{
            return new Promise((resolve,reject)=>{ 
            layer_info.save(function(err, info) {
                console.log("saved layer_info:"+info.a20key_name)    
            })//EOF save
            resolve()
            })//EOF return Promise
            });//EOF promise2
        let promise3=((field_info)=>{
            return new Promise((resolve,reject)=>{ 
            field_info.save(function(err, info) {
                console.log("saved field_info:"+info.a91set_info_ids+"  "+info.a20content)    
            })//EOF save
            resolve()
            })//EOF return Promise
            });//EOF promise3

        promise0(setinfoid)
        .then((set_info)=>{
            return promise1(set_info)
        })
        .then((arraylist)=>{
            let sequence=Promise.resolve();
            arraylist[0].forEach(function(layer_info){                               
            sequence=sequence.then(()=>{
                //console.log("layer info within sequence!"+layer_info)
                    return  promise2(layer_info)
                })//EOF sequence then
                .catch(err=>{
                    console.log(err)
                })
            })//EOF forEach arraylist[0]    
            arraylist[1].forEach(function(field_info){                               
                sequence=sequence.then(()=>{
                        return  promise3(field_info)
                    })//EOF sequence then
                .catch(err=>{
                    console.log(err)
                })
            })//EOF forEach arraylist[1]
        })
        .catch((err)=>{
            console.log(err)
        });
        
        setTimeout(()=>{
            res.redirect("/api/layer_info?statusreport="+statusreport);
        },10000)
    },//EOF fetchdata
    
    //送至待輸入各欄位計數單位頁
    unitinput(req,res){
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
        console.log("going to layer info add unit page....");
        res.render("layer_info/addunitpage",{
            statusreport:listreport,
            layer_info_list:layer_info_list
        })
    })
    },

    //送至待輸入各欄位計數單位頁
    saveaddunit(req,res){
        let listreport=req.body.statusreport;
        console.log("executing saveaddunit()....");
        console.log("req.body.statusreport:"+req.body.statusreport);
        let layer_info_list=req.body.layer_info_list;
        console.log("recepted layer_info0:"+layer_info_list[0].a20key_name);
        console.log("req.body.layer_info0:"+req.body.layer_info_list[0].a45unit);
        let promise3=((layer_info)=>{
            return new Promise((resolve,reject)=>{  
            Layer_info.findOneAndUpdate({_id:layer_info._id}, layer_info, { new: true }, function(err, layer_info) {
                    if (err)
                        res.send(err);
                console.log("Updated layer_info:"+layer_info._id)    
            })//EOF findOneAndUpdate
            resolve()
            })//EOF return Promise
            });//EOF promise3
        let sequence=Promise.resolve();
        layer_info_list.forEach(function(layer_info){                               
            sequence=sequence.then(()=>{
                //console.log("layer info within sequence!"+layer_info)
                    return  promise3(layer_info)
                })//EOF sequence then
                .catch(err=>{
                    console.log(err)
                })
            })//EOF forEach
        console.log("Finished updating layer_info_list!" )
        outcome="補計數單位完成，請至資料階層清單檢視";
        res.send(outcome)
        },

    //送至待選擇欄位清單頁
    showfield(req,res){
        let listreport=req.query.statusreport;
        Layer_info.find({},function(err, layer_info) {
            if (err)
            res.send(err);
            //res.json(layer_info);
            console.log("status report during list"+listreport);
            /*for(let info of layer_info){
                console.log(info)
            }*/
            let layer_info_sublist=new Array();
            for(let info of layer_info){
                if(info.a25no_subkey===0){
                    layer_info_sublist.push(info)
                }
            }
            let layer_info_list=encodeURIComponent(JSON.stringify(layer_info_sublist));
            //res.setHeader('Cache-Control', 'no-cache');
            console.log("going to layer info for choosing page....");
            res.render("layer_info/forchoosepage",{
                statusreport:listreport,
                layer_info_list:layer_info_list
            })
        })
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