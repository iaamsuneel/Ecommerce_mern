import bcrypt from "bcrypt";
export const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.log(error);
    }
};
export const comparedPassword = async (pass, hashedPassword) => {
    return await bcrypt.compare(pass, hashedPassword);
};
