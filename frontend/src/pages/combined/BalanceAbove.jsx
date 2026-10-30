import { useState } from "react";
import API from "../../service/api";

function BalanceAbove() {

    const [balance, setBalance] = useState("");
    const [data, setData] = useState([]);

    const handleSearch = async (event) => {

        event.preventDefault();

        if (!balance) {
            alert("Please enter a balance");
            return;
        }

        try {

            const response = await API.get(
                `/customer/personal_details/balance_above/${balance}`
            );

            setData(response.data);

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.detail ||
                "Failed to fetch customers"
            );
        }
    };

    return (
        <div className="collection-page">

            <div className="collection-card">

                <div className="collection-header">

                    <h2>Balance Above</h2>

                    <p>
                        Find customers whose balance is above the given amount
                    </p>

                </div>

                <form onSubmit={handleSearch}>

                    <div className="input-group">

                        <label>Minimum Balance</label>

                        <input
                            type="number"
                            value={balance}
                            onChange={(e) =>
                                setBalance(e.target.value)
                            }
                            placeholder="Enter amount"
                        />

                    </div>

                    <button type="submit"
                    className="add-customer-button">
                        Search
                    </button>

                </form>


                <div className="analysis-table">

                    <table>

                        <thead>

                            <tr>
                                <th>Account ID</th>
                                <th>Name</th>
                                <th>Balance</th>
                            </tr>

                        </thead>

                        <tbody>

                            {data.map((customer, index) => (

                                <tr key={index}>

                                    <td>
                                        {customer.account_id}
                                    </td>

                                    <td>
                                        {customer.name}
                                    </td>

                                    <td>
                                        ₹ {Number(customer.balance).toLocaleString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default BalanceAbove;