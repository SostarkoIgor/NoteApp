import { useNavigate } from "react-router-dom"
function LogoutLink(props) {
    const navigate = useNavigate()

    function handleClick() {
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(d => {
            if (d.ok) {
                navigate("/login")
            }
        }).catch(e=>{
            console.log(e)
        })
    }
    return (
        <a href="#" className={props.className} onClick={handleClick}>{props.children}</a>
    )
}

export default LogoutLink