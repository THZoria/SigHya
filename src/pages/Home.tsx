import Features from '../components/Features'
import Hero from '../components/Hero'
import News from '../components/News'
import PageTransition from '../components/PageTransition'
import Partners from '../components/Partners'
import Projects from '../components/Projects'

/**
 * Home page component - Main landing page of the application
 * Displays all major sections including hero, features, partners, projects, and news
 * Wrapped with PageTransition for smooth animations
 */
const Home = () => {
  return (
    <PageTransition>
      {/* Hero section with main call-to-action */}
      <Hero />

      {/* Features section showcasing key capabilities */}
      <Features />

      {/* Partners section displaying collaborations */}
      <Partners />

      {/* Projects section highlighting recent work */}
      <Projects />

      {/* News section with latest updates */}
      <News />
    </PageTransition>
  )
}

export default Home
