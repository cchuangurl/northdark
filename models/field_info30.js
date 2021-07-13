var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Field_infoSchema = new Schema(
  {
    a12content:{type:String,required:false},
    a14content:{type:String,required:false},
    a16content:{type:String,required:false},
    a18content:{type:String,required:false},
    a20content:{type:String,required:false},
    a22content:{type:String,required:false},
    a24content:{type:String,required:false},
    a26content:{type:String,required:false},
    a28content:{type:String,required:false},
    a30content:{type:String,required:false},
    a32content:{type:String,required:false},
    a34content:{type:String,required:false},
    a36content:{type:String,required:false},
    a38content:{type:String,required:false},
    a40content:{type:String,required:false},
    a42content:{type:String,required:false},
    a44content:{type:String,required:false},
    a46content:{type:String,required:false},
    a48content:{type:String,required:false},
    a50content:{type:String,required:false},
    a52content:{type:String,required:false},
    a54content:{type:String,required:false},
    a56content:{type:String,required:false},
    a58content:{type:String,required:false},
    a60content:{type:String,required:false},
    a62content:{type:String,required:false},
    a64content:{type:String,required:false},
    a66content:{type:String,required:false},
    a68content:{type:String,required:false},
    a70content:{type:String,required:false},
    a91set_info_ids:{type:Schema.Types.ObjectID,required:true},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for field_info's URL
Field_infoSchema
.virtual('url')
.get(function () {
  return '/api/field_info/' + this._id;
});

//Export model
module.exports = mongoose.model('Field_info30', Field_infoSchema);