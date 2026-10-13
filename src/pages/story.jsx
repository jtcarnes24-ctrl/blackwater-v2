import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { StoryExperience } from '../components/story/StoryExperience'

/* Deliberately not wrapped in <Layout>. The intro runs full-bleed with its
   own fixed lockup, and the site nav would sit on top of the render. */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoryExperience />
  </StrictMode>
)
