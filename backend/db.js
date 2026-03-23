const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',           
  password: 'eliaselias121',
  host: 'localhost',
  port: 5432,
  database: 'task_manager'
});

module.exports = pool;