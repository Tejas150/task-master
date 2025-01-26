require('express-async-errors'); // Handles async errors globally

const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');
const userRoute = require('./routes/userRoute');
const taskRoute = require('./routes/taskRoute');
const projectRoute = require('./routes/projectRoute');

const app = express();

app.use(express.json());
app.use(requestLogger);

app.use('/api/user', userRoute);
app.use('/api/task', taskRoute);
app.use('/api/project', projectRoute);

app.use(errorHandler);

module.exports = app 
