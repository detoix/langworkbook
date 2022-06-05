const { Client } = require('pg')

const createDatabaseClient = () => new Client({
  host: 'localhost',
  database: 'tmp',
  port: 5432,
  user: 'xd',
  password: 'xd',
})

module.exports = {
  createDatabaseClient
}