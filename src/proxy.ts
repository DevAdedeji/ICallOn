import { updateSession } from "@/src/lib/supabase/proxy";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const { supabase, supabaseResponse } = await updateSession(request)

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session && request.nextUrl.pathname.startsWith("/create")) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.\.(?:svg|png|jpg|jpeg|gif|webp)$).)",
        "/create", "/auth/login", "/auth/signup"
    ],
}