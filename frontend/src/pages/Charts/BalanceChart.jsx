import { useEffect, useState } from "react";
import API from "../../service/api";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

import "../../App.css";

const balanceRangeLabels = {
    0: "₹0 - ₹499",
    500: "₹500 - ₹999",
    1000: "₹1,000 - ₹9,999",
    10000: "₹10,000 - ₹99,999",
    100000: "₹100,000+"
};

const accountTypeColors = [
    "#31c48d",
    "#f6ad55",
    "#60a5fa",
    "#f56565",
    "#a78bfa"
];


function BalanceChart() {

    const [summary, setSummary] = useState({
        total_customers: 0,
        total_balance: 0,
        average_balance: 0
    });

    const [balanceRange, setBalanceRange] = useState([]);

    const [accountType, setAccountType] = useState([]);


    useEffect(() => {

        loadDashboard();

    }, []);


    const loadDashboard = async () => {

        try {

            const summaryResponse =
                await API.get("/dashboard/summary");

            const balanceResponse =
                await API.get("/dashboard/balance-range");

            const accountTypeResponse =
                await API.get("/dashboard/account-type");


            console.log(
                "Summary:",
                summaryResponse.data
            );

            console.log(
                "Balance Range:",
                balanceResponse.data
            );

            console.log(
                "Account Type:",
                accountTypeResponse.data
            );


            setSummary(summaryResponse.data);

            const totalCustomers = summaryResponse.data.total_customers || 0;

            setBalanceRange(
                Array.isArray(balanceResponse.data)
                    ? balanceResponse.data.map((item) => ({
                        ...item,
                        range: item.range || balanceRangeLabels[item._id] || "Other",
                        percentage: totalCustomers
                            ? ((item.customer_count / totalCustomers) * 100).toFixed(1)
                            : "0.0"
                    }))
                    : []
            );

            setAccountType(
                Array.isArray(accountTypeResponse.data)
                    ? accountTypeResponse.data
                    : []
            );


        } catch (error) {

            console.log(
                "Dashboard Error:",
                error
            );

        }

    };


    return (

        <div className="dashboard-page">


            {/* ================= HEADER ================= */}

            <div className="dashboard-header">

                <h1>
                    Banking Dashboard
                </h1>

                <p>
                    Customer balance and account overview
                </p>

            </div>



            {/* ================= SUMMARY CARDS ================= */}

            <div className="dashboard-cards">


                {/* TOTAL CUSTOMERS */}

                <div className="dashboard-card">

                    <h3>
                        Total Customers
                    </h3>

                    <h2>
                        {summary.total_customers}
                    </h2>

                </div>



                {/* TOTAL BALANCE */}

                <div className="dashboard-card">

                    <h3>
                        Total Balance
                    </h3>

                    <h2>

                        ₹
                        {Number(
                            summary.total_balance || 0
                        ).toLocaleString("en-IN")}

                    </h2>

                </div>



                {/* AVERAGE BALANCE */}

                <div className="dashboard-card">

                    <h3>
                        Average Balance
                    </h3>

                    <h2>

                        ₹
                        {Number(
                            summary.average_balance || 0
                        ).toLocaleString("en-IN")}

                    </h2>

                </div>


            </div>



            {/* ================= CHART AREA ================= */}

            <div className="dashboard-chart-grid">


                {/* ================= BALANCE RANGE ================= */}

                <div className="dashboard-panel">


                    <div className="panel-header">

                        <h2>
                            Balance Range
                        </h2>

                        <span>
                            Customer distribution
                        </span>

                    </div>


                    <div
                        className="chart-container"
                        style={{
                            width: "100%",
                            height: "350px",
                            color : "AccentColor"
                        }}
                    >

                        {balanceRange.length > 0 ? (

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                                color = "AccentColor"
                            >

                                <BarChart
                                    data={balanceRange}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        left: 8,
                                        bottom: 25
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />


                                    <XAxis
                                        dataKey="range"
                                        angle={-25}
                                        textAnchor="end"
                                        interval={0}
                                    />


                                    <YAxis
                                        allowDecimals={false}
                                    />


                                    <Tooltip />


                                    <Bar
                                        dataKey="customer_count"
                                        name="Customers"
                                        radius={[
                                            6,
                                            6,
                                            0,
                                            0
                                        ]}
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        ) : (

                            <div className="chart-placeholder">

                                No balance range data

                            </div>

                        )}

                    </div>

                </div>



                {/* ================= ACCOUNT TYPE ================= */}

                <div className="dashboard-panel">


                    <div className="panel-header">

                        <h2>
                            Account Type
                        </h2>

                        <span>
                            Account distribution
                        </span>

                    </div>


                    <div
                        className="chart-container"
                        style={{
                            width: "100%",
                            height: "350px"
                        }}
                    >

                        {accountType.length > 0 ? (

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <PieChart>


                                    <Pie
                                        data={accountType}
                                        dataKey="customer_count"
                                        nameKey="account_type"
                                        cx="50%"
                                        cy="45%"
                                        outerRadius={110}
                                        label
                                    >


                                        {accountType.map(
                                            (item, index) => (

                                                <Cell
                                                    key={
                                                        `cell-${index}`
                                                    }
                                                    fill={
                                                        accountTypeColors[index % accountTypeColors.length]
                                                    }
                                                />

                                            )
                                        )}


                                    </Pie>


                                    <Tooltip />


                                    <Legend />


                                </PieChart>

                            </ResponsiveContainer>

                        ) : (

                            <div className="chart-placeholder">

                                No account type data

                            </div>

                        )}

                    </div>

                </div>


            </div>



            {/* ================= BALANCE RANGE TABLE ================= */}

            <div className="dashboard-panel balance-table-panel">


                <div className="panel-header">

                    <h2>
                        Balance Range Details
                    </h2>

                    <span>
                        Active customers
                    </span>

                </div>



                <div className="table-container">


                    <table className="dashboard-table">


                        <thead>

                            <tr>

                                <th>
                                    Balance Range
                                </th>

                                <th>
                                    Customers
                                </th>

                                <th>
                                    Percentage
                                </th>

                            </tr>

                        </thead>



                        <tbody>


                            {balanceRange.length > 0 ? (

                                balanceRange.map(
                                    (item, index) => (

                                        <tr key={index}>

                                            <td>
                                                {item.range}
                                            </td>

                                            <td>
                                                {
                                                    item.customer_count
                                                }
                                            </td>

                                            <td>
                                                {
                                                    item.percentage
                                                }%
                                            </td>

                                        </tr>

                                    )

                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="3"
                                    >
                                        No balance data available
                                    </td>

                                </tr>

                            )}


                        </tbody>


                    </table>


                </div>


            </div>


        </div>

    );

}


export default BalanceChart;