import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import { getUserPreferences } from "@/app/actions/settings-actions";
import { getAccounts } from "@/app/actions/account-actions";
import SettingsClient from "@/components/settings/SettingsClient";

export default async function SettingsPage() {
    const auth = getAuth();
    const headersList = await headers();

    try {
        const session = await auth.api.getSession({ headers: headersList });
        if (!session?.user) {
            redirect("/sign-in");
        }

        const [preferences, accounts] = await Promise.all([
            getUserPreferences(),
            getAccounts()
        ]);

        return (
            <SettingsClient
                user={{
                    id: session.user.id,
                    name: session.user.name,
                    email: session.user.email,
                }}
                preferences={{
                    currency: preferences.currency,
                    dateFormat: preferences.dateFormat,
                    timezone: preferences.timezone,
                    theme: preferences.theme,
                }}
                initialAccounts={accounts}
            />
        );
    } catch (error) {
        redirect("/sign-in");
    }
}
