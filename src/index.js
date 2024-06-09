// Main index.js
import http from 'http';
import app from './app.js';
import fs from 'fs';
import connectDB from "./db/index.mongodb.js";
// const https_options = {
//    key: fs.readFileSync("./keys/private.key"),
//    cert: fs.readFileSync("./keys/certificate.crt"),
//    ca: [
//    fs.readFileSync('./keys/ca_bundle.crt')
//    ]
//    };
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

connectDB()
.then(() => {
  server.listen(PORT, () => {
    console.log(`⚙️Server is running on http://127.0.0.1:${PORT}`);
  });
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
