import mongoose from 'mongoose';
const TableName = "login_details";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// Define schema
const TableSchema = new mongoose.Schema({
  name: { 
    type: String, 
    default: null 
  },
  email: { 
    type: String, 
    required:[true,"Email is required"]
  },
  password: { 
    type: String, 
    required:[true,"Password is required"] 
  },
  avatar: {
    type: String, // cloudinary url
    // required: true,
  },
  refreshToken: { 
    type: String,
  }
},{timestamps: true});

// Define model


TableSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});
TableSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

TableSchema.methods.generateAccessToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
          username: this.name,
          // fullName: this.fullName
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}
TableSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
  )
}

export const loginDetailsModel = mongoose.model(TableName, TableSchema)