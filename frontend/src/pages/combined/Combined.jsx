import { Link } from "react-router-dom";

function Combined() {
    return (
        <div className="collection-page">

            <div className="collection-card">

                <div className="collection-header">
                    <h2>Banking Analysis</h2>
                    <p>Select an analysis to view the required data</p>
                </div>

                <div className="combined-menu">

                    <Link to="/combined/account-type" className="combined-link">
                        <span>01</span>
                        <h3>Account Type</h3>
                        <p>View customers by account type</p>
                    </Link>

                    <Link to="/combined/active" className="combined-link">
                        <span>02</span>
                        <h3>Active Customers</h3>
                        <p>View currently active customers</p>
                    </Link>

                    <Link to="/combined/average-balance" className="combined-link">
                        <span>03</span>
                        <h3>Average Balance</h3>
                        <p>Calculate average account balance</p>
                    </Link>

                    <Link to="/combined/complete-details" className="combined-link">
                        <span>04</span>
                        <h3>Data Projection</h3>
                        <p>View selected customer details</p>
                    </Link>

                    <Link to="/combined/balance-above" className="combined-link">
                        <span>05</span>
                        <h3>Balance Above</h3>
                        <p>Find customers above a balance</p>
                    </Link>

                    <Link to="/combined/balance-below" className="combined-link">
                        <span>06</span>
                        <h3>Balance Below</h3>
                        <p>Find customers Below a balance</p>
                    </Link>

                    <Link to="/combined/high-low" className="combined-link">
                        <span>07</span>
                        <h3>High / Low Balance</h3>
                        <p>Find highest and lowest balances</p>
                    </Link>

                    <Link to="/combined/status-count" className="combined-link">
                        <span>08</span>
                        <h3>Status Count</h3>
                        <p>Count customers by status</p>
                    </Link>

                    <Link to="/combined/top-accounts" className="combined-link">
                        <span>09</span>
                        <h3>Top Accounts</h3>
                        <p>View top 5 account balances</p>
                    </Link>

                    <Link to="/combined/total-balance" className="combined-link">
                        <span>10</span>
                        <h3>Total Balance</h3>
                        <p>View total bank balance</p>
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Combined;