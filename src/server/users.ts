"use server"
import { auth } from "@/lib/auth";



export const signIn = async (email: string, password: string) => {
    try {
        await auth.api.signInEmail({
            body: {
                email: email,
                password: password,
            },

        })
        return { success: true, message: "Signed in successfully" };
    } catch (error) {
        const e = error as Error;
        console.log(e.message);
        return { success: false, message: e.message || "An unknown error occurred" };
    }

}
export const signup = async (name: string, email: string, password: string) => {
    try {
        await auth.api.signUpEmail({
            body: {
                email: email,
                password: password,
                name: name,
            },
        });
        return { success: true, message: "User created successfully" };
    } catch (error) {
        const e = error as Error;
        console.log(e.message);
        return { success: false, message: e.message || "An unknown error occurred" };
    }
}




