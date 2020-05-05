const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");
const cron = require("node-cron");
const Sessions = require("./models/Sessions");
const hours = require("./utils/timeConvertion");
const helmet = require('helmet');
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const mongoSanitize = require('express-mongo-sanitize');
// load env
dotenv.config({ path: "./config/config.env" });
const EventEmitter = require('events');
// Route files
const sessionRoutes = require("./routes/sessionRoutes");

// Connect to DB
connectDB();

// express app
const app = express();

// Body Parser
app.use(express.json());

// Sanitize mongo data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent Xss 
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 1000
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());


// Dev loggin middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Enable Cors
// Set up a whitelist and check against it:
// var whitelist = ['http://localhost:3000'];
// var corsOptions = {
//   origin: function(origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// };
// const allowedOrigins = ['http://192.168.254.43:5000/api/v1/categories'];
app.use(
  cors({
    origin: "*", //"http://localhost:3000"
  })
);

// Mount routers
app.use("/api/v1/sessions", sessionRoutes);

app.use(errorHandler);


cron.schedule(
  "0 2 * * *",
  () => {
    console.log("24 saatten uzun seanslar kontrolu basladi".red);
    let listOfSession = [];
    // Direkt find metodu ile almıyor. O zaman mongodb nin kendi veri tabani
    // field ları da gözüküyor. Bu sekilde olması gerektiği gibi geliyor kayıtlar
    listOfSession = Sessions.find({}, (err, docs) => {
      // async yapmazsak patlıyor
      docs.map(async (doc, index) => {
        // console.log(doc);
        const createdAtDateInstance = new Date.prototype.constructor(
          Date.parse(doc.createdAt)
        );

        const difference = hours(new Date() - createdAtDateInstance);
        console.log(difference.red);
        
        if (difference > 24) {
          console.log(`${doc.patient} kaydı eski geçen süre: ${difference}`);
          const deleted = await Sessions.findByIdAndDelete(doc._id);
          if (!deleted) {
            console.log("KAYIT SILINEMEDI".red);
          }
          console.log("KAYIT SILINDI");
        } else {
          // DO NOTHING
          // console.log(`${doc.patient} kaydı yeni geçen süre: ${difference}`);
        }
      });
    });
  },
  {
    scheduled: true, //duzelt
    timezone: "Europe/Istanbul",
  }
); // end of cron job 

const PORT = process.env.PORT || 5051;
const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

let io = require("socket.io")(server);
app.set("io", io);


// class MyEmitter extends EventEmitter {}

// const myEmitter = new MyEmitter();
// // console.log((eventEmitter.getMaxListeners()).red);
// myEmitter.on('error', (err) => {
//   console.log('Error Oldu');
  
// })
// myEmitter.on('MaxListenersExceededWarning', () => {
//   console.log('max listener Oldu'.red);
  
// })

// io.on('connection', (socket) => socket.join(app.request.body._id))
// console.log(eventEmitter.listenerCount('fromServer'));

// io.on("connection", (socket) => {
//   // socket.emit("welcome", "welcome from Server.js");
//   socket.on("react", (data) => console.log(data));
//   // socket.on("disconnect", () => console.log("Socket user disconnect"));
// });

// handle unhandled promis rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server
  server.close(() => process.exit(1));
});
