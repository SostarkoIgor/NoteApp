import { useContext } from 'react'
import { AuthData } from './Authorize.jsx'
function ReactComponent() {
    const data=useContext(AuthData)
  return (
    <p>Hello {data}</p>
  );
}

export default ReactComponent;