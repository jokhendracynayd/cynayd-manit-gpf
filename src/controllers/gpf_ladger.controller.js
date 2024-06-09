import {GpfSubscription} from '../models/gpf_subscription.model.js';
import ApiResponse from '../utils/ApiResponse.js';

// Get all gpf_subscriptions

const getGpfSubscriptions = async (req, res) => {
  const {gpf_no,employee_id,year} = req.body;
  console.log(gpf_no,employee_id,year);
  let query;
  if(!year){
    return res.status(400).json(new ApiResponse(400, "Invalid Request"));
  }
  if (gpf_no) {
    query = { gpf_no: gpf_no };
  } else if (employee_id) {
    query = { employee_id: employee_id };
  } else {
    return res.status(400).json(new ApiResponse(400, "Invalid Request"));
  }
  let Parseyear = parseInt(year);
  query.gpf_subs_enscashment_date = {
    $gte: new Date(Parseyear, 0, 1), // Start of the Parseyear
    $lt: new Date(Parseyear + 1, 0, 1) // Start of the next year
  };


  const gpf_subscriptions = await GpfSubscription.find(query,{updatedAt:0,createdAt:0,__v:0,gpf_subs_created_by:0});
  return res.status(200).json(new ApiResponse(200,gpf_subscriptions, "Gpf Subscription List" ));
};

const updateIsLocked = async(req,res)=>{
  const id = req.params.id;
  const status = req.params.status;
  if(!id || !status){
    return res.status(400).json(new ApiResponse(400,"Invalid Request"));
  }
  const gpf_subscription = await GpfSubscription.findById(id);
  if(!gpf_subscription){
    return res.status(404).json(new ApiResponse(404,"Gpf Subscription not found"));
  }
  gpf_subscription.isLocked = status;
  await gpf_subscription.save();
  return res.status(200).json(new ApiResponse(200,{},"Updated Successfully"));
};

// export all controllers

export {getGpfSubscriptions,updateIsLocked};