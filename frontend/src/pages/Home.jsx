
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {

    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const pages = [
        { name: "Customer Collection", path: "/customer/collection" },
        { name: "Customer Details", path: "/show/customer" },
        { name: "Personal Details", path: "/show/personal" },
        { name: "Complete Customer Details", path: "/combined/complete-data" },
        { name: "Block Customer", path: "/status/block" },
        { name: "Unblock Customer", path: "/status/unblock" },
        { name: "Deactivate Customer", path: "/status/deactivate" },
        { name: "Customer Update", path: "/update/customerupdate" },
        { name: "Personal Details Update", path: "/update/personaldetailsupdate" },
        { name: "Other Features", path: "/combined" }
    ];

    const filteredPages = pages.filter((page) =>
        page.name.toLowerCase().includes(search.toLowerCase().trim())
    );

    const handleSelect = (path) => {
        navigate(path);
        setSearch("");
    };

    return (

        <div className="home">

            <div className="hero">

                <p>Manage customers and their personal details
                    in one place.</p>

                {/* Global Page Search */}
                <div className="global-search">

                    <input
                        type="text"
                        placeholder="Search application pages..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {search.trim() !== "" && (

                        <div className="search-results">

                            {filteredPages.length > 0 ? (

                                filteredPages.map((page, index) => (

                                    <div
                                        key={index}
                                        className="search-result-item"
                                        onClick={() => handleSelect(page.path)}
                                    >
                                        {page.name}
                                    </div>

                                ))

                            ) : (

                                <div className="no-search-result">
                                    No matching pages found
                                </div>

                            )}

                        </div>

                    )}

                </div>

            </div>

            <br />
            <br />

            <div className="cards">

                <div className="card">
                    <h2>New Customers</h2>
                    <p>Add and manage customer account information.</p>
                    <a href="/customer/collection">Add Customer</a>
                </div>

                <div className="card">
                    <h2>Customer List</h2>
                    <p>View all active customers and their account information.</p>
                    <a href="/show/customer">View Customers</a>
                </div>

                <div className="card">
                    <h2>Personal Details List</h2>
                    <p>View the personal details of active customers.</p>
                    <a href="/show/personal">View Details</a>
                </div>

                <div className="card">
                    <h2>Block Customer</h2>
                    <p>Block the customer who need to.</p>
                    <a href="/status/block">View Details</a>
                </div>

                <div className="card">
                    <h2>Unblock Customer</h2>
                    <p>Unblocking the customer who need to.</p>
                    <a href="/status/unblock">View Details</a>
                </div>

                <div className="card">
                    <h2>Deactivate Customer</h2>
                    <p>Deactivate the customer who need to.</p>
                    <a href="/status/deactivate">View Details</a>
                </div>

                <div className="card">
                    <h2>Customer Update</h2>
                    <p>Update the customer who need to.</p>
                    <a href="/update/customerupdate">
                        Customer Details Updations
                    </a>
                </div>

                <div className="card">
                    <h2>Personal Details Update</h2>
                    <p>Update the customer's Personal Details.</p>
                    <a href="/update/personaldetailsupdate">
                        Personal Details Updations
                    </a>
                </div>

                <div className="card">
                    <h2>Others</h2>
                    <p>Access other Features.</p>
                    <a href="/combined">Other Features</a>
                </div>

                <div className="card">
                    <h2>Complete Data</h2>
                    <p>Access Complete Details of Customers.</p>
                    <a href="/combined/complete-data">Complete Data</a>
                </div>

            </div>

        </div>
    );
}

export default Home;
