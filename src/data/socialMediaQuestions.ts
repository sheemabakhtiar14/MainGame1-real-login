import { SocialMediaQuestion } from '../types/game';

export const socialMediaQuestions: SocialMediaQuestion[] = [
  // Level 1
  {
    id: 'social-1-1',
    username: '@apple.support',
    profilePic: 'https://images.pexels.com/photos/1482061/pexels-photo-1482061.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: "ATTENTION ALL APPLE USERS: We're giving away 100 iPhone 15 Pro Max devices to celebrate our new product launch! To enter, simply like this post, share it to your story, and click the link in our bio to register. Winners will be announced tomorrow!",
    level: 1,
    isScam: true,
    explanation: "This is a scam. Official Apple accounts are verified and would never run giveaways requiring users to click suspicious links. The username '@apple.support' is not an official Apple account name. Apple doesn't conduct giveaways through social media comments or require users to share posts to win products."
  },
  {
    id: 'social-1-2',
    username: '@friend.jessica',
    profilePic: 'https://images.pexels.com/photos/3757004/pexels-photo-3757004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: "Hey! I saw your name on this list of people who are owed money from the government! Check if your name is on it too: [link]",
    level: 1,
    isScam: true,
    explanation: "This is a common social media scam. Even if the account appears to belong to someone you know, legitimate unclaimed funds would never be announced this way. The account may have been hacked or spoofed. Government agencies have official websites for unclaimed property searches and don't notify people through social media friends."
  },
  {
    id: 'social-1-3',
    username: '@nike',
    profilePic: 'https://images.pexels.com/photos/4462782/pexels-photo-4462782.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: "Summer collection JUST dropped! Check out our new line of performance gear, designed for athletes at every level. Available now at nike.com or in Nike stores. #JustDoIt",
    image: 'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    level: 1,
    isScam: false,
    explanation: "This appears to be a legitimate post from Nike. It promotes their products on their official website or stores, uses their official slogan (#JustDoIt), doesn't request personal information, and doesn't offer unrealistic deals or giveaways. The content is consistent with normal brand marketing."
  },

  // Level 2
  {
    id: 'social-2-1',
    username: '@netflix_giveaway',
    profilePic: 'https://images.pexels.com/photos/11787740/pexels-photo-11787740.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: "NETFLIX IS GIVING 1000 PREMIUM ACCOUNTS FOR FREE! Due to the pandemic, Netflix is giving away 1000 free subscriptions to keep people entertained at home. Claim yours now before they're all gone! Click the link and enter your details to qualify: [link]",
    level: 2,
    isScam: true,
    explanation: "This is a scam. Netflix doesn't give away free accounts through unofficial social media profiles. The username '@netflix_giveaway' is not an official Netflix account. Legitimate offers from Netflix would come from their verified accounts and wouldn't require clicking suspicious links or providing personal information through social media."
  },
  {
    id: 'social-2-2',
    username: '@sarah_wilson',
    profilePic: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: "I can't believe how much weight I lost in just 2 weeks using this amazing new supplement! Doctors hate it because it works so well without diet or exercise! Check out my results and get 70% off your first order! [link]",
    image: 'https://images.pexels.com/photos/6551136/pexels-photo-6551136.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    level: 2,
    isScam: true,
    explanation: "This is a scam post. The claims of dramatic weight loss without diet or exercise are unrealistic and the 'doctors hate it' phrase is a common clickbait tactic. Legitimate health products don't make miracle claims and wouldn't be promoted this way. The account may be fake or compromised."
  },
  {
    id: 'social-2-3',
    username: '@starbucks',
    profilePic: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: "Fall is here and so is your favorite! Pumpkin Spice Lattes are back in stores nationwide. Show us how you're enjoying yours with #PSLSeason for a chance to be featured on our page!",
    image: 'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    level: 2,
    isScam: false,
    explanation: "This appears to be a legitimate post from Starbucks. It promotes a real seasonal product, uses normal marketing language, and the hashtag campaign to engage customers is a common and legitimate social media marketing strategy. It doesn't request personal information or offer unrealistic promotions."
  },

  // Level 3
  {
    id: 'social-3-1',
    username: '@mark_zuckerbrg',
    profilePic: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: "Facebook is becoming too crowded. We're now deleting inactive accounts to make more space available. To keep your account active, copy and paste this message to 15 friends. Anyone who doesn't pass this on will have their account deleted tomorrow. This is directly from Mark Zuckerberg.",
    level: 3,
    isScam: true,
    explanation: "This is a hoax. Facebook doesn't delete inactive accounts to 'make space' - that's not how digital platforms work. Note the misspelled username '@mark_zuckerbrg' (missing an 'e'). Real policy changes would be announced through official channels, not chain messages. Mark Zuckerberg would communicate through his verified profile, not ask users to copy and paste messages."
  },
  {
    id: 'social-3-2',
    username: '@elonmusk',
    profilePic: 'https://images.pexels.com/photos/936043/pexels-photo-936043.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: "I want to give back to my loyal followers! I'm giving away 5000 BTC to my followers. To participate: 1. Follow me 2. Like & Retweet 3. Send 0.1 BTC to the verification address and get 1 BTC back! Only first 5000 participants.",
    level: 3,
    isScam: true,
    explanation: "This is a common cryptocurrency scam. Celebrities and business leaders like Elon Musk don't give away cryptocurrency to random followers. The request to send cryptocurrency first to receive more back is a classic scam tactic. No legitimate giveaway would ever ask you to send money first. The account is likely impersonating Elon Musk."
  },
  {
    id: 'social-3-3',
    username: '@amazonhelp',
    profilePic: 'https://images.pexels.com/photos/5966370/pexels-photo-5966370.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: "@customer We're sorry to hear about your delivery issue. Please DM us your order number and we'll look into this for you right away.",
    level: 3,
    isScam: false,
    explanation: "This appears to be legitimate customer service from Amazon. The verified @amazonhelp account is Amazon's official customer service account. They're responding directly to a customer complaint, asking for relevant order information through direct message (which is secure), and not asking for sensitive personal information in public comments."
  }
];