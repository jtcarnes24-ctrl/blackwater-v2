import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { MethodSystems } from '../components/pages/MethodSystems'
import { ContactSection } from '../components/ContactSection'

/* Lead copy matches the four pillars in FlowGroup1 (simplified Nov 24 2026).
   The closing lines describe how the work is run; they deliberately contain
   no performance numbers or client claims. */
const systems = [
  {
    num: '01', title: 'One Tested Playbook',
    lead: 'We studied what the best brands do and kept only what works. Every account runs on the same proven steps, so good results can be repeated, not lucky.',
    close: 'A good method holds up in a bad month. When results change, you can tell why, because we only change one thing at a time.',
  },
  {
    num: '02', title: 'Ads For People Ready To Buy',
    lead: 'Most agencies guess at interests and hope. We use buying data from more than 500,000 websites, covering over 22,000 topics. It shows us who is already shopping for what you sell, and we reach more people like them. Very few agencies work this way.',
    close: 'Targeting matters less than it used to. But starting with real buyers still beats guessing.',
  },
  {
    num: '03', title: 'Creators Film Your Ads',
    lead: 'Winning takes a lot of ads, and that takes real people on camera. Our network of creators makes new videos as fast as we need them. You never have to film.',
    close: 'An account that gets two new ads a month stops learning. A steady supply of new ads keeps testing going.',
  },
  {
    num: '04', title: 'New Ads Every Week',
    lead: 'We test new ads every week. Winners get more money and ads that stop working get turned off. You get your numbers twice a week, so you always know what changed.',
    close: 'Twice-a-week reports are not about more updates. They make sure nothing goes wrong for two weeks before anyone notices.',
  },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <MethodSystems
        heading="How We Grow"
        emph="brands."
        standfirst="Four steps, run as one system. Every account we take on follows them."
        systems={systems}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
