import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Feedback } from '../components/Feedback.tsx'
import { Footer } from '../components/Footer.tsx'
import { Header } from '../components/Header.tsx'
import { Hero } from '../components/Hero.tsx'
import { HowItWorks } from '../components/HowItWorks.tsx'
import { Reunion } from '../components/Reunion.tsx'
import { Witnesses } from '../components/Witnesses.tsx'
import './HomePage.scss'

// Ссылки шапки вида /#how-it-works: роутер меняет адрес, но сам к якорю не прокручивает.
function useScrollToHash() {
  const { hash, key } = useLocation()

  useEffect(() => {
    if (!hash || hash === '#top') {
      if (hash === '#top') window.scrollTo({ top: 0 })
      return
    }
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
  }, [hash, key])
}

export function HomePage() {
  useScrollToHash()

  return (
    <div className="home-page">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Witnesses />
        <Reunion />
        <Feedback />
      </main>
      <Footer />
    </div>
  )
}
