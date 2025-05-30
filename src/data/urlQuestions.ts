import { URLQuestion } from '../types/game';

export const urlQuestions: URLQuestion[] = [
  // Level 1
  {
    id: 'url-1-1',
    url: 'www.paypa1.com/account/security',
    description: 'You received an email claiming your PayPal account has been compromised. It contains this link to verify your account details.',
    level: 1,
    isScam: true,
    explanation: "This is a phishing URL. Notice that it uses the number '1' instead of the letter 'l' in 'paypa1.com'. The legitimate PayPal URL is 'paypal.com'. This subtle difference is a common phishing tactic designed to trick users who don't examine URLs carefully."
  },
  {
    id: 'url-1-2',
    url: 'https://www.amazon.com/gp/css/order-history',
    description: 'You want to check your recent orders on Amazon and found this link in your bookmarks.',
    level: 1,
    isScam: false,
    explanation: "This is a legitimate Amazon URL. It uses the correct domain (amazon.com) and points to the order history page, which is a real section of the Amazon website. The URL structure is consistent with Amazon's website organization."
  },
  {
    id: 'url-1-3',
    url: 'www.netf1ix-account-verify.com/login',
    description: 'You received a text message saying your Netflix subscription will be canceled unless you verify your payment information through this link.',
    level: 1,
    isScam: true,
    explanation: "This is a phishing URL. The domain 'netf1ix-account-verify.com' is not Netflix's official domain. Netflix would only use 'netflix.com' for their services. The number '1' instead of the letter 'l' and the addition of 'account-verify' in the domain name are red flags of a phishing attempt."
  },

  // Level 2
  {
    id: 'url-2-1',
    url: 'https://facebook-securityalert.com/verify',
    description: 'You received a notification that someone tried to log into your Facebook account. This link was provided to secure your account.',
    level: 2,
    isScam: true,
    explanation: "This is a phishing URL. Despite containing 'facebook' in the domain name, 'facebook-securityalert.com' is not owned by Facebook. Facebook would only use domains ending with 'facebook.com' (like security.facebook.com). Hyphenated domains that contain a brand name are often phishing attempts."
  },
  {
    id: 'url-2-2',
    url: 'https://www.linkedin.com/jobs/',
    description: 'A friend suggested you check out this link for job opportunities on LinkedIn.',
    level: 2,
    isScam: false,
    explanation: "This is a legitimate LinkedIn URL. It uses the correct domain (linkedin.com) and points to the jobs section of the site, which is a real part of LinkedIn's platform. The URL is secure (https) and doesn't contain any suspicious elements."
  },
  {
    id: 'url-2-3',
    url: 'http://drive.google.com.download-document.xyz/file/d/1AbCdEfG',
    description: 'A colleague shared an important document with you through this Google Drive link.',
    level: 2,
    isScam: true,
    explanation: "This is a phishing URL. The actual domain is 'download-document.xyz', not Google. The scammer is using 'drive.google.com' as a subdomain to make it appear legitimate. In a real Google Drive URL, 'drive.google.com' would be the actual domain, not a subdomain of another website. Also note it uses 'http' instead of the secure 'https'."
  },

  // Level 3
  {
    id: 'url-3-1',
    url: 'https://secure-bankofamerica.com.logon.verify-account.mobi/login',
    description: 'You received an urgent email from Bank of America asking you to verify your account through this link.',
    level: 3,
    isScam: true,
    explanation: "This is a sophisticated phishing URL. The actual domain is 'verify-account.mobi', not 'bankofamerica.com'. The scammer has placed 'bankofamerica.com' as a subdomain to confuse users. Legitimate Bank of America URLs would use 'bankofamerica.com' as the actual domain (like secure.bankofamerica.com)."
  },
  {
    id: 'url-3-2',
    url: 'https://signin.ebay.com/ws/eBayISAPI.dll?SignIn&ru=',
    description: 'You clicked on "Sign In" from the eBay homepage and were directed to this URL.',
    level: 3,
    isScam: false,
    explanation: "This is a legitimate eBay sign-in URL. It uses the correct domain (ebay.com) with a subdomain ('signin') that's appropriate for the login function. The URL structure with 'eBayISAPI.dll?SignIn' is consistent with eBay's actual website architecture for authentication."
  },
  {
    id: 'url-3-3',
    url: 'https://accounts.googl.com/ServiceLogin?continue=',
    description: 'You received an email about suspicious activity on your Google account with this link to review your recent sign-ins.',
    level: 3,
    isScam: true,
    explanation: "This is a sophisticated phishing URL. Notice the domain is 'googl.com' (missing the 'e') instead of the legitimate 'google.com'. This is a typosquatting attack where scammers register domains with common misspellings of well-known websites. Even though the rest of the URL looks legitimate, the incorrect domain reveals it's a phishing attempt."
  }
];