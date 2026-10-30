import { useEffect, useState } from "react";
import API from "../../service/api";

function TopAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getTopAccounts = async () => {
        try {
            setLoading(true);
            const response = await API.get("/customer/personal_details/top_5");
            console.log("Top Accounts response:", response.data);

            const result = response.data;
            if (result && Array.isArray(result.Customers)) {
                setAccounts(result.Customers);
            } else if (Array.isArray(result)) {
                setAccounts(result);
            } else {
                setAccounts([]);
            }
        } catch (error) {
            console.log("Top accounts error:", error);
            alert(
                error.response?.data?.detail ||
                "Failed to fetch top accounts"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTopAccounts();
    }, []);

    return (
        <div className="collection-page">
            <div className="collection-card">
                <div className="collection-header">
                    <h2>Top Accounts</h2>
                    <p>View top 5 account balances</p>
                </div>

                {loading ? (
                    <div className="analysis-message">
                        Loading top accounts...
                    </div>
                ) : accounts.length === 0 ? (
                    <div className="analysis-message">
                        No top accounts found.
                    </div>
                ) : (
                    <div className="top-accounts-list">
                        {accounts.map((account, index) => (
                            <div className="top-account-card" key={account.account_id || index}>
                                <div className="top-account-rank">
                                    #{index + 1}
                                </div>
                                <div className="top-account-details">
                                    <h4 className="top-account-name">
                                        {account.name || account["name"]}
                                    </h4>
                                    <p className="top-account-id">
                                        Account ID: {account.account_id} | {account.account_type}
                                    </p>
                                </div>
                                <div className="top-account-balance">
                                    ₹ {Number(account.balance).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TopAccounts;
