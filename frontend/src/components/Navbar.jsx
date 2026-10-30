import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-menu">

                {/*Home*/}
                <div className="dropdown">
                    <button className="dropdown-button">
                        Home 
                    </button>
                    <div className="dropdown-content">
                        <Link to="/login">Login</Link>
                    </div>
                    <div className="dropdown-content">
                        <Link to = "/home">Home</Link>
                    </div>
                </div>

                {/*Data updation */}
                <div className="dropdown">
                    <button className="dropdown-button">
                        Customer 
                    </button>
                    <div className="dropdown-content">
                        <Link to="/customer/collection">
                            Customer Collection
                        </Link>
                        <Link to="/show/customer">
                            Customer Show
                        </Link>
                    </div>
                </div>

                <div className="dropdown">
                    <button className="dropdown-button">
                        Data View
                    </button>
                    <div className="dropdown-content">
                        <Link to="/show/personal">
                            Personal Details Show
                        </Link> 
                        <Link to="/combined/complete-data">
                            Complete Data's
                        </Link>
                        <Link to="/chart">
                            Dashboard
                        </Link>                 
                    </div>
                </div>

                <div className="dropdown">
                    <button className="dropdown-button">
                        Status 
                    </button>
                    <div className="dropdown-content">
                        <Link to="/status/block">
                            Block
                        </Link>
                        <Link to="/status/unblock">
                            Unblock
                        </Link>
                        <Link to="/status/deactivate">
                            Deactivate
                        </Link>
                    </div>
                </div>

                <div className="dropdown">
                    <button className="dropdown-button">
                        Updation
                    </button>
                    <div className="dropdown-content">
                        <Link to="/update/customerupdate">
                            Customer updation
                        </Link> 
                        <Link to="/update/personaldetailsupdate">
                            Personal Details updation
                        </Link>                   
                    </div>
                </div>

                <div className="dropdown">
                    <button className="dropdown-button">
                        Others
                    </button>
                    <div className="dropdown-content">
                        <Link to="/combined">
                            Others
                        </Link>                   
                    </div>
                </div>

                <div className="dropdown">
                    <button className="dropdown-button">
                        LogOut
                    </button>
                    <div className="dropdown-content">
                        <Link to="/login">Logout</Link>
                    </div>
                </div>

                <div className="dropdown">
                    <button 
                        type="button"
                        className="dropdown-button"
                        onClick={() => window.dispatchEvent(new CustomEvent('openChatbot'))}
                    >
                        ChatBot
                    </button>
                    <div className="dropdown-content">
                        <button
                            type="button"
                            onClick={() => window.dispatchEvent(new CustomEvent('openChatbot'))}
                            style={{
                                display: "block",
                                width: "100%",
                                background: "rgb(74, 74, 183)",
                                border: "none",
                                padding: "12px 16px",
                                textDecoration: "none",
                                color: "#fcfcfc",
                                fontSize: "16px",
                                textAlign: "left",
                                cursor: "pointer"
                            }}
                        >
                            Open Assistant
                        </button>
                        <Link to="/chatbot">
                            Help & Support
                        </Link>
                    </div>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;