import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
    getAccounts,
    getAccountBalance,
    getTransactions,
    createAccount,
    updateAccount,
    deleteAccount,
    depositMoney,
    withdrawMoney
} from "../services/accountService";

const Dashboard = () => {
    const { user, logout } = useAuth();

    const [accounts, setAccounts] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState(null);

    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);

    const [accountHolderName, setAccountHolderName] = useState("");
    const [accountType, setAccountType] = useState("SAVINGS");

    const [amount, setAmount] = useState("");
    const [transactionType, setTransactionType] = useState("DEPOSIT");
    const [transactionFilter, setTransactionFilter] = useState("");

    const [editingAccount, setEditingAccount] = useState(false);
    const [showCreateAccount, setShowCreateAccount] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================
    // LOAD ACCOUNTS
    // =========================================

    const loadAccounts = async (preferredAccountId = null) => {
        try {
            setLoading(true);
            setError("");

            const response = await getAccounts();
            const fetchedAccounts = response.data || [];

            setAccounts(fetchedAccounts);

            if (fetchedAccounts.length === 0) {
                setAccount(null);
                setBalance(null);
                setTransactions([]);
                setSelectedAccountId(null);
                setShowCreateAccount(true);
                return;
            }

            let accountToSelect = null;

            if (preferredAccountId) {
                accountToSelect = fetchedAccounts.find(
                    (item) => item.id === preferredAccountId
                );
            }

            if (!accountToSelect && selectedAccountId) {
                accountToSelect = fetchedAccounts.find(
                    (item) => item.id === selectedAccountId
                );
            }

            if (!accountToSelect) {
                accountToSelect = fetchedAccounts[0];
            }

            setSelectedAccountId(accountToSelect.id);
            setAccount(accountToSelect);
            setAccountHolderName(accountToSelect.accountHolderName);

            await loadAccountDetails(accountToSelect.id);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load accounts"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================
    // LOAD ACCOUNT DETAILS
    // =========================================

    const loadAccountDetails = async (accountId) => {
        try {
            const [
                balanceResponse,
                transactionResponse
            ] = await Promise.all([
                getAccountBalance(accountId),
                getTransactions(accountId, transactionFilter)
            ]);

            setBalance(balanceResponse.data);
            setTransactions(transactionResponse.data || []);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load account details"
            );
        }
    };

    // =========================================
    // INITIAL LOAD
    // =========================================

    useEffect(() => {
        loadAccounts();
    }, []);

    // =========================================
    // ACCOUNT CHANGE
    // =========================================

    const handleAccountChange = async (event) => {
        const accountId = Number(event.target.value);

        const selectedAccount = accounts.find(
            (item) => item.id === accountId
        );

        if (!selectedAccount) {
            return;
        }

        setSelectedAccountId(accountId);
        setAccount(selectedAccount);
        setAccountHolderName(selectedAccount.accountHolderName);

        setEditingAccount(false);
        setShowProfile(false);
        setError("");
        setSuccess("");
        setTransactionFilter("");

        await loadAccountDetails(accountId);
    };

    // =========================================
    // CREATE ACCOUNT
    // =========================================

    const handleCreateAccount = async (event) => {
        event.preventDefault();

        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            const response = await createAccount(
                accountHolderName,
                accountType
            );

            const newAccount = response.data;

            setSuccess("Account created successfully");
            setShowCreateAccount(false);
            setShowProfile(false);
            setEditingAccount(false);

            setAccountHolderName("");

            await loadAccounts(newAccount.id);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to create account"
            );
        } finally {
            setActionLoading(false);
        }
    };

    // =========================================
    // EDIT ACCOUNT
    // =========================================

    const handleStartEdit = () => {
        if (!account) {
            return;
        }

        setAccountHolderName(account.accountHolderName);
        setEditingAccount(true);
        setError("");
        setSuccess("");
    };

    const handleUpdateAccount = async (event) => {
        event.preventDefault();

        if (!account) {
            return;
        }

        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            const response = await updateAccount(
                account.id,
                accountHolderName
            );

            const updatedAccount = response.data;

            setAccount(updatedAccount);

            setAccounts((previousAccounts) =>
                previousAccounts.map((item) =>
                    item.id === updatedAccount.id
                        ? updatedAccount
                        : item
                )
            );

            setEditingAccount(false);
            setSuccess(
                "Account holder details updated successfully"
            );

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to update account"
            );
        } finally {
            setActionLoading(false);
        }
    };

    // =========================================
    // DELETE ACCOUNT
    // =========================================

    const handleDeleteAccount = async () => {
        if (!account) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this account? All transaction history will also be deleted."
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            await deleteAccount(account.id);

            setShowProfile(false);
            setEditingAccount(false);

            setSuccess("Account deleted successfully");

            await loadAccounts();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete account"
            );
        } finally {
            setActionLoading(false);
        }
    };

    // =========================================
    // DEPOSIT / WITHDRAW
    // =========================================

    const handleTransaction = async (event) => {
        event.preventDefault();

        if (!account) {
            return;
        }

        if (!amount || Number(amount) <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            if (transactionType === "DEPOSIT") {
                await depositMoney(
                    account.id,
                    Number(amount)
                );

                setSuccess("Money deposited successfully");
            } else {
                await withdrawMoney(
                    account.id,
                    Number(amount)
                );

                setSuccess("Money withdrawn successfully");
            }

            setAmount("");

            await loadAccountDetails(account.id);

            const accountsResponse = await getAccounts();
            const updatedAccounts =
                accountsResponse.data || [];

            setAccounts(updatedAccounts);

            const updatedAccount = updatedAccounts.find(
                (item) => item.id === account.id
            );

            if (updatedAccount) {
                setAccount(updatedAccount);
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Transaction failed"
            );
        } finally {
            setActionLoading(false);
        }
    };

    // =========================================
    // TRANSACTION FILTER
    // =========================================

    const handleTransactionFilter = async (filter) => {
        if (!account) {
            return;
        }

        try {
            setTransactionFilter(filter);

            const response = await getTransactions(
                account.id,
                filter
            );

            setTransactions(response.data || []);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load transactions"
            );
        }
    };

    // =========================================
    // LOGOUT
    // =========================================

    const handleLogout = () => {
        logout();
    };

    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading-message">
                    Loading your accounts...
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">

            {/* ================================= */}
            {/* NAVBAR */}
            {/* ================================= */}

            <nav className="bank-navbar">

                <div className="brand">
                    <div className="brand-icon">
                        ₹
                    </div>

                    <span>Bankly</span>
                </div>

                <div className="navbar-right">

                    {/* ACCOUNT SELECTOR */}

                    {accounts.length > 0 && (
                        <div className="navbar-account">

                            <span className="navbar-account-label">
                                Account
                            </span>

                            <select
                                value={selectedAccountId || ""}
                                onChange={handleAccountChange}
                            >
                                {accounts.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.accountType}
                                        {" • "}
                                        ****
                                        {item.accountNumber.slice(-4)}
                                    </option>
                                ))}
                            </select>

                        </div>
                    )}

                    {/* OPEN ACCOUNT */}

                    <button
                        className="navbar-add-account"
                        onClick={() => {
                            setShowCreateAccount(true);
                            setEditingAccount(false);
                            setShowProfile(false);
                            setError("");
                            setSuccess("");
                            setAccountHolderName("");
                        }}
                    >
                        <span>+</span>
                        New Account
                    </button>

                    {/* USER MENU */}

                    <div className="profile-wrapper">

                        <button
                            className="profile-button"
                            onClick={() =>
                                setShowProfile(
                                    (previous) => !previous
                                )
                            }
                        >
                            <div className="user-avatar">
                                {user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </div>

                            <div className="profile-name">
                                <strong>
                                    {user?.name}
                                </strong>

                                <span>
                                    My Profile
                                </span>
                            </div>

                            <span
                                className={
                                    showProfile
                                        ? "profile-arrow open"
                                        : "profile-arrow"
                                }
                            >
                                ▾
                            </span>
                        </button>

                        {/* PROFILE DROPDOWN */}

                        {showProfile && (
                            <div className="profile-dropdown">

                                <div className="profile-dropdown-header">

                                    <div className="large-avatar">
                                        {user?.name
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </div>

                                    <div>
                                        <strong>
                                            {user?.name}
                                        </strong>

                                        <span>
                                            {user?.email}
                                        </span>
                                    </div>

                                </div>

                                <div className="dropdown-divider" />

                                {!editingAccount ? (
                                    <>
                                        <div className="dropdown-title">
                                            Account Details
                                        </div>

                                        <div className="profile-detail">
                                            <span>
                                                Account Number
                                            </span>

                                            <strong>
                                                {account?.accountNumber}
                                            </strong>
                                        </div>

                                        <div className="profile-detail">
                                            <span>
                                                Account Type
                                            </span>

                                            <strong>
                                                {account?.accountType}
                                            </strong>
                                        </div>

                                        <div className="profile-detail">
                                            <span>
                                                Account Holder
                                            </span>

                                            <strong>
                                                {account?.accountHolderName}
                                            </strong>
                                        </div>

                                        <div className="profile-detail">
                                            <span>
                                                Created
                                            </span>

                                            <strong>
                                                {account?.createdAt
                                                    ? new Date(
                                                        account.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN"
                                                    )
                                                    : "-"}
                                            </strong>
                                        </div>

                                        <div className="dropdown-divider" />

                                        <button
                                            className="profile-action edit"
                                            onClick={
                                                handleStartEdit
                                            }
                                        >
                                            Edit Holder Details
                                        </button>

                                        <button
                                            className="profile-action danger"
                                            onClick={
                                                handleDeleteAccount
                                            }
                                            disabled={
                                                actionLoading
                                            }
                                        >
                                            Delete Account
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="dropdown-title">
                                            Edit Account
                                        </div>

                                        <form
                                            onSubmit={
                                                handleUpdateAccount
                                            }
                                            className="profile-edit-form"
                                        >
                                            <label>
                                                Account Holder Name
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    accountHolderName
                                                }
                                                onChange={(event) =>
                                                    setAccountHolderName(
                                                        event.target.value
                                                    )
                                                }
                                                required
                                            />

                                            <div className="readonly-mini">
                                                <span>
                                                    Account Number
                                                </span>

                                                <strong>
                                                    {
                                                        account?.accountNumber
                                                    }
                                                </strong>
                                            </div>

                                            <div className="profile-edit-actions">

                                                <button
                                                    type="submit"
                                                    className="save-profile"
                                                    disabled={
                                                        actionLoading
                                                    }
                                                >
                                                    {actionLoading
                                                        ? "Saving..."
                                                        : "Save"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="cancel-profile"
                                                    onClick={() => {
                                                        setEditingAccount(
                                                            false
                                                        );
                                                        setAccountHolderName(
                                                            account.accountHolderName
                                                        );
                                                    }}
                                                >
                                                    Cancel
                                                </button>

                                            </div>
                                        </form>
                                    </>
                                )}

                                <div className="dropdown-divider" />

                                <button
                                    className="logout-button"
                                    onClick={handleLogout}
                                >
                                    <span>↪</span>
                                    Logout
                                </button>

                            </div>
                        )}

                    </div>

                </div>

            </nav>

            {/* ================================= */}
            {/* PAGE CONTENT */}
            {/* ================================= */}

            <main className="dashboard-content">

                <div className="welcome-section">

                    <div>
                        <p className="welcome-label">
                            PERSONAL BANKING
                        </p>

                        <h1>
                            Welcome back,{" "}
                            {user?.name?.split(" ")[0]}
                        </h1>

                        <p>
                            Manage your money and track your
                            transactions.
                        </p>
                    </div>

                </div>

                {/* ================================= */}
                {/* MESSAGES */}
                {/* ================================= */}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                {/* ================================= */}
                {/* CREATE ACCOUNT */}
                {/* ================================= */}

                {showCreateAccount && (
                    <div className="dashboard-card create-account-card">

                        <div className="card-header">

                            <div>
                                <h2>
                                    Open New Account
                                </h2>

                                <p>
                                    Create another Savings or
                                    Current account.
                                </p>
                            </div>

                            {accounts.length > 0 && (
                                <button
                                    className="secondary-button"
                                    onClick={() => {
                                        setShowCreateAccount(
                                            false
                                        );
                                        setError("");
                                    }}
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                        <form
                            className="account-form"
                            onSubmit={handleCreateAccount}
                        >

                            <div className="form-group">
                                <label>
                                    Account Holder Name
                                </label>

                                <input
                                    type="text"
                                    value={accountHolderName}
                                    onChange={(event) =>
                                        setAccountHolderName(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter account holder name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Account Type
                                </label>

                                <select
                                    value={accountType}
                                    onChange={(event) =>
                                        setAccountType(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="SAVINGS">
                                        Savings
                                    </option>

                                    <option value="CURRENT">
                                        Current
                                    </option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={actionLoading}
                            >
                                {actionLoading
                                    ? "Creating..."
                                    : "Create Account"}
                            </button>

                        </form>

                    </div>
                )}

                {/* ================================= */}
                {/* MAIN ACCOUNT CONTENT */}
                {/* ================================= */}

                {accounts.length > 0 && (
                    <>

                        {/* BALANCE */}

                        <section className="balance-section">

                            <div className="balance-card">

                                <div className="balance-top">

                                    <div>
                                        <span>
                                            Available Balance
                                        </span>

                                        <h2>
                                            ₹
                                            {Number(
                                                balance?.balance || 0
                                            ).toLocaleString(
                                                "en-IN",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }
                                            )}
                                        </h2>
                                    </div>

                                    <div className="balance-account-type">
                                        {account?.accountType}
                                    </div>

                                </div>

                                <div className="balance-bottom">
                                    <span>
                                        Account ending in
                                    </span>

                                    <strong>
                                        ****
                                        {account?.accountNumber?.slice(
                                            -4
                                        )}
                                    </strong>
                                </div>

                            </div>

                        </section>

                        {/* ================================= */}
                        {/* TRANSACTION ACTION */}
                        {/* ================================= */}

                        <section className="dashboard-card transaction-card">

                            <div className="card-header">

                                <div>
                                    <h2>
                                        Make a Transaction
                                    </h2>

                                    <p>
                                        Deposit or withdraw money
                                        from your account.
                                    </p>
                                </div>

                            </div>

                            <form
                                className="transaction-form"
                                onSubmit={handleTransaction}
                            >

                                <div className="form-group">
                                    <label>
                                        Transaction Type
                                    </label>

                                    <select
                                        value={transactionType}
                                        onChange={(event) =>
                                            setTransactionType(
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option value="DEPOSIT">
                                            Deposit
                                        </option>

                                        <option value="WITHDRAW">
                                            Withdraw
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>
                                        Amount
                                    </label>

                                    <div className="amount-input">
                                        <span>₹</span>

                                        <input
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            value={amount}
                                            onChange={(event) =>
                                                setAmount(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={
                                        transactionType ===
                                        "DEPOSIT"
                                            ? "transaction-submit deposit"
                                            : "transaction-submit withdraw"
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                >
                                    {actionLoading
                                        ? "Processing..."
                                        : transactionType ===
                                          "DEPOSIT"
                                            ? "Deposit Money"
                                            : "Withdraw Money"}
                                </button>

                            </form>

                        </section>

                        {/* ================================= */}
                        {/* TRANSACTIONS */}
                        {/* ================================= */}

                        <section className="dashboard-card">

                            <div className="transaction-header">

                                <div>
                                    <h2>
                                        Recent Transactions
                                    </h2>

                                    <p>
                                        Your latest account activity.
                                    </p>
                                </div>

                                <div className="transaction-filters">

                                    <button
                                        className={
                                            transactionFilter === ""
                                                ? "filter-button active"
                                                : "filter-button"
                                        }
                                        onClick={() =>
                                            handleTransactionFilter(
                                                ""
                                            )
                                        }
                                    >
                                        All
                                    </button>

                                    <button
                                        className={
                                            transactionFilter ===
                                            "DEPOSIT"
                                                ? "filter-button active"
                                                : "filter-button"
                                        }
                                        onClick={() =>
                                            handleTransactionFilter(
                                                "DEPOSIT"
                                            )
                                        }
                                    >
                                        Deposits
                                    </button>

                                    <button
                                        className={
                                            transactionFilter ===
                                            "WITHDRAW"
                                                ? "filter-button active"
                                                : "filter-button"
                                        }
                                        onClick={() =>
                                            handleTransactionFilter(
                                                "WITHDRAW"
                                            )
                                        }
                                    >
                                        Withdrawals
                                    </button>

                                </div>

                            </div>

                            {transactions.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">
                                        ₹
                                    </div>

                                    <strong>
                                        No transactions yet
                                    </strong>

                                    <span>
                                        Your account activity will
                                        appear here.
                                    </span>
                                </div>
                            ) : (
                                <div className="transactions-list">

                                    {transactions.map(
                                        (transaction) => (
                                            <div
                                                className="transaction-item"
                                                key={
                                                    transaction.id
                                                }
                                            >

                                                <div className="transaction-left">

                                                    <div
                                                        className={
                                                            transaction.transactionType ===
                                                            "DEPOSIT"
                                                                ? "transaction-icon deposit-icon"
                                                                : "transaction-icon withdraw-icon"
                                                        }
                                                    >
                                                        {transaction.transactionType ===
                                                        "DEPOSIT"
                                                            ? "↓"
                                                            : "↑"}
                                                    </div>

                                                    <div className="transaction-info">

                                                        <strong>
                                                            {transaction.transactionType ===
                                                            "DEPOSIT"
                                                                ? "Money Deposited"
                                                                : "Money Withdrawn"}
                                                        </strong>

                                                        <span>
                                                            {new Date(
                                                                transaction.transactionDate
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </span>

                                                    </div>

                                                </div>

                                                <div className="transaction-amount">

                                                    <strong
                                                        className={
                                                            transaction.transactionType ===
                                                            "DEPOSIT"
                                                                ? "amount-positive"
                                                                : "amount-negative"
                                                        }
                                                    >
                                                        {transaction.transactionType ===
                                                        "DEPOSIT"
                                                            ? "+"
                                                            : "-"}
                                                        ₹
                                                        {Number(
                                                            transaction.amount
                                                        ).toLocaleString(
                                                            "en-IN",
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            }
                                                        )}
                                                    </strong>

                                                    <span>
                                                        Balance ₹
                                                        {Number(
                                                            transaction.availableBalance
                                                        ).toLocaleString(
                                                            "en-IN",
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            }
                                                        )}
                                                    </span>

                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                        </section>

                    </>
                )}

            </main>

        </div>
    );
};

export default Dashboard;