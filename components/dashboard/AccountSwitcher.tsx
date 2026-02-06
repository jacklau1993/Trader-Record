"use client";

interface AccountSwitcherProps {
    accounts: any[];
    selectedAccountId: string | "all";
    onSelect: (value: string | "all") => void;
}

function normalizeName(name?: string) {
    return (name || "").trim().toLowerCase();
}

function getShortId(id?: string) {
    return (id || "").slice(0, 6);
}

function buildAccountLabels(accounts: any[]) {
    const nameCounts = new Map<string, number>();
    const initialLabelsById = new Map<string, string>();
    const initialLabelCounts = new Map<string, number>();

    for (const account of accounts) {
        const key = `${account.type}:${normalizeName(account.name)}`;
        nameCounts.set(key, (nameCounts.get(key) || 0) + 1);
    }

    for (const account of accounts) {
        const baseName = account.name || "Unnamed account";
        const key = `${account.type}:${normalizeName(account.name)}`;
        const hasSameName = (nameCounts.get(key) || 0) > 1;

        let label = baseName;
        if (hasSameName && account.type === "PROP_FIRM") {
            const accountNumber = account.accountNumber?.trim();
            if (accountNumber) {
                label = `${baseName} (#${accountNumber})`;
            }
        }

        initialLabelsById.set(account.id, label);
        initialLabelCounts.set(label, (initialLabelCounts.get(label) || 0) + 1);
    }

    const finalLabelsById = new Map<string, string>();
    for (const account of accounts) {
        const initialLabel = initialLabelsById.get(account.id) || (account.name || "Unnamed account");
        if ((initialLabelCounts.get(initialLabel) || 0) > 1) {
            finalLabelsById.set(account.id, `${initialLabel} · ${getShortId(account.id)}`);
        } else {
            finalLabelsById.set(account.id, initialLabel);
        }
    }

    return finalLabelsById;
}

export function AccountSwitcher({ accounts, selectedAccountId, onSelect }: AccountSwitcherProps) {
    const accountLabels = buildAccountLabels(accounts);

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
                        {accountLabels.get(account.id) || account.name}
                    </option>
                ))}
            </optgroup>
            <optgroup label="Prop Firms">
                {accounts.filter(a => a.type === "PROP_FIRM").map((account) => (
                    <option key={account.id} value={account.id}>
                        {accountLabels.get(account.id) || account.name}
                    </option>
                ))}
            </optgroup>
        </select>
    );
}
