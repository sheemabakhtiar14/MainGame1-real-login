import { Question } from '../types/game';

export const standardQuestions: Question[] = [
  // Level 1
  {
    id: 'std-1-1',
    question: "Hello, I'm calling from your bank. We've detected suspicious activity on your account. I'll need your full account number and PIN to verify your identity. Can you provide that for me?",
    options: [
      { id: 1, text: "Yes, of course. Let me get my card. My account number is...", isCorrect: false },
      { id: 2, text: "I'm not comfortable providing that information. I'll call my bank directly using the number on my card.", isCorrect: true },
      { id: 3, text: "Can you tell me which transactions were suspicious first?", isCorrect: false }
    ],
    level: 1,
    explanation: "Legitimate banks will never call and ask for your full account details or PIN. Always call your bank directly using the official number on your card or statement.",
    correct: 2
  },
  {
    id: 'std-1-2',
    question: "Congratulations! You've won our grand prize lottery of $5,000,000! To claim your prize, we just need you to pay a small processing fee of $99. How would you like to proceed?",
    options: [
      { id: 1, text: "This sounds amazing! I'll pay the fee right away!", isCorrect: false },
      { id: 2, text: "I don't recall entering any lottery. This sounds suspicious.", isCorrect: true },
      { id: 3, text: "Can I pay the fee after I receive my winnings?", isCorrect: false }
    ],
    level: 1,
    explanation: "Legitimate lotteries never ask for money upfront to claim a prize. If you haven't entered a lottery, you can't win it. This is a classic advance fee scam.",
    correct: 2
  },
  {
    id: 'std-1-3',
    question: "Hi, this is tech support. We've detected a virus on your computer that is stealing your data. We can remove it for you right now if you give us remote access to your computer.",
    options: [
      { id: 1, text: "Thank you for letting me know! Yes, please help me remove it right away.", isCorrect: false },
      { id: 2, text: "Which computer? I have several devices.", isCorrect: false },
      { id: 3, text: "I didn't request tech support. I'll contact my IT department or service provider directly.", isCorrect: true }
    ],
    level: 1,
    explanation: "Tech support will never contact you unsolicited about viruses on your computer. This is a common tactic to gain remote access to your devices for malicious purposes.",
    correct: 3
  },

  // Level 2
  {
    id: 'std-2-1',
    question: "Hello, I'm from the government tax office. Our records show you have an outstanding tax debt that needs to be paid immediately or we'll have to issue an arrest warrant. You can pay now with gift cards to avoid legal action.",
    options: [
      { id: 1, text: "I'll pay right away! I don't want to be arrested.", isCorrect: false },
      { id: 2, text: "Government agencies don't accept gift cards as payment. This is a scam.", isCorrect: true },
      { id: 3, text: "Can I get a payment extension?", isCorrect: false }
    ],
    level: 2,
    explanation: "Government agencies never demand immediate payment using gift cards, cryptocurrency, or wire transfers. They communicate through official letters and provide multiple ways to verify and resolve tax issues.",
    correct: 2
  },
  {
    id: 'std-2-2',
    question: "I'm calling about your car's extended warranty that's about to expire. We're offering a special discount to renew it today. Would you like to protect your vehicle from expensive repairs?",
    options: [
      { id: 1, text: "Yes, I'd like to know more about the coverage options.", isCorrect: false },
      { id: 2, text: "Which car are you referring to?", isCorrect: false },
      { id: 3, text: "I don't respond to unsolicited calls about warranties. Please remove me from your call list.", isCorrect: true }
    ],
    level: 2,
    explanation: "These unsolicited warranty calls are almost always scams. Legitimate warranty companies don't cold-call consumers. They typically communicate through mail with specific details about your vehicle.",
    correct: 3
  },
  {
    id: 'std-2-3',
    question: "This is an urgent message from the immigration office. There's a problem with your visa status that requires immediate attention. Please call this number back immediately or you may face deportation.",
    options: [
      { id: 1, text: "I'll call back right away! I can't risk being deported.", isCorrect: false },
      { id: 2, text: "Immigration authorities send official notices by mail, not phone calls. I'll contact the official immigration office directly.", isCorrect: true },
      { id: 3, text: "Can you provide more details about the issue with my visa?", isCorrect: false }
    ],
    level: 2,
    explanation: "Immigration authorities communicate through official written notices, not unexpected phone calls. These scams prey on fear to extract personal information or money.",
    correct: 2
  },

  // Level 3
  {
    id: 'std-3-1',
    question: "Hello, I'm calling from your mortgage company. We're offering a special refinance program with much lower rates, but you need to act today. We just need to verify your identity with your Social Security number and date of birth.",
    options: [
      { id: 1, text: "That sounds like a great offer! Let me give you my information.", isCorrect: false },
      { id: 2, text: "Can you send me the offer in writing first?", isCorrect: false },
      { id: 3, text: "I don't provide personal information on unsolicited calls. I'll contact my mortgage company directly if I'm interested in refinancing.", isCorrect: true }
    ],
    level: 3,
    explanation: "Legitimate financial institutions won't call you unexpectedly asking for personal information. Always verify offers by contacting your mortgage company directly using their official contact information.",
    correct: 3
  },
  {
    id: 'std-3-2',
    question: "I'm an investment advisor, and I have an exclusive opportunity that guarantees a 50% return in just 3 months. This is a limited-time offer only available to select individuals. Would you like to invest?",
    options: [
      { id: 1, text: "That sounds incredible! How much can I invest?", isCorrect: false },
      { id: 2, text: "No legitimate investment guarantees returns. This is likely a scam.", isCorrect: true },
      { id: 3, text: "Can you provide me with more information about this investment?", isCorrect: false }
    ],
    level: 3,
    explanation: "No legitimate investment can guarantee high returns, especially in a short timeframe. Promises of guaranteed high returns with little or no risk are classic signs of investment scams.",
    correct: 2
  },
  {
    id: 'std-3-3',
    question: "I'm calling from your insurance company. We've found a way to lower your premium by 50%, but we need to update your payment information today. Can you verify your credit card details?",
    options: [
      { id: 1, text: "Great! I'm happy to provide my payment details for the lower rate.", isCorrect: false },
      { id: 2, text: "I'll call my insurance company directly using the number on my policy to discuss this offer.", isCorrect: true },
      { id: 3, text: "Can you explain how you're able to offer such a significant discount?", isCorrect: false }
    ],
    level: 3,
    explanation: "Insurance companies typically communicate policy changes in writing and won't call asking for payment information out of the blue. Always verify such offers by contacting your insurance company directly using their official number.",
    correct: 2
  }
];