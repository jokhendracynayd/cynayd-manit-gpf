import mongoose from 'mongoose';

const TableName = "gpf_intereset_rate";

// Define schema
const TableSchema = new mongoose.Schema({
  gpf_intereset_year: { 
    type: String, 
    required: true 
  },
  gpf_intereset_month: { 
    type: String, 
    required: true 
  },
  gpf_interest_rate: { 
    type:mongoose.Decimal128, 
    required: true 
  },
  gpf_intereset_created_by: { 
    type: String, 
    default: null
    // required: true 
  },
  gpf_intereset_delete_status: { 
    type: Number, 
    required: true, 
    default: 0 
  }
},{timestamps: true});

// Define model
export const gpfInterestRateModel = mongoose.model(TableName, TableSchema)
