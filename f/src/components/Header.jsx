import React from 'react';
import {Link} from "react-router-dom";

function Header(){
    return(
        <aside className="side-nav">
            <nav>
                <div className="w3-sidebar w3-light-grey w3-bar-block" style={{width: '100%'}}>
                    <h3 className="w3-bar-item">Menu</h3>
                    <div className="w3-bar-item w3-button w3-hover-blue"><Link to="/rent_form" className="nav-link">Lease Rent Agreement Form</Link></div>
                    <div className="w3-bar-item w3-button w3-hover-blue"><Link to="/rent_details" className="nav-link">View Lease Rent Agreement Details</Link></div>
                    <div className="w3-bar-item w3-button w3-hover-blue"><Link to="/house_sale_details" className="nav-link">House Sale Agreement Form</Link></div>
                    <div className="w3-bar-item w3-button w3-hover-blue"><Link to="/house_sale_form" className="nav-link">View House Sale Agreement Details</Link></div>
                </div>
            </nav>
        </aside>
    );
}

export default Header;