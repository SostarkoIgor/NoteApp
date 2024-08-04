import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../Styles/Login.module.css'
import Loader from '../Components/Loader.jsx'
function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const [message, setMessage] = useState("")
    const [passwordInput, setPasswordInput] = useState("password")

    const navigator = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setMessage("")
        
        if (email === "" || password === "") {
            setMessage("Fill in email and password")
        } else {
            setLoading(true)
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
            }).finally(() => {
                setLoading(false)
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
    <div className={styles.pagecontainer}>
        <div className={styles.formcontainer}>
            <div className={styles.titlediv}>
            <h2>Login</h2>
            <h4>Login to access your notes</h4>
            </div>
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className={styles.formlabel} htmlFor="email">
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
                        <input type={passwordInput} id="password-form" name="password" value={password} onChange={onChange} />
                    </div>
                    <div>
                        <input type="checkbox" id="show-password" name="show-password" onClick={() => { setPasswordInput(passwordInput === "password" ? "text" : "password") }} />
                        <label htmlFor="show-password">Show password</label>
                    </div>
                    <div>
                        {loading ? <Loader /> : 
                            <button type="submit">Login</button>}
                    </div>
                    {loading ? <div></div> :
                        <div className={styles.linkclass}>
                            <a onClick={() => navigator("/register")}>Register</a>
                        </div>}
                    <div>
                        <p className={styles.submitmessage}>
                            {message}
                        </p>
                    </div>
                </form>
        </div>
    </div>
  );
}

export default Login;