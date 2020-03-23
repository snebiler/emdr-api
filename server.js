const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')
const colors = require("colors");
const cors = require('cors')
const connectDB = require('./config/db')


// load env
dotenv.config({ path: './config/config.env'});


// Route files
const sessionRoutes = require('./routes/sessionRoutes');

// Connect to DB
connectDB();


const app = express();

// Body Parser
app.use(express.json());

// Dev loggin middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
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
      origin: "*"//"http://localhost:3000"
    })
  );

// Mount routers
app.use("/api/v1/sessions", sessionRoutes );




const PORT = process.env.PORT || 5051;
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

// handle unhandled promis rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}` );
    // Close server
    server.close(() => process.exit(1))
    
})