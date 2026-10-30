import { useEffect, useState } from "react";
import API from "../../service/api";

function Active() {

    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        getActiveCustomers();
    }, []);

    const getActiveCustomers = async () => {
        try {

            const response = await API.get(
                "/customer/personal_details/active"
            );

            setCustomers(response.data);

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.detail ||
                "Failed to fetch active customers"
            );
        }
    };


    return (
        <div className="collection-page">

            <div className="collection-card">

                <div className="collection-header">
                    <h2>Active Customers</h2>
                    <p>Currently active customer accounts</p>
                </div>

                <div className="analysis-table">

                    <table>

                        <thead>
                            <tr>
                                <th>Account ID</th>
                                <th>Name</th>
                                <th>Account Type</th>
                                <th>Balance</th>
                                
                            </tr>
                        </thead>

                        <tbody>

                            {customers.map((customer, index) => (

                                <tr key={index}>

                                    <td>{customer.account_id}</td>

                                    <td>{customer.name}</td>

                                    <td>{customer.account_type}</td>

                                    <td>
                                        Rs. {Number(customer.balance).toLocaleString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    <div
                    style={{
                        marginTop: "15px",
                        fontWeight: "600"
                    }}
                >
                    Total  Active Customers: {customers.length}
                </div>

                </div>

            </div>

        </div>
    );
}

export default Active;