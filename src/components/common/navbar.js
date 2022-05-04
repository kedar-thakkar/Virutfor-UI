import React from 'react';
import virtuForLlogo from './images/virtufor_logo.png'

function Navbar() {

    return (
        <>
            <header className="header">
                <div className="wrapper">
                    <div className="header_inr">
                        <div className="logo_header">
                            <a href="#.">
                                <img src={virtuForLlogo} alt="" />
                            </a>
                        </div>
                    </div>
                </div>
            </header>
        </>
    ) 
    
}

export default Navbar;