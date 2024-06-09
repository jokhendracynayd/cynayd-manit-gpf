import {Router} from 'express';
import {loginDetailsModel} from '../models/login_details.model.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
const router = Router();

// Create new loginDetailsModel
const generateAccessAndRefereshTokens = async(userId) =>{
  try {
      const user = await loginDetailsModel.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}


  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}


router.route('/register').post(asyncErrorHandler(async(req,res)=>{
  let { name, email, password } = req.body;
  if([name,email,password].some((field) => field?.trim() === "" || !field)){
    return res.json(new ApiResponse(400,{},"Invalid Request"));
  }
  let isExist = await loginDetailsModel.findOne({email: email});
  if(isExist){
    return res.json(new ApiResponse(400,{},"User Already Exist"));
  }
  // create a new loginDetailsModel
  const newLoginDetails = new loginDetailsModel({
    name: name,
    email: email,
    password: password,
  });
  // save the loginDetailsModel
  await newLoginDetails.save();
  return res.json(new ApiResponse(200,newLoginDetails,"User Created Successfully"));
}))


router.route('/login').post(asyncErrorHandler(async(req,res)=>{
  let { email, password } = req.body;
  // return;
  if([email,password].some((field) => field?.trim() === "" || !field)){
    return res.redirect("/login?error=Invalid Request");
  }
  let isExist = await loginDetailsModel.findOne({email: email});
  if(!isExist){
    return res.redirect("/login?error=User Not Found");
  }
  const isPasswordValid = await isExist.isPasswordCorrect(password)

   if (!isPasswordValid) {
    return res.redirect("/login?error=Invalid Password");
    }
    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(isExist._id);
    const loggedInUser = await loginDetailsModel.findById(isExist._id).select("-password -refreshToken");
    
    const currentTime = new Date();

  // Calculate the expiration time (1 minute from the current time)
  const expirationTime = new Date(currentTime.getTime() + 60000); // 60000 milliseconds = 1 minute

    const options = {
      httpOnly: true,
      secure: true,
      // expires: expirationTime,
    };
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .redirect("/");

}))

router.route('/logout').get(asyncErrorHandler(async(req,res)=>{
  res.clearCookie("accessToken")
  res.clearCookie("refreshToken")
  return res.redirect("/login");
}))

export default router;