import { useState } from "react";
import API from "../../service/api";
import "../../App.css";

function PersonalDetailsUpdate() {

    const [accountId, setAccountId] = useState("");

    const [formData, setFormData] = useState({
        account_id: "",
        aadhaar_no: "",
        address: "",
        pincode: ""
    });

    const [detailsFound, setDetailsFound] = useState(false);

    const handleAccountIdChange = (e) => {
        setAccountId(e.target.value);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Search existing personal details
    const handleSearch = async () => {

        if (!accountId) {
            alert("Please enter Account ID");
            return;
        }

        try {

            const response = await API.get(
                `/personal_details/read/${accountId}`
            );

            console.log(
                "Personal details:",
                response.data
            );

            const details = response.data;

            setFormData({
                account_id: details.account_id,
                aadhaar_no: details.aadhaar_no,
                address: details.address,
                pincode: details.pincode
            });

            setDetailsFound(true);

        } catch (error) {

            console.log(
                "Personal details search error:",
                error
            );

            setDetailsFound(false);

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

    // Update personal details
    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            const personalData = {
                account_id: Number(formData.account_id),
                aadhaar_no: formData.aadhaar_no,
                address: formData.address,
                pincode: Number(formData.pincode)
            };

            console.log(
                "Personal details update data:",
                personalData
            );

            const response = await API.put(
                `/personal_details/update/${formData.account_id}`,
                personalData
            );

            console.log(
                "Update response:",
                response.data
            );

            alert(
                "Personal details updated successfully!"
            );

        } catch (error) {

            console.log(
                "Personal details update error:",
                error
            );

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

                

                    <h1>Personal Details Update</h1>

                    <p>
                        Search and update existing personal details
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


                {/* Personal Details Form */}

                {detailsFound && (

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

                                <label>
                                    Aadhaar Number
                                </label>

                                <input
                                    type="text"
                                    name="aadhaar_no"
                                    value={formData.aadhaar_no}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="input-group full-width">

                                <label>Address</label>

                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                />

                            </div>


                            <div className="input-group">

                                <label>Pincode</label>

                                <input
                                    type="number"
                                    name="pincode"
                                    value={formData.pincode}
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
                                Update Personal Details
                            </button>

                        </div>

                    </form>

                )}

            </div>

        </div>
    );
}

export default PersonalDetailsUpdate;