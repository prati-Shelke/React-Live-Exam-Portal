import React from 'react'
const Footer = () => {
    return (
        <div className="footer" style={{marginTop:"-20px"}}>
            <div className="container mt-5">
                <ul className="nav justify-content-center">
                    <li className="nav-item">
                        <span className="nav-link text-secondary">Terms of Use</span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link text-secondary">Privacy Policy</span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link text-secondary">Support</span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link text-secondary">Contact</span>
                    </li>
                </ul>
                <ul className="nav justify-content-center">
                    <li className="nav-item">
                        <p className="text-secondary">© 2020 Angular Minds Pvt Ltd, All Rights Reserved</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default Footer