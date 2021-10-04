const mongoose = require("mongoose");

//var mongoosePaginate = require('mongoose-paginate');

const tagSchema = new mongoose.Schema(
    {
    listId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"List",
        required:true
    }],
    tagtitle: {
        type: String,
        maxlength:20,
        unique:true
    },
},
  {
    timestamps: true,
  }

);
module.exports = mongoose.model("Tag", tagSchema);
