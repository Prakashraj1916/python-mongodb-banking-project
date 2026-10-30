import { useEffect, useState } from "react";
import API, { downloadExcel } from "../../service/api";

function CompleteShow() {

    const [customer, setCustomer] = useState([]);

    // Fetch complete customer details
    useEffect(() => {
        getCompleteCustomers();
    }, []);

    const getCompleteCustomers = async () => {

        try {

            const response = await API.get(
                "/customer/personal_details/complete"
            );

            console.log("Complete Customer Data:", response.data);

            // Store API data in state
            setCustomer(response.data);

        } catch (error) {

            console.log("Fetch Complete Customer Error:");
            console.log(error);
            console.log("Response:", error.response);
            console.log("Status:", error.response?.status);
            console.log("Data:", error.response?.data);

            alert(
                error.response?.data?.detail ||
                "Failed to fetch the complete Customers"
            );
        }
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
            console.log("Response:", error.response);
            console.log("Status:", error.response?.status);
            console.log("Data:", error.response?.data);

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

                                    <tr
                                        key={
                                            item.account_id || index
                                        }
                                    >

                                        <td>
                                            {item.account_id}
                                        </td>

                                        <td>
                                            {item.name}
                                        </td>

                                        <td>
                                            {item.age}
                                        </td>

                                        <td>
                                            {item.account_type}
                                        </td>

                                        <td>
                                            Rs.{" "}
                                            {Number(
                                                item.balance
                                            ).toLocaleString("en-IN")}
                                        </td>

                                        <td>
                                            {item.aadhaar_no}
                                        </td>

                                        <td>
                                            {item.address}
                                        </td>

                                        <td>
                                            {item.pincode}
                                        </td>

                                        <td>
                                            {item.status}
                                        </td>

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


                {/* Customer Count */}

                <div
                    style={{
                        marginTop: "15px",
                        fontWeight: "600"
                    }}
                >
                    Total Customers: {customer.length}
                </div>

            </div>

        </div>
    );
}

export default CompleteShow;