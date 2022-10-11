const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: `${__dirname}/config/config.env` });

// Connect to database
connectDB();

// Route file
const bootcamps = require('./routes/bootcamps');

const app = express();

app.use(express.json());

// Dev logging middlewere
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});