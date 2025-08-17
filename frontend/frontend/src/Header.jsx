import React from 'react';
import { Link } from 'react-router-dom';
import iconApp from "./iconApp.png"

function Header() {
    return(
        <header  className="app-header">
            <nav>
                <ul>
                    <img src={iconApp} alt="icon" className="App-logo"/>
                </ul>
            </nav>
        </header>
    )
}
export default Header;