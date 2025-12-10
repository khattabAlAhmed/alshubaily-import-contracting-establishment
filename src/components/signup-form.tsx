"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signup } from "@/server/users"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})
export const signInWithGoogle = async () => {
  const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: `/dashboard`,
  })
}
const ERROR_MESSAGES = {
  "User not found" : "USER_NOT_FOUND",
  "Failed to create user" : "FAILED_TO_CREATE_USER",
  "Failed to create session" : "FAILED_TO_CREATE_SESSION",
  "Failed to update user" : "FAILED_TO_UPDATE_USER",
  "Failed to get session" : "FAILED_TO_GET_SESSION",
  "Invalid password" : "INVALID_PASSWORD",
  "Invalid email" : "INVALID_EMAIL",
  "Invalid email or password" : "INVALID_EMAIL_OR_PASSWORD",
  "Social account already linked" : "SOCIAL_ACCOUNT_ALREADY_LINKED",
  "Provider not found" : "PROVIDER_NOT_FOUND",
  "Invalid token" : "INVALID_TOKEN",
  "ID token not supported" : "ID_TOKEN_NOT_SUPPORTED",
  "Failed to get user info" : "FAILED_TO_GET_USER_INFO",
  "User email not found" : "USER_EMAIL_NOT_FOUND",
  "Email not verified" : "EMAIL_NOT_VERIFIED",
  "Password too short" : "PASSWORD_TOO_SHORT",
  "Password too long" : "PASSWORD_TOO_LONG",
  "User already exists" : "USER_ALREADY_EXISTS",
  "Email can not be updated" : "EMAIL_CAN_NOT_BE_UPDATED",
  "Credential account not found" : "CREDENTIAL_ACCOUNT_NOT_FOUND",
  "Session expired" : "SESSION_EXPIRED",
  "Failed to unlink last account" : "FAILED_TO_UNLINK_LAST_ACCOUNT",
  "Account not found" : "ACCOUNT_NOT_FOUND",
  "User already has password" : "USER_ALREADY_HAS_PASSWORD",
  "User already exists. Use another email." : "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
}
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations('SignupForm')
  const tAuthError = useTranslations('AuthError')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const { success, message } = await signup(values.name, values.email, values.password)
    if (success) {
      toast.success(t('signupSuccess'))
      router.push('/dashboard')
    } else {
      toast.error(tAuthError(ERROR_MESSAGES[message as keyof typeof ERROR_MESSAGES]))
    }
    setIsLoading(false)
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('createAccount')}</CardTitle>
          <CardDescription>
            {t('enterEmailBelow')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
              <Field>
                <Button variant="outline" type="button" onClick={() => signInWithGoogle()}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  {t('signupWithGoogle')}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                {t('orContinueWith')}
              </FieldSeparator>
                <Field>
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">{t('fullName')}</FormLabel>
                      <FormControl>
                        <Input id="name" type="text" placeholder={t('namePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </Field>
                <Field>
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">{t('email')}</FormLabel>
                      <FormControl>
                        <Input id="email" type="email" placeholder={t('emailPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </Field>
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">{t('password')}</FormLabel>
                    <FormControl>
                      <Input id="password" type="password" placeholder={t('passwordPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Field>
                  <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="size-4 animate-spin" /> : t('createAccountButton')}</Button>
                  <FieldDescription className="text-center mt-4">
                    {t('alreadyHaveAccount')} <Link href="/sign-in" className="text-primary">{t('loginLink')}</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        {t('termsAndPrivacy')}
      </FieldDescription>
    </div>
  )
}
