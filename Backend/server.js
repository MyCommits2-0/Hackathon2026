const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

// Just import pool to initialize DB connection
require("./db/pool");

// ======================
// Middlewares
// ======================

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// ======================
// Auth Middleware
// ======================

const { authUser, checkAuthorization } = require('./utils/auth');

// ======================
// Routes
// ======================

const studentRouter = require('./routes/students');
const courseRouter = require('./routes/courses');
const batchRouter = require('./routes/batches');
const registrationRouter = require('./routes/registrations');
const discountRouter = require('./routes/discounts');
const paymentRouter = require('./routes/payments');
const commonRouter = require('./routes/common');

// Public routes
app.use("/", commonRouter);

// Protected routes
app.use(authUser);

app.use('/students', studentRouter);
app.use('/courses', courseRouter);
app.use('/batches', batchRouter);
app.use('/registrations', registrationRouter);
app.use('/discounts', discountRouter);
app.use('/payments', paymentRouter);

// ======================
// Server
// ======================

app.listen(4000, 'localhost', () => {
  console.log("🚀 Server started at port 4000");
});