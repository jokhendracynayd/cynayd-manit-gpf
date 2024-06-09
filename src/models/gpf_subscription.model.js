import mongoose from 'mongoose';

const TableName = "gpf_subscription";

// Define schema
const TableSchema = new mongoose.Schema({
  // idgpf_subscription: {
  //   type: String,
  //   required: true,
  //   default: null
  // },
  gpf_no:{
    type: String,
  },
  employee_desg: {
    type: String,
    required: true
  },
  employee_id: {
    type: String,
    required: true
  },
  employee_name: {
    type: String,
    required: true
  },
  // gpf_subs_year: {
  //   type: String,
  //   required: true
  // },
  gpf_subs_amount: {
    type: Number,
    required: true
  },
  gpf_subs_type: {
    type: String,
    required: true
  },
  gpf_subs_enscashment_date: {
    type: Date,
    required: true
  },
  gpf_subs_remarks: {
    type: String,
    default: "No Remarks"
  },
  gpf_subs_vocher_no: {
    type: String,
    default: "No Voucher No",
    required: true
  },
  gpf_subs_created_by: {
    type: String,
    default: null
  },
  isLocked: {
    type: Boolean,
    required: true,
    default: false
  },
  gpf_subs_delete_status: {
    type: Number,
    required: true,
    default: 0
  }
},{timestamps: true});

// Define model
export const GpfSubscription = mongoose.model(TableName, TableSchema);

