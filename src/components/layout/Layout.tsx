import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="min-h-screen grid-tactical bg-ground text-ink">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
