import {Router} from 'express';
import {GpfSubscription} from '../models/gpf_subscription.model.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import {employee_information} from '../models/employee_information.model.js';
import {getGpfSubscriptions,updateIsLocked} from '../controllers/gpf_ladger.controller.js'
const router = Router();

router.route('/nothing').get(asyncErrorHandler(async(req,res)=>{
  // let temp = [
  //   {
  //     gpf_subs_amount:2646,
  //     gpf_subs_type:"Salary-GPF Subscription",
  //     gpf_subs_enscashment_date:"2022-04-01",
  //     employee_id:"1001",
  //     employee_desg:"SENIOR ASSISTANT",
  //     employee_name:"JOSHI N D"
  //   },
  //   {
  //     gpf_subs_amount:2646,
  //     gpf_subs_type:"Salary-GPF Subscription",
  //     gpf_subs_enscashment_date:"2022-05-01",
  //     employee_id:"1001",
  //     employee_desg:"SENIOR ASSISTANT",
  //     employee_name:"JOSHI N D"
  //   },
  //   {
  //     gpf_subs_amount:2646,
  //     gpf_subs_type:"Salary-GPF Subscription",
  //     gpf_subs_enscashment_date:"2022-06-01",
  //     employee_id:"1001",
  //     employee_desg:"SENIOR ASSISTANT",
  //     employee_name:"JOSHI N D"
  //   },
  //   {
  //     gpf_subs_amount:2646,
  //     gpf_subs_type:"Salary-GPF Subscription",
  //     gpf_subs_enscashment_date:"2022-07-01",
  //     employee_id:"1001",
  //     employee_desg:"SENIOR ASSISTANT",
  //     employee_name:"JOSHI N D"
  //   },
  //   {
  //     gpf_subs_amount:2724,
  //     gpf_subs_type:"Salary-GPF Subscription",
  //     gpf_subs_enscashment_date:"2022-08-01",
  //     employee_id:"1001",
  //     employee_desg:"SENIOR ASSISTANT",
  //     employee_name:"JOSHI N D"
  //   },
  //   {
  //     gpf_subs_amount:2724,
  //     gpf_subs_type:"Salary-GPF Subscription",
  //     gpf_subs_enscashment_date:"2022-09-01",
  //     employee_id:"1001",
  //     employee_desg:"SENIOR ASSISTANT",
  //     employee_name:"JOSHI N D"
  //   },
  //   {
  //     gpf_subs_amount:7724,
  //     gpf_subs_type:"Salary-GPF Subscription",
  //     gpf_subs_enscashment_date:"2022-10-01",
  //     employee_id:"1001",
  //     employee_desg:"SENIOR ASSISTANT",
  //     employee_name:"JOSHI N D"
  //   },
  //   {
  //     gpf_subs_amount:7724,
  //     gpf_subs_type:"Salary-GPF Subscription",
  //     gpf_subs_enscashment_date:"2022-11-01",
  //     employee_id:"1001",
  //     employee_desg:"SENIOR ASSISTANT",
  //     employee_name:"JOSHI N D"
  //   },
  //   {
  //     gpf_subs_amount:250000,
  //     gpf_subs_type:"GPF-Withdrawal",
  //     gpf_subs_enscashment_date:"2022-11-05",
  //     employee_id:"1001",
  //     employee_desg:"SENIOR ASSISTANT",
  //     employee_name:"JOSHI N D"
  //   },
  //   {
  //     gpf_subs_amount:7724,
  //     gpf_subs_type:"Salary-GPF Subscription",
  //     gpf_subs_enscashment_date:"2022-12-01",
  //     employee_id:"1001",
  //     employee_desg:"SENIOR ASSISTANT",
  //     employee_name:"JOSHI N D"
  //   },
  //   {
  //     gpf_subs_amount:7724,
  //     gpf_subs_type:"Salary-GPF Subscription",
  //     gpf_subs_enscashment_date:"2023-01-01",
  //     employee_id:"1001",
  //     employee_desg:"SENIOR ASSISTANT",
  //     employee_name:"JOSHI N D"
  //   },
  //   {
  //     gpf_subs_amount:7724,
  //     gpf_subs_type:"Salary-GPF Subscription",
  //     gpf_subs_enscashment_date:"2023-02-01",
  //     employee_id:"1001",
  //     employee_desg:"SENIOR ASSISTANT",
  //     employee_name:"JOSHI N D"
  //   },
  //   {
  //     gpf_subs_amount:10417,
  //     gpf_subs_type:"GPF-Refund",
  //     gpf_subs_enscashment_date:"2023-02-05",
  //     employee_id:"1001",
  //     employee_desg:"SENIOR ASSISTANT",
  //     employee_name:"JOSHI N D"
  //   },
  //   {
  //     gpf_subs_amount:7724,
  //     gpf_subs_type:"Salary-GPF Subscription",
  //     gpf_subs_enscashment_date:"2023-03-01",
  //     employee_id:"1001",
  //     employee_desg:"SENIOR ASSISTANT",
  //     employee_name:"JOSHI N D"
  //   },
  //   {
  //     gpf_subs_amount:10417,
  //     gpf_subs_type:"GPF-Refund",
  //     gpf_subs_enscashment_date:"2023-03-06",
  //     employee_id:"1001",
  //     employee_desg:"SENIOR ASSISTANT",
  //     employee_name:"JOSHI N D"
  //   },
  //   {
  //     gpf_subs_amount:7724,
  //     gpf_subs_type:"Salary-GPF Subscription",
  //     gpf_subs_enscashment_date:"2023-03-07",
  //     employee_id:"1001",
  //     employee_desg:"SENIOR ASSISTANT",
  //     employee_name:"JOSHI N D"
  //   },
  //   {
  //     gpf_subs_amount:10417,
  //     gpf_subs_type:"GPF-Refund",
  //     gpf_subs_enscashment_date:"2023-03-10",
  //     employee_id:"1001",
  //     employee_desg:"SENIOR ASSISTANT",
  //     employee_name:"JOSHI N D"
  //   }
  // ];
  
  let temp = [
    {
      gpf_subs_amount:7724,
      gpf_subs_type:"Salary-GPF Subscription",
      gpf_subs_enscashment_date:"2023-04-01",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:10417,
      gpf_subs_type:"GPF-Refund",
      gpf_subs_enscashment_date:"2023-04-05",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:7724,
      gpf_subs_type:"Salary-GPF Subscription",
      gpf_subs_enscashment_date:"2023-05-01",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:108332.45,
      gpf_subs_type:"GPF-Refund",
      gpf_subs_enscashment_date:"2023-05-05",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:7724,
      gpf_subs_type:"Salary-GPF Subscription",
      gpf_subs_enscashment_date:"2023-06-01",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:60000,
      gpf_subs_type:"GPF-Refund",
      gpf_subs_enscashment_date:"2023-06-05",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:2808,
      gpf_subs_type:"Salary-GPF Subscription",
      gpf_subs_enscashment_date:"2023-07-01",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:10000,
      gpf_subs_type:"GPF-Refund",
      gpf_subs_enscashment_date:"2023-07-05",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:2808,
      gpf_subs_type:"Salary-GPF Subscription",
      gpf_subs_enscashment_date:"2023-08-01",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:10000,
      gpf_subs_type:"GPF-Refund",
      gpf_subs_enscashment_date:"2023-08-05",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:2808,
      gpf_subs_type:"Salary-GPF Subscription",
      gpf_subs_enscashment_date:"2023-09-01",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:10000,
      gpf_subs_type:"GPF-Refund",
      gpf_subs_enscashment_date:"2023-09-05",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:2808,
      gpf_subs_type:"Salary-GPF Subscription",
      gpf_subs_enscashment_date:"2023-10-01",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:10000,
      gpf_subs_type:"GPF-Refund",
      gpf_subs_enscashment_date:"2023-10-05",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:2808,
      gpf_subs_type:"Salary-GPF Subscription",
      gpf_subs_enscashment_date:"2023-11-01",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:2808,
      gpf_subs_type:"Salary-GPF Subscription",
      gpf_subs_enscashment_date:"2023-12-01",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:2808,
      gpf_subs_type:"Salary-GPF Subscription",
      gpf_subs_enscashment_date:"2024-01-01",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:2808,
      gpf_subs_type:"Salary-GPF Subscription",
      gpf_subs_enscashment_date:"2024-02-01",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    {
      gpf_subs_amount:2808,
      gpf_subs_type:"Salary-GPF Subscription",
      gpf_subs_enscashment_date:"2023-03-01",
      employee_id:"1001",
      employee_desg:"SENIOR ASSISTANT",
      employee_name:"JOSHI N D"
    },
    
  ];

  await GpfSubscription.insertMany(temp);
  return res.send("done");
}))



// Create new gpf_subscription
router.route('/create').post(asyncErrorHandler(async(req,res)=>{
  // console.log(req.body);
  const { id,status, 'gpf_amount[]': gpfAmount, 'gpf_sub_type[]': gpfSubType, 'encashment_date[]': encashmentDate, 'voucher_no[]': voucherNo, 'remark[]': remark ,'locked[]':locked} = req.body;
  console.log(req.body);
  if(!id){
    return res.redirect('/gpf-ladger?error=Employee Id is required');
  }
  let employee = await employee_information.findOne({employee_id:id});
  let data = [];
  // console.log(object.keys(req.body));
  if(status == "single"){
    await GpfSubscription.create({
      employee_id:id,
      employee_name:employee.employee_name,
      employee_desg:employee.employee_desg,
      gpf_subs_amount:gpfAmount,
      gpf_subs_type:gpfSubType,
      gpf_subs_enscashment_date:encashmentDate,
      gpf_subs_vocher_no:voucherNo,
      remark:remark,
      // isLocked:locked
    });
    return res.redirect('/gpf-ladger?success=Gpf Subscription Added Successfully');
  }else{
    console.log(gpfAmount.length,"this is the lenght of gpfAmount");
    for(let i=0;i<gpfAmount.length;i++){
      data.push({
        employee_id:id,
        employee_name:employee.employee_name,
        employee_desg:employee.employee_desg,
        gpf_subs_amount:gpfAmount[i],
        gpf_subs_type:gpfSubType[i],
        gpf_subs_enscashment_date:encashmentDate[i],
        gpf_subs_vocher_no:voucherNo[i],
        remark:remark[i],
        // isLocked:locked[i]
      })
    }
    console.log("this is data befor instert to database",data);
    await GpfSubscription.insertMany(data);
    return res.redirect('/gpf-ladger?success=Gpf Subscription Added Successfully');
  }
}))

// get all gpf_subscriptions based on gpf_no, employee_id and year
router.route('/get-all-subcription').post(asyncErrorHandler(getGpfSubscriptions));

// update isLocked field 
router.route('/update-isLocked/:id/:status').get(asyncErrorHandler(updateIsLocked));
// Get all gpf_subscriptions
router.route('/').get(asyncErrorHandler(async(req,res)=>{
  const gpf_subscriptions = await GpfSubscription.find();
  return res.json(new ApiResponse(200,"Gpf Subscription List",gpf_subscriptions));
}))

// Get gpf_subscription by id
router.route('/:id').get(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  // validate the request
  if(!id){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const gpf_subscription = await GpfSubscription.findById(id);
  if(!gpf_subscription){
    return res.json(new ApiResponse(404,"Gpf Subscription not found"));
  }
  return res.json(new ApiResponse(200,"Gpf Subscription Details",gpf_subscription));
}))

// Update gpf_subscription by id
router.route('/:id').put(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  const {gpf_subs_id,gpf_subs_year,gpf_subs_amount,gpf_subs_type,gpf_subs_enscashment_date,gpf_subs_vocher_no} = req.body;
  // validate the request
  if(!id || !gpf_subs_id || !gpf_subs_year || !gpf_subs_amount || !gpf_subs_type || !gpf_subs_enscashment_date || !gpf_subs_vocher_no || !gpf_subs_created_at || !gpf_subs_created_by){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const gpf_subscription = await GpfSubscription.findById(id);
  if(!gpf_subscription){
    return res.json(new ApiResponse(404,"Gpf Subscription not found"));
  }
  gpf_subscription.gpf_subs_id = gpf_subs_id;
  gpf_subscription.gpf_subs_year = gpf_subs_year;
  gpf_subscription.gpf_subs_amount = gpf_subs_amount;
  gpf_subscription.gpf_subs_type = gpf_subs_type;
  gpf_subscription.gpf_subs_enscashment_date = gpf_subs_enscashment_date;
  gpf_subscription.gpf_subs_vocher_no = gpf_subs_vocher_no;
  await gpf_subscription.save();
  return res.json(new ApiResponse(200,"Gpf Subscription Updated Successfully"));
}))

// Update gpf_subscription by id with patch
router.route('/:id').patch(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  const {gpf_subs_id,gpf_subs_year,gpf_subs_amount,gpf_subs_type,gpf_subs_enscashment_date,gpf_subs_vocher_no} = req.body;
  // validate the request
  if(!id || !gpf_subs_id || !gpf_subs_year || !gpf_subs_amount || !gpf_subs_type || !gpf_subs_enscashment_date || !gpf_subs_vocher_no || !gpf_subs_created_at || !gpf_subs_created_by){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const gpf_subscription = await GpfSubscription.findById(id);
  if(!gpf_subscription){
    return res.json(new ApiResponse(404,"Gpf Subscription not found"));
  }
  if(gpf_subs_id){
    gpf_subscription.gpf_subs_id = gpf_subs_id;
  }
  if(gpf_subs_year){
    gpf_subscription.gpf_subs_year = gpf_subs_year;
  }
  if(gpf_subs_amount){
    gpf_subscription.gpf_subs_amount = gpf_subs_amount;
  }
  if(gpf_subs_type){
    gpf_subscription.gpf_subs_type = gpf_subs_type;
  }
  if(gpf_subs_enscashment_date){
    gpf_subscription.gpf_subs_enscashment_date = gpf_subs_enscashment_date;
  }
  if(gpf_subs_vocher_no){
    gpf_subscription.gpf_subs_vocher_no = gpf_subs_vocher_no;
  }
  await gpf_subscription.save();
  return res.json(new ApiResponse(200,"Gpf Subscription Updated Successfully"));
}))

// Delete gpf_subscription by id
router.route('/:id').delete(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  // validate the request
  if(!id){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const gpf_subscription = await GpfSubscription.findById(id);
  if(!gpf_subscription){
    return res.json(new ApiResponse(404,"Gpf Subscription not found"));
  }
  await gpf_subscription.remove();
  return res.json(new ApiResponse(200,"Gpf Subscription Deleted Successfully"));
}))


export default router;