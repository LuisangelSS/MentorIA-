import app from '../src/backend/app.js';

// Vercel handler: export default function that receives (req, res)
export default function handler(req, res) {
  return app(req, res);
}
