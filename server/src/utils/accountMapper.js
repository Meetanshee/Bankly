export const mapAccount = (account) => {
    if (!account) {
        return null;
    }

    return {
        id: account.id,
        userId: account.user_id,
        accountNumber: account.account_number,
        accountHolderName:
            account.account_holder_name,
        accountType: account.account_type,
        balance: account.balance,
        createdAt: account.created_at
    };
};


export const mapBalance = (account) => {
    if (!account) {
        return null;
    }

    return {
        balance: account.balance
    };
};