var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Set_infoSchema = new Schema(
  {
    a05web_path:{type:String,required:true},
    a08UnitId:{type:String,required:false},
    a10data_volume:{type:Number,required:false},
    a15skip:{type:Number,required:false},
    a20filter:{type:String,required:false},
    a25order:{type:String,required:false},
    a30dataset_name:{type:String,required:false},
    a35describe:{type:String,required:false},
    a40date_of_get:{type:Date,required:true},
    a45filename_part:{type:String,required:true},
    a50preventer:{type:Number,required:false},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for set_info's URL
Set_infoSchema
.virtual('url')
.get(function () {
  return '/api/set_info/' + this._id;
});

//Export model
module.exports = mongoose.model('Set_info', Set_infoSchema);