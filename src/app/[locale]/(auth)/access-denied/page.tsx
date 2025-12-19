import { ShieldX, Home, LogOut } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logout } from "@/components/logout";

export default function AccessDeniedPage() {
    const t = useTranslations("Auth.AccessDenied");
    const locale = useLocale();

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6 items-center">
                <Image
                    alt="logo"
                    src={locale === "ar" ? "/logo.png" : "/logo_english.png"}
                    height={56.1}
                    width={134.5}
                />

                <Card className="w-full">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                            <ShieldX className="h-8 w-8 text-destructive" />
                        </div>
                        <CardTitle className="text-xl">{t("title")}</CardTitle>
                        <CardDescription className="mt-2">
                            {t("description")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center text-sm text-muted-foreground">
                            {t("contactAdmin")}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/">
                                    <Home className="mr-2 h-4 w-4" />
                                    {t("backToHome")}
                                </Link>
                            </Button>
                            <Logout />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
