import crypto from "crypto";

const generateAccountNumber = () => {
    const number = crypto.randomInt(
        1000000000,
        10000000000
    );

    return number.toString();
};

export default generateAccountNumber;