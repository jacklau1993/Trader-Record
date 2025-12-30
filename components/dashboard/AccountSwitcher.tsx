"use client";

interface AccountSwitcherProps {
    accounts: any[];
    selectedAccountId: string | "all";
    onSelect: (value: string | "all") => void;
}

export function AccountSwitcher({ accounts, selectedAccountId, onSelect }: AccountSwitcherProps) {
    return (
        <select
            className="w-full sm:w-[200px] h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={selectedAccountId}
            onChange={(e) => onSelect(e.target.value)}
        >
            <option value="all">All Accounts</option>
            <optgroup label="Personal Accounts">
                {accounts.filter(a => a.type === "BROKER").map((account) => (
                    <option key={account.id} value={account.id}>
                        {account.name}
                    </option>
                ))}
            </optgroup>
            <optgroup label="Prop Firms">
                {accounts.filter(a => a.type === "PROP_FIRM").map((account) => (
                    <option key={account.id} value={account.id}>
                        {account.name}
                    </option>
                ))}
            </optgroup>
        </select>
    );
}
