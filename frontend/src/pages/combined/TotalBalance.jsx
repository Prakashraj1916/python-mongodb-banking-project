import { useEffect, useState } from "react";
import API from "../../service/api";

function TotalBalance() {

    const [totalBalance, setTotalBalance] = useState(null);

    useEffect(() => {
        getTotalBalance();
    }, []);

    const getTotalBalance = async () => {

        try {

            const response = await API.get(
                "/customer/personal_details/bank_balance"
            );

            console.log("Total Balance:", response.data);

            const value =
                response.data.total_balance ??
                response.data.total_bank_balance ??
                response.data.Total_Balance ??
                response.data.bank_balance;

            setTotalBalance(value);

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.detail ||
                "Failed to fetch total bank balance"
            );
        }
    };

    return (
        <div className="collection-page">

            <div className="collection-card">

                <div className="collection-header">

                    <h2>Total Bank Balance</h2>

                    <p>
                        Combined balance of active customer accounts
                    </p>

                </div>


                <div className="total-balance-card">

                    <span>TOTAL BANK BALANCE</span>

                    <h1>

                        {totalBalance !== null
                            ? `₹ ${Number(totalBalance).toLocaleString()}`
                            : "Loading..."}

                    </h1>

                    <p>
                        Calculated using MongoDB aggregation
                    </p>

                </div>

            </div>

        </div>
    );
}

export default TotalBalance;