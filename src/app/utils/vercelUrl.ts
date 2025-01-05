import { NextRequest } from "next/server";

export const getVercelUrl = (request: NextRequest) => {
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host");
    const vercelUrl = `${protocol}://${host}`;
    return vercelUrl;
}

export const getVercelUrlWithoutRequest = () => {
    if (typeof window !== "undefined") {
        const protocol = window.location.protocol;
        const host = window.location.host;
        return `${protocol}//${host}`;
    }
    return "http://localhost:3000";
};