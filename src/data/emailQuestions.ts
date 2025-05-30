import { EmailQuestion } from '../types/game';

export const emailQuestions: EmailQuestion[] = [
  // Level 1
  {
    id: 'email-1-1',
    subject: 'Your Amazon Order #38942 has been shipped',
    sender: 'amazon-shipping@amazonn.com',
    content: `Dear Customer,

We are confirming that your recent order #38942 has been shipped and is on its way. You can track your package by clicking the link below.

[Track Your Package Now]

If you did not make this purchase, please click here to report unauthorized activity.

Thank you for shopping with Amazon!

Amazon Customer Service`,
    level: 1,
    isScam: true,
    explanation: "This is a scam email. The sender's email domain is 'amazonn.com' (note the double 'n'), which is not Amazon's official domain. Legitimate Amazon emails come from domains like amazon.com or amazon.co.uk."
  },
  {
    id: 'email-1-2',
    subject: 'Your Netflix subscription has expired',
    sender: 'accounts@netflix-billing.com',
    content: `Dear Valued Customer,

Your Netflix subscription has expired. To continue enjoying our services without interruption, please update your payment information immediately by clicking the link below.

[Update Payment Information]

If you fail to update your payment information within 24 hours, your account will be permanently deactivated.

Netflix Support Team`,
    level: 1,
    isScam: true,
    explanation: "This is a scam email. Netflix only sends emails from the netflix.com domain, not 'netflix-billing.com'. Additionally, legitimate companies don't typically threaten to permanently deactivate accounts with such short notice."
  },
  {
    id: 'email-1-3',
    subject: 'Your PayPal account: action required',
    sender: 'service@paypal.com',
    content: `Dear PayPal Customer,

We noticed some unusual activity in your account. To ensure your account security, we've temporarily limited some features.

Please review your recent transactions and verify your identity by logging into your account through our secure website.

Thank you for your cooperation.

PayPal Customer Service`,
    level: 1,
    isScam: false,
    explanation: "This is a legitimate email. The sender's domain is the official PayPal domain (paypal.com), and the email doesn't contain urgent threats or demands. It also doesn't include suspicious links or attachments. However, it's still best to access your PayPal account directly through the app or by typing the URL manually rather than clicking any links."
  },

  // Level 2
  {
    id: 'email-2-1',
    subject: 'URGENT: Your account has been compromised',
    sender: 'security-alert@appIe.com',
    content: `URGENT SECURITY ALERT

Our security systems have detected unauthorized access to your Apple ID. Your account has been temporarily suspended.

To restore access to your account, verify your information by clicking on the link below:

[Restore Account Access]

If you don't verify within 24 hours, your account will be permanently deleted.

Apple Support Team`,
    level: 2,
    isScam: true,
    explanation: "This is a scam email. The sender's domain 'appIe.com' uses a capital 'I' instead of a lowercase 'l' to mimic 'apple.com'. Also, legitimate companies like Apple don't threaten to delete your account if you don't respond within a short timeframe."
  },
  {
    id: 'email-2-2',
    subject: 'Your recent purchase from Best Buy',
    sender: 'order-confirmation@bestbuy.com',
    content: `Thank you for your recent purchase from Best Buy!

Order Number: BB-29845731
Date: May 15, 2023

Items Purchased:
- Samsung 55" 4K Smart TV - $699.99
- 3-Year Protection Plan - $89.99

Total: $789.98

Your order is being processed and will be ready for pickup at your selected store within 2-3 business days. We'll email you when it's ready.

Best Buy Customer Service
1-888-BEST-BUY`,
    level: 2,
    isScam: false,
    explanation: "This appears to be a legitimate email. It's from the official Best Buy domain, contains specific order details without requesting personal information, and provides the official Best Buy customer service number rather than an unusual contact method."
  },
  {
    id: 'email-2-3',
    subject: 'Inheritance Notification: $5.2 Million USD',
    sender: 'barrister.james@legalfirm-uk.org',
    content: `CONFIDENTIAL

Dear Sir/Madam,

I am Barrister James Wilson, legal representative of the late Mr. Robert Thompson who died in a car accident and left $5.2 million USD without any heir. After an extensive search, you have been identified as a possible relative.

To process your inheritance claim, I need your full name, address, phone number, and a copy of your identification. A processing fee of $750 will be required to cover legal documentation.

Please treat this as confidential and respond immediately.

Regards,
Barrister James Wilson
Senior Partner`,
    level: 2,
    isScam: true,
    explanation: "This is a classic inheritance scam email. Red flags include an unexpected inheritance from someone you don't know, requests for personal information, upfront fees, and pressure to keep the communication confidential. No legitimate inheritance process works this way."
  },

  // Level 3
  {
    id: 'email-3-1',
    subject: 'Invoice #INV-4298: Payment Due',
    sender: 'accounting@microsoft-billing.net',
    content: `Microsoft Subscription Services
Invoice #INV-4298

Dear Customer,

Your recent Microsoft subscription renewal has been processed. Please find the invoice attached for your records.

Subscription: Microsoft 365 Business Premium
Period: June 2023 - June 2024
Amount: $299.99

If you did not authorize this charge, please call our billing department at 1-888-555-0123 immediately.

Microsoft Billing Department`,
    level: 3,
    isScam: true,
    explanation: "This is a scam email. Microsoft doesn't send emails from 'microsoft-billing.net' domain. Also, the phone number provided is not an official Microsoft support number. Microsoft typically sends billing information from microsoft.com or office.com domains."
  },
  {
    id: 'email-3-2',
    subject: 'Action Required: Update your W-9 information',
    sender: 'tax-documents@irs-gov.org',
    content: `INTERNAL REVENUE SERVICE

IMPORTANT TAX DOCUMENT - IMMEDIATE ACTION REQUIRED

Our records indicate that your W-9 information needs to be updated in our system. Failure to update this information may result in tax withholding issues.

Please download, complete, and return the attached W-9 form within 5 business days.

For questions, contact our support department at support@irs-gov.org.

Thank you for your cooperation.

IRS Documentation Department`,
    level: 3,
    isScam: true,
    explanation: "This is a scam email. The IRS never initiates contact with taxpayers via email about personal tax issues. The sender domain 'irs-gov.org' is not the official IRS domain (which is irs.gov). The IRS would send official letters through postal mail, not emails with attachments."
  },
  {
    id: 'email-3-3',
    subject: 'Your Chase statement is ready',
    sender: 'no-reply@chase.com',
    content: `Your Chase statement is ready to view

Account: ....1234 (Credit Card)
Statement Period: 04/15/2023 - 05/14/2023
Available Credit: $8,724.31
Payment Due Date: 06/10/2023
Minimum Payment Due: $25.00

To view your statement, please sign in to chase.com or the Chase Mobile app.

Please do not reply to this email. This mailbox is not monitored.

JPMorgan Chase Bank, N.A. Member FDIC`,
    level: 3,
    isScam: false,
    explanation: "This appears to be a legitimate email. It's from the official Chase domain, doesn't include suspicious attachments or links, only shows partial account information for security, and directs you to log in directly to the official website rather than clicking a link in the email."
  }
];