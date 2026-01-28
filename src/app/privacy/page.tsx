import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-40">
            <h1 className="text-4xl font-bold mb-8 font-fraunces">Privacy Policy</h1>

            <div className="prose prose-slate max-w-none space-y-8 text-foreground/80">
                <section>
                    <h2 className="text-xl font-bold text-foreground">1. Data Protection at a Glance</h2>
                    <h3 className="text-lg font-semibold text-foreground mt-4">General Information</h3>
                    <p>
                        The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data that can be used to identify you personally.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">2. Responsible Party</h2>
                    <p>
                        The party responsible for data processing on this website is:<br />
                        Product Tour<br />
                        Mariendorfer Damm 1<br />
                        12099 Berlin<br />
                        E-Mail: mehmet@producttour.app
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">3. Data Collection on this Website</h2>
                    <h3 className="text-lg font-semibold text-foreground mt-4">Cookies</h3>
                    <p>
                        Our website uses cookies. These are small text files that your web browser stores on your device. Cookies help us make our website more user-friendly, effective, and secure.
                    </p>
                    <h3 className="text-lg font-semibold text-foreground mt-4">Server Log Files</h3>
                    <p>
                        The provider of the pages automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. These are:
                    </p>
                    <ul className="list-disc pl-6">
                        <li>Browser type and browser version</li>
                        <li>Operating system used</li>
                        <li>Referrer URL</li>
                        <li>Hostname of the accessing computer</li>
                        <li>Time of the server request</li>
                        <li>IP address</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">4. Analysis Tools and Third-Party Tools</h2>
                    <h3 className="text-lg font-semibold text-foreground mt-4">Supabase</h3>
                    <p>
                        We use Supabase for authentication and database management. Data is processed on Supabase's servers (in the cloud). Usage is based on Art. 6 Para. 1 lit. f GDPR (DSGVO).
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">5. Your Rights</h2>
                    <p>
                        You have the right at any time to receive information free of charge about the origin, recipient, and purpose of your stored personal data. You also have a right to request the correction or deletion of this data.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">6. Data Processing Agreement (DPA)</h2>
                    <p>
                        If you use Product Tour as a business customer (B2B) and process personal data of your own users using our service, a Data Processing Agreement (DPA) according to Art. 28 GDPR is required. We provide a standardized DPA that outlines our commitment to protecting your users' data and our responsibilities as a data processor. Please contact us at mehmet@producttour.app to receive a copy of our DPA.
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
