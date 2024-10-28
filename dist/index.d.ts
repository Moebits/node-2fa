import notp from "notp";
export declare function generateSecret(options: any): Promise<{
    secret: string;
    uri: string;
    qr: string;
}>;
export declare function generateToken(secret: string): {
    token: string;
} | null;
export declare function verifyToken(secret: string, token?: string, window?: number): notp.VerifyResult | null;
