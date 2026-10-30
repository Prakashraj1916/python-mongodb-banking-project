import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./login/Login";
import Home from "./pages/Home";

import CompleteShow from "./pages/show/CompleteShow";
import CustomerShow from "./pages/show/CustomerShow";
import PersonalDetailsShow from "./pages/show/PersonalDetailsShow";
import Block from "./pages/status/BlockCustomer";
import Unblock from "./pages/status/UnblockCustomer";
import CustomerCollection from "./pages/collection/CustomerCollection";
import PersonalDetailsCollection from "./pages/collection/PersonalDetailsCollection";
import Deactivation from "./pages/status/Deactivation";
import CustomerUpdate from "./pages/updates/CustomerUpdate";
import PersonalDetailsUpdate from "./pages/updates/PersonalDetailsUpdate";
import Combined from "./pages/combined/Combined";

import AccountType from "./pages/combined/AccountType";
import Active from "./pages/combined/Active";
import AverageBalance from "./pages/combined/AverageBalance";
import CompleteDetails from "./pages/combined/CompleteDetails";
import BalanceAbove from "./pages/combined/BalanceAbove";
import HighLow from "./pages/combined/HighLow";
import StatusCount from "./pages/combined/StatusCount";

import TopAccounts from "./pages/combined/TopAccounts";
import TotalBalance from "./pages/combined/TotalBalance";
import BalanceBelow from "./pages/combined/BalanceBelow";
import BalanceChart from "./pages/Charts/BalanceChart";

import Chatbot from "./chatbot/Chatbot";
import HelpSupport from "./pages/HelpSupport";

import "./App.css";

function AppContent() {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    return (
        <>
            {!isLoginPage && <Navbar />}

            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />

                <Route
                    path="/customer/collection"
                    element={<CustomerCollection />}
                />

                <Route
                    path="/collection/personal"
                    element={<PersonalDetailsCollection />}
                />

                <Route
                    path="/collection/personal/:accountId"
                    element={<PersonalDetailsCollection />}
                />

                <Route
                    path="/show/customer"
                    element={<CustomerShow />}
                />

                <Route
                    path="/show/personal"
                    element={<PersonalDetailsShow />}
                />

                {/* STATUS */}
                <Route
                    path="/status/block"
                    element={<Block />}
                />

                <Route
                    path="/status/unblock"
                    element={<Unblock />}
                />

                <Route
                    path="/status/deactivate"
                    element={<Deactivation />}
                />

                {/* Update */}
                <Route 
                    path="/update/customerupdate"
                    element={<CustomerUpdate />}
                />

                <Route
                    path="/update/personaldetailsupdate"
                    element={<PersonalDetailsUpdate />}
                />

                {/* Combined */}
                <Route
                    path="/combined"
                    element={<Combined />}
                />

                <Route
                    path="/combined/account-type"
                    element={<AccountType />}
                />

                <Route
                    path="/combined/active"
                    element={<Active />}
                />

                <Route
                    path="/combined/average-balance"
                    element={<AverageBalance />}
                />

                <Route
                    path="/combined/complete-details"
                    element={<CompleteDetails />}
                />

                <Route
                    path="/combined/balance-above"
                    element={<BalanceAbove />}
                />

                <Route
                    path="/combined/balance-below"
                    element={<BalanceBelow />}
                />

                <Route
                    path="/combined/high-low"
                    element={<HighLow />}
                />

                <Route
                    path="/combined/status-count"
                    element={<StatusCount />}
                />

                <Route
                    path="/combined/top-accounts"
                    element={<TopAccounts />}
                />

                <Route
                    path="/combined/total-balance"
                    element={<TotalBalance />}
                />

                <Route 
                    path="/combined/complete-data"
                    element={<CompleteShow />}
                />

                <Route 
                    path="/chart"
                    element={<BalanceChart />}
                />

                <Route 
                    path="/chatbot"
                    element={<HelpSupport />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />
            </Routes>

            {/* Global floating Banking Assistant available on every page to clear doubts */}
            <Chatbot />
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;