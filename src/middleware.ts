import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("access_token");
    const { pathname } = request.nextUrl;

    // Nếu người dùng đã đăng nhập, không cho phép vào /auth/login
    if (token && pathname === "/auth/login") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Nếu người dùng chưa đăng nhập, cấm truy cập các route ngoài /auth/*
    // if (!token && !pathname.startsWith("/auth")) {
    //     return NextResponse.redirect(new URL("/auth/login", request.url));
    // }

    // Tiếp tục nếu không vi phạm điều kiện
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Áp dụng cho tất cả các route ngoại trừ các static files và api
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
};
