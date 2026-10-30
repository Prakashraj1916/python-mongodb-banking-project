import { useEffect, useState } from "react";
import API from "../../service/api";

function AccountType() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAccountType();
    }, []);

    const getAccountType = async () => {

        try {

            setLoading(true);

            const response = await API.get(
                "/customer/personal_details/type_count"
            );

            console.log("ACCOUNT TYPE API RESPONSE:", response.data);

            let result = response.data;

            // If backend sends an object containing an array
            if (!Array.isArray(result)) {

                if (Array.isArray(result["The account types"])) {
                    result = result["The account types"];
                }
                else if (Array.isArray(result.data)) {
                    result = result.data;
                }
                else if (Array.isArray(result.result)) {
                    result = result.result;
                }
                else {
                    result = [result];
                }
            }

            setData(result);

        } catch (error) {

            console.log("ACCOUNT TYPE ERROR:", error);

            alert(
                error.response?.data?.detail ||
                "Failed to fetch account type data"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="collection-page">

            <div className="collection-card">

                <div className="analysis-header">

                    <h2>Account Type Analysis</h2>

                    <p>
                        Number of customers under each account type
                    </p>

                </div>


                {loading ? (

                    <div className="analysis-message">
                        Loading account type data...
                    </div>

                ) : data.length === 0 ? (

                    <div className="analysis-message">
                        No account type data found.
                    </div>

                ) : (

                    <div className="account-type-grid">

                        {data.map((item, index) => (

                            <div
                                className="account-type-card"
                                key={index}
                            >

                                <h3>
                                    {item._id ||
                                     item.account_type ||
                                     item.type ||
                                     "Unknown"}
                                </h3>

                                <div className="account-type-count">

                                    {item.total_accounts ??
                                     item.count ??
                                     item.total ??
                                     item.customer_count ??
                                     0}

                                </div>

                                <div className="account-type-label">
                                    Customers
                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default AccountType;