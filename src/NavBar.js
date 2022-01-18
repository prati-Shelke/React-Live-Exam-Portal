import React from 'react'
import { useNavigate } from 'react-router-dom'

function NavBar() {

    let navigate = useNavigate()
    return (
        <div>
            
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
                    <div className="container">
                        <ul className="navbar-nav" style={{marginTop:"2px"}}>
                            <li className="nav-item">
                                <a className="nav-link" href="/QuestionList"><label className="label"> Questions </label>  </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link"> <label className="label"> Subjects </label>  </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link"> <label className="label"> Topics </label>  </a>
                            </li>
                        </ul>
                        <button type="button" className="btn btn-danger text text-end" onClick={()=>{localStorage.removeItem('token');localStorage.removeItem('googleToken');window.open('/Login','_self')}} style={{height:"38px",width:"90px",float:"right"}}>
                            Logout
                        </button>
                    </div>
            </nav>

        </div>
    )
}

export default NavBar
