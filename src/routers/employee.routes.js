import {Router} from 'express';
import {employee_information} from '../models/employee_information.model.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import counter from '../models/counter.js';
const router = Router();

// Create new employee
router.route('/create').post(asyncErrorHandler(async(req,res)=>{
  const {employee_name,employee_desg,employee_gpf_no} = req.body;
  // validate the request body
  // console.log("this is in sind e henl",req.body);
  if(!employee_name || !employee_desg || !employee_gpf_no){
    return res.redirect('/add-employee?error=Something+went+worng');  // This is the view file
  }
  // create a new employee
  let employee_id = await counter.nextEmployeeId();
  const newEmployee = new employee_information({
    employee_id: employee_id.employee_seq,
    employee_name,
    employee_desg,
    employee_gpf_no
  });
  // save the employee
  await newEmployee.save();
  return res.redirect('/add-employee?success=Employee+Created+Successfully');  // This is the view file
  // return res.json(new ApiResponse(200,"Hello World"));

}))


router.route('/').get(asyncErrorHandler(async(req,res)=>{
  let data = await employee_information.find(
    {},
    {
      employee_id: 1,
      employee_name: 1,
      employee_desg: 1,
      employee_gpf_no:1,
    }
  );
  return res.json(new ApiResponse(200,data,"Employee Details"));
}));

// Get all employees
router.route('/view').get(asyncErrorHandler(async(req,res)=>{
  const employees = await employee_information.find();
  // console.log(employees);
  return res.render('html/view-employee.ejs',{employees});
}))

// Get employee by id
router.route('/:id').get(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  // validate the request
  if(!id){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const employee = await employee_information.findById(id);
  if(!employee){
    return res.json(new ApiResponse(404,"Employee not found"));
  }
  return res.json(new ApiResponse(200,employee,"Employee Details"));
}))

// Update employee by id
router.route('/update/:id').put(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  const {employee_name,employee_desg,employee_gpf_no} = req.body;
  // validate the request
  console.log(req.body);
  if(!id || !employee_name || !employee_desg || !employee_gpf_no){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const employee = await employee_information.findById(id);
  if(!employee){
    return res.json(new ApiResponse(404,"Employee not found"));
  }
  employee.employee_name = employee_name;
  employee.employee_desg = employee_desg;
  employee.employee_gpf_no = employee_gpf_no;
  await employee.save();
  return res.json(new ApiResponse(200,"Employee Updated Successfully"));
}))

// Update employee by id with patch request
router.route('/:id').patch(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  const {employee_id,employee_name,employee_desg,employee_gpf_no} = req.body;
  // validate the request
  if(!id){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const employee = await employee_information.findById(id);
  if(!employee){
    return res.json(new ApiResponse(404,"Employee not found"));
  }
  if(employee_id){
    employee.employee_id = employee_id;
  }
  if(employee_name){
    employee.employee_name = employee_name;
  }
  if(employee_desg){
    employee.employee_desg = employee_desg;
  }
  if(employee_gpf_no){
    employee.employee_gpf_no = employee_gpf_no;
  }
  await employee.save();
  return res.json(new ApiResponse(200,"Employee Updated Successfully"));
}))

// Delete employee by id
router.route('/:id').delete(asyncErrorHandler(async(req,res)=>{
  const {id} = req.params;
  // validate the request
  if(!id){
    return res.json(new ApiResponse(400,"Invalid Request"));
  }
  const employee = await employee_information.findById(id);
  if(!employee){
    return res.json(new ApiResponse(404,"Employee not found"));
  }
  await employee.remove();
  return res.json(new ApiResponse(200,"Employee Deleted Successfully"));
}))


export default router;