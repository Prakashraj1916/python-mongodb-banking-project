
import React from "react";


function Home() {

    return (

        <div className="home">

            <div className="hero">

                <p>Manage customers and their personal details
                    in one place.</p>

            </div>
            <br />
            <br />
            <div className="cards">

                <div className="card">

                    <h2>New Customers</h2>

                    <p>
                        Add and manage customer account information.
                    </p>
                    

                    <a href="/customer/collection">
                        Add Customer
                    </a>

                </div>


                <div className="card">

                    <h2>Customer List</h2>

                    <p>
                        View all active customers and their account
                        information.
                    </p>

                    <a href="/show/customer">
                        View Customers
                    </a>

                </div>


                <div className="card">

                    <h2>Personal Details List</h2>

                    <p>
                        View the personal details of active customers.
                    </p>

                    <a href="/show/personal">
                        View Details
                    </a>

                </div>

                <div className="card">

                    <h2>Block Customer</h2>

                    <p>
                        Block the customer who need to.
                    </p>

                    <a href="/status/block">
                        View Details
                    </a>

                </div>

                <div className="card">

                    <h2>Unblock Customer</h2>

                    <p>
                        Unblocking the customer who need to.
                    </p>

                    <a href="/status/unblock">
                        View Details
                    </a>

                </div>

                <div className="card">

                    <h2>Deactivate Customer</h2>

                    <p>
                        Deactivate the customer who need to.
                    </p>

                    <a href="/status/deactivate">
                        View Details
                    </a>

                </div>

                <div className="card">

                    <h2>Customer Update</h2>

                    <p>
                        Update the customer who need to.
                    </p>

                    <a href="/update/customerupdate">
                        Customer Detials Updations
                    </a>

                </div>

                <div className="card">

                    <h2>Persoanl Details Update</h2>

                    <p>
                        Update the customer's Personal Details who need to.
                    </p>

                    <a href="/update/personaldetailsupdate">
                        Personal Detials Updations
                    </a>

                </div>


                <div className="card">

                    <h2>Others</h2>

                    <p>
                        Access other Features.
                    </p>

                    <a href="/combined">
                        Other Features
                    </a>

                </div>

                <div className="card">

                    <h2>Complete Data
                    </h2>

                    <p>
                        Access Complete Details of Customers.
                    </p>

                    <a href="/combined/complete-data">
                        Complete Data
                    </a>

                </div>

            </div>

        </div>
    );
}

export default Home;