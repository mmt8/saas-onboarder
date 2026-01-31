import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reset Password - Product Tour",
};

export default function ResetPasswordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
