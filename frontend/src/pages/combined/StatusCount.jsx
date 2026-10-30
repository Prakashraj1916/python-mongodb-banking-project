import { useEffect, useState } from "react";
import API from "../../service/api";

function StatusCount() {

    const [data, setData] = useState([]);

    useEffect(() => {
        getStatusCount();
    }, []);

    const getStatusCount = async () => {

        try {

            const response = await API.get(
                "/customer/personal_details/status_count"
            );

            let result = response.data;
            if (!Array.isArray(result)) {
                if (Array.isArray(result["The status count"])) {
                    result = result["The status count"];
                } else if (Array.isArray(result.data)) {
                    result = result.data;
                } else {
                    result = [];
                }
            }
            setData(result);

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.detail ||
                "Failed to fetch status count"
            );
        }
    };

    return (
        <div className="collection-page">

            <div className="collection-card">

                <div className="collection-header">

                    <h2>Customer Status</h2>

                    <p>
                        Customer count based on account status
                    </p>

                </div>


                <div className="analysis-grid">

                    {data.map((item, index) => (

                        <div
                            className="analysis-box"
                            key={index}
                        >

                            <h3>{item.status || item._id}</h3>

                            <div className="analysis-number">
                                {item.Count ?? item.count ?? item.total ?? 0}
                            </div>

                            <p>Accounts</p>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}

export default StatusCount;