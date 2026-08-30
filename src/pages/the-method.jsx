import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { MethodSystems } from '../components/pages/MethodSystems'
import { ContactSection } from '../components/ContactSection'

/* Lead copy is Jack's existing four pillars, taken verbatim from FlowGroup1.
   The supporting bullets and closing lines describe how the work is run; they
   deliberately contain no performance numbers or client claims. */
const systems = [
  {
    label: 'Pillar One', num: '01', title: 'A Method, Not a Template',
    lead: 'Built by studying the top-performing strategies across the industry and keeping only what actually produces results. Every campaign runs on the same foundation, so performance is repeatable instead of lucky.',
    points: [
      'One account structure applied across every client',
      'Changes made one at a time so cause is readable',
      'Testing kept separate from scaling',
      'Nothing rebuilt on a single bad week',
    ],
    close: 'The point of a method is that it survives a bad month. When results move you can tell what moved them, because only one thing changed.',
  },
  {
    label: 'Pillar Two', num: '02', title: 'Audiences Built on Real Intent',
    lead: 'Most agencies pick interests and hope. We use intent data to build and target audiences already in the market for what you sell, then feed it into lookalikes. Very few agencies work this way.',
    points: [
      'Audiences built from in-market signals, not guesses',
      'Seed lists fed into lookalike expansion',
      'Broad targeting where the creative can carry it',
      'Exclusions kept clean so spend is not duplicated',
    ],
    close: 'Targeting matters less than it used to, but starting from real intent still beats starting from a list of interests someone picked by feel.',
  },
  {
    label: 'Pillar Three', num: '03', title: 'Creators On Demand',
    lead: 'Winning ads take volume, and volume takes people on camera. We pull from a network of UGC creators to get brands real content at the pace testing actually requires. No casting, no filming on your end.',
    points: [
      'Creator sourcing and briefing handled for you',
      'Angles written before anything is filmed',
      'Formats built natively for each platform',
      'New concepts supplied on a steady cadence',
    ],
    close: 'An account fed two ads a month has stopped learning. The supply of creative is what keeps testing alive.',
  },
  {
    label: 'Pillar Four', num: '04', title: 'Testing On A Schedule',
    lead: 'New creative goes live every week, winners get more budget, and anything that stops working comes off. You get the numbers twice a week, so you always know what changed and why.',
    points: [
      'A defined win condition before a test runs',
      'Budget moved to winners, losers cut',
      'Scaling in increments that do not reset learning',
      'Reporting on cost per result, CTR and ROAS',
    ],
    close: 'Reporting twice a week is not about the volume of updates. It is so nothing drifts for a fortnight before anyone notices.',
  },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <MethodSystems
        eyebrow="[ 01 / THE FOUR PILLARS ]"
        heading="How We Scale"
        emph="brands."
        standfirst="Four pillars, operated as one system. Every account we take on runs through the same framework."
        systems={systems}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
