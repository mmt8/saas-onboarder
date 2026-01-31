import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-40">
            <h1 className="text-4xl font-bold mb-4 font-fraunces">Privacy Policy</h1>
            <p className="text-muted-foreground mb-12">Last updated: January 31, 2026</p>

            <div className="prose prose-slate max-w-none space-y-10 text-foreground/80">
                <section>
                    <h2 className="text-xl font-bold text-foreground">1. Introduction</h2>
                    <p>
                        This Privacy Policy explains how Product Tour ("we", "us", "our") collects, uses, and protects your personal data when you use our website and services at producttour.app. We are committed to protecting your privacy in accordance with the General Data Protection Regulation (GDPR) and German data protection laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">2. Data Controller</h2>
                    <p>
                        The data controller responsible for your personal data is:
                    </p>
                    <p>
                        Product Tour<br />
                        Mariendorfer Damm 1<br />
                        12099 Berlin, Germany<br />
                        Managing Director: Mehmet Perk<br />
                        Email: <a href="mailto:mehmet@producttour.app" className="text-primary hover:underline">mehmet@producttour.app</a>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">3. Data We Collect</h2>

                    <h3 className="text-lg font-semibold text-foreground mt-4">Account Data</h3>
                    <p>When you register for an account, we collect:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Email address</li>
                        <li>Password (encrypted)</li>
                        <li>Profile information you provide</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-foreground mt-4">Usage Data</h3>
                    <p>When you use our Service, we automatically collect:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>IP address</li>
                        <li>Browser type and version</li>
                        <li>Operating system</li>
                        <li>Referrer URL</li>
                        <li>Pages visited and actions taken</li>
                        <li>Date and time of access</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-foreground mt-4">End-User Data</h3>
                    <p>
                        When your website visitors interact with Product Tour widgets embedded on your site, we collect anonymized session data to provide analytics. We do not collect personally identifiable information from your end users unless you configure the widget to do so.
                    </p>

                    <h3 className="text-lg font-semibold text-foreground mt-4">Payment Data</h3>
                    <p>
                        Payment information is processed directly by our payment processor, Stripe. We do not store your full credit card number. We receive only the last four digits for reference purposes.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">4. How We Use Your Data</h2>
                    <p>We process your personal data for the following purposes:</p>

                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Purpose</th>
                                    <th className="text-left py-2 font-semibold text-foreground">Legal Basis (GDPR)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                <tr>
                                    <td className="py-2 pr-4">Providing the Service</td>
                                    <td className="py-2">Art. 6(1)(b) – Contract performance</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">Account management</td>
                                    <td className="py-2">Art. 6(1)(b) – Contract performance</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">Processing payments</td>
                                    <td className="py-2">Art. 6(1)(b) – Contract performance</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">Service improvements</td>
                                    <td className="py-2">Art. 6(1)(f) – Legitimate interest</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">Security and fraud prevention</td>
                                    <td className="py-2">Art. 6(1)(f) – Legitimate interest</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4">Legal compliance</td>
                                    <td className="py-2">Art. 6(1)(c) – Legal obligation</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">5. Sub-Processors and Third Parties</h2>
                    <p>
                        We use the following third-party service providers (sub-processors) to operate our Service. Each has been selected for their commitment to data protection:
                    </p>

                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Service</th>
                                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Purpose</th>
                                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Data Processed</th>
                                    <th className="text-left py-2 font-semibold text-foreground">Location</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                <tr>
                                    <td className="py-2 pr-4 font-medium">Supabase</td>
                                    <td className="py-2 pr-4">Database, Authentication, Storage</td>
                                    <td className="py-2 pr-4">Account data, Tour content</td>
                                    <td className="py-2">EU region</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4 font-medium">Vercel</td>
                                    <td className="py-2 pr-4">Web hosting, CDN</td>
                                    <td className="py-2 pr-4">IP address, Access logs</td>
                                    <td className="py-2">EU/US</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4 font-medium">Stripe</td>
                                    <td className="py-2 pr-4">Payment processing</td>
                                    <td className="py-2 pr-4">Payment details, Billing address</td>
                                    <td className="py-2">EU/US</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4 font-medium">Resend</td>
                                    <td className="py-2 pr-4">Transactional email</td>
                                    <td className="py-2 pr-4">Email address</td>
                                    <td className="py-2">US</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4 font-medium">OpenAI</td>
                                    <td className="py-2 pr-4">AI content generation</td>
                                    <td className="py-2 pr-4">Tour step text (no PII)</td>
                                    <td className="py-2">US</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-4">
                        All sub-processors are bound by data processing agreements and are required to implement appropriate security measures.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">6. International Data Transfers</h2>
                    <p>
                        Some of our sub-processors are located in the United States. For transfers of personal data outside the European Economic Area (EEA), we rely on:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                        <li>The EU-U.S. Data Privacy Framework, where applicable</li>
                    </ul>
                    <p className="mt-2">
                        These mechanisms ensure that your data receives adequate protection as required by GDPR.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">7. Data Retention</h2>
                    <p>We retain your personal data for as long as necessary to fulfill the purposes described in this policy:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Account data:</strong> Until you delete your account</li>
                        <li><strong>Usage logs:</strong> 90 days</li>
                        <li><strong>Payment records:</strong> 10 years (German tax law requirement)</li>
                        <li><strong>Backup copies:</strong> Deleted within 30 days of primary data deletion</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">8. Data Security</h2>
                    <p>We implement appropriate technical and organizational measures to protect your data:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Encryption in transit (TLS 1.3) and at rest</li>
                        <li>Secure authentication with hashed passwords</li>
                        <li>Regular security assessments</li>
                        <li>Access controls and audit logging</li>
                        <li>Data center security (ISO 27001 certified providers)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">9. Your Rights (GDPR)</h2>
                    <p>Under the GDPR, you have the following rights regarding your personal data:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Right of access:</strong> Request a copy of your personal data</li>
                        <li><strong>Right to rectification:</strong> Correct inaccurate or incomplete data</li>
                        <li><strong>Right to erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                        <li><strong>Right to restrict processing:</strong> Limit how we use your data</li>
                        <li><strong>Right to data portability:</strong> Receive your data in a machine-readable format</li>
                        <li><strong>Right to object:</strong> Object to processing based on legitimate interests</li>
                        <li><strong>Right to withdraw consent:</strong> Where processing is based on consent</li>
                    </ul>
                    <p className="mt-4">
                        To exercise these rights, contact us at <a href="mailto:mehmet@producttour.app" className="text-primary hover:underline">mehmet@producttour.app</a>. We will respond within 30 days.
                    </p>
                    <p className="mt-4">
                        You also have the right to lodge a complaint with the Berlin data protection authority:<br />
                        Berliner Beauftragte für Datenschutz und Informationsfreiheit<br />
                        Alt-Moabit 59-61, 10555 Berlin<br />
                        <a href="https://www.datenschutz-berlin.de" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.datenschutz-berlin.de</a>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">10. Cookies</h2>
                    <p>
                        We use cookies to provide essential functionality. Our cookies include:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Authentication cookies:</strong> Keep you logged in (essential)</li>
                        <li><strong>Session cookies:</strong> Maintain your session state (essential)</li>
                    </ul>
                    <p className="mt-2">
                        We do not use third-party tracking cookies or advertising cookies.
                    </p>
                </section>

                <section id="dpa">
                    <h2 className="text-xl font-bold text-foreground">11. Data Processing Addendum (DPA)</h2>
                    <p>
                        If you are a business customer (B2B) using Product Tour to process personal data of your own users, we act as a data processor on your behalf under Article 28 GDPR.
                    </p>

                    <h3 className="text-lg font-semibold text-foreground mt-4">Scope of Processing</h3>
                    <p>
                        As your data processor, we process end-user data solely to provide the Product Tour service to you. This includes displaying product tours, tracking tour completion, and providing analytics.
                    </p>

                    <h3 className="text-lg font-semibold text-foreground mt-4">Our Obligations</h3>
                    <p>As a data processor, we commit to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Process data only on your documented instructions</li>
                        <li>Ensure persons authorized to process data are bound by confidentiality</li>
                        <li>Implement appropriate technical and organizational security measures</li>
                        <li>Assist you in responding to data subject requests</li>
                        <li>Assist you with data breach notifications when required</li>
                        <li>Delete or return all personal data upon termination of the contract</li>
                        <li>Make available information necessary to demonstrate compliance</li>
                        <li>Only engage sub-processors with your prior authorization (see Section 5)</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-foreground mt-4">Your Obligations</h3>
                    <p>As the data controller, you are responsible for:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Ensuring you have a lawful basis to collect end-user data</li>
                        <li>Providing appropriate privacy notices to your end users</li>
                        <li>Responding to data subject requests from your end users</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-foreground mt-4">Standard Contractual Clauses</h3>
                    <p>
                        For transfers to sub-processors outside the EEA, we incorporate the EU Standard Contractual Clauses (Module 3: Processor to Sub-processor) into our agreements.
                    </p>

                    <p className="mt-4">
                        By using Product Tour as a business customer, you agree to this Data Processing Addendum. For a signed copy or customized DPA, please contact <a href="mailto:mehmet@producttour.app" className="text-primary hover:underline">mehmet@producttour.app</a>.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">12. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through the Service. The "Last updated" date at the top indicates when this policy was last revised.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">13. Contact Us</h2>
                    <p>
                        For questions about this Privacy Policy or to exercise your data protection rights, please contact us:
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
