import React, {
    useState,
    useEffect,
    useRef,
    useCallback
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../service/api";
import "./Chatbot.css";

const INITIAL_MESSAGE = {
    sender: "bot",
    text: "Hello! Welcome to Banking Customer Support. How can I help you today?",
    timestamp: "Just now"
};

const DOUBT_SUGGESTIONS = [
    {
        label: "Open Bank Account",
        query: "Open a new bank account"
    },
    {
        label: "Add Personal Details",
        query: "Add personal details to account"
    },
    {
        label: "Account Types",
        query: "What are the account types available?"
    },
    {
        label: "Check Balance",
        query: "How to check my account balance?"
    },
    {
        label: "Block Card",
        query: "How to block card or stolen card?"
    },
    {
        label: "KYC Documents",
        query: "What documents are required for KYC?"
    }
];

const ACCOUNT_TYPES = ["Savings", "Current", "Salary"];

const DEFAULT_SUGGESTIONS = [
    "Open a new bank account",
    "What are the account types available?",
    "How to check my account balance?",
    "Add personal details to account",
    "How to block a lost or stolen card?"
];

const getContextualSuggestions = (queryText) => {
    const q = (queryText || "").toLowerCase();

    if (
        q.includes("card") ||
        q.includes("block") ||
        q.includes("lost") ||
        q.includes("stolen") ||
        q.includes("atm")
    ) {
        return [
            "How can I request a replacement card?",
            "How can I unblock my card if found?",
            "How to report an unauthorized transaction?",
            "What is the emergency helpline number?"
        ];
    }

    if (
        q.includes("balance") ||
        q.includes("statement") ||
        q.includes("money") ||
        q.includes("transfer") ||
        q.includes("neft") ||
        q.includes("upi")
    ) {
        return [
            "How can I download my account statement?",
            "What is the minimum balance requirement?",
            "How to report an incorrect balance?",
            "What are the transaction charges?"
        ];
    }

    if (
        q.includes("account") ||
        q.includes("open") ||
        q.includes("saving") ||
        q.includes("current") ||
        q.includes("salary")
    ) {
        return [
            "Open a new bank account",
            "What are the account types available?",
            "What documents are required for KYC?",
            "What are current interest rates on savings?"
        ];
    }

    if (
        q.includes("loan") ||
        q.includes("interest") ||
        q.includes("rate") ||
        q.includes("emi") ||
        q.includes("fd")
    ) {
        return [
            "What documents are required for a loan?",
            "What are current home loan interest rates?",
            "How to calculate loan EMI?",
            "What is the minimum CIBIL score required?"
        ];
    }

    if (
        q.includes("kyc") ||
        q.includes("aadhaar") ||
        q.includes("pan") ||
        q.includes("document") ||
        q.includes("verify") ||
        q.includes("personal")
    ) {
        return [
            "Add personal details to account",
            "What documents qualify as address proof?",
            "Why is KYC renewal mandatory?",
            "Open a new bank account"
        ];
    }

    if (
        q.includes("password") ||
        q.includes("pin") ||
        q.includes("login") ||
        q.includes("otp") ||
        q.includes("fraud") ||
        q.includes("security")
    ) {
        return [
            "How to keep my account secure?",
            "What is two-factor authentication (OTP)?",
            "What should I do if my account is locked?",
            "How to reset ATM PIN?"
        ];
    }

    return DEFAULT_SUGGESTIONS;
};

const getTime = () =>
    new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

const INITIAL_FLOW_STATE = {
    active: false,
    mode: "create", // "create" = full account + personal details, "personal_only" = personal details for existing account
    step: 0,
    data: {
        name: "",
        age: "",
        account_type: "",
        balance: "",
        account_id: "",
        aadhaar_no: "",
        address: "",
        pincode: ""
    }
};

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [suggestions, setSuggestions] = useState([]);
    const [accountFlow, setAccountFlow] = useState(INITIAL_FLOW_STATE);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const addBotMessage = (text) => {
        setMessages((previous) => [
            ...previous,
            {
                sender: "bot",
                text,
                timestamp: getTime()
            }
        ]);
    };

    const addUserMessage = (text) => {
        setMessages((previous) => [
            ...previous,
            {
                sender: "user",
                text,
                timestamp: getTime()
            }
        ]);
    };

    // Automatically scroll to the latest message.
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth"
            });
            inputRef.current?.focus();
        }
    }, [messages, loading, isOpen, suggestions]);

    // Open the chatbot on the support page.
    useEffect(() => {
        if (location.pathname === "/chatbot") {
            setIsOpen(true);
        }
    }, [location.pathname]);

    // Start full account opening + personal details collection flow
    const startAccountFlow = () => {
        setAccountFlow({
            active: true,
            mode: "create",
            step: 0,
            data: {
                name: "",
                age: "",
                account_type: "",
                balance: "",
                account_id: "",
                aadhaar_no: "",
                address: "",
                pincode: ""
            }
        });

        setSuggestions([]);
        setMessage("");

        addBotMessage(
            "Let's open your new bank account! \n\nI will guide you step-by-step to collect both your Account Details and Personal KYC Details, and immediately provide your generated Account Number upon submission.\n\nFirst, what is your full name?"
        );
    };

    // Start standalone personal details collection flow for existing account
    const startPersonalDetailsFlow = () => {
        setAccountFlow({
            active: true,
            mode: "personal_only",
            step: 0,
            data: {
                name: "",
                age: "",
                account_type: "",
                balance: "",
                account_id: "",
                aadhaar_no: "",
                address: "",
                pincode: ""
            }
        });

        setSuggestions([]);
        setMessage("");

        addBotMessage(
            "Let's add your Personal Details for KYC verification! \n\nPlease enter your Account Number (Account ID):"
        );
    };

    // Submit full account application (Account Collection + Personal Details Collection)
    const submitFullAccount = async (dataToSubmit) => {
        setLoading(true);
        setSuggestions([]);

        addBotMessage("⏳ Submitting your account and personal details to create your account...");

        try {
            // 1. Submit Account Collection
            const customerPayload = {
                name: dataToSubmit.name,
                age: Number(dataToSubmit.age),
                account_type: dataToSubmit.account_type,
                balance: Number(dataToSubmit.balance)
            };

            const customerResponse = await API.post("/customers/posting", customerPayload);
            const generatedAccountId = customerResponse.data?.account_id;

            if (!generatedAccountId) {
                throw new Error("Account ID was not returned by the server.");
            }

            // 2. Submit Personal Details Collection connected to generated Account ID
            const personalPayload = {
                account_id: Number(generatedAccountId),
                aadhaar_no: String(dataToSubmit.aadhaar_no),
                address: String(dataToSubmit.address),
                pincode: Number(dataToSubmit.pincode)
            };

            await API.post("/personal_details/post", personalPayload);

            // 3. Provide the generated Account Number and confirmation to the user
            const formattedBalance = Number(dataToSubmit.balance).toLocaleString("en-IN");
            addBotMessage(
                `• Congratulations, ${dataToSubmit.name}! Your bank account has been created successfully!\n\n` +
                `• Account Information:\n` +
                `• Account Number: #${generatedAccountId}\n` +
                `• Account Holder: ${dataToSubmit.name}\n` +
                `• Account Type: ${dataToSubmit.account_type}\n` +
                `• Initial Balance: ₹${formattedBalance}\n` +
                `• Account Status: ACTIVE\n\n` +
                `• Linked Personal Details:\n` +
                `• Aadhaar Number: ${dataToSubmit.aadhaar_no}\n` +
                `• Address: ${dataToSubmit.address}\n` +
                `• Pincode: ${dataToSubmit.pincode}\n\n` +
                `IMPORTANT: Your Account Number is #${generatedAccountId}. Please keep this number safe for logging in, deposits, and transfers.\n\n` +
                `How else can I assist you today?`
            );

            setAccountFlow(INITIAL_FLOW_STATE);
            setSuggestions([
                "How to check my account balance?",
                "What are current interest rates on savings?",
                "How to transfer money?",
                "What documents are required for KYC?"
            ]);
        } catch (error) {
            console.error("Account creation submission error:", error);
            const errorDetail =
                error.response?.data?.detail ||
                error.message ||
                "Failed to complete account registration.";

            addBotMessage(
                `Submission Error: ${typeof errorDetail === "object" ? JSON.stringify(errorDetail) : errorDetail}\n\n` +
                `Would you like to try submitting again, or Cancel?`
            );
            setSuggestions(["Submit", "Cancel"]);
        } finally {
            setLoading(false);
        }
    };

    // Submit standalone personal details linked to existing account ID
    const submitPersonalOnly = async (dataToSubmit) => {
        setLoading(true);
        setSuggestions([]);

        addBotMessage("Submitting your personal details...");

        try {
            const personalPayload = {
                account_id: Number(dataToSubmit.account_id),
                aadhaar_no: String(dataToSubmit.aadhaar_no),
                address: String(dataToSubmit.address),
                pincode: Number(dataToSubmit.pincode)
            };

            await API.post("/personal_details/post", personalPayload);

            addBotMessage(
                `• Personal Details added successfully for Account Number #${dataToSubmit.account_id}!\n\n` +
                `• Aadhaar Number: ${dataToSubmit.aadhaar_no}\n` +
                `• Address: ${dataToSubmit.address}\n` +
                `• Pincode: ${dataToSubmit.pincode}\n\n` +
                `Your account KYC details have been updated. Is there anything else I can help you with?`
            );

            setAccountFlow(INITIAL_FLOW_STATE);
            setSuggestions(DEFAULT_SUGGESTIONS);
        } catch (error) {
            console.error("Personal details submission error:", error);
            const errorDetail =
                error.response?.data?.detail ||
                error.message ||
                "Failed to save personal details.";

            addBotMessage(
                `Error adding personal details: ${typeof errorDetail === "object" ? JSON.stringify(errorDetail) : errorDetail}\n\n` +
                `Would you like to try submitting again, or Cancel?`
            );
            setSuggestions(["Submit", "Cancel"]);
        } finally {
            setLoading(false);
        }
    };

    // Process conversational answers during form flows
    const handleAccountAnswer = async (answer) => {
        const value = (answer || "").trim();

        if (!value) return;

        addUserMessage(value);
        setMessage("");

        const lower = value.toLowerCase();

        // Allow cancellation at any step
        if (["cancel", "stop", "exit", "quit", "abort"].includes(lower)) {
            setAccountFlow(INITIAL_FLOW_STATE);
            setSuggestions(DEFAULT_SUGGESTIONS);
            addBotMessage("Operation cancelled. You can ask me another banking question.");
            return;
        }

        // ==========================================
        // FLOW 1: CREATE FULL ACCOUNT + PERSONAL DETAILS
        // ==========================================
        if (accountFlow.mode === "create") {
            // STEP 0: FULL NAME
            if (accountFlow.step === 0) {
                const name = value.replace(/\s+/g, " ");

                if (name.length < 2 || !/[a-zA-Z]/.test(name) || /^\d+$/.test(name)) {
                    addBotMessage("Please enter a valid full name (letters only, minimum 2 characters).");
                    return;
                }

                setAccountFlow((previous) => ({
                    ...previous,
                    step: 1,
                    data: {
                        ...previous.data,
                        name
                    }
                }));

                addBotMessage(`Thank you, ${name}! What is your age?`);
                return;
            }

            // STEP 1: AGE
            if (accountFlow.step === 1) {
                const age = Number(value);

                if (!Number.isInteger(age) || age < 1 || age > 99) {
                    addBotMessage("Please enter a valid age between 1 and 99.");
                    return;
                }

                setAccountFlow((previous) => ({
                    ...previous,
                    step: 2,
                    data: {
                        ...previous.data,
                        age
                    }
                }));

                setSuggestions(ACCOUNT_TYPES);
                addBotMessage("Which account type would you like? Choose Savings, Current, or Salary.");
                return;
            }

            // STEP 2: ACCOUNT TYPE
            if (accountFlow.step === 2) {
                const matchedType = ACCOUNT_TYPES.find(
                    (type) => type.toLowerCase() === value.toLowerCase()
                );

                if (!matchedType) {
                    setSuggestions(ACCOUNT_TYPES);
                    addBotMessage("Please select a valid account type: Savings, Current, or Salary.");
                    return;
                }

                setAccountFlow((previous) => ({
                    ...previous,
                    step: 3,
                    data: {
                        ...previous.data,
                        account_type: matchedType
                    }
                }));

                setSuggestions(["0", "500", "1000", "5000", "10000"]);
                addBotMessage("Great! What will be your initial deposit / opening balance? (Minimum ₹0)");
                return;
            }

            // STEP 3: BALANCE
            if (accountFlow.step === 3) {
                const balance = Number(value);

                if (value === "" || !Number.isFinite(balance) || balance < 0) {
                    setSuggestions(["0", "500", "1000", "5000", "10000"]);
                    addBotMessage("Please enter a valid initial balance of 0 or more (e.g. 0, 500, 1000).");
                    return;
                }

                setAccountFlow((previous) => ({
                    ...previous,
                    step: 4,
                    data: {
                        ...previous.data,
                        balance: String(balance)
                    }
                }));

                setSuggestions([]);
                addBotMessage(
                    "Account details recorded! Now let's connect your Personal Details for KYC verification.\n\nPlease enter your 12-digit Aadhaar Number:"
                );
                return;
            }

            // STEP 4: AADHAAR NUMBER
            if (accountFlow.step === 4) {
                const cleanedAadhaar = value.replace(/\s+/g, "");

                if (!/^\d{12}$/.test(cleanedAadhaar)) {
                    addBotMessage("Please enter a valid 12-digit Aadhaar number (digits only, e.g. 123456789012).");
                    return;
                }

                setAccountFlow((previous) => ({
                    ...previous,
                    step: 5,
                    data: {
                        ...previous.data,
                        aadhaar_no: cleanedAadhaar
                    }
                }));

                setSuggestions([]);
                addBotMessage("Aadhaar Number verified! Now, please enter your residential Address:");
                return;
            }

            // STEP 5: ADDRESS
            if (accountFlow.step === 5) {
                const address = value.replace(/\s+/g, " ");

                if (address.length < 3) {
                    addBotMessage("Please enter a valid residential address.");
                    return;
                }

                setAccountFlow((previous) => ({
                    ...previous,
                    step: 6,
                    data: {
                        ...previous.data,
                        address
                    }
                }));

                setSuggestions([]);
                addBotMessage("Thank you! Please enter your 6-digit postal Pincode:");
                return;
            }

            // STEP 6: PINCODE
            if (accountFlow.step === 6) {
                const pincode = Number(value);

                if (!/^\d{6}$/.test(value.trim()) || !Number.isInteger(pincode) || pincode < 100000 || pincode > 999999) {
                    addBotMessage("Please enter a valid 6-digit postal pincode between 100000 and 999999.");
                    return;
                }

                const completedData = {
                    ...accountFlow.data,
                    pincode: String(pincode)
                };

                setAccountFlow((previous) => ({
                    ...previous,
                    step: 7,
                    data: completedData
                }));

                setSuggestions(["Submit", "Cancel"]);

                const formattedBalance = Number(completedData.balance).toLocaleString("en-IN");
                addBotMessage(
                    `Please review your complete application details:\n\n` +
                    `Account Details:\n` +
                    `• Name: ${completedData.name}\n` +
                    `• Age: ${completedData.age}\n` +
                    `• Account Type: ${completedData.account_type}\n` +
                    `• Opening Balance: ₹${formattedBalance}\n\n` +
                    `Personal Details:\n` +
                    `• Aadhaar Number: ${completedData.aadhaar_no}\n` +
                    `• Address: ${completedData.address}\n` +
                    `• Pincode: ${completedData.pincode}\n\n` +
                    `Type Submit to create your account and receive your Account Number, or Cancel to stop.`
                );
                return;
            }

            // STEP 7: CONFIRMATION & SUBMIT
            if (accountFlow.step === 7) {
                if (["submit", "confirm", "yes", "continue", "proceed"].includes(lower)) {
                    await submitFullAccount(accountFlow.data);
                    return;
                }

                setSuggestions(["Submit", "Cancel"]);
                addBotMessage("Please choose Submit to create your account or Cancel to stop.");
                return;
            }
        }

        // ==========================================
        // FLOW 2: PERSONAL DETAILS ONLY (EXISTING ACCOUNT)
        // ==========================================
        if (accountFlow.mode === "personal_only") {
            // STEP 0: ACCOUNT ID
            if (accountFlow.step === 0) {
                const accountId = Number(value);

                if (!Number.isInteger(accountId) || accountId <= 0) {
                    addBotMessage("Please enter a valid positive numeric Account ID.");
                    return;
                }

                // Verify the account ID exists
                try {
                    const res = await API.get(`/customers/read/${accountId}`);
                    const customerName = res.data?.name || "Customer";

                    setAccountFlow((previous) => ({
                        ...previous,
                        step: 1,
                        data: {
                            ...previous.data,
                            account_id: String(accountId),
                            name: customerName
                        }
                    }));

                    addBotMessage(`Found active account #${accountId} for ${customerName}! Now, please enter your 12-digit Aadhaar Number:`);
                } catch (err) {
                    console.error("Account verification error:", err);
                    addBotMessage(`Account #${accountId} was not found in active customer records. Please re-enter your Account ID, or type Cancel.`);
                }
                return;
            }

            // STEP 1: AADHAAR
            if (accountFlow.step === 1) {
                const cleanedAadhaar = value.replace(/\s+/g, "");

                if (!/^\d{12}$/.test(cleanedAadhaar)) {
                    addBotMessage("Please enter a valid 12-digit Aadhaar number (digits only, e.g. 123456789012).");
                    return;
                }

                setAccountFlow((previous) => ({
                    ...previous,
                    step: 2,
                    data: {
                        ...previous.data,
                        aadhaar_no: cleanedAadhaar
                    }
                }));

                addBotMessage("Aadhaar noted! Please enter your residential Address:");
                return;
            }

            // STEP 2: ADDRESS
            if (accountFlow.step === 2) {
                const address = value.replace(/\s+/g, " ");

                if (address.length < 3) {
                    addBotMessage("Please enter a valid residential address.");
                    return;
                }

                setAccountFlow((previous) => ({
                    ...previous,
                    step: 3,
                    data: {
                        ...previous.data,
                        address
                    }
                }));

                addBotMessage("Please enter your 6-digit postal Pincode:");
                return;
            }

            // STEP 3: PINCODE
            if (accountFlow.step === 3) {
                const pincode = Number(value);

                if (!/^\d{6}$/.test(value.trim()) || !Number.isInteger(pincode) || pincode < 100000 || pincode > 999999) {
                    addBotMessage("Please enter a valid 6-digit postal pincode between 100000 and 999999.");
                    return;
                }

                const completedData = {
                    ...accountFlow.data,
                    pincode: String(pincode)
                };

                setAccountFlow((previous) => ({
                    ...previous,
                    step: 4,
                    data: completedData
                }));

                setSuggestions(["Submit", "Cancel"]);

                addBotMessage(
                    `• Please review your Personal Details for Account #${completedData.account_id}:\n\n` +
                    `• Aadhaar Number: ${completedData.aadhaar_no}\n` +
                    `• Address: ${completedData.address}\n` +
                    `• Pincode: ${completedData.pincode}\n\n` +
                    `Type Submit to save or Cancel to stop.`
                );
                return;
            }

            // STEP 4: SUBMIT
            if (accountFlow.step === 4) {
                if (["submit", "confirm", "yes", "continue", "proceed"].includes(lower)) {
                    await submitPersonalOnly(accountFlow.data);
                    return;
                }

                setSuggestions(["Submit", "Cancel"]);
                addBotMessage("Please choose Submit or Cancel.");
                return;
            }
        }
    };

    // Existing FastAPI FAQ/chat functionality.
    const sendQuery = useCallback(async (textToSend) => {
        const text = (textToSend || "").trim();

        if (!text || loading) return;

        addUserMessage(text);
        setMessage("");
        setLoading(true);
        setSuggestions([]);

        try {
            const response = await API.post("/chat", {
                message: text
            });

            const data = response.data;

            addBotMessage(
                data.response ||
                "I am here to help. Please ask any banking question."
            );

            if (
                Array.isArray(data.suggestions) &&
                data.suggestions.length > 0
            ) {
                setSuggestions(data.suggestions);
            } else {
                setSuggestions(getContextualSuggestions(text));
            }
        } catch (error) {
            console.error("Chatbot query error:", error);

            addBotMessage(
                "Unable to reach the backend server right now. Please check your connection or try a suggested question."
            );

            setSuggestions(getContextualSuggestions(text));
        } finally {
            setLoading(false);
        }
    }, [loading]);

    // Query intent checks
    const isAccountOpenQuery = (queryText) => {
        const q = (queryText || "").toLowerCase().trim();
        return (
            q === "open account" ||
            q === "create account" ||
            q === "new account" ||
            q === "open bank account" ||
            q === "open a new account" ||
            q === "open a bank account" ||
            q === "open an account" ||
            q === "open a new bank account" ||
            q === "open a new account now" ||
            q === "yes, open account now" ||
            q.includes("open account") ||
            q.includes("open a new account") ||
            q.includes("open bank account") ||
            q.includes("create account") ||
            q.includes("create a new account") ||
            q.includes("create new account") ||
            q.includes("start account opening") ||
            q.includes("account collection") ||
            q.includes("account creation") ||
            q.includes("apply for account") ||
            q.includes("apply account") ||
            q.includes("open savings account") ||
            q.includes("open current account") ||
            q.includes("open salary account")
        );
    };

    const isPersonalDetailsQuery = (queryText) => {
        const q = (queryText || "").toLowerCase().trim();
        return (
            q === "personal details" ||
            q === "personal details collection" ||
            q === "add personal details" ||
            q === "add personal details to account" ||
            q === "add personal details now" ||
            q.includes("personal details collection") ||
            q.includes("personal detail collection") ||
            q.includes("add personal details") ||
            q.includes("submit personal details") ||
            q.includes("enter personal details") ||
            q.includes("link personal details")
        );
    };

    // Unified message dispatcher for text input and suggestion chips
    const handleUserSubmission = useCallback((rawText) => {
        const text = (rawText || "").trim();

        if (!text || loading) return;

        // If an active form flow is underway, direct input to form handler
        if (accountFlow.active) {
            handleAccountAnswer(text);
            return;
        }

        // Check if intent is to open a new account
        if (isAccountOpenQuery(text)) {
            addUserMessage(text);
            startAccountFlow();
            return;
        }

        // Check if intent is to add personal details
        if (isPersonalDetailsQuery(text)) {
            addUserMessage(text);
            startPersonalDetailsFlow();
            return;
        }

        // Otherwise fallback to FAQ API query
        sendQuery(text);
    }, [accountFlow, loading, sendQuery]);

    // Send direct message from suggestion clicks
    const sendDirectMessage = useCallback((queryText) => {
        handleUserSubmission(queryText);
    }, [handleUserSubmission]);

    // Keep support for external events that open the chatbot
    useEffect(() => {
        const handleOpenEvent = (event) => {
            setIsOpen(true);

            if (event.detail?.query) {
                handleUserSubmission(event.detail.query);
            }
        };

        window.addEventListener("openChatbot", handleOpenEvent);

        return () => {
            window.removeEventListener("openChatbot", handleOpenEvent);
        };
    }, [handleUserSubmission]);

    const sendMessage = (event) => {
        event.preventDefault();

        if (loading || !message.trim()) return;

        const currentMessage = message;
        setMessage("");
        handleUserSubmission(currentMessage);
    };

    // Restart chat and cancel any active flow
    const handleClearChat = () => {
        setMessages([INITIAL_MESSAGE]);
        setSuggestions([]);
        setMessage("");
        setAccountFlow(INITIAL_FLOW_STATE);
    };

    // Determine appropriate input placeholder based on current state
    const getInputPlaceholder = () => {
        if (!accountFlow.active) {
            return "Ask a banking question...";
        }

        if (accountFlow.mode === "create") {
            switch (accountFlow.step) {
                case 0:
                    return "Enter your full name...";
                case 1:
                    return "Enter your age (1 - 99)...";
                case 2:
                    return "Choose Savings, Current, or Salary...";
                case 3:
                    return "Enter opening balance amount (e.g. 1000)...";
                case 4:
                    return "Enter 12-digit Aadhaar number...";
                case 5:
                    return "Enter residential address...";
                case 6:
                    return "Enter 6-digit pincode...";
                case 7:
                    return "Type Submit or Cancel...";
                default:
                    return "Your answer...";
            }
        }

        if (accountFlow.mode === "personal_only") {
            switch (accountFlow.step) {
                case 0:
                    return "Enter your Account Number...";
                case 1:
                    return "Enter 12-digit Aadhaar number...";
                case 2:
                    return "Enter residential address...";
                case 3:
                    return "Enter 6-digit pincode...";
                case 4:
                    return "Type Submit or Cancel...";
                default:
                    return "Your answer...";
            }
        }

        return "Type your message...";
    };

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-title-box">
                            <div className="chatbot-header-text">
                                <h3>Banking Support</h3>
                                <div className="chatbot-status-row">
                                    <span className="online-indicator"></span>
                                    <small>
                                        Customer assistance • Online
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div className="chatbot-header-actions">
                            <button
                                type="button"
                                className="chatbot-clear-btn"
                                onClick={handleClearChat}
                                title="Restart Conversation"
                                aria-label="Restart Conversation"
                            >
                                Clr
                            </button>

                            <button
                                type="button"
                                className="chatbot-close-btn"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close chatbot"
                                title="Close"
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((item, index) => (
                            <div
                                key={index}
                                className={`chat-message ${item.sender}`}
                            >
                                <div className="message-content">
                                    {item.text}
                                </div>

                                {item.timestamp && (
                                    <span className="message-time">
                                        {item.timestamp}
                                    </span>
                                )}
                            </div>
                        ))}

                        {messages.length === 1 &&
                            suggestions.length === 0 && (
                                <div className="chatbot-doubt-section">
                                    <span className="doubt-section-title">
                                        Quick Banking Actions & Queries
                                    </span>

                                    <div className="doubt-chips">
                                        {DOUBT_SUGGESTIONS.map(
                                            (sug, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    className="doubt-chip"
                                                    onClick={() =>
                                                        sendDirectMessage(
                                                            sug.query
                                                        )
                                                    }
                                                    disabled={loading}
                                                    title={`Ask: ${sug.query}`}
                                                >
                                                    <span className="doubt-chip-label">
                                                        {sug.label}
                                                    </span>
                                                    <span className="doubt-chip-arrow">
                                                        →
                                                    </span>
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {suggestions.length > 0 && !loading && (
                            <div className="suggestion-container">
                                <div className="suggestion-title">
                                    {accountFlow.active
                                        ? "Choose an option:"
                                        : "Suggested queries you can ask:"}
                                </div>

                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="suggestion-tile"
                                        onClick={() =>
                                            sendDirectMessage(suggestion)
                                        }
                                        disabled={loading}
                                        title={`Select: ${suggestion}`}
                                    >
                                        <span className="suggestion-tile-icon">
                                            
                                        </span>
                                        <span className="suggestion-tile-text">
                                            {suggestion}
                                        </span>
                                        <span className="suggestion-tile-arrow">
                                            →
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {loading && (
                            <div className="chat-message bot typing-message">
                                <span className="typing-dot"></span>
                                <span className="typing-dot"></span>
                                <span className="typing-dot"></span>
                                <span className="typing-text">
                                    Processing...
                                </span>
                            </div>
                        )}

                        <div ref={messagesEndRef}></div>
                    </div>

                    <form
                        className="chatbot-input"
                        onSubmit={sendMessage}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={message}
                            onChange={(event) =>
                                setMessage(event.target.value)
                            }
                            placeholder={getInputPlaceholder()}
                            maxLength={2000}
                            aria-label="Your message"
                            disabled={loading}
                        />

                        <button
                            type="submit"
                            disabled={loading || !message.trim()}
                            title="Send Message"
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}

            <button
                type="button"
                className="chatbot-toggle"
                onClick={() => setIsOpen((previous) => !previous)}
                aria-label={
                    isOpen
                        ? "Close chatbot"
                        : "Open banking customer support chat"
                }
                title={
                    isOpen
                        ? "Close Support Chat"
                        : "Clear your banking doubts"
                }
            >
                {isOpen ? (
                    "×"
                ) : (
                    <span className="toggle-inner">
                        <span className="toggle-label">Chat</span>
                    </span>
                )}
            </button>
        </div>
    );
}

export default Chatbot;
