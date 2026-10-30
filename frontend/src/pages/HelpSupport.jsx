import React, { useEffect } from "react";

function HelpSupport() {
    useEffect(() => {
        // Automatically open the chatbot when landing on the Help & Support page
        const timer = setTimeout(() => {
            window.dispatchEvent(new CustomEvent("openChatbot"));
        }, 150);
        return () => clearTimeout(timer);
    }, []);

    const handleOpenChat = (queryTopic) => {
        window.dispatchEvent(new CustomEvent("openChatbot", { detail: { query: queryTopic } }));
    };

    return (
        <div className="home">
            <div className="hero" style={{ textAlign: "center", marginBottom: "30px" }}>
                <h1 style={{ color: "#fff", fontSize: "32px", marginBottom: "10px" }}>
                    Banking Customer Support & Doubt Clearing Center
                </h1>
                <p style={{ color: "#e4edff", fontSize: "18px", maxWidth: "800px", margin: "0 auto" }}>
                    Have questions about banking services, accounts, cards, or security? 
                    Our Banking Assistant is available on every page at the bottom-right corner to help clear your doubts.
                </p>
                <div style={{ marginTop: "20px" }}>
                    <button
                        type="button"
                        onClick={() => handleOpenChat()}
                        style={{
                            background: "#1456a0",
                            color: "#fff",
                            border: "none",
                            padding: "12px 28px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            borderRadius: "30px",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)"
                        }}
                    >
                        💬 Open Banking Chatbot
                    </button>
                </div>
            </div>

            <div className="cards">
                <div className="card">
                    <h2>Account Types & Opening</h2>
                    <p>
                        Learn about savings accounts, current accounts, eligibility, and the step-by-step account opening process.
                    </p>
                    <button
                        type="button"
                        className="quick-ask-btn"
                        style={cardBtnStyle}
                        onClick={() => handleOpenChat("account type")}
                    >
                        Ask About Account Types →
                    </button>
                </div>

                <div className="card">
                    <h2>Card Safety & Emergency Block</h2>
                    <p>
                        Lost or stolen debit/credit card? Learn how to block your card immediately and keep your account safe.
                    </p>
                    <button
                        type="button"
                        className="quick-ask-btn"
                        style={cardBtnStyle}
                        onClick={() => handleOpenChat("block card")}
                    >
                        Ask How To Block Card →
                    </button>
                </div>

                <div className="card">
                    <h2>Balance & Transactions</h2>
                    <p>
                        Find out how to safely check your account balance and conduct secure money transfers.
                    </p>
                    <button
                        type="button"
                        className="quick-ask-btn"
                        style={cardBtnStyle}
                        onClick={() => handleOpenChat("balance")}
                    >
                        Ask About Balance & Transfers →
                    </button>
                </div>

                <div className="card">
                    <h2>Loans & Interest Rates</h2>
                    <p>
                        Get information on personal loans, home loans, eligibility requirements, and current interest rates.
                    </p>
                    <button
                        type="button"
                        className="quick-ask-btn"
                        style={cardBtnStyle}
                        onClick={() => handleOpenChat("loan")}
                    >
                        Ask About Loans & Rates →
                    </button>
                </div>

                <div className="card">
                    <h2>KYC & Identity Verification</h2>
                    <p>
                        Understand KYC guidelines, accepted identity documents, and how to keep sensitive credentials secure.
                    </p>
                    <button
                        type="button"
                        className="quick-ask-btn"
                        style={cardBtnStyle}
                        onClick={() => handleOpenChat("kyc")}
                    >
                        Ask About KYC Process →
                    </button>
                </div>

                <div className="card">
                    <h2>Fraud Alert & Security</h2>
                    <p>
                        Report suspicious activities, unauthorized transactions, and learn best practices against scams.
                    </p>
                    <button
                        type="button"
                        className="quick-ask-btn"
                        style={cardBtnStyle}
                        onClick={() => handleOpenChat("fraud")}
                    >
                        Ask About Fraud & Security →
                    </button>
                </div>
            </div>
        </div>
    );
}

const cardBtnStyle = {
    marginTop: "16px",
    background: "#1456a0",
    color: "#ffffff",
    border: "none",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: "600",
    borderRadius: "8px",
    cursor: "pointer",
    display: "inline-block",
    transition: "background 0.2s ease"
};

export default HelpSupport;
