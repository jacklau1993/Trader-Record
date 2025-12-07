"use client";

import { useState } from "react";
import {
    User,
    Download,
    Moon,
    Sun,
    Trash2,
    LogOut,
    Settings,
    DollarSign,
    Calendar,
    Globe,
    Save,
    Check,
    Loader2,
    AlertTriangle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
    updateUserProfile,
    updateUserPreferences,
    getTradesForExport,
    deleteUserAccount,
} from "@/app/actions/settings-actions";

interface UserData {
    id: string;
    name: string;
    email: string;
}

interface Preferences {
    currency: string;
    dateFormat: string;
    timezone: string;
    theme: string;
}

interface SettingsClientProps {
    user: UserData;
    preferences: Preferences;
}

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "HKD", "SGD"];
const DATE_FORMATS = ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY", "DD-MM-YYYY"];
const TIMEZONES = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "America/Chicago",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Asia/Hong_Kong",
    "Asia/Singapore",
    "Australia/Sydney",
];

export default function SettingsClient({ user, preferences }: SettingsClientProps) {
    const router = useRouter();

    // Profile state
    const [name, setName] = useState(user.name);
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);

    // Preferences state
    const [currency, setCurrency] = useState(preferences.currency);
    const [dateFormat, setDateFormat] = useState(preferences.dateFormat);
    const [timezone, setTimezone] = useState(preferences.timezone);
    const [theme, setTheme] = useState(preferences.theme);
    const [prefsSaving, setPrefsSaving] = useState(false);
    const [prefsSaved, setPrefsSaved] = useState(false);

    // Export state
    const [exporting, setExporting] = useState(false);

    // Delete state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [deleting, setDeleting] = useState(false);

    // Save profile
    const handleSaveProfile = async () => {
        setProfileSaving(true);
        try {
            await updateUserProfile({ name });
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 2000);
        } catch (error) {
            alert("Failed to save profile");
        } finally {
            setProfileSaving(false);
        }
    };

    // Save preferences
    const handleSavePreferences = async () => {
        setPrefsSaving(true);
        try {
            await updateUserPreferences({ currency, dateFormat, timezone, theme });
            setPrefsSaved(true);
            setTimeout(() => setPrefsSaved(false), 2000);
        } catch (error) {
            alert("Failed to save preferences");
        } finally {
            setPrefsSaving(false);
        }
    };

    // Toggle theme
    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        // Apply theme to document
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        document.documentElement.classList.toggle("light", newTheme === "light");
    };

    // Export trades
    const handleExport = async (format: "csv" | "json") => {
        setExporting(true);
        try {
            const trades = await getTradesForExport();

            let content: string;
            let filename: string;
            let mimeType: string;

            if (format === "json") {
                content = JSON.stringify(trades, null, 2);
                filename = `traderrecord-trades-${new Date().toISOString().split("T")[0]}.json`;
                mimeType = "application/json";
            } else {
                // CSV
                const headers = [
                    "Date",
                    "Ticker",
                    "Type",
                    "Entry Price",
                    "Exit Price",
                    "Quantity",
                    "P&L",
                    "Status",
                    "Notes",
                ];
                const rows = trades.map((t: any) => [
                    t.date,
                    t.ticker,
                    t.type,
                    t.entryPrice,
                    t.exitPrice,
                    t.quantity,
                    t.pnl,
                    t.status,
                    `"${(t.notes || "").replace(/"/g, '""')}"`,
                ]);
                content = [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\n");
                filename = `traderrecord-trades-${new Date().toISOString().split("T")[0]}.csv`;
                mimeType = "text/csv";
            }

            // Download
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            alert("Export failed");
        } finally {
            setExporting(false);
        }
    };

    // Sign out
    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/sign-in");
    };

    // Delete account
    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== "DELETE") return;
        setDeleting(true);
        try {
            await deleteUserAccount();
            await authClient.signOut();
            router.push("/sign-in");
        } catch (error) {
            alert("Failed to delete account");
            setDeleting(false);
        }
    };

    return (
        <div className="flex-1 p-8 pt-6 max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Settings</h2>

            <div className="space-y-6">
                {/* Profile Section */}
                <section className="rounded-lg border border-border bg-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <User className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Profile</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="mt-1 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                        </div>
                        <button
                            onClick={handleSaveProfile}
                            disabled={profileSaving || name === user.name}
                            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {profileSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : profileSaved ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {profileSaved ? "Saved!" : "Save Profile"}
                        </button>
                    </div>
                </section>

                {/* Preferences Section */}
                <section className="rounded-lg border border-border bg-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Settings className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Preferences</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <DollarSign className="h-4 w-4" /> Currency
                            </label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                {CURRENCIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> Date Format
                            </label>
                            <select
                                value={dateFormat}
                                onChange={(e) => setDateFormat(e.target.value)}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                {DATE_FORMATS.map((f) => (
                                    <option key={f} value={f}>
                                        {f}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Globe className="h-4 w-4" /> Timezone
                            </label>
                            <select
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                {TIMEZONES.map((tz) => (
                                    <option key={tz} value={tz}>
                                        {tz}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleSavePreferences}
                        disabled={prefsSaving}
                        className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                        {prefsSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : prefsSaved ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {prefsSaved ? "Saved!" : "Save Preferences"}
                    </button>
                </section>

                {/* Theme Section */}
                <section className="rounded-lg border border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {theme === "dark" ? (
                                <Moon className="h-5 w-5 text-primary" />
                            ) : (
                                <Sun className="h-5 w-5 text-primary" />
                            )}
                            <div>
                                <h3 className="text-lg font-semibold">Theme</h3>
                                <p className="text-sm text-muted-foreground">
                                    Currently using {theme} mode
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                        >
                            Switch to {theme === "dark" ? "Light" : "Dark"}
                        </button>
                    </div>
                </section>

                {/* Data Export Section */}
                <section className="rounded-lg border border-border bg-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Download className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Export Data</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Download all your trades as a file for backup or analysis.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleExport("csv")}
                            disabled={exporting}
                            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
                        >
                            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                            Export CSV
                        </button>
                        <button
                            onClick={() => handleExport("json")}
                            disabled={exporting}
                            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
                        >
                            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                            Export JSON
                        </button>
                    </div>
                </section>

                {/* Account Section */}
                <section className="rounded-lg border border-border bg-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <LogOut className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Account</h3>
                    </div>
                    <div className="space-y-4">
                        <button
                            onClick={handleSignOut}
                            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="rounded-lg border border-destructive/50 bg-destructive/5 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="inline-flex items-center gap-2 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Account
                        </button>
                    ) : (
                        <div className="space-y-3 p-4 rounded-md border border-destructive/30 bg-destructive/10">
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                                <span className="font-semibold">Are you absolutely sure?</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Type <strong>DELETE</strong> to confirm:
                            </p>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="DELETE"
                                className="w-full rounded-md border border-destructive/30 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-destructive"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmText !== "DELETE" || deleting}
                                    className="inline-flex items-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    {deleting ? "Deleting..." : "Delete Forever"}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeleteConfirmText("");
                                    }}
                                    className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
