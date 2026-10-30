import { useState } from "react";
import API from "../../service/api";
import "../../App.css";

function CustomerUpdate() {

    const [accountId, setAccountId] = useState("");

    const [formData, setFormData] = useState({
        account_id: "",
        name: "",
        age: "",
        account_type: "",
        balance: ""
    });

    const [customerFound, setCustomerFound] = useState(false);

    const handleAccountIdChange = (e) => {
        setAccountId(e.target.value);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Get existing customer details
    const handleSearch = async () => {

        if (!accountId) {
            alert("Please enter Account ID");
            return;
        }

        try {

            const response = await API.get(
                `/customers/read/${accountId}`
            );

            console.log("Customer details:", response.data);

            const customer = response.data;

            setFormData({
                account_id: customer.account_id,
                name: customer.name,
                age: customer.age,
                account_type: customer.account_type,
                balance: customer.balance
            });

            setCustomerFound(true);

        } catch (error) {

            console.log("Customer search error:", error);

            setCustomerFound(false);

            if (error.response) {
                alert(
                    "Error " +
                    error.response.status +
                    ": " +
                    JSON.stringify(error.response.data)
                );
            } else {
                alert("Request failed: " + error.message);
            }
        }
    };

    // Update customer
    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            const customerData = {
                account_id: Number(formData.account_id),
                name: formData.name,
                age: Number(formData.age),
                account_type: formData.account_type,
                balance: Number(formData.balance)
            };

            console.log(
                "Customer update data:",
                customerData
            );

            const response = await API.put(
                `/customers/update/${formData.account_id}`,
                customerData
            );

            console.log(
                "Update response:",
                response.data
            );

            alert("Customer details updated successfully!");

        } catch (error) {

            console.log("Customer update error:", error);

            if (error.response) {

                alert(
                    "Error " +
                    error.response.status +
                    ": " +
                    JSON.stringify(error.response.data)
                );

            } else {

                alert(
                    "Request failed: " +
                    error.message
                );
            }
        }
    };

    return (
        <div className="collection-page">

            <div className="collection-card">

                

                    <h1>Customer Update</h1>

                    <p>
                        Search and update existing customer details
                    </p>

                

                {/* Account ID Search */}

                <div className="input-group">

                    <label>Account ID</label>

                    <div className="search-row">

                        <input
                            type="number"
                            value={accountId}
                            onChange={handleAccountIdChange}
                            placeholder="Enter Account ID"
                        />

                        <button
                            type="button"
                            className="add-customer-button"
                            onClick={handleSearch}
                        >
                            Search
                        </button>

                    </div>

                </div>


                {/* Customer Form */}

                {customerFound && (

                    <form onSubmit={handleUpdate}>

                        <div className="customer-grid">

                            <div className="input-group">

                                <label>Account ID</label>

                                <input
                                    type="number"
                                    name="account_id"
                                    value={formData.account_id}
                                    readOnly
                                />

                            </div>


                            <div className="input-group">

                                <label>Name</label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="input-group">

                                <label>Age</label>

                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="input-group">

                                <label>Account Type</label>

                                <select
                                    name="account_type"
                                    value={formData.account_type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select Account Type
                                    </option>

                                    <option value="Savings">
                                        Savings
                                    </option>

                                    <option value="Current">
                                        Current
                                    </option>

                                    <option value="Salary">
                                        Salary
                                    </option>

                                </select>

                            </div>


                            <div className="input-group">

                                <label>Balance</label>

                                <input
                                    type="number"
                                    name="balance"
                                    value={formData.balance}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="add-customer-button"
                            >
                                Update Customer
                            </button>

                        </div>

                    </form>

                )}

            </div>

        </div>
    );
}

export default CustomerUpdate;