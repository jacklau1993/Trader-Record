type AccountLike = {
    id: string;
    name?: string | null;
    type?: string | null;
    accountNumber?: string | null;
};

function normalizeName(name?: string | null) {
    return (name || "").trim().toLowerCase();
}

function getShortId(id?: string) {
    return (id || "").slice(0, 6);
}

export function buildAccountLabels(accounts: AccountLike[]) {
    const nameCounts = new Map<string, number>();
    const initialLabelsById = new Map<string, string>();
    const initialLabelCounts = new Map<string, number>();

    for (const account of accounts) {
        const key = `${account.type || ""}:${normalizeName(account.name)}`;
        nameCounts.set(key, (nameCounts.get(key) || 0) + 1);
    }

    for (const account of accounts) {
        const baseName = account.name || "Unnamed account";
        const key = `${account.type || ""}:${normalizeName(account.name)}`;
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
