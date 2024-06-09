import {Router} from 'express';
import {establishment_master} from '../models/establishment_master.model.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import counter from '../models/counter.js';
const router = Router();


// Create new establishment 
router.route('/create').post(asyncErrorHandler(async(req,res)=>{
  const {establishment_name,establishment_address,establishment_default_status} = req.body;
  // validate the request body 
  if(!establishment_name || !establishment_address){
    return res.redirect('/add-establishment?error=Establishment Name and Address are required');
  }
  // create a new establishment
  let establishment_id = await counter.nextEstablishmentId();
  const newEstablishment = new establishment_master({
    idestablishment_master: establishment_id.establishment_seq,
    establishment_name,
    establishment_address,
    establishment_default_status: establishment_default_status || 'No',
  });
  // save the establishment
  await newEstablishment.save();
  return res.redirect('/add-establishment?success=Establishment Created Successfully');
  // return res.json(new ApiResponse(200,"Hello World"));

}))

// Get all establishments
router.route('/view').get(asyncErrorHandler(async(req,res)=>{
  const establishments = await establishment_master.find();
  console.log(establishments);
  return res.render('html/view-establishment.ejs',{establishments});
}))


// Get establishment by id
router.route('/:id').get(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  // validate the request
  if(!id){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const establishment = await establishment_master.findById(id);
  if(!establishment){
    return res.json(new ApiResponse(404,"Establishment not found"));
  }
  return res.json(new ApiResponse(200, establishment,"Establishment Details"));
}))

// Update establishment by id
router.route('/:id').put(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  const {establishment_name,establishment_address} = req.body;
  // validate the request
  if(!id || !establishment_name || !establishment_address){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const establishment = await establishment_master.findById(id);
  if(!establishment){
    return res.json(new ApiResponse(404,"Establishment not found"));
  }
  establishment.establishment_name = establishment_name;
  establishment.establishment_address = establishment_address;
  await establishment.save();
  return res.json(new ApiResponse(200,"Establishment Updated Successfully"));
}))

// Update employee by id with patch request
router.route('/:id').patch(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  const {establishment_name,establishment_address} = req.body;
  // validate the request
  if(!id || !establishment_name || !establishment_address){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const establishment = await establishment_master.findById(id);
  if(!establishment){
    return res.json(new ApiResponse(404,"Establishment not found"));
  }
  if(establishment_name){
    establishment.establishment_name = establishment_name;
  }
  if(establishment_address){
    establishment.establishment_address = establishment_address;
  }
  await establishment.save();
  return res.json(new ApiResponse(200,"Establishment Updated Successfully"));
}))

// Delete establishment by id
router.route('/:id').delete(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  // validate the request
  if(!id){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const establishment = await establishment_master.findById(id);
  if(!establishment){
    return res.json(new ApiResponse(404,"Establishment not found"));
  }
  await establishment.remove();
  return res.json(new ApiResponse(200,"Establishment Deleted Successfully"));
}))


export default router;