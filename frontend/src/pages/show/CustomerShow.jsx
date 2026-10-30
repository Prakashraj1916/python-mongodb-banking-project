import "../../App.css";
import { useEffect, useState } from "react";
import API from "../../service/api";

function CustomerShow() {

    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        getCustomers();
    }, []);

    const getCustomers = async () => {
        try {
            const response = await API.get("/customers/read");

            console.log(response.data);

            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    return (
        <div>
            <h1 className = "color">Customer Details</h1>

            <h2>Active Customers</h2>
            <br />
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

                <tbody className='tablecolor'>
                    {customers.map((customer)=>(
                        <tr key={customer.account_id}>
                            <td>{customer.account_id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.age}</td>
                            <td>{customer.account_type}</td>
                            <td>Rs. {customer.balance}</td>
                            
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
                    Total Customers: {customers.length}
                </div>
            
            
        </div>
    );
}

export default CustomerShow;