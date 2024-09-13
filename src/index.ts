/* eslint-disable no-useless-catch */
import notp from "notp";
import crypto from "crypto";
import b32 from "thirty-two";
import { Options } from "./interfaces";
import { toDataURL } from "qrcode";


export async function generateSecret(options: any) {
    const config = {
        name: encodeURIComponent(options?.name ?? "App"),
        account: encodeURIComponent(options?.account ? `:${options.account}` : ""),
    };

    const bin = crypto.randomBytes(20);
    const base32 = b32.encode(bin).toString("utf8").replace(/=/g, "");

    const secret = base32
        .toLowerCase()
        .replace(/(\w{4})/g, "$1 ")
        .trim()
        .split(" ")
        .join("")
        .toUpperCase();

    const query = `?secret=${secret}&issuer=${config.name}`;
    const uri = `otpauth://totp/${config.name}${config.account}${query}`;

    const data_url = await toDataURL(uri);
    return {
        secret,
        uri,
        qr: data_url,
    };

}


export function generateToken(secret: string) {
    if (!secret || !secret.length) return null;
    const unformatted = secret.replace(/\W+/g, "").toUpperCase();
    const bin = b32.decode(unformatted);

    return { token: notp.totp.gen(bin) };
}

export function verifyToken(secret: string, token?: string, window = 4) {
    if (!token || !token.length) return null;

    const unformatted = secret.replace(/\W+/g, "").toUpperCase();
    const bin = b32.decode(unformatted);

    return notp.totp.verify(token.replace(/\W+/g, ""), bin, {
        window,
        time: 30,
    });
}
