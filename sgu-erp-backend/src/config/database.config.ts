import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10) || 5432,
  username: process.env.DB_USERNAME || 'sgu_admin',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sgu_erp',
  schema: process.env.DB_SCHEMA || 'public',
  
  // Connection Pool (Critical for 100k users)
  poolSize: parseInt(process.env.DB_POOL_SIZE || '50', 10) || 50,
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '200', 10) || 200,
  
  // SSL for Production
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false,
    ca: process.env.DB_SSL_CA,
    cert: process.env.DB_SSL_CERT,
    key: process.env.DB_SSL_KEY,
  } : false,
  
  // Performance
  queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT || '30000', 10) || 30000,
  statementTimeout: parseInt(process.env.DB_STATEMENT_TIMEOUT || '30000', 10) || 30000,
  idleInTransactionSessionTimeout: 60000,
  
  // Replication (Primary + Read Replicas)
  replication: process.env.DB_REPLICATION === 'true' ? {
    master: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    slaves: [
      {
        host: process.env.DB_REPLICA_HOST || process.env.DB_HOST,
        port: parseInt(process.env.DB_REPLICA_PORT || '5432', 10) || 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
    ],
  } : false,
}));
