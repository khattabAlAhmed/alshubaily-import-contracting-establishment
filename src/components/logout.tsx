"use client"
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
export const logout = async () => {
  await authClient.signOut();
}

export const Logout = () => {
  const t = useTranslations("Auth.SignOut")
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.push('/sign-in');

  }
  return (
    <Button variant="outline" onClick={() => handleLogout()}>{t("button")}</Button>
  );
}