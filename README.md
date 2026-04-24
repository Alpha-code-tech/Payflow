# PayFlow 💸

> Get Paid in USDC. Convert to Naira on Your Terms.

Built during the **Kwala x Schulltech Hackathon** — April 23–24, 2026.

**Live Platform:** https://payflow-eight-dun.vercel.app  
**Backend API:** https://payflow-ud12.onrender.com  

---

## 👥 Team

| Name | Role |
|------|------|
| **Shalom Julius** | Full Stack Developer |
| **Progress Oni** | Full Stack Developer |

---

## 🇳🇬 The Problem

Nigerian freelancers are getting shortchanged on 
every international payment they receive.

Here is what they face every day:

**PayPal is blocked in Nigeria.**
Over 200 million Nigerians cannot create or use 
PayPal accounts. Payments sent by international 
clients simply never arrive.

**Payoneer charges too much.**
A 2% conversion fee on top of an exchange rate 
spread of up to 8% means a Nigerian freelancer 
loses between $30 and $100 on every $1,000 earned. 
That is money they worked for and never received.

**They miss the best exchange rates.**
The NGN/USD rate shifts every hour. Without 
automation, freelancers convert whenever they 
remember — rarely at the best moment. A 6% 
difference in rate on a $2,000 payment is 
₦161,880 left on the table.

**The real cost:**
A Nigerian freelancer earning $3,000/month loses 
an average of ₦450,000 every month to fees and 
bad exchange rates. That is ₦5.4 million every 
year — money that should be in their bank account.

---

## ✅ Our Solution

PayFlow is a programmable payment platform that 
lets Nigerian freelancers:

1. **Receive USDC** from any international client 
   worldwide — no PayPal, no restrictions
2. **Set a target NGN rate** and let PayFlow 
   monitor the market 24/7 automatically
3. **Get notified on Telegram** the moment their 
   target rate is hit and confirm with a simple 
   YES or NO reply
4. **Receive NGN** directly in their Nigerian bank 
   account within 2 hours — automatically

No servers to maintain. No scripts to run. 
No checking rates manually. PayFlow handles 
the entire payment pipeline from USDC deposit 
to NGN bank transfer automatically.

---

## ⚙️ How It Works in Real Time

### The complete payment journey:
Client sends USDC to freelancer's vault address
↓
Kwala WF1 detects the deposit
↓
Kwala WF2 monitors NGN/USD rate
(checks every 5 minutes via live API)
↓
Kwala WF3 checks freelancer's preference:
┌─────────────────────────────────────┐
│ Mode A: Convert Immediately         │
│ → Goes straight to WF4             │
│                                     │
│ Mode B: Wait for Target Rate        │
│ → Sends Telegram message to         │
│   freelancer: "Rate hit ₦1,650.     │
│   Convert now? Reply YES or NO"     │
│ → Waits for reply                   │
└─────────────────────────────────────┘
↓
Kwala WF4 executes the swap
(USDC → NGN via ERC-4337 smart wallet)
↓
Kwala WF5 initiates bank transfer
(NGN sent to freelancer's bank account
via Bitnob off-ramp API)
↓
Kwala WF6 sends dual notification
(Freelancer: "₦1,980,000 sent to GTBank"
Client: "Payment confirmed. Ref: 0x7f3a...")
↓
Dashboard updates in real time
(Transaction moves from pending → complete)

---

## 🔧 How We Used Kwala — Six Workflows

Kwala is the entire backend of PayFlow. Every 
automated action runs through a Kwala workflow. 
There is no custom server logic handling 
blockchain events — Kwala does all of it.

### WF1 — Payment Intake
**Trigger:** On-chain event listener  
**Network:** Polygon Amoy  
**What it does:** Watches the freelancer's vault 
address for incoming USDC Transfer events. The 
moment USDC arrives, this workflow fires and 
POSTs the payment details to our backend server 
which saves the transaction to Supabase.

```yaml
trigger:
  type: on_chain_event
  network: polygon-amoy
  contract_address: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"
  event: Transfer
  filter:
    to: "{{ env.VAULT_ADDRESS }}"
```

### WF2 — FX Rate Monitor
**Trigger:** Time trigger (every 5 minutes)  
**What it does:** POSTs to our backend server 
which calls the ExchangeRate API to fetch the 
live USD/NGN rate and stores it in Supabase. 
This runs 24/7 — the freelancer never has to 
check rates manually.

```yaml
trigger:
  type: time_trigger
  schedule: "*/5 * * * *"
```

### WF3 — Decision Gate
**Trigger:** Time trigger (every 5 minutes)  
**What it does:** The core of PayFlow. Checks 
the freelancer's conversion preference. If they 
chose auto-convert, triggers WF4 immediately. 
If they set a target rate, sends a Telegram 
message asking them to confirm. Uses Kwala's 
Web2 API Engine to call the Telegram Bot API. 
Waits for the freelancer's reply before proceeding.

```yaml
actions:
  - name: ask_confirmation
    type: POST
    url: "https://api.telegram.org/bot{TOKEN}/sendMessage"
    body:
      text: "Rate hit ₦1,650. Convert now? 
             Reply YES / NO / SNOOZE"
```

### WF4 — Swap Executor
**Trigger:** Time trigger / chained from WF3  
**What it does:** Executes the USDC to NGN 
conversion through an ERC-4337 smart wallet. 
The swap is trustless — PayFlow never holds 
your funds. All execution is verifiable on-chain. 
POSTs swap details to backend which updates the 
transaction status in Supabase.

### WF5 — Off-Ramp to Bank
**Trigger:** Chained from WF4  
**What it does:** Calls the Bitnob API to 
initiate an NGN bank transfer to the freelancer's 
registered Nigerian bank account. Supports all 
major Nigerian banks (GTBank, Access, Zenith, 
First Bank, UBA). POSTs the bank reference to 
backend which saves it to the transaction record.

### WF6 — Dual Notification
**Trigger:** Chained from WF5  
**What it does:** Fires two Telegram messages 
simultaneously using Kwala's Web2 API Engine:
- To the freelancer: full conversion summary 
  with NGN amount, rate achieved, bank reference
- To the client: payment confirmation with 
  on-chain transaction hash

This gives both parties a complete receipt 
without any manual communication.

---

## 🏗️ Architecture
┌─────────────────────────────────────────┐
│           FRONTEND (Vercel)             │
│         Next.js 14 + Tailwind           │
│  Landing │ Dashboard │ Pay │ Auth       │
└──────────────────┬──────────────────────┘
                   │
                   │ REST API calls
                   │
┌──────────────────▼──────────────────────┐
│           BACKEND (Render)              │
│           Express.js Server             │
│  /payment │ /fx-rate │ /swap │ etc.    │
└──────┬────────────────────┬────────────┘
       │                    │
       │                    │
┌──────▼──────┐    ┌────────▼────────────┐
│   SUPABASE  │    │   EXTERNAL APIs     │
│  PostgreSQL │    │                     │
│  Auth       │    │ ExchangeRate API    │
│  Realtime   │    │ Telegram Bot API   │
│  Row Level  │    │ Bitnob Off-ramp    │
│  Security   │    │ Polygon Amoy RPC   │
└─────────────┘    └─────────────────────┘
       ▲
       │ Saves data
       │
┌──────┴──────────────────────────────────┐
│              KWALA                      │
│         6 Active Workflows              │
│                                         │
│  WF1: On-chain event listener          │
│  WF2: FX rate monitor (5 min cron)     │
│  WF3: Decision gate + Telegram         │
│  WF4: Swap executor (ERC-4337)         │
│  WF5: Bitnob bank transfer             │
│  WF6: Dual Telegram notification       │
└─────────────────────────────────────────┘

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 (App Router) | React framework |
| Styling | Tailwind CSS | Utility-first CSS |
| Animations | Framer Motion | Micro animations |
| Icons | Lucide React | UI icons |
| Auth | Supabase Auth | Email authentication |
| Database | Supabase (PostgreSQL) | User data and transactions |
| Realtime | Supabase Realtime | Live dashboard updates |
| Backend | Express.js | API server and webhook handler |
| Hosting (Frontend) | Vercel | Next.js deployment |
| Hosting (Backend) | Render | Express server deployment |
| Blockchain | Polygon Amoy | Testnet for USDC transfers |
| Smart Wallet | ERC-4337 | Trustless swap execution |
| Workflow Engine | Kwala | All backend automation |
| FX Data | ExchangeRate API | Live USD/NGN rate |
| Notifications | Telegram Bot API | Payment alerts |
| Off-ramp | Bitnob API | NGN bank transfers |
| Version Control | GitHub | Code repository |

---

## 🚀 How to Run It

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- MetaMask browser extension
- Supabase account
- Kwala account
- Telegram bot token

### 1. Clone the repository

```bash
git clone https://github.com/Alpha-code-tech/Payflow.git
cd Payflow
```

### 2. Set up the backend server

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your environment variables to .env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
FX_API_KEY=your_exchangerate_api_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
PORT=3000

# Start the server
npm start
```

### 3. Set up the frontend

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your environment variables to .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=https://payflow-ud12.onrender.com
NEXT_PUBLIC_VAULT_ADDRESS=your_metamask_address

# Start the development server
npm run dev
```

### 4. Set up Supabase database

Go to your Supabase project → SQL Editor and 
run the schema file:

```bash
# File location
database/schema.sql
```

This creates:
- `profiles` table — stores user details, 
  bank info, vault address, conversion preferences
- `transactions` table — stores all payment records
- `fx_rates` table — stores rate history
- Row Level Security policies
- Auto profile creation trigger on signup

### 5. Set up Kwala workflows

1. Log in to app.kwala.network
2. Create 6 workflows using the YAML files in 
   the `/workflows` folder:
   - wf1-payment-intake.yaml
   - wf2-fx-monitor.yaml
   - wf3-decision-gate.yaml
   - wf4-swap-executor.yaml
   - wf5-offramp.yaml
   - wf6-notifications.yaml
3. Set environment variable in Kwala:
   `VAULT_ADDRESS` = your MetaMask address
4. Activate all 6 workflows

### 6. Configure Telegram bot

1. Message @BotFather on Telegram
2. Create a new bot with /newbot
3. Copy the bot token
4. Add token to your .env files
5. Message your bot /start to activate it

### 7. Test the full flow

1. Visit http://localhost:3000
2. Sign up for an account
3. Connect your MetaMask wallet
4. Add your bank details
5. Copy your vault address
6. Send test USDC on Polygon Amoy to your vault
7. Watch the Kwala workflows fire
8. Check Telegram for notifications
9. See the transaction update on your dashboard

---

## 🌐 Live Demo

**Platform:** https://payflow-eight-dun.vercel.app  
**Backend API:** https://payflow-ud12.onrender.com  
**Health Check:** https://payflow-ud12.onrender.com/health  

### Test accounts for judges

You can create your own account at:
https://payflow-eight-dun.vercel.app/sign-up

Or use the test account:
Email:    judge@payflow.app
Password: Hackathon2026!

---

## 📁 Project Structure
Payflow/
├── workflows/              # All 6 Kwala YAML workflows
│   ├── wf1-payment-intake.yaml
│   ├── wf2-fx-monitor.yaml
│   ├── wf3-decision-gate.yaml
│   ├── wf4-swap-executor.yaml
│   ├── wf5-offramp.yaml
│   └── wf6-notifications.yaml
├── server.js               # Express backend server
├── package.json            # Backend dependencies
├── .env.example            # Environment variable template
├── README.md               # This file
└── frontend/               # Next.js application
    ├── app/
    │   ├── page.tsx        # Landing page
    │   ├── dashboard/      # Protected dashboard
    │   ├── sign-in/        # Authentication
    │   ├── sign-up/        # Registration
    │   ├── onboarding/     # First time setup
    │   └── pay/[userId]/   # Client payment page
    ├── components/         # Reusable UI components
    ├── lib/                # Utilities and hooks
    └── package.json        # Frontend dependencies

---

## 💡 Why We Built It This Way

**Why Kwala for the backend?**
Smart contracts are 20% of the work. The other 
80% is event listeners, retry logic, cross-chain 
coordination, and API integrations. Kwala handles 
all of that with simple YAML workflows. We focused 
entirely on the product instead of infrastructure.

**Why Polygon Amoy?**
Fast, cheap transactions with strong USDC support. 
Perfect for the high-frequency small payments that 
Nigerian freelancers receive. Gas fees are 
negligible compared to Ethereum mainnet.

**Why ERC-4337 smart wallets?**
Non-custodial execution means PayFlow never holds 
user funds. Every swap is trustless and verifiable 
on-chain. Users remain in full control of their 
money at all times.

**Why Telegram for notifications?**
Nigerian freelancers already use Telegram daily. 
No new app to install. A simple YES or NO reply 
is all it takes to trigger a conversion. 
It is the most frictionless confirmation flow 
possible for a mobile-first audience.

**Why Supabase?**
One platform for authentication, database, and 
realtime subscriptions. The dashboard updates 
instantly when Kwala workflows post new data — 
no polling required.

**Why Next.js 14 with App Router?**
Server components for fast initial page loads. 
Client components only where interactivity is 
needed. Vercel deployment is zero configuration.

---

## 🔮 Roadmap

**Immediately after hackathon:**
- [ ] Full Bitnob API integration for live bank transfers
- [ ] MetaMask wallet connection during onboarding
- [ ] Multi-currency support (USD, GBP, EUR)
- [ ] Mobile app (React Native)

**3 months:**
- [ ] Fiat on-ramp so clients can pay by card
- [ ] Invoice generation with payment links
- [ ] Team accounts for agencies
- [ ] Rate analytics and history charts

**6 months:**
- [ ] Expand to Ghana (GHS), Kenya (KES), 
      South Africa (ZAR)
- [ ] API for developers
- [ ] White-label solution for fintechs
- [ ] Regulatory compliance framework

---

## 🔗 Links

- **Hackathon:** dorahacks.io/hackathon/buildwithkwala
- **Kwala:** kwala.network
- **Polygon Amoy Explorer:** amoy.polygonscan.com
- **GitHub:** github.com/Alpha-code-tech/Payflow

---

## 📄 License

MIT License — see LICENSE file for details.

---

*Built with ❤️ for Nigerian freelancers by 
Shalom Julius and Progress Oni*  
*Kwala x Schulltech Hackathon 2026*
