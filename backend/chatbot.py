
from fastapi import APIRouter
from pydantic import BaseModel, Field
import re

router = APIRouter(
    prefix="/chat",
    tags=["Customer Support Chatbot"]
)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)


class ChatResponse(BaseModel):
    success: bool
    response: str
    suggestions: list[str]


# Default fallback suggestions for banking customer queries
DEFAULT_SUGGESTIONS = [
    "What are the account types available?",
    "How to open a new account?",
    "How to check my account balance?",
    "How to block a lost or stolen card?"
]

# Comprehensive rule-based knowledge with contextual related queries
FAQ_RULES = [
    {
        "keywords": ["hello", "hi", "hey", "good morning", "good evening", "greetings"],
        "response": (
            "Hello! Welcome to Banking Customer Support. "
            "How can I help you today?"
        ),
        "suggestions": [
            "What types of bank accounts are available?",
            "How to open a new account?",
            "How do I check my account balance?",
            "What documents are required for KYC?"
        ]
    },
    {
        "keywords": ["account type", "account types", "accounts available", "types of accounts", "types of account"],
        "response": (
            "We offer three primary types of accounts:\n"
            "1. Savings Account - Designed to safely save money and earn interest with standard transaction limits.\n"
            "2. Current Account - Ideal for businesses and frequent high-volume daily transactions.\n"
            "3. Salary Account - Tailored for salaried employees with automated monthly payroll credits and zero minimum balance benefits."
        ),
        "suggestions": [
            "How can I open a savings account?",
            "What documents are required for account opening?",
            "What is the minimum balance requirement?",
            "What are current interest rates on savings?"
        ]
    },
    {
        "keywords": ["salary account", "savings account", "current account"],
        "response": (
            "A Savings Account is designed for personal savings and earns competitive interest.\n"
            "A Current Account offers unlimited daily liquidity without overdraft restrictions, tailored for businesses.\n"
            "A Salary Account offers zero-balance perks, free debit card, and special loan rate benefits."
        ),
        "suggestions": [
            "How to open a new account?",
            "What are the interest rates?",
            "How can I check my balance?",
            "What documents are needed for KYC?"
        ]
    },
    {
        "keywords": ["open account", "new account", "create account", "account opening", "start account opening", "open bank account", "apply account", "apply for account"],
        "response": (
            "You can open a new bank account right here through this chatbot!\n"
            "I will collect your Account Details (Name, Age, Account Type, Initial Balance) and Personal Details (Aadhaar, Address, Pincode), submit your application, and generate your Account Number instantly.\n"
            "Simply click 'Open a new account now' or type 'Open account' to begin!"
        ),
        "suggestions": [
            "Open a new account now",
            "What types of accounts are available?",
            "What is the minimum balance required?",
            "Add personal details to account"
        ]
    },
    {
        "keywords": ["personal detail", "personal details", "add personal details", "submit personal details", "personal details collection"],
        "response": (
            "You can submit and link personal details (Aadhaar Number, residential Address, and Pincode) directly through this chatbot for KYC verification.\n"
            "You can also link them to an existing Account ID anytime!"
        ),
        "suggestions": [
            "Open a new account now",
            "Add personal details to account",
            "What documents are required for KYC?"
        ]
    },
    {
        "keywords": ["block card", "lost card", "stolen card", "card stolen", "debit card lost", "atm card lost", "card safety"],
        "response": (
            "Emergency Card Safety Notice:\n"
            "If your debit/ATM card is lost or stolen, please block it immediately via the mobile banking app under 'Cards > Manage Cards > Block', or call our 24x7 emergency helpline. Never share your 4-digit PIN or OTP with anyone."
        ),
        "suggestions": [
            "How can I request a replacement card?",
            "How can I unblock my card if found?",
            "How do I report a suspicious transaction?",
            "How to contact 24x7 bank support?"
        ]
    },
    {
        "keywords": ["unblock card", "activate card", "new card"],
        "response": (
            "To unblock or activate your card, log in to your mobile banking app, navigate to 'Cards > Card Services > Unblock / Activate', or visit your nearest branch with your photo ID."
        ),
        "suggestions": [
            "How to generate ATM PIN?",
            "How to check debit card limits?",
            "How to block card in emergency?"
        ]
    },
    {
        "keywords": ["forgot password", "reset password", "password", "netbanking password", "login issue"],
        "response": (
            "To reset your online banking password, click 'Forgot Password' on the login screen. You will receive an OTP on your registered mobile number and email. Never disclose your password or OTP to bank staff or callers."
        ),
        "suggestions": [
            "How to keep my account secure?",
            "What is two-factor authentication (OTP)?",
            "What to do if my account is locked?",
            "How to update registered mobile number?"
        ]
    },
    {
        "keywords": ["balance", "account balance", "check balance", "current balance", "statement"],
        "response": (
            "To check your live account balance:\n"
            "• Log in to Internet Banking or Mobile App.\n"
            "• Give a missed call or send an SMS from your registered number.\n"
            "• Visit any affiliated ATM with your debit card.\n"
            "Note: This chatbot does not access personal financial details for your privacy and security."
        ),
        "suggestions": [
            "How can I download account statements?",
            "What is the minimum balance requirement?",
            "How to report an incorrect balance?",
            "How to check recent transactions?"
        ]
    },
    {
        "keywords": ["transaction", "money transfer", "transfer money", "neft", "rtgs", "imps", "upi"],
        "response": (
            "You can execute secure fund transfers via UPI, IMPS (instant 24x7), NEFT, or RTGS through our mobile app or internet banking. Always verify the recipient's account number and IFSC code before confirming the transaction."
        ),
        "suggestions": [
            "What to do about a failed transaction where money was deducted?",
            "What to do about an unauthorized transaction?",
            "How to check transfer limits?",
            "How to download transaction receipt?"
        ]
    },
    {
        "keywords": ["interest rate", "interest", "fd rate", "fixed deposit rate", "savings rate"],
        "response": (
            "Current indicative interest rates:\n"
            "• Savings Account: 3.50% - 4.00% p.a.\n"
            "• Fixed Deposits (FD): 6.50% - 7.50% p.a. (Extra 0.50% for senior citizens).\n"
            "• Home Loans: Starting from 8.35% p.a.\n"
            "Rates are subject to revision as per RBI guidelines."
        ),
        "suggestions": [
            "What is a Fixed Deposit (FD)?",
            "What are personal loan interest rates?",
            "How is savings account interest calculated?",
            "What are senior citizen banking benefits?"
        ]
    },
    {
        "keywords": ["loan", "personal loan", "home loan", "car loan", "education loan", "emi"],
        "response": (
            "We offer Home Loans, Personal Loans, Auto Loans, and Education Loans with flexible tenures and competitive interest rates. Eligibility is determined based on monthly income, credit score (CIBIL), and repayment capacity."
        ),
        "suggestions": [
            "What documents are required for a loan?",
            "What is the minimum CIBIL score required for a loan?",
            "What is the current loan interest rate?",
            "How to calculate loan EMI?"
        ]
    },
    {
        "keywords": ["fraud", "scam", "suspicious transaction", "unauthorized", "phishing", "cyber crime"],
        "response": (
            "🚨 Urgent Security Alert:\n"
            "If you suspect unauthorized activity or fraud, immediately:\n"
            "1. Block all cards via the mobile app or helpline.\n"
            "2. Lock your netbanking credentials.\n"
            "3. Report the incident to your bank's Cyber Crime Helpline immediately. The bank never asks for your PIN, OTP, or CVV."
        ),
        "suggestions": [
            "How can I block my card right now?",
            "How to dispute a fraudulent transaction?",
            "How to secure my account credentials?",
            "What is the bank emergency customer care number?"
        ]
    },
    {
        "keywords": ["aadhaar", "identity proof", "kyc", "pan card", "video kyc"],
        "response": (
            "KYC (Know Your Customer) is mandatory regulatory verification. Required documents include:\n"
            "• Identity Proof: PAN Card / Passport / Voter ID\n"
            "• Address Proof: Aadhaar Card / Utility Bill / Driving License\n"
            "• Passport-size Photograph\n"
            "You can complete re-KYC online via our Video-KYC portal."
        ),
        "suggestions": [
            "How can I update my KYC online?",
            "Why is KYC renewal mandatory?",
            "Can I open an account with Aadhaar and PAN?",
            "What happens if KYC is expired?"
        ]
    },
    {
        "keywords": ["thank you", "thanks", "appreciate", "helpful"],
        "response": "You are very welcome! We are always glad to assist you. Is there anything else you would like to know?",
        "suggestions": [
            "What are the account types available?",
            "How to check my account balance?",
            "Tell me about loans and interest rates",
            "How to contact customer support?"
        ]
    },
    {
        "keywords": ["help", "what can you do", "support", "menu", "options"],
        "response": (
            "I am your 24x7 Banking Customer Assistant. I can help answer questions regarding:\n"
            "• Account Types & Account Opening\n"
            "• Card Safety & Emergency Card Blocking\n"
            "• Balance Enquiries & Fund Transfers\n"
            "• Loans, EMIs & Interest Rates\n"
            "• KYC Verification & Security Best Practices"
        ),
        "suggestions": [
            "What are the account types available?",
            "How to open a new account?",
            "How to block card or stolen card?",
            "What documents are required for KYC?"
        ]
    },
    {
        "keywords": ["contact", "customer care", "phone number", "helpline", "branch", "email"],
        "response": (
            "Customer Support Contacts:\n"
            "• 24x7 Toll-Free Support: 1800-123-4567\n"
            "• Emergency Card Block Helpline: 1800-999-CARD\n"
            "• Email Support: support@bankingportal.com\n"
            "• Branch Hours: Monday to Friday 9:30 AM - 4:30 PM, 1st/3rd Saturdays."
        ),
        "suggestions": [
            "How to block card immediately?",
            "How to report an unauthorized transaction?",
            "What are the account types?",
            "How to reset internet banking password?"
        ]
    },
    {
        "keywords": ["no", "don't", "stop", "never mind", "cancel"],
        "response": "Understood! Let me know if you need any assistance with your banking services.",
        "suggestions": [
            "What are the account types available?",
            "How can I check my balance?",
            "Tell me about loans and interest rates"
        ]
    }
]


def stems_match(kw_word: str, text_word: str) -> bool:
    if kw_word == text_word:
        return True
    if kw_word.rstrip("s") == text_word.rstrip("s"):
        return True
    if text_word.startswith(kw_word) and len(kw_word) >= 4:
        return True
    return False


def get_bot_response(message: str) -> tuple[str, list[str]]:
    text = message.lower().strip()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    padded_text = f" {text} "
    text_words = text.split()

    # 1. Exact phrase / substring match
    for rule in FAQ_RULES:
        for keyword in rule["keywords"]:
            kw = keyword.lower().strip()
            if f" {kw} " in padded_text or kw == text:
                return (rule["response"], rule.get("suggestions", DEFAULT_SUGGESTIONS))

    # 2. Multi-word stem match (all words in keyword present in text)
    for rule in FAQ_RULES:
        for keyword in rule["keywords"]:
            kw_words = keyword.lower().split()
            if len(kw_words) > 1 and all(any(stems_match(kw_w, tw) for tw in text_words) for kw_w in kw_words):
                return (rule["response"], rule.get("suggestions", DEFAULT_SUGGESTIONS))

    # 3. Single-word stem match
    for rule in FAQ_RULES:
        for keyword in rule["keywords"]:
            kw = keyword.lower().strip()
            if len(kw.split()) == 1 and any(stems_match(kw, tw) for tw in text_words):
                return (rule["response"], rule.get("suggestions", DEFAULT_SUGGESTIONS))

    return (
        "Sorry, I don't have an exact answer for that query yet. "
        "Please check the related banking queries below, or contact our 24x7 customer support helpline for personalized assistance.",
        DEFAULT_SUGGESTIONS
    )


@router.post("", response_model=ChatResponse)
@router.post("/", response_model=ChatResponse)
def chat_with_bot(data: ChatRequest):
    message = data.message.strip()

    if not message:
        return {
            "success": False,
            "response": "Please enter a message.",
            "suggestions": DEFAULT_SUGGESTIONS
        }

    answer, suggestions = get_bot_response(message)

    return {
        "success": True,
        "response": answer,
        "suggestions": suggestions
    }

