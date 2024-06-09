import mongoose from 'mongoose';
const TableName = "gpf_sub_type";
const TableSchema = new mongoose.Schema({
  gpf_sub_type: {
    type: String,
    required: true,
  },
  operation:{
    type:String,
    enum:['credit','debit'],
    required:true
  }
},{timestamps: true});

export const gpfSubType = mongoose.model(TableName, TableSchema)