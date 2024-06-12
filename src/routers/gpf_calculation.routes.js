import {Router} from 'express';
import {employee_information} from '../models/employee_information.model.js';
import {GpfSubscription} from "../models/gpf_subscription.model.js"
import {gpfSubType} from "../models/gpf_sub_type.model.js"
import {gpfInterestRateModel} from "../models/gpf_interest_rate.model.js";
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import EmployeeOb from '../models/gpf_employee_ob.model.js'
import userSessionModel from '../models/usergpfsession.model.js'
const router = Router();

var months = {
  '1':{
    name:'January',
    days:31
  },
  '2':{
    name:'February',
    days:28
  },
  '3':{
    name:'March',
    days:31
  },
  '4':{
    name:'April',
    days:30
  },
  '5':{
    name:'May',
    days:31
  },
  '6':{
    name:'June',
    days:30
  },
  '7':{
    name:'July',
    days:31
  },
  '8':{
    name:'August',
    days:31
  },
  '9':{
    name:'September',
    days:30
  },
  '10':{
    name:'October',
    days:31
  },
  '11':{
    name:'November',
    days:30
  },
  '12':{
    name:'December',
    days:31
  }
}


async function calculateOpeningBalance(startyear, startmonth,employee_id,gpf_sub_types) {
  startmonth = parseInt(startmonth)-1;
  // console.log("this is the month and year",new Date(`${startyear}-${(parseInt(startmonth)+1)<9?'0'+ startmonth:startmonth}-${months[startmonth].days}`));
  const gpf_sub = await GpfSubscription.aggregate([
    {
      $match: {
        employee_id: employee_id,
        gpf_subs_enscashment_date: { $lte: new Date(`${startyear}-${parseInt(startmonth)<9?'0'+ startmonth:startmonth}-${months[startmonth].days}`) } 
      }
    },
    {
      $project: {
        year: { $year: "$gpf_subs_enscashment_date" },
        month: { $month: "$gpf_subs_enscashment_date" },
        gpf_subs_amount: 1,
        employee_desg: 1,
        employee_id: 1,
        employee_name: 1,
        gpf_subs_type: 1,
        gpf_subs_enscashment_date: 1,
        isLocked: 1,
        gpf_subs_delete_status: 1
      }
    },
    {
      $group: {
        _id: { year: "$year", month: "$month" },
        records: { $push: "$$ROOT" }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);

  // console.log("this is the result of gfpsub",gpf_sub[0]?.records);
  let employeeOb = await EmployeeOb.findOne({employee_id:employee_id});
  if(!employeeOb){
    return null;
  }
  if (gpf_sub.length === 0) {
    return employeeOb.employee_ob_amount;
  }

  let interestRate = 7.10/12;
  let progressiveTotal = 0.0;
  let interest = 0.0;
  let opening_balance = employeeOb.employee_ob_amount;
  for (let index = 0; index < gpf_sub.length; index++) {
    progressiveTotal = 0.0;
    let tempProgressiveTotal = 0.0;
    gpf_sub[index].records.forEach(item => {
      if(gpf_sub_types[item.gpf_subs_type] === 'credit'){
        tempProgressiveTotal += item.gpf_subs_amount;
      }else{
        tempProgressiveTotal -= item.gpf_subs_amount;
      }
    });
    progressiveTotal = opening_balance + tempProgressiveTotal;
    interest += Math.round((progressiveTotal * interestRate) / 100);
    opening_balance = progressiveTotal;
  }
  // console.log(progressiveTotal , interest);
  return progressiveTotal + interest;
}


router.route('/calculate').post(asyncErrorHandler(async (req, res) => {
  const {
    startmonth,
    startyear,
    endyear,
    endmonth,
    employee_id,
    name,
    desg
  } = req.body;
  // console.log(req.body);
  if (!startmonth || !endyear || !employee_id || !startyear || !endmonth) {
    return res.status(400).json(new ApiResponse(400,{}, 'Month, year and employee_id are required'));
  }
// console.log("this is the endyear",endyear);
// console.log("this is the endmonth",endmonth);
// console.log("this is startyear and endyear",new Date(`${startyear}-${parseInt(startmonth)<9?'0'+ startmonth:startmonth}-01`), new Date(`${endyear}-${parseInt(endmonth)<9?'0'+ endmonth:endmonth}-${months[endmonth].days}`));
  const gpf_sub = await GpfSubscription.aggregate([
    {
      $match: {
        employee_id: employee_id,
        gpf_subs_enscashment_date: { $gte: new Date(`${startyear}-${parseInt(startmonth)<9?'0'+ startmonth:startmonth}-01`), $lte: new Date(`${endyear}-${parseInt(endmonth)<9?'0'+ endmonth:endmonth}-${months[endmonth].days}`) }
      }
    },
    {
      $project: {
        year: { $year: "$gpf_subs_enscashment_date" },
        month: { $month: "$gpf_subs_enscashment_date" },
        gpf_subs_amount: 1,
        employee_desg: 1,
        employee_id: 1,
        employee_name: 1,
        gpf_subs_type: 1,
        gpf_subs_enscashment_date: 1,
        isLocked: 1,
        gpf_subs_delete_status: 1
      }
    },
    {
      $group: {
        _id: { year: "$year", month: "$month" },
        // totalAmount: { $sum: "$gpf_subs_amount" },
        records: { $push: "$$ROOT" }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);
  
  
  if (gpf_sub.length === 0) {
    return res.status(404).json(new ApiResponse(404,{}, 'No GPF subscription found'));
  }
  let temp_gpf_sub_types = await gpfSubType.find({},{_id:0,__v:0,updatedAt:0,createdAt:0});
  let gpf_sub_types = {};
  temp_gpf_sub_types.forEach(sub_type => {
    gpf_sub_types[sub_type.gpf_sub_type] = sub_type.operation;
  });
  // console.log("this is the start year",startyear);
  // console.log("this is the start month",startmonth);
  // console.log("this is employee id",employee_id);
  let interestRate = 7.10/12;
  let totalRefund = 0.0;
  let totalSubscription = 0.0;
  let totalWithdrawal = 0.0;
  let progressiveTotal = 0.0;
  let interest = 0.0;
  let opening_balance = await calculateOpeningBalance(startyear, startmonth,employee_id,gpf_sub_types);
  // console.log("this is opening balance",opening_balance);
  if(opening_balance === null){
    return res.status(404).json(new ApiResponse(404,{}, 'Employee Opening balance not found'));
  }
  let netOpeningBalance = opening_balance;
  let totalMonthsData = [];
  for (let index = 0; index < gpf_sub.length; index++) {
    let currentMonth = months[gpf_sub[index]._id.month];
    let temp = {
      month:currentMonth.name,
      "GPF-Refund":0.0,
      "Salary-GPF Subscription":0.0,
      "GPF-Withdrawal":0.0,
      "Arrear-GPF Deduction":0.0,
      "progressiveTotal":0.0,
      "interest":0.0,
      interestRate:7.10,
      netAmount:0.0
    };
    progressiveTotal = 0.0;
    let tempProgressiveTotal = 0.0;
    gpf_sub[index].records.forEach(item => {
      if(gpf_sub_types[item.gpf_subs_type] === 'credit'){
        if(item.gpf_subs_type == "GPF-Refund"){
          totalRefund += item.gpf_subs_amount;
          temp["GPF-Refund"] += item.gpf_subs_amount;
        }if(item.gpf_subs_type == "Salary-GPF Subscription"){
          totalSubscription += item.gpf_subs_amount;
          temp["Salary-GPF Subscription"] += item.gpf_subs_amount;
        }if(item.gpf_subs_type == "Arrear-GPF Deduction"){
          // totalSubscription += item.gpf_subs_amount;
          temp["Arrear-GPF Deduction"] += item.gpf_subs_amount;
        }
        tempProgressiveTotal += item.gpf_subs_amount;
      }else{
        tempProgressiveTotal -= item.gpf_subs_amount;
        totalWithdrawal += item.gpf_subs_amount;
        temp["GPF-Withdrawal"] += item.gpf_subs_amount;
      }
    });
    progressiveTotal = opening_balance + tempProgressiveTotal;
    temp["progressiveTotal"] = progressiveTotal;
    temp["netAmount"] = tempProgressiveTotal;
    temp["interest"] = Math.round((progressiveTotal * interestRate) / 100);
    interest += Math.round((progressiveTotal * interestRate) / 100);
    opening_balance = progressiveTotal;
    totalMonthsData.push(temp);
  }
  let closing_balance = progressiveTotal + interest;
  let employee = await employee_information.findOne({employee_id:employee_id});
  if(employee){
    let data = {
      employee_desg:employee.employee_desg,
      employee_name:employee.employee_name,
      employee_gpf_no:employee.employee_gpf_no,
      totalMonthsData,
      totalRefund:totalRefund.toFixed(2),
      totalSubscription:totalSubscription.toFixed(2),
      totalWithdrawal:totalWithdrawal.toFixed(2),
      interest:interest.toFixed(2),
      opening_balance:netOpeningBalance.toFixed(2),
      closing_balance:closing_balance.toFixed(2)
    }
    // now find the user session if it exists then update it otherwise create it
    await userSessionModel.findOneAndUpdate({employee_id:employee_id},{$set:{data}},{upsert:true,new:true});

  }
  return res.json(new ApiResponse(200,{
    totalRefund:totalRefund.toFixed(2),
    totalSubscription:totalSubscription.toFixed(2),
    totalWithdrawal:totalWithdrawal.toFixed(2),
    interest:interest.toFixed(2),
    opening_balance:netOpeningBalance.toFixed(2),
    closing_balance:closing_balance.toFixed(2)
  },'Success'));
}));


router.route('/generate-gpf-statement').post(asyncErrorHandler(async (req, res) => {
  let {
    startmonth,
    startyear,
    id,
    opening_balance,
    subscription,
    refund,
    withdrawal,
    interest_year,
    closing_balance
  } = req.body;
  // console.log(req.body);
  const requiredFields = [id, startyear, startmonth, opening_balance, subscription, refund, withdrawal, interest_year, closing_balance];
  const isMissingField = requiredFields.some(field => !field);
  if (isMissingField) {
    // FIXME: Replace with redirect to error page
    return res.status(400).json(new ApiResponse(400, "Please provide all required fields")); 
  }
  let employee = await employee_information.findOne({employee_id:id});
  if(!employee){
    //FIXME: Replace with redirect to error page
    return res.status(404).json(new ApiResponse(404,{}, 'Employee not found'));
  }
  let employeeSession = await userSessionModel.findOne({employee_id:id});
  if(!employeeSession){
    // FIXME: Replace with redirect to error page
    return res.status(404).json(new ApiResponse(404,{}, 'Employee session not found'));
  }
  //TODO: Now check here if the employee session is updated before less the 2 minutes then return the session data
  let currentDate = new Date();
  let sessionDate = new Date(employeeSession.updatedAt);
  let diff = Math.abs(currentDate - sessionDate);
  let minutes = Math.floor((diff/1000)/60);
  // if(minutes > 2){
  //   // FIXME: Replace with redirect to error page
  //   return res.json(new ApiResponse(200,employeeSession.data,'Success'));
  // }
  console.log(employeeSession.data);
  return res.render('html/gpf-statment', {
    employee,
    employeeSession:employeeSession.data
  });
}));

export default router;