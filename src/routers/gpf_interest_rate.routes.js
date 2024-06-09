import {Router} from 'express';
import {gpfInterestRateModel} from '../models/gpf_interest_rate.model.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
const router = Router();

// Create new gpfInterestRateModel
router.route('/create').post(asyncErrorHandler(async(req,res)=>{
  let { monthYear, interest } = req.body;
  console.log(monthYear,interest);
  interest = parseFloat(interest);
  let year = monthYear.split('-')[0];
  let month = monthYear.split('-')[1];
  // validate the request body
  if(!interest || !year || !month){
    return res.redirect('/gpf-interest-rate?error=Invalid Request')
  }

  let isExist = await gpfInterestRateModel.findOne({gpf_intereset_year: year, gpf_intereset_month: month});
  if(isExist){
    return res.redirect('/gpf-interest-rate?error=Gpf Intereset Rate Already Exist');
  }
  // // create a new gpfInterestRateModel
  const newGpfInteresetRate = new gpfInterestRateModel({
    gpf_interest_rate: interest,
    gpf_intereset_year: year,
    gpf_intereset_month: month,
  });
  // // save the gpfInterestRateModel
  await newGpfInteresetRate.save();
  return res.redirect('/gpf-interest-rate?success=Gpf Intereset Rate Created Successfully');
}))

// Get all gpfInterestRateModels
router.route('/').get(asyncErrorHandler(async(req,res)=>{
  const gpfInterestRateModels = await gpfInterestRateModel.find();
  return res.json(new ApiResponse(200,"Gpf Intereset Rate List",gpfInterestRateModels));
}))

// Get gpfInterestRateModel by id
router.route('/:id').get(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  // validate the request
  if(!id){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const gpfInterestRateModel = await gpfInterestRateModel.findById(id);
  if(!gpfInterestRateModel){
    return res.json(new ApiResponse(404,"Gpf Intereset Rate not found"));
  }
  return res.json(new ApiResponse(200,"Gpf Intereset Rate Details",gpfInterestRateModel));
}))

// Update gpfInterestRateModel by id
router.route('/:id').put(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  const {gpf_intereset_intreset_rate,gpf_intereset_year,gpf_intereset_month} = req.body;
 
  console.log(gpf_intereset_intreset_rate,gpf_intereset_year,gpf_intereset_month,id);
  // validate the request
  if(!id || !gpf_intereset_intreset_rate || !gpf_intereset_year || !gpf_intereset_month){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const gpfInterestRate = await gpfInterestRateModel.findById(id);
  if(!gpfInterestRate){
    return res.json(new ApiResponse(404,"Gpf Intereset Rate not found"));
  }
  gpfInterestRate.gpf_intereset_intreset_rate = gpf_intereset_intreset_rate;
  gpfInterestRate.gpf_intereset_year = gpf_intereset_year;
  gpfInterestRate.gpf_intereset_month = gpf_intereset_month;
  await gpfInterestRate.save();
  return res.json(new ApiResponse(200,"Gpf Intereset Rate Updated Successfully"));
}))

// Update gpfInterestRateModel by id with patch
router.route('/:id').patch(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  const {gpf_intereset_intreset_rate,gpf_intereset_year,gpf_intereset_month} = req.body;
  // validate the request
  if(!id || !gpf_intereset_intreset_rate || !gpf_intereset_year || !gpf_intereset_month){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const gpfInterestRateModel = await gpfInterestRateModel.findById(id);
  if(!gpfInterestRateModel){
    return res.json(new ApiResponse(404,"Gpf Intereset Rate not found"));
  }
  if(gpf_intereset_intreset_rate){
    gpfInterestRateModel.gpf_intereset_intreset_rate = gpf_intereset_intreset_rate;
  }
  if(gpf_intereset_year){
    gpfInterestRateModel.gpf_intereset_year = gpf_intereset_year;
  }
  if(gpf_intereset_month){
    gpfInterestRateModel.gpf_intereset_month = gpf_intereset_month;
  }
  await gpfInterestRateModel.save();
  return res.json(new ApiResponse(200,"Gpf Intereset Rate Updated Successfully"));
}))

// Delete gpfInterestRateModel by id
router.route('/:id').delete(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  // validate the request
  if(!id){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const gpfInterestRate = await gpfInterestRateModel.findById(id);
  if(!gpfInterestRate){
    return res.json(new ApiResponse(404,"Gpf Intereset Rate not found"));
  }
  gpfInterestRate.gpf_intereset_delete_status = 1;
  await gpfInterestRate.save();
  return res.json(new ApiResponse(200,"Gpf Intereset Rate Deleted Successfully"));
}))




export default router;