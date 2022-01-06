import React from 'react'

function NavBar() {
    return (
        <div>
            
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
                    <div className="container">
                        <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="QuestionList.js"><label className="label"> Questions </label>  </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link"> <label className="label"> Subjects </label>  </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link"> <label className="label"> Topics </label>  </a>
                        </li>
                        </ul>
                    </div>
            </nav>

        </div>
    )
}

export default NavBar
