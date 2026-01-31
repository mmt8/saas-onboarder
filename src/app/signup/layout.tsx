import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up - Product Tour",
};

export default function SignupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
