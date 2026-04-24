const express = require('express');
const axios   = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Supabase (service role — bypasses RLS) ────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── ExchangeRate API ──────────────────────────────────────────────────────
const FX_URL = `https://v6.exchangerate-api.com/v6/${process.env.FX_API_KEY}/pair/USD/NGN`;

// ── Middleware ────────────────────────────────────────────────────────────
app.use(express.json());

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://payflow-eight-dun.vercel.app',
  ...(process.env.ALLOWED_ORIGIN ? [process.env.ALLOWED_ORIGIN] : []),
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ── Helpers ───────────────────────────────────────────────────────────────
function err(res, status, message, detail) {
  console.error(`[${status}] ${message}`, detail || '');
  return res.status(status).json({ status: 'error', message });
}

async function fetchLiveRate() {
  const { data } = await axios.get(FX_URL);
  return data.conversion_rate;
}

// ══════════════════════════════════════════════════════════════════════════
// GET /health
// ══════════════════════════════════════════════════════════════════════════
app.get('/', (req, res) => {
  res.json({
    service: 'PayFlow API',
    status: 'running',
    version: '1.0.0',
    endpoints: [
      'GET /health',
      'GET /rate',
      'GET /transactions/:userId',
      'GET /profile/:userId',
      'POST /payment',
      'POST /fx-rate',
      'POST /swap',
      'POST /offramp',
      'POST /notify',
      'POST /decision',
      'POST /profile/:userId',
    ],
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'PayFlow API' });
});

// ══════════════════════════════════════════════════════════════════════════
// POST /payment
// Body: { from_address, usdc_amount, tx_hash, network }
// ══════════════════════════════════════════════════════════════════════════
app.post('/payment', async (req, res) => {
  const { from_address, usdc_amount, tx_hash, network } = req.body;
  console.log('[/payment]', req.body);

  if (!from_address || !usdc_amount || !tx_hash) {
    return err(res, 400, 'from_address, usdc_amount and tx_hash are required');
  }

  // Find the user who owns this vault address
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('vault_address', from_address)
    .single();

  if (profileErr || !profile) {
    return err(res, 404, 'No user found for this vault address', profileErr?.message);
  }

  // Insert transaction
  const { data: tx, error: txErr } = await supabase
    .from('transactions')
    .insert({
      user_id:      profile.id,
      from_address,
      usdc_amount,
      tx_hash,
      network:      network || 'polygon',
      status:       'received',
    })
    .select()
    .single();

  if (txErr) return err(res, 500, 'Failed to insert transaction', txErr.message);

  // Update total received on profile
  const { error: updateErr } = await supabase
    .from('profiles')
    .update({ total_received_usdc: (profile.total_received_usdc || 0) + Number(usdc_amount) })
    .eq('id', profile.id);

  if (updateErr) console.error('[/payment] profile update failed:', updateErr.message);

  res.status(201).json({ status: 'success', transaction: tx });
});

// ══════════════════════════════════════════════════════════════════════════
// POST /fx-rate  — fetch live rate, store it, return it
// ══════════════════════════════════════════════════════════════════════════
app.post('/fx-rate', async (req, res) => {
  console.log('[/fx-rate]', req.body);
  try {
    const rate = await fetchLiveRate();

    const { data: record, error: insertErr } = await supabase
      .from('fx_rates')
      .insert({ rate, currency_pair: 'USD/NGN', source: 'exchangerate-api' })
      .select()
      .single();

    if (insertErr) console.error('[/fx-rate] insert failed:', insertErr.message);

    res.json({
      status:        'success',
      rate,
      currency_pair: 'USD/NGN',
      timestamp:     new Date().toISOString(),
      reference:     `payflow-rate-${Date.now()}`,
    });
  } catch (e) {
    return err(res, 502, 'Failed to fetch exchange rate', e.message);
  }
});

// ══════════════════════════════════════════════════════════════════════════
// GET /rate  — always fetches live rate from ExchangeRate API
// ══════════════════════════════════════════════════════════════════════════
app.get('/rate', async (req, res) => {
  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.FX_API_KEY}/pair/USD/NGN`
    );
    res.json({
      status:        'success',
      rate:          response.data.conversion_rate,
      currency_pair: 'USD/NGN',
      timestamp:     new Date().toISOString(),
    });
  } catch (e) {
    return err(res, 500, 'Failed to fetch exchange rate', e.message);
  }
});

// ══════════════════════════════════════════════════════════════════════════
// POST /decision
// Body: { user_id, mode, target_rate }
// ══════════════════════════════════════════════════════════════════════════
app.post('/decision', async (req, res) => {
  const { user_id, mode, target_rate } = req.body;
  console.log('[/decision]', req.body);

  if (!user_id || !mode) {
    return err(res, 400, 'user_id and mode are required');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .update({ conversion_mode: mode, target_rate: target_rate || null })
    .eq('id', user_id)
    .select()
    .single();

  if (error) return err(res, 500, 'Failed to update decision', error.message);

  res.json({ status: 'success', profile });
});

// ══════════════════════════════════════════════════════════════════════════
// POST /swap
// Body: { transaction_id, ngn_amount, rate }
// ══════════════════════════════════════════════════════════════════════════
app.post('/swap', async (req, res) => {
  const { transaction_id, ngn_amount, rate } = req.body;
  console.log('[/swap]', req.body);

  if (!transaction_id || !ngn_amount || !rate) {
    return err(res, 400, 'transaction_id, ngn_amount and rate are required');
  }

  const { data: tx, error } = await supabase
    .from('transactions')
    .update({ status: 'converted', ngn_amount, rate })
    .eq('id', transaction_id)
    .select()
    .single();

  if (error) return err(res, 500, 'Failed to update swap', error.message);

  res.json({ status: 'success', transaction: tx });
});

// ══════════════════════════════════════════════════════════════════════════
// POST /offramp
// Body: { transaction_id, bank_reference }
// ══════════════════════════════════════════════════════════════════════════
app.post('/offramp', async (req, res) => {
  const { transaction_id, bank_reference } = req.body;
  console.log('[/offramp]', req.body);

  if (!transaction_id) {
    return err(res, 400, 'transaction_id is required');
  }

  const { data: tx, error } = await supabase
    .from('transactions')
    .update({ status: 'processing_bank_transfer', bank_reference: bank_reference || null })
    .eq('id', transaction_id)
    .select()
    .single();

  if (error) return err(res, 500, 'Failed to update offramp', error.message);

  res.json({ status: 'success', transaction: tx });
});

// ══════════════════════════════════════════════════════════════════════════
// POST /notify
// Body: { transaction_id }
// ══════════════════════════════════════════════════════════════════════════
app.post('/notify', async (req, res) => {
  const { transaction_id } = req.body;
  console.log('[/notify]', req.body);

  if (!transaction_id) {
    return err(res, 400, 'transaction_id is required');
  }

  // Fetch the transaction to get user_id + ngn_amount
  const { data: tx, error: fetchErr } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transaction_id)
    .single();

  if (fetchErr || !tx) return err(res, 404, 'Transaction not found', fetchErr?.message);

  // Mark transaction complete
  const { data: updatedTx, error: txErr } = await supabase
    .from('transactions')
    .update({ status: 'complete' })
    .eq('id', transaction_id)
    .select()
    .single();

  if (txErr) return err(res, 500, 'Failed to update transaction', txErr.message);

  // Add ngn_amount to profile total
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('total_converted_ngn')
    .eq('id', tx.user_id)
    .single();

  if (!profileErr && profile) {
    await supabase
      .from('profiles')
      .update({ total_converted_ngn: (profile.total_converted_ngn || 0) + Number(tx.ngn_amount || 0) })
      .eq('id', tx.user_id);
  }

  res.json({ status: 'success', transaction: updatedTx });
});

// ══════════════════════════════════════════════════════════════════════════
// GET /transactions/:userId
// ══════════════════════════════════════════════════════════════════════════
app.get('/transactions/:userId', async (req, res) => {
  const { userId } = req.params;

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return err(res, 500, 'Failed to fetch transactions', error.message);

  res.json({ status: 'success', transactions });
});

// ══════════════════════════════════════════════════════════════════════════
// GET /profile/:userId
// ══════════════════════════════════════════════════════════════════════════
app.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !profile) return err(res, 404, 'Profile not found', error?.message);

  res.json({ status: 'success', profile });
});

// ══════════════════════════════════════════════════════════════════════════
// POST /profile/:userId
// Body: { bank_name, bank_code, account_number, account_name,
//         telegram_chat_id, vault_address }
// ══════════════════════════════════════════════════════════════════════════
app.post('/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  const { bank_name, bank_code, account_number, account_name, telegram_chat_id, vault_address } = req.body;
  console.log('[/profile/:userId]', { userId, ...req.body });

  const updates = {};
  if (bank_name        !== undefined) updates.bank_name        = bank_name;
  if (bank_code        !== undefined) updates.bank_code        = bank_code;
  if (account_number   !== undefined) updates.account_number   = account_number;
  if (account_name     !== undefined) updates.account_name     = account_name;
  if (telegram_chat_id !== undefined) updates.telegram_chat_id = telegram_chat_id;
  if (vault_address    !== undefined) updates.vault_address    = vault_address;

  if (Object.keys(updates).length === 0) {
    return err(res, 400, 'No fields provided to update');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) return err(res, 500, 'Failed to update profile', error.message);

  res.json({ status: 'success', profile });
});

// ── Start ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`PayFlow backend running on port ${PORT}`);
});
