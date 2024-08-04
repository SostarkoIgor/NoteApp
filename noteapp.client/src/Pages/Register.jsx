import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../Styles/Login.module.css'
import Loader from '../Components/Loader.jsx'

function Register() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cPassword, setCpassword] = useState("")
    const [errorColor, setErrorColor] = useState("")
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState("")

    const navigator = useNavigate()

    const onChange = (e) => {
        if (e.target.name === "email") {
            setEmail(e.target.value)
        } else if (e.target.name === "password") {
            setPassword(e.target.value)
        } else if (e.target.name === "cpassword") {
            setCpassword(e.target.value)
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        setErrorColor("")
        if (password !== cPassword) {
            setError("Password mismatch")
            setLoading(false)
        } else if (email === "" || password === "" || cPassword === "") {
            setError("Fill in all fields")
            setLoading(false)
        } else {
            setError("");
            fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email, password: password, }),
            }).then(d => {
                    if (d.ok) {
                        setError("Successful register")
                        setErrorColor("green;")
                    } else {
                        setError("Error")
                    }
                }).finally(() => {
                    setLoading(false)
                })
        }
        
    }

  return (
    <div className={styles.pagecontainer}>
          <div className={styles.formcontainer}>
          <div className={styles.titlediv}>
            <h2>Register</h2>
            <h4>Register to to start making notes</h4>
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
                      <label htmlFor="password" className={styles.formlabel}>
                          Password:
                      </label>
                  </div>
                  <div>
                      <input type="password" id="password-form" name="password" value={password} onChange={onChange} />
                  </div>
                  <label htmlFor="password" className={styles.formlabel}>
                          Repeat password:
                      </label>
                  <div>
                      <input type="password" id="cpassword-form" name="cpassword" value={cPassword} onChange={onChange} />
                  </div>
                  <div>
                  {loading ? <Loader /> : 
                      <button type="submit">Register</button>}
                  </div>
                  <div className={styles.linkclass}>
                      <a onClick={()=>navigator("/login")}>Login</a>
                  </div>
                  <div>
                      <p className={styles.submitmessage} style={{ color: errorColor }}>
                          {error}
                      </p>
                  </div>
              </form>
          </div>
      </div>
  );
}

export default Register;