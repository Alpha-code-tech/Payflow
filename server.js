const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const FX_API_URL = 'https://v6.exchangerate-api.com/v6/d3f46bc05d51dbd7dc93b1fc/pair/USD/NGN';

app.use(express.json());

function respond(res, endpoint, body) {
  console.log(`[${endpoint}]`, body);
  res.json({
    status: 'success',
    reference: `payflow-${Date.now()}`,
    message: 'Action logged successfully',
  });
}

app.post('/payment',  (req, res) => respond(res, '/payment',  req.body));

app.post('/fx-rate', async (req, res) => {
  console.log('[/fx-rate]', req.body);
  try {
    const { data } = await axios.get(FX_API_URL);
    const now = Date.now();
    res.json({
      status: 'success',
      rate: data.conversion_rate,
      currency_pair: 'USD/NGN',
      timestamp: new Date(now).toISOString(),
      reference: `payflow-rate-${now}`,
    });
  } catch (err) {
    console.error('[/fx-rate] API error:', err.message);
    res.status(502).json({ status: 'error', message: 'Failed to fetch exchange rate' });
  }
});
app.post('/decision', (req, res) => respond(res, '/decision', req.body));
app.post('/swap',     (req, res) => respond(res, '/swap',     req.body));
app.post('/offramp',  (req, res) => respond(res, '/offramp',  req.body));
app.post('/notify',   (req, res) => respond(res, '/notify',   req.body));

app.listen(PORT, () => {
  console.log(`PayFlow mock server running on port ${PORT}`);
});
