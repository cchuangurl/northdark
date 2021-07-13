var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DictionarySchema = new Schema(
  {
    a05name_domain:{type:String,required:false},
    a10uid:{type:String,required:false},
    a15name_ch:{type:String,required:true},
    a20alias:{type:String,required:false},
    a25code_a:{type:String,required:false},
    a30name_a_ch:{type:String,required:false},
    a35code_b:{type:String,required:false},
    a40name_b_ch:{type:String,required:false},
    a45code_c:{type:String,required:false},
    a50name_c_ch:{type:String,required:false},
    a55code_d:{type:String,required:false},
    a60name_d_ch:{type:String,required:false},
    a65code_e:{type:String,required:false},
    a70name_e_ch:{type:String,required:false},
    a75code_apply:{type:String,required:false},
    a80data_unit:{type:String,required:false},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for dictionary's URL
DictionarySchema
.virtual('url')
.get(function () {
  return '/api/dictionary/' + this._id;
});

//Export model
module.exports = mongoose.model('Dictionary', DictionarySchema);