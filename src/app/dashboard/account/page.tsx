"use client";

import { useEffect, useState } from "react";
import { useTourStore } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { User, Building, Globe, Mail, Save, Loader2 } from "lucide-react";

const COUNTRIES = [
    "United States", "Germany", "United Kingdom", "France", "Canada",
    "Australia", "Netherlands", "Spain", "Italy", "Sweden", "Switzerland",
    "Austria", "Belgium", "Denmark", "Finland", "Ireland", "Norway", "Poland",
    "Portugal", "Brazil", "Mexico", "Japan", "South Korea", "Singapore",
    "India", "Other"
];

export default function AccountPage() {
    const { user, profile, fetchProfile, updateProfile, isLoading } = useTourStore();

    const [fullName, setFullName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [country, setCountry] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (profile) {
            setFullName(profile.fullName || "");
            setCompanyName(profile.companyName || "");
            setCountry(profile.country || "");
        }
    }, [profile]);

    const handleSave = async () => {
        setIsSaving(true);
        await updateProfile({
            fullName,
            companyName,
            country
        });
        setIsSaving(false);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-fraunces mb-2">Account Settings</h1>
                <p className="text-muted-foreground">
                    Manage your personal information and preferences
                </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <div className="space-y-6">
                    {/* Email (Read-only) */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                            <Mail className="w-4 h-4 text-primary" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="w-full h-12 px-4 bg-secondary/50 border border-border rounded-xl text-muted-foreground cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Email cannot be changed
                        </p>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                            <User className="w-4 h-4 text-primary" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full h-12 px-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>

                    {/* Company Name */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                            <Building className="w-4 h-4 text-primary" />
                            Company Name
                        </label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Acme Inc."
                            className="w-full h-12 px-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>

                    {/* Country */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                            <Globe className="w-4 h-4 text-primary" />
                            Country
                        </label>
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full h-12 px-4 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Select a country</option>
                            {COUNTRIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full h-12 gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
