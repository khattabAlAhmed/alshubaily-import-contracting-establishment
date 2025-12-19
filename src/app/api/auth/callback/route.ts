import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db/drizzle";
import { accounts } from "@/lib/db/schema/auth-schema";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import type { EmailOtpType } from "@supabase/supabase-js";

async function createAccountIfNotExists(userId: string, userMetadata: Record<string, string | undefined>) {
    try {
        // Check if account already exists for this user
        const existingAccounts = await db
            .select()
            .from(accounts)
            .where(eq(accounts.authUserId, userId))
            .limit(1);

        // Create account if it doesn't exist
        if (existingAccounts.length === 0) {
            const userName = userMetadata?.full_name ||
                userMetadata?.name ||
                userMetadata?.email?.split("@")[0] ||
                "User";

            await db.insert(accounts).values({
                id: nanoid(),
                authUserId: userId,
                displayNameEn: userName,
                displayNameAr: userName,
                avatarUrl: userMetadata?.avatar_url || null,
            });

            console.log(`Account created for user: ${userId}`);
        }
    } catch (error) {
        console.error("Error creating account:", error);
        // Don't throw - we still want to redirect the user
    }
}

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;
    const next = searchParams.get("next") ?? "/dashboard";

    const supabase = await createClient();

    // Handle OAuth callback (code-based)
    if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.user) {
            await createAccountIfNotExists(data.user.id, data.user.user_metadata as Record<string, string | undefined>);

            return redirectToNext(request, origin, next);
        }
    }

    // Handle email verification callback (token_hash-based)
    if (token_hash && type) {
        const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type,
        });

        if (!error && data.user) {
            await createAccountIfNotExists(data.user.id, data.user.user_metadata as Record<string, string | undefined>);

            return redirectToNext(request, origin, next);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_error`);
}

function redirectToNext(request: Request, origin: string, next: string) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";

    if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
        return NextResponse.redirect(`${origin}${next}`);
    }
}
