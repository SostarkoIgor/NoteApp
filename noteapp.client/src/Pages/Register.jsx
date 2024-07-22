import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Styles/Login.css'

function Register() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cPassword, setCpassword] = useState("")

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
        if (password !== cPassword) {
            setError("Password mismatch")
        } else if (email === "" || password === "" || cPassword === "") {
            setError("Fill in all fields")
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
                    } else {
                        setError("Error")
                    }
                })
        }
    }

  return (
      <>
          <div className="form-container">
          <div className='title-div'>
            <h2>Register</h2>
            <h4>Register to to start making notes</h4>
            </div>
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
                  <label htmlFor="password" className="form-label">
                          Repeat password:
                      </label>
                  <div>
                      <input type="password" id="cpassword-form" name="cpassword" value={cPassword} onChange={onChange} />
                  </div>
                  <div>
                      <button type="submit">Register</button>
                  </div>
                  <div className='link-class'>
                      <a onClick={()=>navigator("/login")}>Login</a>
                  </div>
                  <div>
                      <p className="submit-message">
                          {error}
                      </p>
                  </div>
              </form>
          </div>
      </>
  );
}

export default Register;