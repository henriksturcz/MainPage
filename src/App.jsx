import { useState, lazy, Suspense } from 'react'
import PageLoader from './components/ui/PageLoader'
import Cursor from './components/ui/Cursor'
import ThreeBackground from './components/ui/ThreeBackground'

const Navbar       = lazy(() => import('./components/layout/Navbar'))
const Footer       = lazy(() => import('./components/layout/Footer'))
const Hero         = lazy(() => import('./components/sections/Hero'))
const About        = lazy(() => import('./components/sections/About'))
const Projects     = lazy(() => import('./components/sections/Projects'))
const GitHub       = lazy(() => import('./components/sections/GitHub'))
const Capabilities = lazy(() => import('./components/sections/Capabilities'))
const Contact      = lazy(() => import('./components/sections/Contact'))

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <Cursor />
      {!loaded && <PageLoader onComplete={() => setLoaded(true)} />}
      <ThreeBackground />
      {loaded && (
        <Suspense fallback={null}>
          <Navbar />
          <main>
            <Hero />
            <About />
            <Projects />
            <GitHub />
            <Capabilities />
            <Contact />
          </main>
          <Footer />
        </Suspense>
      )}
    </>
  )
}