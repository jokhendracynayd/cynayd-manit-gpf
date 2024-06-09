import mongoose from 'mongoose';

const TableName = "establishment_master";

// Define schema
const TableSchema = new mongoose.Schema({
  idestablishment_master: {
    type: String,
    required: true,
    default: null
  },
  establishment_name: { 
    type: String, 
    required: true 
  },
  establishment_address: { 
    type: String, 
    required: true 
  },
  establishment_default_status: { 
    type: String, 
    enum: ['Yes', 'No'],
    default: 'No'
  },
  establishment_created_by: { 
    type: String,
  }
},{timestamps: true});

// Define model
export  const establishment_master = mongoose.model(TableName, TableSchema)