import { useState } from "react";
import API from "../../service/api";

function BlockCustomer() {

    const [accountId, setAccountId] = useState("");

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!accountId) {
            alert("Please enter Account ID");
            return;
        }

        try {
            

            const response = await API.put(
                `/customers/${accountId}/block`
            );

            console.log(response.data);

            alert("Customer blocked successfully!");

            setAccountId("");

        } catch (error) {
            console.error("Block customer error:", error);

            console.log("Status:", error.response?.status);
            console.log("Response:", error.response?.data);

            alert(
                error.response?.data?.detail ||
                "Failed to block customer"
            );
        }
    };

    return (
        <div className="collection-page">

            <div className="collection-card">

            <h1>Block Customer</h1>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                <label>
                    Account ID
                </label>
                <div className="form-buttons">
                <input
                    type="number"
                    value={accountId}
                    onChange={(event) =>
                        setAccountId(event.target.value)
                    }
                    placeholder="Enter Account ID"
                />
                </div>
                </div>

                <button
                            type="submit"
                            className="add-customer-button"
                >
                    Block Customer
                </button>

            </form>

            </div>

        </div>
    );
}

export default BlockCustomer;