import {Router} from 'express';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import {gpfSubType} from '../models/gpf_sub_type.model.js';
const router = Router();

// Create new gpf_subscription
router.route('/create').post(asyncErrorHandler(async(req,res)=>{
  const { gpf_sub_type ,operation} = req.body;
  if(!gpf_sub_type){
    return res.redirect('/gpf-sub-type?error=Gpf Sub Type is required');
  }
  let isSave = new gpfSubType({gpf_sub_type,operation});
  isSave = await isSave.save()
  if(!isSave){
    return res.redirect('/gpf-sub-type?error=Something went wrong');
  }
  return res.redirect('/gpf-sub-type?success=Gpf Sub Type Added Successfully');
}))

// Get all gpf_sub_types
router.route('/').get(asyncErrorHandler(async(req,res)=>{
  const gpf_sub_types = await gpfSubType.find({},{createdAt:0,updatedAt:0,__v:0});
  return res.json(new ApiResponse(200,gpf_sub_types,"Gpf Sub Type List"));
}))

router.route('/:id').get(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  if(!id){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const gpf_sub_type = await gpfSubType.findById(id);
  if(!gpf_sub_type){
    return res.json(new ApiResponse(404,"Gpf Sub Type not found"));
  }
  return res.json(new ApiResponse(200,"Gpf Sub Type Details",gpf_sub_type));
}))


router.route('/:id').put(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  const {gpf_sub_type} = req.body;
  if(!id || !gpf_sub_type){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const isUpdate = await gpfSubType.findByIdAndUpdate(id,{gpf_sub_type});
  if(!isUpdate){
    return res.json(new ApiResponse(400,"Something went wrong"));
  }
  return res.json(new ApiResponse(200,"Gpf Sub Type Updated Successfully"));
}))

router.route('/:id').delete(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  if(!id){
    return res.json(new ApiResponse(400,{},"Invalid Request"));
  }
  const isDelete = await gpfSubType.findByIdAndDelete(id);
  if(!isDelete){
    return res.json(new ApiResponse(400,{},"Something went wrong"));
  }
  return res.json(new ApiResponse(200,{},"Gpf Sub Type Deleted Successfully"));
}))

export default router;