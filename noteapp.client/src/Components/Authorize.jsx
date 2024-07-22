import React, { useState, useEffect, createContext } from 'react'
import { Navigate } from 'react-router-dom'

const AuthData = createContext()
export { AuthData }
function Authorize(props) {
    const [authorised, setAuthorised] = useState(false)
    const [mail, setMail] = useState("")
    const [loading, setLoading]=useState(true)
    useEffect(() => {
        async function start() {
            try {
                let resp = await fetch("/getauth", {
                    method: "GET"
                })
               
                if (resp.status == 200) {
                    let j = await resp.json()
                    console.log(j.email)
                    setMail(j.email)
                    setAuthorised(true)
                }
                else {
                    console.log(resp.status)
                    //
                }
                setLoading(false)
            }
            catch (e) {
                setAuthorised(false)
                console.log("error with /getauth")
            }
            
        }
        start()
    }, [])
    if (authorised) {
        return <AuthData.Provider value={mail}>{props.children}</AuthData.Provider>
    }
    else {
        if (loading) {
            return <p className="loading-p">Loading...</p>
        }
        else
        return <Navigate to="/login"/>
    }
}

export default Authorize;