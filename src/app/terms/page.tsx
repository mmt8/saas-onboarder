import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-40">
            <h1 className="text-4xl font-bold mb-4 font-fraunces">Terms of Service</h1>
            <p className="text-muted-foreground mb-12">Last updated: January 31, 2026</p>

            <div className="prose prose-slate max-w-none space-y-10 text-foreground/80">
                <section>
                    <h2 className="text-xl font-bold text-foreground">1. Agreement to Terms</h2>
                    <p>
                        These Terms of Service ("Terms") constitute a legally binding agreement between you and Product Tour ("we", "us", "our"), a company registered at Mariendorfer Damm 1, 12099 Berlin, Germany. By accessing or using Product Tour's services at producttour.app (the "Service"), you agree to be bound by these Terms.
                    </p>
                    <p>
                        If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">2. Description of Service</h2>
                    <p>
                        Product Tour provides a SaaS platform for creating interactive product tours and onboarding experiences. The Service allows you to:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Create and customize interactive product tours</li>
                        <li>Embed tours on your own websites and applications</li>
                        <li>Track tour engagement and analytics</li>
                        <li>Use AI-assisted content generation for tour steps</li>
                    </ul>
                    <p>
                        The specific features available to you depend on your subscription plan as described on our pricing page.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">3. Account Registration</h2>
                    <p>
                        To use the Service, you must register for an account. You agree to:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Provide accurate, current, and complete registration information</li>
                        <li>Maintain and promptly update your account information</li>
                        <li>Keep your password secure and confidential</li>
                        <li>Accept responsibility for all activities under your account</li>
                        <li>Notify us immediately of any unauthorized access</li>
                    </ul>
                    <p>
                        We reserve the right to suspend or terminate accounts that contain false information or violate these Terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">4. Payments and Billing</h2>
                    <p>
                        Certain features of the Service require a paid subscription. By subscribing to a paid plan:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>You authorize us to charge your payment method on a recurring basis</li>
                        <li>Subscriptions automatically renew unless canceled before the renewal date</li>
                        <li>All fees are exclusive of applicable taxes, which you are responsible for</li>
                        <li>We may change prices upon 30 days' notice; continued use constitutes acceptance</li>
                    </ul>
                    <p>
                        Payments are processed securely through Stripe. We do not store your full payment card details.
                    </p>
                    <h3 className="text-lg font-semibold text-foreground mt-4">Refunds</h3>
                    <p>
                        Subscription fees are generally non-refundable. However, if you are unsatisfied with the Service, please contact us within 14 days of your initial subscription, and we will consider your refund request on a case-by-case basis.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">5. Free Trial and Free Tier</h2>
                    <p>
                        We may offer free trials or a free tier with limited functionality. Free trials automatically convert to paid subscriptions unless canceled before the trial ends. Free tier accounts may be subject to usage limitations and may be terminated after extended periods of inactivity.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">6. Acceptable Use</h2>
                    <p>
                        You agree not to use the Service to:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Violate any applicable laws or regulations</li>
                        <li>Infringe upon intellectual property rights of others</li>
                        <li>Distribute malware, spam, or harmful content</li>
                        <li>Attempt to gain unauthorized access to our systems</li>
                        <li>Interfere with or disrupt the Service or other users</li>
                        <li>Collect user data without proper consent</li>
                        <li>Use the Service in a manner that could damage our reputation</li>
                    </ul>
                    <p>
                        We reserve the right to suspend or terminate access for violations of these terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">7. Intellectual Property</h2>
                    <h3 className="text-lg font-semibold text-foreground mt-4">Our Rights</h3>
                    <p>
                        Product Tour and its licensors own all rights, title, and interest in the Service, including all software, designs, trademarks, and documentation. These Terms do not grant you any rights to use our trademarks or branding.
                    </p>
                    <h3 className="text-lg font-semibold text-foreground mt-4">Your Content</h3>
                    <p>
                        You retain all rights to the content you create using the Service ("Your Content"). By using the Service, you grant us a limited license to host, store, and display Your Content solely to provide the Service to you. We do not claim ownership of Your Content.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">8. Cancellation and Termination</h2>
                    <h3 className="text-lg font-semibold text-foreground mt-4">Cancellation by You</h3>
                    <p>
                        You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period. You will retain access until then.
                    </p>
                    <h3 className="text-lg font-semibold text-foreground mt-4">Termination by Us</h3>
                    <p>
                        We may suspend or terminate your account immediately if you violate these Terms or engage in fraudulent activity. We may also terminate free accounts after 90 days of inactivity.
                    </p>
                    <h3 className="text-lg font-semibold text-foreground mt-4">Data Deletion</h3>
                    <p>
                        Upon termination, we will delete your data within 30 days, unless legally required to retain it. You may export your data before cancellation.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">9. Modifications to the Service</h2>
                    <p>
                        We reserve the right to modify, suspend, or discontinue any part of the Service at any time. We will provide reasonable notice for material changes that negatively affect your use of the Service. Continued use after changes constitutes acceptance.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">10. Limitation of Liability</h2>
                    <p>
                        To the maximum extent permitted by applicable law:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>We are not liable for indirect, incidental, special, consequential, or punitive damages</li>
                        <li>Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim</li>
                        <li>We are not liable for any loss of data, profits, or business opportunities</li>
                    </ul>
                    <p>
                        These limitations do not apply to liability for intent or gross negligence under German law.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">11. Disclaimer of Warranties</h2>
                    <p>
                        The Service is provided "as is" and "as available" without warranties of any kind, whether express or implied. We do not warrant that the Service will be uninterrupted, error-free, or completely secure. You use the Service at your own risk.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">12. Indemnification</h2>
                    <p>
                        You agree to indemnify and hold harmless Product Tour and its officers, employees, and agents from any claims, damages, or expenses arising from your use of the Service, your violation of these Terms, or your violation of any third-party rights.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">13. Governing Law and Dispute Resolution</h2>
                    <p>
                        These Terms are governed by the laws of the Federal Republic of Germany. Any disputes arising from these Terms shall be resolved exclusively by the courts of Berlin, Germany.
                    </p>
                    <p>
                        For EU consumers: You may also use the European Online Dispute Resolution platform at <a href="https://ec.europa.eu/consumers/odr" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">14. Changes to These Terms</h2>
                    <p>
                        We may update these Terms from time to time. We will notify you of material changes by email or through the Service. Your continued use after such notice constitutes acceptance of the updated Terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">15. Contact</h2>
                    <p>
                        For questions about these Terms, please contact us at:
                    </p>
                    <p>
                        Product Tour<br />
                        Mariendorfer Damm 1<br />
                        12099 Berlin, Germany<br />
                        Email: <a href="mailto:mehmet@producttour.app" className="text-primary hover:underline">mehmet@producttour.app</a>
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
