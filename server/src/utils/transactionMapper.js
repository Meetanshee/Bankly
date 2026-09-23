export const mapTransaction = (transaction) => {
    return {
        id: transaction.id,
        accountId: transaction.account_id,
        transactionType: transaction.transaction_type,
        amount: transaction.amount,
        availableBalance: transaction.available_balance,
        transactionDate: transaction.transaction_date
    };
};

export const mapTransactions = (transactions) => {
    return transactions.map(mapTransaction);
};