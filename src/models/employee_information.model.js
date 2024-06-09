import mongoose from 'mongoose';
const TableName = "employee_information";
// Define schema
const TableSchema = new mongoose.Schema({
  // idemployee_information: {
  //   type: String,
  //   required: true,
  //   default: null
  // },
  employee_id: { 
    type: String,
    default: null 
  },
  employee_name: { 
    type: String, 
    default: null 
  },
  employee_desg: { 
    type: String, 
    default: null 
  },
  employee_gpf_no: { 
    type: String, 
    default: null 
  },
  employee_gpf_ledger_status: { 
    type: Number, 
    default: 0 
  },
  // employee_created_at: { 
  //   type: Date, 
  //   default: null 
  // },
  employee_created_by: { 
    type: String, 
    default: null 
  },
  employee_delete_status: { 
    type: Number, 
    default: 0 
  }
},{timestamps: true});

// Define model
export const employee_information = mongoose.model(TableName, TableSchema)