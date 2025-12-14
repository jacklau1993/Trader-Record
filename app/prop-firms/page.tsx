import { getAccounts } from "@/app/actions/account-actions";
import { PropFirmManager } from "@/components/prop-firms/PropFirmManager";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function PropFirmsPage() {
    let accounts: any[] = [];
    try {
        accounts = await getAccounts();
    } catch (e) {
        console.error("Failed to fetch accounts:", e);
        redirect("/sign-in");
    }

    // Filter for Prop Firms only (handled in UI or here? Better here or let Manager handle both? 
    // User requested "Prop firm" module. But accounts table is generic.
    // I'll pass all accounts and let the UI filter or categorize.
    // Actually, "Prop firm" module implies managing prop firms. 
    // Is it also for "Broker" accounts? 
    // The requirement: "module after Tag before setting named 'Prop firm'. In that module, allow user to CURD their prop firm data"
    // So specifically Prop Firms.

    const propFirms = accounts.filter((a: any) => a.type === "PROP_FIRM");

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Prop Firms</h2>
            </div>
            <PropFirmManager initialPropFirms={propFirms} />
        </div>
    );
}
