const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

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
app.post('/fx-rate',  (req, res) => respond(res, '/fx-rate',  req.body));
app.post('/decision', (req, res) => respond(res, '/decision', req.body));
app.post('/swap',     (req, res) => respond(res, '/swap',     req.body));
app.post('/offramp',  (req, res) => respond(res, '/offramp',  req.body));
app.post('/notify',   (req, res) => respond(res, '/notify',   req.body));

app.listen(PORT, () => {
  console.log(`PayFlow mock server running on port ${PORT}`);
});
