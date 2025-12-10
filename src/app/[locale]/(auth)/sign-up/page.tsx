import { School2 } from "lucide-react"

import { SignupForm } from "@/components/signup-form"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"

export default function SignupPage() {
  const t = useTranslations("Auth.SignUp")
  const locale = useLocale()
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center">
        <Image alt='logo' src={locale === 'ar' ? '/logo.png' : '/logo_english.png'} height={56.1} width={134.5} />
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <School2 className="size-4" />
          </div>
          {t("title")}
        </a>
        <SignupForm />
      </div>
    </div>
  )
}
