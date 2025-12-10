import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('dashboard.home');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
      </div>

      {/* Add your dashboard content here */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold text-lg mb-2">Welcome</h3>
          <p className="text-muted-foreground text-sm">
            This is your dashboard. Customize this page to display your app&apos;s key metrics and quick actions.
          </p>
        </div>
      </div>
    </div>
  );
}