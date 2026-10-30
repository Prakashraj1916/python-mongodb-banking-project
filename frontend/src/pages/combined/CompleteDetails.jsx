import { useState } from "react";
import API from "../../service/api";

function CompleteDetails() {

    const [accountId, setAccountId] = useState("");
    const [data, setData] = useState(null);

    const handleSearch = async (event) => {

        event.preventDefault();

        if (!accountId) {
            alert("Please enter Account ID");
            return;
        }

        try {

            const response = await API.get(
                `/customer/personal_details/read/${accountId}`
            );

            console.log("Projected Data:", response.data);

            setData(response.data);

        } catch (error) {

            console.log(error);

            setData(null);

            alert(
                error.response?.data?.detail ||
                "Customer details not found"
            );
        }
    };

    return (
        <div className="collection-page">

            <div className="collection-card">

                <div className="collection-header">

                    <h2>Customer Data Projection</h2>

                    <p>
                        Display selected customer and personal information
                    </p>

                </div>


                <form onSubmit={handleSearch}>

                    <div className="input-group">

                        <label>Account ID</label>

                        <input
                            type="number"
                            value={accountId}
                            onChange={(e) =>
                                setAccountId(e.target.value)
                            }
                            placeholder="Enter Account ID"
                        />

                    </div>

                    <button type="submit" className="add-customer-button">
                        View Details
                    </button>

                </form>


                {data && (

                    <div className="projection-container">

                        <div className="projection-title">

                            <span>ACCOUNT</span>

                            <h3>
                                #{data.account_id}
                            </h3>

                        </div>


                        <div className="projection-section">

                            <h3>Customer Information</h3>

                            <div className="projection-grid">

                                <div>
                                    <span>Name</span>
                                    <strong>{data.name}</strong>
                                </div>

                                <div>
                                    <span>Age</span>
                                    <strong>{data.age}</strong>
                                </div>

                                <div>
                                    <span>Account Type</span>
                                    <strong>{data.account_type}</strong>
                                </div>

                                <div>
                                    <span>Balance</span>
                                    <strong>
                                        ₹ {Number(data.balance).toLocaleString()}
                                    </strong>
                                </div>

                            </div>

                        </div>



                        <div className="projection-status">

                            <span>ACCOUNT STATUS</span>

                            <strong>
                                {data.status}
                            </strong>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default CompleteDetails;