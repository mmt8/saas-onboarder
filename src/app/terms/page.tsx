import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 pb-40">
            <h1 className="text-4xl font-bold mb-8 font-fraunces">Terms and Conditions</h1>

            <div className="prose prose-slate max-w-none space-y-8 text-foreground/80">
                <section>
                    <h2 className="text-xl font-bold text-foreground">1. Scope of Application</h2>
                    <p>
                        These General Terms and Conditions (GTC) apply to all contracts regarding the use of the Product Tour software between Product Tour and its customers.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">2. Scope of Services</h2>
                    <p>
                        Product Tour provides a SaaS solution for the creation of interactive product tours. The exact scope of services is based on the respective product description on the website.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">3. Registration and Conclusion of Contract</h2>
                    <p>
                        The use of Product Tour requires registration. By completing the registration, the customer makes an offer to conclude a usage contract. Product Tour accepts this offer by activating the account.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">4. Obligations of the Customer</h2>
                    <p>
                        The customer is obliged to keep the access data secret and to protect it from access by third parties. He may only use the software in accordance with applicable law.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">5. Liability</h2>
                    <p>
                        Product Tour is liable without limitation for intent and gross negligence. In the case of slight negligence, Product Tour is only liable for the breach of an essential contractual obligation.
                    </p>
                </section>

                <div className="pt-8 border-t border-border">
                    <Link href="/" className="text-primary hover:underline font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
