
import { useEffect, useState } from "react";
import API, { downloadExcel } from "../../service/api";

function CompleteShow() {

    const [customer, setCustomer] = useState([]);

    // Search and Filter states
    const [search, setSearch] = useState("");
    const [accountType, setAccountType] = useState("");
    const [status, setStatus] = useState("");

    // Pagination states
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Fetch complete customer details
    const getCompleteCustomers = async () => {

        try {

            const response = await API.get(
                "/customer/personal_details/search",
                {
                    params: {
                        search,
                        account_type: accountType,
                        status,
                        page,
                        limit
                    }
                }
            );

            console.log("Complete Customer Data:", response.data);

            setCustomer(response.data.customers);
            setTotal(response.data.total);
            setTotalPages(response.data.total_pages);

        } catch (error) {

            console.log("Fetch Complete Customer Error:", error);

            alert(
                error.response?.data?.detail ||
                "Failed to fetch complete customers"
            );
        }
    };

    // Automatically fetch when search, filters or page changes
    useEffect(() => {
        getCompleteCustomers();
    }, [search, accountType, status, page]);


    // Clear all filters
    const clearFilters = () => {

        setSearch("");
        setAccountType("");
        setStatus("");
        setPage(1);

    };


    // Download complete database as Excel
    const handleDownload = async () => {

        try {

            console.log("1. Download Button Clicked");

            await downloadExcel();

            console.log("2. Excel Download Completed");

            alert("Excel downloaded Successfully!");

        } catch (error) {

            console.log("3. Download Error");

            console.log(error);

            alert(
                error.response?.data?.detail ||
                "Failed to download Excel"
            );
        }
    };


    return (

        <div className="collection-page">

            <div className="collection-card">

                {/* Header */}

                <div className="collection-header">

                    <div>

                        <h2>Complete Customers</h2>

                        <p>
                            Complete Customers with Personal Details
                        </p>

                    </div>

                    <button
                        className="download-btn"
                        onClick={handleDownload}
                    >
                        Download Excel
                    </button>

                </div>


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


                {/* Complete Customer Table */}

                <div className="analysis-table">

                    <table>

                        <thead>

                            <tr>

                                <th>Account ID</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Account Type</th>
                                <th>Balance</th>
                                <th>Aadhaar Number</th>
                                <th>Address</th>
                                <th>Pincode</th>
                                <th>Status</th>

                            </tr>

                        </thead>


                        <tbody>

                            {customer.length > 0 ? (

                                customer.map((item, index) => (

                                    <tr key={item.account_id || index}>

                                        <td>{item.account_id}</td>

                                        <td>{item.name}</td>

                                        <td>{item.age}</td>

                                        <td>{item.account_type}</td>

                                        <td>
                                            Rs.{" "}
                                            {Number(
                                                item.balance
                                            ).toLocaleString("en-IN")}
                                        </td>

                                        <td>{item.aadhaar_no}</td>

                                        <td>{item.address}</td>

                                        <td>{item.pincode}</td>

                                        <td>{item.status}</td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="9"
                                        style={{
                                            textAlign: "center",
                                            padding: "5px"
                                        }}
                                    >
                                        No Complete Customer Data Found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


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
                        disabled={
                            page >= totalPages || totalPages === 0
                        }
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>

                </div>

            </div>

        </div>
    );
}

export default CompleteShow;
