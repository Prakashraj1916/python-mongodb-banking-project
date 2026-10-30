import { useEffect, useState } from "react";
import API from "../../service/api";

function HighLow() {

    const [highBalance, setHighBalance] = useState(null);
    const [highAccountId, setHighAccountId] = useState(null);

    const [lowBalance, setLowBalance] = useState(null);
    const [lowAccountId, setLowAccountId] = useState(null);

    useEffect(() => {
        getHighLow();
    }, []);

    const getHighLow = async () => {

        try {

            const response = await API.get(
                "/customer/personal_details/high_low_balance"
            );

            console.log(
                "HIGH LOW BACKEND RESPONSE:",
                response.data
            );

            const result = response.data;

            // CASE 1: Backend returns an object
            if (
                result &&
                !Array.isArray(result) &&
                typeof result === "object"
            ) {

                const high =
                    result.highest_balance ??
                    result.Highest_balance ??
                    result.max_balance ??
                    result.maximum_balance ??
                    result.high ??
                    result.Highest_Balance;

                const low =
                    result.lowest_balance ??
                    result.Lowest_balance ??
                    result.min_balance ??
                    result.minimum_balance ??
                    result.low ??
                    result.Lowest_Balance;

                const highId =
                    result.highest_account_id ??
                    result.Highest_account_id ??
                    result.high_account_id ??
                    result.highestAccountId;

                const lowId =
                    result.lowest_account_id ??
                    result.Lowest_account_id ??
                    result.low_account_id ??
                    result.lowestAccountId;

                setHighBalance(
                    high !== undefined
                        ? Number(high)
                        : null
                );

                setLowBalance(
                    low !== undefined
                        ? Number(low)
                        : null
                );

                setHighAccountId(
                    highId !== undefined
                        ? highId
                        : null
                );

                setLowAccountId(
                    lowId !== undefined
                        ? lowId
                        : null
                );

                return;
            }

            // CASE 2: Backend returns aggregation array
            if (Array.isArray(result) && result.length > 0) {

                const first = result[0];

                const high =
                    first.highest_balance ??
                    first.max_balance ??
                    first.maximum_balance ??
                    first.high ??
                    first.Highest_Balance;

                const low =
                    first.lowest_balance ??
                    first.min_balance ??
                    first.minimum_balance ??
                    first.low ??
                    first.Lowest_Balance;

                const highId =
                    first.highest_account_id ??
                    first.high_account_id ??
                    first.highestAccountId ??
                    first.Highest_account_id;

                const lowId =
                    first.lowest_account_id ??
                    first.low_account_id ??
                    first.lowestAccountId ??
                    first.Lowest_account_id;

                setHighBalance(
                    high !== undefined
                        ? Number(high)
                        : null
                );

                setLowBalance(
                    low !== undefined
                        ? Number(low)
                        : null
                );

                setHighAccountId(
                    highId !== undefined
                        ? highId
                        : null
                );

                setLowAccountId(
                    lowId !== undefined
                        ? lowId
                        : null
                );

                return;
            }

            // No data
            setHighBalance(null);
            setHighAccountId(null);

            setLowBalance(null);
            setLowAccountId(null);

        } catch (error) {

            console.log("HIGH LOW ERROR:", error);

            alert(
                error.response?.data?.detail ||
                "Failed to fetch high and low balance"
            );
        }
    };

    return (
        <div className="collection-page">

            <div className="collection-card">

                <div className="analysis-header">

                    <h2>High / Low Balance</h2>

                    <p>
                        Highest and lowest balance among active customers
                    </p>

                </div>

                <div className="high-low-grid">

                    {/* HIGH BALANCE */}

                    <div className="balance-card">

                        <span>
                            HIGHEST BALANCE
                        </span>

                        <h2>
                            {highBalance !== null &&
                            !Number.isNaN(highBalance)
                                ? `${highBalance.toLocaleString()}`
                                : "No data"}
                        </h2>

                        {highAccountId !== null && (
                            <p>
                                Account ID: <strong>{highAccountId}</strong>
                            </p>
                        )}

                    </div>


                    {/* LOW BALANCE */}

                    <div className="balance-card">

                        <span>
                            LOWEST BALANCE
                        </span>

                        <h2>
                            {lowBalance !== null &&
                            !Number.isNaN(lowBalance)
                                ? `${lowBalance.toLocaleString()}`
                                : "No data"}
                        </h2>

                        {lowAccountId !== null && (
                            <p>
                                Account ID: <strong>{lowAccountId}</strong>
                            </p>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default HighLow;
