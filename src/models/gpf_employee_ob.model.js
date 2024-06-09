import mongoose from "mongoose";
const tableName = "employee_ob";  
const counterSchema = new mongoose.Schema({
  employee_id:{
    type: String,
    required: true,
  },
  employee_name:{
    type: String,
    required: true,
  },
  employee_gpf_no:{
    type: String,
    required: true,
  },
  employee_ob_amount:{
    type:Number,
    required: true,
  },
  year:{
    type: String,
    required: true,
  },
  month:{
    type: String,
    required: true,
  },
},
{ timestamps: true });

const employee_ob = mongoose.model(tableName, counterSchema);

export default employee_ob;