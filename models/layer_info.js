var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Layer_infoSchema = new Schema(
  {
    a05set_info_ids:{type:Schema.Types.ObjectID,required:true},
    a10dataset_name:{type:String,required:false},
    a15data_layer:{type:Number,required:false},
    a20key_name:{type:String,required:true},
    a25no_subkey:{type:Number,required:true},
    a30no_container:{type:Number,required:false},
    a35upper_layer_id:{type:Schema.Types.ObjectID,required:false},
    a40upper_key:{type:String,required:false},
    a45unit:{type:String,required:false},
    a50field_name:{type:String,required:false},
    a99footnote:{type:String,required:false}
  }
);

// Virtual for layer_info's URL
Layer_infoSchema
.virtual('url')
.get(function () {
  return '/api/layer_info/' + this._id;
});

//Export model
module.exports = mongoose.model('Layer_info', Layer_infoSchema);