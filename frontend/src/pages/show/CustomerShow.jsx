
import "../../App.css";
import { useEffect, useState } from "react";
import API from "../../service/api";

function CustomerShow() {

    const [customers, setCustomers] = useState([]);

    // Search and filter states
    const [search, setSearch] = useState("");
    const [accountType, setAccountType] = useState("");
    const [status, setStatus] = useState("");

    // Pagination states
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Fetch customers from backend
    const getCustomers = async () => {
        try {
            const response = await API.get("/customers/search", {
                params: {
                    search,
                    account_type: accountType,
                    status,
                    page,
                    limit
                }
            });

            console.log(response.data);

            setCustomers(response.data.customers);
            setTotal(response.data.total);
            setTotalPages(response.data.total_pages);

        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    // Automatically fetch when search or filters change
    useEffect(() => {
        getCustomers();
    }, [search, accountType, status, page]);

    // Clear all filters
    const clearFilters = () => {
        setSearch("");
        setAccountType("");
        setStatus("");
        setPage(1);
    };

    return (
        <div>

            <h1 className="color">Customer Details</h1>

            <h2>Active Customers</h2>

            <br />

            {/* Search and Filters */}
            <div className="search-filter">

                <input
                    type="text"
                    placeholder="Search Account ID or Name"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />

                <select
                    value={accountType}
                    onChange={(e) => {
                        setAccountType(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Account Types</option>
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                    <option value="Salary">Salary</option>
                </select>

                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="BLOCKED">Blocked</option>
                    <option value="INACTIVE">Inactive</option>
                </select>

                <button onClick={clearFilters}>
                    Clear Filters
                </button>

            </div>

            <br />

            {/* Customer Table */}
            <table>

                <thead>
                    <tr>
                        <th>Account ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Account Type</th>
                        <th>Balance</th>
                    </tr>
                </thead>

                <tbody className="tablecolor">

                    {customers.length > 0 ? (

                        customers.map((customer) => (

                            <tr key={customer.account_id}>
                                <td>{customer.account_id}</td>
                                <td>{customer.name}</td>
                                <td>{customer.age}</td>
                                <td>{customer.account_type}</td>
                                <td>Rs. {customer.balance}</td>
                            </tr>

                        ))

                    ) : (

                        <tr>
                            <td colSpan="5">
                                No customers found
                            </td>
                        </tr>

                    )}

                </tbody>

            </table>

            {/* Total Customers */}
            <div
                style={{
                    marginTop: "15px",
                    fontWeight: "600"
                }}
            >
                Total Customers: {total}
            </div>

            {/* Pagination */}
            <div className="pagination">

                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>

                <span>
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page >= totalPages || totalPages === 0}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>

            </div>

        </div>
    );
}

export default CustomerShow;
