/**
 * Hero content for every inner page (PageHero, Nov 27 2026). One place so the
 * photos can be swapped page by page as Jack sends them.
 *
 * Copy rules: every line is taken from that page's own copy or from Jack's
 * confirmed claims ($1M+ for clients, $200K+ client months, 35+ brands).
 * No em dashes.
 *
 * PHOTOS: every page has its own photo (Jack's Pexels downloads, Nov 27 2026),
 * graded to dark black-and-white and cut into bg (whole photo) and fg (land
 * only) by scratchpad grade2.py. `foot` is where the word's baseline sits, as a
 * fraction of photo height; `maxRight` keeps long words left of a tall peak.
 *
 * `orb` is the service's orb from the Services grid (public/orbs, still frame),
 * shown beside the social icons. Pages with no orb of their own in the grid
 * (Meta, TikTok, Testing, Tracking) use the Paid Ads orb, their category.
 */

const MTN = { bg: '/hero/pages/method-bg.webp', fg: '/hero/pages/method-fg.webp', w: 2400, h: 1350, foot: 0.52, footMobile: 0.6, maxRight: 0.82, maxRightMobile: 0.96 }
const LAKE = { bg: '/hero/pages/about-bg.webp', fg: '/hero/pages/about-fg.webp', w: 2400, h: 1607, foot: 0.52, footMobile: 0.515, minLeft: 0.27, maxRight: 0.88 }
const MTN_DOTS = [{ x: 0.2, y: 0.56, toCard: true }]
const LAKE_DOTS = [{ x: 0.2, y: 0.55, toCard: true }]
const mtn = { image: MTN, dots: MTN_DOTS }
const lake = { image: LAKE, dots: LAKE_DOTS }

const KICKER = 'BlackWater Marketing'

export const PAGE_HEROES = {
  method: {
    ...mtn,
    title: 'The Method: how we grow brands',
    word: 'Method', script: 'one system', kicker: KICKER,
    meta: ['The Method', 'How we grow brands'],
    points: ['Tested playbook', 'Buying data', 'Creator ads', 'Weekly tests'],
    facts: [['Steps', '4'], ['New ads', 'Every week'], ['Reports', 'Twice a week'], ['Filming', 'Our creators'], ['Targeting', 'Real buying data']],
    paras: [
      'Four steps, run as one system. Every account we take on follows them, so good results can be repeated, not lucky.',
      'We test new ads every week. Winners get more money, and ads that stop working get turned off.',
    ],
    mobileLine: 'Four steps, run as one system.',
  },

  about: {
    ...lake,
    title: 'About BlackWater Marketing',
    word: 'About', kicker: KICKER,
    meta: ['About us', 'Judged on results'],
    points: ['Results first', 'Clear numbers', 'No handoffs', 'One team'],
    facts: [['Founder', 'Jack Carnes'], ['Brands', '35+'], ['Made for clients', '$1M+'], ['Focus', 'E-commerce brands'], ['We run', 'Ads, videos, pages, emails']],
    paras: [
      'Most agencies sell you a monthly fee and a report. We would rather be judged on one thing: is your account making money?',
      'The person who builds your plan is the one inside your ad account every day. No handoff to a junior.',
    ],
    mobileLine: 'Judged on results, not reports.',
  },

  services: {
    image: { bg: '/hero/pages/services-bg.webp', fg: '/hero/pages/services-fg.webp', w: 2400, h: 1613, foot: 0.47, footMobile: 0.419, maxRight: 0.84 },
    dots: [{ x: 0.2, y: 0.557, toCard: true }],
    title: 'Our marketing services',
    word: 'Services', script: 'one team', kicker: KICKER,
    meta: ['Services', 'Start to finish'],
    points: ['Ads', 'Creative', 'Pages', 'Email and SMS'],
    facts: [['Ads', 'Meta, TikTok, Google'], ['Creative', 'Hooks, scripts, creators'], ['Pages', 'Landing pages, funnels'], ['Retention', 'Email and SMS'], ['Setup', 'Tracking you can trust']],
    paras: [
      'Ads, websites, emails and texts. One team does it all, so nothing gets missed between six different companies.',
      'Every account follows the same tested playbook, so good results can be repeated.',
    ],
    mobileLine: 'Everything an online store needs, one team.',
  },

  results: {
    image: { bg: '/hero/pages/results-bg.webp', fg: '/hero/pages/results-fg.webp', w: 2400, h: 1613, foot: 0.35, footMobile: 0.28 },
    dots: [{ x: 0.2, y: 0.519, toCard: true }],
    title: 'Client results',
    word: 'Results', script: 'that speak', kicker: KICKER,
    meta: ['Results', 'Real client accounts'],
    points: ['Real accounts', 'Real numbers', 'E-commerce', 'Run by us'],
    facts: [['Made for clients', '$1M+'], ['Best client months', '$200K+'], ['Brands', '35+'], ['Every account', 'Run by us']],
    paras: [
      'Real numbers from real client accounts. We ran every one of them.',
      'Over $1M made for our clients, across 35+ brands.',
    ],
    mobileLine: 'Real numbers from real client accounts.',
  },

  contact: {
    image: { bg: '/hero/pages/contact-bg.webp', fg: '/hero/pages/contact-fg.webp', w: 2400, h: 1815, foot: 0.54, footMobile: 0.56 },
    dots: [{ x: 0.2, y: 0.67, toCard: true }],
    title: 'Tell us about your brand',
    word: 'Contact', script: "let's talk", kicker: KICKER,
    meta: ['Contact', 'Apply below'],
    points: ['Short application', 'Honest fit check', 'First steps'],
    facts: [['Step one', 'Apply below'], ['Step two', 'We check the fit'], ['Then', 'What we would do first']],
    paras: [
      "Apply below. We'll tell you honestly if we're the right fit, and what we'd do first.",
      'The person you talk to is the person who runs your account.',
    ],
    mobileLine: "Apply below. We'll tell you if we're a fit.",
  },

  'meta-ads': {
    orb: 'iridescent',
    image: { bg: '/hero/pages/meta-ads-bg.webp', fg: '/hero/pages/meta-ads-fg.webp', w: 2400, h: 1613, foot: 0.48, footMobile: 0.47 },
    dots: [{ x: 0.2, y: 0.551, toCard: true }],
    title: 'Meta ads for online brands',
    word: 'Meta', script: 'ads', kicker: KICKER,
    meta: ['Meta Ads Management', 'Facebook and Instagram'],
    points: ['Clean structure', 'Creative tests', 'Steady scaling', 'Weekly reports'],
    facts: [['Platforms', 'Facebook, Instagram'], ['Setup', 'Pixel and Conversions API'], ['Tests', 'Win rule set first'], ['You own', 'Your ad account']],
    paras: [
      'Facebook and Instagram ads for e-commerce brands. We set them up, run them and scale them once the numbers say it is time.',
      'Three numbers decide if a campaign lives: cost per result, click-through rate and return on ad spend.',
    ],
    mobileLine: 'Facebook and Instagram ads, run and scaled.',
  },

  'tiktok-ads': {
    orb: 'iridescent',
    image: { bg: '/hero/pages/tiktok-ads-bg.webp', fg: '/hero/pages/tiktok-ads-fg.webp', w: 2400, h: 1936, foot: 0.4, footMobile: 0.338, maxRight: 0.8 },
    dots: [{ x: 0.2, y: 0.63, toCard: true }],
    title: 'TikTok ads made for TikTok',
    word: 'TikTok', script: 'ads', kicker: KICKER,
    meta: ['TikTok Ads Management', 'Built for TikTok'],
    points: ['Pixel setup', 'TikTok-native ads', 'Hook testing', 'Honest reports'],
    facts: [['Platform', 'TikTok'], ['Setup', 'Pixel and events'], ['Ads', 'Written for TikTok'], ['Testing', 'Hooks first']],
    paras: [
      'TikTok ads for e-commerce brands, built for the platform instead of copied from Meta.',
      'The first second decides if anyone sees the rest, so we test hooks before anything else.',
    ],
    mobileLine: 'TikTok ads built for TikTok, not copied from Meta.',
  },

  'paid-ads': {
    orb: 'iridescent',
    image: { bg: '/hero/pages/paid-ads-bg.webp', fg: '/hero/pages/paid-ads-fg.webp', w: 2400, h: 1361, foot: 0.5, footMobile: 0.25, maxRight: 0.62 },
    dots: [{ x: 0.2, y: 0.83, toCard: true }],
    title: 'Paid ads on every platform',
    word: 'Paid', script: 'ads', kicker: KICKER,
    meta: ['Paid Ads', 'Meta, TikTok, Google'],
    points: ['One plan', 'Tracking first', 'Win rules', 'Small steps'],
    facts: [['Platforms', 'Meta, TikTok, Google'], ['Tracking', 'Checked before spend'], ['Reports', 'Twice a week'], ['Scaling', 'In small steps']],
    paras: [
      'Meta, TikTok and Google ads for brands that want paid traffic to be a steady system, not a monthly gamble.',
      "Most brands don't have a Meta problem or a TikTok problem. They have a structure problem.",
    ],
    mobileLine: 'Meta, TikTok and Google ads under one plan.',
  },

  'email-sms': {
    orb: 'pearl',
    image: { bg: '/hero/pages/email-sms-bg.webp', fg: '/hero/pages/email-sms-fg.webp', w: 2400, h: 1613, foot: 0.44, footMobile: 0.442 },
    dots: [{ x: 0.2, y: 0.591, toCard: true }],
    title: 'Email and SMS that brings them back',
    word: 'Email', script: 'and SMS', kicker: KICKER,
    meta: ['Email & SMS Marketing', 'Bring them back'],
    points: ['Welcome flow', 'Cart recovery', 'Post-purchase', 'Win-back'],
    facts: [['Flows', 'Welcome, cart, browse'], ['After purchase', 'Reviews and reorders'], ['Past buyers', 'Win-back'], ['Campaigns', 'Not always a discount']],
    paras: [
      'Email and SMS flows and campaigns that bring in revenue from people who already know you.',
      "Your email and text list is the one audience you don't pay a platform to reach again.",
    ],
    mobileLine: 'Your cheapest customer has already bought once.',
  },

  'creative-strategy': {
    orb: 'prism',
    image: { bg: '/hero/pages/creative-strategy-bg.webp', fg: '/hero/pages/creative-strategy-fg.webp', w: 2400, h: 1614, foot: 0.48, footMobile: 0.354 },
    dots: [{ x: 0.3, y: 0.56, toCard: true }],
    title: 'Ad creative that gets watched',
    word: 'Creative', script: 'strategy', kicker: KICKER,
    meta: ['Creative Strategy & Production', 'Ads that get watched'],
    points: ['Customer words', 'Hook versions', 'Video and static', 'Build on winners'],
    facts: [['Angles', 'From real reviews'], ['Hooks', 'Several per angle'], ['Formats', 'Video, static, carousel'], ['Tests', 'One change at a time']],
    paras: [
      'Angles, hooks, scripts and concepts for paid social ads. The ad itself is the biggest thing you control.',
      'Broad targeting plus a strong sales signal now beats stacks of interests. So the ad decides who sees it.',
    ],
    mobileLine: 'The ad is the biggest thing you control.',
  },

  'testing-scaling': {
    orb: 'iridescent',
    image: { bg: '/hero/pages/testing-scaling-bg.webp', fg: '/hero/pages/testing-scaling-fg.webp', w: 2400, h: 1603, foot: 0.44, footMobile: 0.414 },
    dots: [{ x: 0.2, y: 0.55, toCard: true }],
    title: 'Ad testing and scaling that finds winners',
    word: 'Testing', script: 'and scaling', kicker: KICKER,
    meta: ['Ad Testing & Scaling', 'Find the winners'],
    points: ['One change', 'Win rules', 'Cut on schedule', 'Scale slowly'],
    facts: [['Win condition', 'Set before the test'], ['Losers', 'Cut on schedule'], ['Winners', 'Scaled in small steps'], ['Reports', 'Twice a week']],
    paras: [
      'We test ads with a win condition set before the test starts, then scale winners in small steps.',
      'Most accounts run tests with no agreed definition of a winner. Ours are decided up front.',
    ],
    mobileLine: 'A win rule set before every test.',
  },

  'tracking-setup': {
    orb: 'iridescent',
    image: { bg: '/hero/pages/tracking-setup-bg.webp', fg: '/hero/pages/tracking-setup-fg.webp', w: 2400, h: 1613, foot: 0.44, footMobile: 0.411 },
    dots: [{ x: 0.2, y: 0.577, toCard: true }],
    title: 'Tracking setup you can trust',
    word: 'Tracking', script: 'you can trust', kicker: KICKER,
    meta: ['Tracking & Account Setup', 'Checked before spend'],
    points: ['Pixel', 'Conversions API', 'No double counts', 'Partner access'],
    facts: [['Pixel', 'Installed and firing'], ['Conversions API', 'Server side'], ['Purchases', 'Counted once'], ['Access', 'Partner, not logins']],
    paras: [
      'We set up your ad account, pixel and Conversions API, and check every event before ad spend goes live.',
      'Every budget choice a platform makes comes from the data you send it. Wrong data aims it at the wrong thing.',
    ],
    mobileLine: 'Every event checked before spend goes live.',
  },

  funnels: {
    orb: 'ribbon',
    image: { bg: '/hero/pages/funnels-bg.webp', fg: '/hero/pages/funnels-fg.webp', w: 2400, h: 1614, foot: 0.43, footMobile: 0.399, minLeft: 0.4, maxRight: 0.88 },
    dots: [{ x: 0.2, y: 0.395, toCard: true }],
    title: 'Funnels that turn clicks into customers',
    word: 'Funnels', script: 'after the click', kicker: KICKER,
    meta: ['Funnel Creation & Optimization', 'Clicks into customers'],
    points: ['Find drop-offs', 'Match ad to page', 'Less friction', 'Follow-up'],
    facts: [['First', 'Find where people drop off'], ['Pages', 'Match the ad and offer'], ['Checkout', 'Less friction'], ['After purchase', 'The second order']],
    paras: [
      'Funnels are the steps between the ad and the purchase. We design them so you stop losing sales after the click.',
      'The ad buys attention. Everything after it decides if that attention turns into money.',
    ],
    mobileLine: 'Stop losing sales after the click.',
  },

  'landing-pages': {
    orb: 'rock',
    image: { bg: '/hero/pages/landing-pages-bg.webp', fg: '/hero/pages/landing-pages-fg.webp', w: 2400, h: 1613, foot: 0.66, footMobile: 0.605 },
    dots: [{ x: 0.2, y: 0.73, toCard: true }],
    title: 'Landing pages that convert',
    word: 'Landing', script: 'pages', kicker: KICKER,
    meta: ['Landing Pages & CRO', 'Pages that convert'],
    points: ['Clear top', 'One action', 'Proof in place', 'Mobile first'],
    facts: [['Top of page', 'What, who, what it costs'], ['Each screen', 'One main action'], ['Built for', 'Mobile first'], ['Speed', 'Fast load']],
    paras: [
      'We build the page people see after clicking your ad, with clearer messaging and a simpler flow.',
      'A high cost per customer is often a page problem, not an ad problem.',
    ],
    mobileLine: 'Often the ads work. The page leaks.',
  },

  'crm-cro': {
    orb: 'gold',
    image: { bg: '/hero/pages/crm-cro-bg.webp', fg: '/hero/pages/crm-cro-fg.webp', w: 2400, h: 1513, foot: 0.54, footMobile: 0.542 },
    dots: [{ x: 0.2, y: 0.701, toCard: true }],
    title: 'Fix your CRM before you scale',
    word: 'CRO', script: 'and CRM', kicker: KICKER,
    meta: ['CRM & Conversion Optimization', 'Fix it before you scale'],
    points: ['Pipeline stages', 'Fast follow-up', 'Clean data', 'Shorter forms'],
    facts: [['Leads', 'Routed and followed up fast'], ['Data', 'No duplicates'], ['Forms', 'Only what is needed'], ['Tracking', 'Tied to the CRM']],
    paras: [
      'We fix your CRM and your conversion rate. More traffic into a leaky funnel just makes the leak cost more.',
      'Leads sit untouched, records get duplicated, and forms ask for too much too soon. We fix that first.',
    ],
    mobileLine: 'Fix the leak before you buy more traffic.',
  },

  'b2b-marketing': {
    orb: 'chrome',
    image: { bg: '/hero/pages/b2b-marketing-bg.webp', fg: '/hero/pages/b2b-marketing-fg.webp', w: 2400, h: 1613, foot: 0.54, footMobile: 0.53 },
    dots: [{ x: 0.2, y: 0.572, toCard: true }],
    title: 'B2B marketing for real buyers',
    word: 'B2B', script: 'marketing', kicker: KICKER,
    meta: ['B2B Marketing', 'For real buyers'],
    points: ['Role targeting', 'Patient offers', 'Lead qualification', 'Full-cycle tracking'],
    facts: [['Targeting', 'Role, company, intent'], ['Offers', 'Built for long decisions'], ['Leads', 'Qualified for sales'], ['Measured', 'Over a full sales cycle']],
    paras: [
      'B2B means longer sales cycles, smaller lists and bigger deals. It needs precision and patience, not volume.',
      'You target a few companies, several people decide together, and the sale takes months.',
    ],
    mobileLine: 'Precision and patience, not volume.',
  },
}
