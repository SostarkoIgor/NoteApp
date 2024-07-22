import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [message, setMessage] = useState("")

    const navigator = useNavigate()

    const handleSubmit = (e) => {
        setMessage("")
        e.preventDefault()
        if (email === "" || password === "") {
            setMessage("Fill in email and password")
        } else {
            fetch("/login?useSessionCookies=true", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email, password: password })
            }).then(d => {
                if (d.ok) {
                    navigator("/")
                } else {
                    setMessage("Wrong data")
                }
            }).catch(e => {
                setMessage("Error")
            })

        }
    }

    const onChange = (e) => {
        if (e.target.name === "email") {
            setEmail(e.target.value)
        } else if (e.target.name === "password") {
            setPassword(e.target.value)
        }
    }
    return (
    <>
        <div className="form-container">
                <h3>Login</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="form-label" htmlFor="email">
                        Email:
                        </label>
                    </div>
                    <div>
                        <input type="email" id="email-form" name="email" value={email} onChange={onChange} placeholder="mail@mail.com" />
                    </div>
                    <div>
                        <label htmlFor="password" className="form-label">
                        Password:
                        </label>
                    </div>
                    <div>
                        <input type="password" id="password-form" name="password" value={password} onChange={onChange} />
                    </div>
                    <div>
                    <button type="submit">Login</button>
                    </div>
                    <div>
                        <a onClick={()=>navigator("/register") }>Register</a>
                    </div>
                    <div>
                        <p className="login-message">
                            {message}
                        </p>
                    </div>
                </form>
        </div>
    </>
  );
}

export default Login;