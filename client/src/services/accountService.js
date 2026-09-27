import api from "./api";

export const getAccounts = async () => {
    const response = await api.get("/accounts");

    return response.data;
};


export const getAccountBalance = async (accountId) => {
    const response = await api.get(
        `/accounts/${accountId}/balance`
    );

    return response.data;
};


export const getTransactions = async (
    accountId,
    type = ""
) => {
    const url = type
        ? `/accounts/${accountId}/transactions?type=${type}`
        : `/accounts/${accountId}/transactions`;

    const response = await api.get(url);

    return response.data;
};


export const createAccount = async (
    accountHolderName,
    accountType
) => {
    const response = await api.post(
        "/accounts",
        {
            account_holder_name: accountHolderName,
            account_type: accountType
        }
    );

    return response.data;
};


export const updateAccount = async (
    accountId,
    accountHolderName
) => {
    const response = await api.put(
        `/accounts/${accountId}`,
        {
            account_holder_name: accountHolderName
        }
    );

    return response.data;
};


export const deleteAccount = async (accountId) => {
    await api.delete(
        `/accounts/${accountId}`
    );
};


export const depositMoney = async (
    accountId,
    amount
) => {
    const response = await api.post(
        `/accounts/${accountId}/deposit`,
        {
            amount
        }
    );

    return response.data;
};


export const withdrawMoney = async (
    accountId,
    amount
) => {
    const response = await api.post(
        `/accounts/${accountId}/withdraw`,
        {
            amount
        }
    );

    return response.data;
};