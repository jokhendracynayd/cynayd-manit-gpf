import mongoose from "mongoose";
const tableName = "counter";
const counterSchema = new mongoose.Schema({
  employee_seq: { type: Number, default: 0 },
  establishment_seq: { type: Number, default: 0 },
  gpf_interest_seq: { type: Number, default: 0 },
  gpf_subscription_seq: { type: Number, default: 0 },
});

function nextEmployeeId() {
  return this.findOneAndUpdate({}, { $inc: { employee_seq: 1 } }, { new: true });
}

function nextEstablishmentId() {
  return this.findOneAndUpdate({}, { $inc: { establishment_seq: 1 } }, { new: true });
}

function nextGpfInterestId() {
  return this.findOneAndUpdate({}, { $inc: { gpf_interest_seq: 1 } }, { new: true });
}

function nextGpfSubcripation() {
  return this.findOneAndUpdate({}, { $inc: { gpf_subscription_seq: 1 } }, { new: true });
}

counterSchema.statics.nextEmployeeId = nextEmployeeId;
counterSchema.statics.nextEstablishmentId = nextEstablishmentId;
counterSchema.statics.nextGpfInterestId = nextGpfInterestId;
counterSchema.statics.nextGpfSubcripation = nextGpfSubcripation;

const counter = mongoose.model(tableName, counterSchema);
export default counter;