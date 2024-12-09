module.exports = {
  apps: [{
    name: 'crypto-platform',
    script: 'backend/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    autorestart: true,
    max_memory_restart: '1G',
    exp_backoff_restart_delay: 100,
    
    // 자동 확장 설정
    instance_var: 'INSTANCE_ID',
    increment_var: 'NODE_APP_INSTANCE',
    
    // 환경 변수
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },

    // 모니터링 설정
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // 메트릭 수집
    metrics: {
      http: true,
      runtime: true,
      custom_metrics: [{
        name: 'realtime_users',
        type: 'gauge',
        unit: 'count'
      }]
    },

    // 자동 복구 설정
    max_restarts: 10,
    min_uptime: '5s',
    listen_timeout: 8000,
    
    // 로드 밸런싱 설정
    wait_ready: true,
    listen_timeout: 10000,
    kill_timeout: 5000
  }]
}; 