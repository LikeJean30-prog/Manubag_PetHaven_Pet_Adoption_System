import { Link } from 'react-router-dom'
import '../styles/home.css'

export default function Home() {
  return (
    
    <section className="card home-card">
      <h1>Find your new best friend</h1>
      <p>Browse pets from verified shelters and rescuers, and apply to adopt online.</p>
      <Link to="/register" className="btn">Create an account</Link>
    </section>
    
  )
}