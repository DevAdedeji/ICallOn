import { NextRequest, NextResponse } from "next/server";
import { createSupabaseOAuthClient } from "@/src/lib/supabase/proxy-oauth";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") ?? "/create";

    if (!code) {
        return NextResponse.redirect(new URL("/auth/login", url.origin));
    }

    const { supabase, res } = createSupabaseOAuthClient(req);

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        console.error("OAuth error:", error.message);
        return NextResponse.redirect(
            new URL("/auth/login?error=oauth", url.origin)
        );
    }

    return NextResponse.redirect(new URL(next, url.origin), {
        headers: res.headers,
    });
}
