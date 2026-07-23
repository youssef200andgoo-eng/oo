import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10) || 6379,
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0', 10) || 0,
  
  // Cluster Mode (for 100k users)
  cluster: process.env.REDIS_CLUSTER === 'true' ? {
    nodes: [
      { host: process.env.REDIS_NODE_1 || 'localhost', port: 7000 },
      { host: process.env.REDIS_NODE_2 || 'localhost', port: 7001 },
      { host: process.env.REDIS_NODE_3 || 'localhost', port: 7002 },
    ],
    options: {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
    },
  } : false,
  
  // Sentinel (High Availability)
  sentinel: process.env.REDIS_SENTINEL === 'true' ? {
    sentinels: [
      { host: process.env.REDIS_SENTINEL_1, port: 26379 },
      { host: process.env.REDIS_SENTINEL_2, port: 26379 },
    ],
    name: 'mymaster',
  } : false,
  
  // Cache TTL
  ttl: parseInt(process.env.REDIS_TTL || '3600', 10) || 3600,
  
  // Session Store
  sessionPrefix: 'sgu:session:',
  sessionTtl: 86400, // 24 hours
}));
