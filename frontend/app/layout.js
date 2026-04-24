import './globals.css';

export const metadata = {
  title: 'PayFlow — Get Paid in USDC, Convert to Naira on Your Terms',
  description:
    'PayFlow lets Nigerian freelancers receive international USDC payments and automatically convert to Naira when the exchange rate hits your target. No Payoneer. No PayPal. No high fees.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className="bg-[#0A0A0F] text-white antialiased"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
