
import { Outlet, NavLink } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 bg-brand/95 backdrop-blur z-50 border-b border-accent/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-accent flex items-center justify-center">
              <span className="text-brand font-bold text-sm">JP</span>
            </div>
            <span className="font-bold tracking-tight text-white">John P. Stas</span>
          </a>
          <nav className="flex items-center gap-6 text-sm">
            <NavLink to="/" className={({isActive}) => isActive ? 'font-semibold text-accent' : 'text-white hover:text-accent transition-colors'}>Home</NavLink>
            <NavLink to="/portfolio" className={({isActive}) => isActive ? 'font-semibold text-accent' : 'text-white hover:text-accent transition-colors'}>Work</NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? 'font-semibold text-accent' : 'text-white hover:text-accent transition-colors'}>About</NavLink>
            <NavLink to="/resume" className={({isActive}) => isActive ? 'font-semibold text-accent' : 'text-white hover:text-accent transition-colors'}>Resume</NavLink>
            <NavLink to="/contact" className={({isActive}) => isActive ? 'font-semibold text-accent' : 'text-white hover:text-accent transition-colors'}>Contact</NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-accent/20 bg-brand/95">
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white">&copy; {new Date().getFullYear()} John P. Stas. All rights reserved.</p>
          <div className="flex gap-4">
            <a className="text-white hover:text-accent transition-colors" href="mailto:johnpstas@gmail.com">Email</a>
            <a className="text-white hover:text-accent transition-colors" href="https://www.linkedin.com/in/johnpstas" target="_blank">LinkedIn</a>
            <a className="text-white hover:text-accent transition-colors" href="https://github.com/" target="_blank">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
