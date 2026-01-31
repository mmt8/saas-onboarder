import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In - Product Tour",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
