import {NextRequest, NextResponse} from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("access_token");
    // Lấy ra URL ngay lúc thực hiện request
    const url = request.nextUrl.clone();

    // Nếu có access_token thì không cho phép truy cập vào login
    // Điều hướng về home
    if (token && url.pathname === "/auth/login") {
        return NextResponse.redirect(
            new URL('/', request.url)
        );
    }

    // Nếu không có access_token thì chỉ cho phép truy cập vào login
    // Điều hướng về login
    if (!token && url.pathname !== "/auth/login") {
        return NextResponse.redirect(
            new URL('/auth/login', request.url)
        );
    }

    // Nếu không có vấn đề gì thì tiếp tục thực hiện request
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/auth/login', '/menu', '/category']
};
