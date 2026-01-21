import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import "./Login.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>CURES Admin</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Log In</button>

          {error && <p className="login-error">{error}</p>}
          {success && <p className="login-success">Login successful!</p>}
        </form>
      </div>
    </div>
  )
}

export default Login

