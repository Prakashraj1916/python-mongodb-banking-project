import { useEffect, useState } from "react";
import API from "../../service/api";

function AverageBalance() {

    const [average, setAverage] = useState(null);

    useEffect(() => {
        getAverageBalance();
    }, []);

    const getAverageBalance = async () => {

        try {

            const response = await API.get(
                "/customer/personal_details/avg"
            );

            console.log("AVERAGE BACKEND RESPONSE:", response.data);

            // Handle different possible backend response formats
            let value = null;

            if (typeof response.data === "number") {

                value = response.data;

            } else if (typeof response.data === "object") {

                value =
                    response.data["Average_Amount : "] ??
                    response.data.average_balance ??
                    response.data.Average_Amount ??
                    response.data.average ??
                    response.data.avg ??
                    response.data.average_amount;
            }

            if (value !== null && value !== undefined) {

                setAverage(Number(value));

            } else {

                console.log(
                    "Average value not found in:",
                    response.data
                );

                setAverage(null);
            }

        } catch (error) {

            console.log("AVERAGE ERROR:", error);

            alert(
                error.response?.data?.detail ||
                "Failed to fetch average balance"
            );
        }
    };

    return (
        <div className="collection-page">

            <div className="collection-card">

                <div className="analysis-header">

                    <h2>Average Balance</h2>

                    <p>
                        Average balance maintained by active customers
                    </p>

                </div>

                <div className="average-balance-container">

                    <div className="average-balance-card">

                        <span className="average-balance-label">
                            AVERAGE ACCOUNT BALANCE
                        </span>

                        <div className="average-balance-value">

                            {average !== null &&
                            !Number.isNaN(average)
                                ? `${average.toLocaleString()}`
                                : "No data"}

                        </div>

                        <p className="average-balance-description">
                            Calculated using MongoDB aggregation
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AverageBalance;