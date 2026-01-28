import Link from "next/link";

export default function ImpressumPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
            <h1 className="text-4xl font-bold mb-8 font-fraunces">Legal Notice (Impressum)</h1>

            <div className="prose prose-slate max-w-none space-y-8 text-foreground/80">
                <section>
                    <h2 className="text-xl font-bold text-foreground">Information according to § 5 TMG</h2>
                    <p>
                        Product Tour<br />
                        Mariendorfer Damm 1<br />
                        12099 Berlin<br />
                        Germany
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">Represented by</h2>
                    <p>Mehmet Perk</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">Contact</h2>
                    <p>
                        E-Mail: mehmet@producttour.app
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">EU Dispute Resolution</h2>
                    <p>
                        The European Commission provides a platform for online dispute resolution (ODR):
                        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                            https://ec.europa.eu/consumers/odr/
                        </a>.<br />
                        Our e-mail address can be found above in the legal notice.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground">Consumer Dispute Resolution</h2>
                    <p>
                        We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
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
