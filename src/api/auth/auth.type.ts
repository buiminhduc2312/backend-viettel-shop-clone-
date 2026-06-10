export interface IVerifyTokenPayLoad {
    id: string;
}

export interface ITokenResponse {
    tokenType: string;
    accessToken: string;
    iat: number;
    exp?: number;
}
