import bcrypt from "bcrypt";

const SALT = 10;

export const encriptar = async (password: string) => {

    return await bcrypt.hash(password, SALT);

}

export const comparar = async (

    password: string,

    hash: string

) => {

    return await bcrypt.compare(password, hash);

}