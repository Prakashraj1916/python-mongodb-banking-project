import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../service/api";

function PersonalDetailsCollection() {

    const { accountId } = useParams();

    console.log("Account ID from URL:", accountId);

    const [formData, setFormData] = useState({
        account_id: accountId || "",
        aadhaar_no: "",
        address: "",
        pincode: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        // Check account ID before sending
        if (!accountId) {
            alert("Account ID is missing.");
            return;
        }

        const personalData = {
            account_id: Number(accountId),
            aadhaar_no: formData.aadhaar_no,
            address: formData.address,
            pincode: Number(formData.pincode)
        };

        console.log(
            "Personal details being sent:",
            personalData
        );

        try {

            const response = await API.post(
                "/personal_details/post",
                personalData
            );

            console.log(
                "Personal details response:",
                response.data
            );

            alert(
                "Personal details added successfully!"
            );

        } catch (error) {

            console.log(
                "Personal details error:",
                error
            );

            if (error.response) {

                console.log(
                    "Status:",
                    error.response.status
                );

                console.log(
                    "Backend error:",
                    error.response.data
                );

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

                <div className="collection-header">

                    <h2>
                        Personal Details Collection
                    </h2>

                    <p>
                        Enter the personal details of the customer
                    </p>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="customer-grid">

                        <div className="input-group">

                            <label>
                                Account ID
                            </label>

                            <input
                                type="number"
                                name="account_id"
                                value={formData.account_id}
                                onChange={handleChange}
                                readOnly={Boolean(accountId)}
                                placeholder="Enter Account ID"
                                required
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
                                maxLength={12}
                                pattern="[0-9]{12}"
                                inputMode="numeric"
                                placeholder="Enter Aadhaar Number"
                                required
                            />

                        </div>
                        </div>

                        <div className="input-group full-width">

                            <label>
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter Address"
                                rows="4"
                                required
                            />

                        </div>


                        <div className="input-group">

                            <label>
                                Pincode
                            </label>

                            <input
                                type="number"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                min="100000"
                                max="999999"
                                placeholder="Enter Pincode"
                                required
                            />

                        </div>

                    


                    <div className="form-buttons">

                        <button
                            type="submit"
                            className="add-customer-button"
                        >
                            Add Personal Details
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default PersonalDetailsCollection;