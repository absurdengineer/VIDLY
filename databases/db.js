const {Pool} = require('pg')
const winston =  require('winston')
const config = require('config')
const vidlyDebug = require('debug')('vidlyDebug')
const pool = new Pool({
    host : config.get('PGHOST'),
    user : config.get('PGUSER'),
    password : config.get('PGPASSWORD'),
    database : config.get('PGDATABASE'),
    port : config.get('PGPORT')
})

vidlyDebug(
    'Postgres Host : ',config.get('PGHOST'),
    '\nPostgres User : ',config.get('PGUSER'),
    '\nPostgres Password : ',config.get('PGPASSWORD'),
    '\nPostgres Database : ',config.get('PGDATABASE'),
    '\nPostgres Port : ',config.get('PGPORT')
)

pool.connect()
    .then( () => winston.info(`Connected to ${config.get('PGDATABASE')} as ${config.get('PGUSER')} over port ${config.get('PGPORT')}`) )

module.exports = pool