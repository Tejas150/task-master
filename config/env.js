module.exports = {
    PORT: process.env.PORT || 8080,
    DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/task-master',
    JWT_SECRET: process.env.JWT_SECRET || 's2dgfgre41vet5t5gvxfbfh41', // Change for production
    NODE_ENV: process.env.NODE_ENV || 'development',
};