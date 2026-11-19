import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="card" style={{ maxWidth: 720, textAlign: 'center' }}>
      <h1>Find your new best friend</h1>
      <p>Browse pets from verified shelters and rescuers, and apply to adopt online.</p>
      <Link to="/register" className="btn">Create an account</Link>
    </section>
  )
}