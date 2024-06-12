// app.js
import express from "express";
import logger from "morgan";
import { fileURLToPath } from "url";
import path, { join, dirname } from "path";
const app = express();
import cors from "cors";
import { globalErrorHandler } from "./utils/errorController.js";
import ApiResponse from "./utils/ApiResponse.js";
import asyncErrorHandler from "./utils/asyncErrorHandler.js";
import preroute from "./constants.js";
import pdf from "html-pdf";
import upload from "./file.js";
import cookieParser from "cookie-parser";
// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static("./src/public"));
app.use(logger("dev")); // This is the logger middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  next();
}); // This is the custom middleware

// Model Import

import { employee_information } from "./models/employee_information.model.js";
import { establishment_master } from "./models/establishment_master.model.js";
import { gpfSubType } from "./models/gpf_sub_type.model.js";
import { gpfInterestRateModel } from "./models/gpf_interest_rate.model.js";

import employeeRouter from "./routers/employee.routes.js";
import establishmentRouter from "./routers/establishment.routes.js";
import gpfSubscription from "./routers/gpf_subscription.routes.js";
import gpfSubTypes from "./routers/gpf_sub_type.routes.js";
import gpfInterestRate from "./routers/gpf_interest_rate.routes.js";
import loginRoutes from "./routers/login_details.routes.js";
import gpfCalculation from "./routers/gpf_calculation.routes.js";

app.get("/", (req, res) => {
  const accessToken = req.cookies.accessToken || "";
  const refreshToken = req.cookies.refreshToken || "";
  if (accessToken && refreshToken) {
    return res
      .render(
        "index.ejs",      
      );
  }
  return res.redirect("/login");
});



app.post('/generate-pdf', async (req, res) => {
  // Data to fill placeholders
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
  const requiredFields = [id, startyear, startmonth, opening_balance, subscription, refund, withdrawal, interest_year, closing_balance];
  const isMissingField = requiredFields.some(field => !field);
  if (isMissingField) {
    return res.status(400).json(new ApiResponse(400, "Please provide all required fields"));
  }

  let employee = await employee_information.findOne({ employee_id: id });
  if (!employee) {
    return res.status(404).json(new ApiResponse(404, "Employee not found"));
  }

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  let start_month = monthNames[parseInt(startmonth)];
  let end_month = monthNames[parseInt(startmonth) + 1];
  
  let data = {
    start_date: `Opening Balance as on 1st ${start_month} ${startyear}`,
    end_date: `Ending Balance on 31st ${end_month} ${startyear}`,
    employee_name: employee.employee_name,
    employee_designation: employee.employee_desg,
    employee_gpf_no: employee.employee_gpf_no,
    employee_opening_balance: opening_balance,
    employee_gpf_subscriptions: subscription,
    employee_recovery: refund,
    employee_interest: interest_year,
    employee_total: closing_balance,
    employee_withdrawal: withdrawal,
    employee_closing_balance: closing_balance,
  };

  // Render the layout with dynamic content
  return res.render('layout', { data });
});

app.use("/employee", employeeRouter);
app.use("/establishment", establishmentRouter);
app.use("/gpf-subscription", gpfSubscription);
app.use("/gpf-sub-types", gpfSubTypes);
app.use("/gpf-interest-rates", gpfInterestRate);
app.use('/users',loginRoutes);
app.use("/gpf-calculation", gpfCalculation);

app.get("/login", (req, res) => {
  if (req.query.error) {
    return res.render("html/login.ejs", { error: req.query.error });
  }
  return res.render("html/login.ejs");
});
app.get('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.redirect('/login');
});

app.get('/upload-xlsx-file', (req, res) => {
  if (req.query.error) {
    return res.render("html/upload.ejs", { error: req.query.error });
  } else if (req.query.success) {
    return res.render("html/upload.ejs", { success: req.query.success });
  }
  return res.render("html/upload.ejs");
  // res.render('html/upload.ejs');
});

import xlsx from "xlsx";


import employeeOBModel from "./models/gpf_employee_ob.model.js"

app.get('/upload-file',async(req,res)=>{
  // read file form public folder
  const workbook = xlsx.readFile('./src/uploads/sample.xlsx');
  // Assuming there's only one sheet, get its name
  const sheetName = workbook.SheetNames[0];
  // Get worksheet
  const worksheet = workbook.Sheets[sheetName];
  // console.log(sheetName,"this is sheet name");
  // console.log(worksheet,"this is worksheet");
  // Convert worksheet data into JSON format
  const data = xlsx.utils.sheet_to_json(worksheet);
  // console.log(data,"this is data");
  // Process the data as needed
  const processedData = processData(data);
  // console.log(processedData,"this is processed data");
  // Now you can decide what to do with the processed data
  // For example, you can store it in a database, perform additional operations, etc.
  // Send a response indicating that the file was uploaded and processed
  // return res.json({ message: 'File uploaded and processed successfully', data: processedData });
  let newArray = [];
  for (let item of processedData) {
    if(item["S.No"]==="Sr.No." || item["S.No"]==="S.No"){
      continue;
    }
    newArray.push(item);
  }
  // for (let item of newArray) {
  //   let employee = new employeeOBModel({
  //     employee_id: item["GPF No."],
  //     employee_name: item["Employee Name"],
  //     employee_gpf_no: item["GPF No."],
  //     year:"2024",
  //     month:"03",
  //     employee_ob_amount: item["CBAL"],
  //   });
  //   await employee.save();
  // }
  return res.json({newArray});
})

app.post("/upload", upload, (req, res) => {
  // Check if file is uploaded
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Load the uploaded file
  const workbook = xlsx.readFile(req.file.path);

  // Assuming there's only one sheet, get its name
  const sheetName = workbook.SheetNames[0];

  // Get worksheet
  const worksheet = workbook.Sheets[sheetName];

  // Convert worksheet data into JSON format
  const data = xlsx.utils.sheet_to_json(worksheet);

  // Process the data as needed
  const processedData = processData(data);

  // Now you can decide what to do with the processed data
  // For example, you can store it in a database, perform additional operations, etc.

  // Send a response indicating that the file was uploaded and processed
  return res.redirect('/upload-xlsx-file?success=Uploaded successfully!');
  // res.json({ message: 'File uploaded and processed successfully', data: processedData });
});

// Function to process the data (you can customize this as needed)
function processData(data) {
  // Example processing: Add a new property to each object
  return data.map(item => {
    return { ...item, processed: true };
  });
}

app.get("/add-employee", (req, res) => {
  if (req.query.error) {
    return res.render("html/add_employee.ejs", { error: req.query.error });
  } else if (req.query.success) {
    return res.render("html/add_employee.ejs", { success: req.query.success });
  }
  return res.render("html/add_employee.ejs");
});

app.get("/add-establishment", (req, res) => {
  if (req.query.error) {
    return res.render("html/add-establishment.ejs", { error: req.query.error });
  } else if (req.query.success) {
    return res.render("html/add-establishment.ejs", {
      success: req.query.success,
    });
  }
  return res.render("html/add-establishment.ejs");
});

app.get("/gpf-ladger", async (req, res) => {
  let data = await employee_information.find(
    {},
    {
      employee_id: 1,
      employee_name: 1,
      employee_desg: 1,
      employee_gpf_no:1,
    }
  );
  let sub_types = await gpfSubType.find();
  if (req.query.error) {
    return res.render("html/gpf-ladger.ejs", {
      error: req.query.error,
      data: data,
      sub_types: sub_types,
    });
  } else if (req.query.success) {
    return res.render("html/gpf-ladger.ejs", {
      success: req.query.success,
      data: data,
      sub_types: sub_types,
    });
  }
  return res.render("html/gpf-ladger.ejs", {
    data: data,
    sub_types: sub_types,
  });
});

app.get("/gpf-calculation", async (req, res) => {
  let employees = await employee_information.find(
    {},
    {
      employee_id: 1,
      employee_name: 1,
      employee_desg: 1,
    }
  );
  // console.log(employees);
  return res.render("html/gpf-calculation.ejs", { employees: employees });
});

app.get("/gpf-sub-type", async (req, res) => {
  let data = await gpfSubType.find();
  if (req.query.error) {
    return res.render("html/gpf_sub_type.ejs", {
      data,
      error: req.query.error,
    });
  } else if (req.query.success) {
    return res.render("html/gpf_sub_type.ejs", {
      data,
      success: req.query.success,
    });
  }
  return res.render("html/gpf_sub_type.ejs", { data });
});

app.get("/gpf-interest-rate", async (req, res) => {
  let data = await gpfInterestRateModel.find(
    {gpf_intereset_delete_status:0},
    {
      gpf_intereset_year: 1,
      gpf_intereset_month: 1,
      gpf_interest_rate: 1,
    }
  );
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  
  // Map over the data and convert month numbers to month names
  data = data.map((item) => {
    // Convert month number to month name
    const monthName = monthNames[parseInt(item.gpf_intereset_month) - 1]; // Adjust index

    // Update the object with the month name
    // console.log("object", item.gpf_intereset_year,item.gpf_intereset_month);
    // console.log("nothing",new Date().getFullYear(),new Date().getMonth()+1);
    return {
      ...item._doc,
      gpf_intereset_month: monthName,
      color: parseInt(item.gpf_intereset_year.slice(-2)) % 2 === 0 ? "primary" : "success",
      // if gpf_intereset_year is greater than current year, and gpf_intereset_month is greater than current month, then canEdit is true
      canEdit: Number(item.gpf_intereset_year) > new Date().getFullYear() || (Number(item.gpf_intereset_year) >= new Date().getFullYear() && Number(item.gpf_intereset_month) >= new Date().getMonth()+1)? true : false,
    };
  });
  data.sort((a, b) => {
    if (a.gpf_intereset_year !== b.gpf_intereset_year) {
      return a.gpf_intereset_year - b.gpf_intereset_year;
    } else {
      // If years are the same, compare months
      const monthIndexA = monthNames.indexOf(a.gpf_intereset_month);
      const monthIndexB = monthNames.indexOf(b.gpf_intereset_month);
      return monthIndexA - monthIndexB;
    }
  });
  if (req.query.error) {
    return res.render("html/gpf_interest_rate.ejs", {
      data,
      error: req.query.error,
    });
  } else if (req.query.success) {
    return res.render("html/gpf_interest_rate.ejs", {
      data,
      success: req.query.success,
    });
  }
  return res.render("html/gpf_interest_rate.ejs", { data });
});

app.all("*", (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = "fail";
  // err.statusCode = 404;
  // next(err);
  return res.redirect("/");
}); // This is the catch all route handler

app.use(globalErrorHandler); // This is the error handler middleware

export default app;
