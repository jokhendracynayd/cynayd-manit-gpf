import mongoose  from "mongoose";

const UserGpfSessionSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    unique: true
  },
  data: {
    type: Object,
    required: true
  }
}, {timestamps: true});

export default mongoose.model("UserGpfSession", UserGpfSessionSchema);