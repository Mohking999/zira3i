/**
 * PM2 Ecosystem — Zira3i AI Server
 * تشغيل دائم بدل التشغيل اليدوي في الطرفية
 *
 * الاستخدام:
 *   npm install -g pm2
 *   pm2 start ecosystem.config.cjs
 *   pm2 save              ← لحفظ قائمة العمليات
 *   pm2 startup           ← لتشغيل تلقائي مع بدء النظام
 *   pm2 logs zira3i       ← متابعة السجلات
 *   pm2 restart zira3i    ← إعادة تشغيل بعد أي تحديث
 *   pm2 stop zira3i       ← إيقاف مؤقت
 */
module.exports = {
  apps: [
    {
      name: 'zira3i',
      script: 'node_modules/.bin/tsx',
      args: 'server.ts',
      cwd: __dirname,
      interpreter: 'none',

      // إعادة تشغيل تلقائية عند الانهيار
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 3000,
      min_uptime: '10s',

      // ذاكرة: أعد التشغيل إذا تجاوز 1GB
      max_memory_restart: '1G',

      // متغيرات البيئة — الإنتاج
      env_production: {
        NODE_ENV: 'production',
        PORT: '3000',
      },
      // متغيرات البيئة — التطوير
      env_development: {
        NODE_ENV: 'development',
        PORT: '3000',
      },

      // سجلات
      error_file: './logs/zira3i-error.log',
      out_file: './logs/zira3i-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
  ],
};
