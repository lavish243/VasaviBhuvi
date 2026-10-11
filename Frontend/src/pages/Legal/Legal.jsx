import PageHero from "../../components/PageHero/PageHero";
import "./Legal.css";

export const Privacy = () => (
  <main className="legal-page">
    <PageHero eyebrow="LEGAL" title="Privacy Policy" description="How Vasavi Bhuvi handles information shared through this website." />
    <section className="legal-content"><div className="container">
      <h2>Privacy Policy</h2>
      <p>We use information submitted through enquiry forms only to respond to project enquiries, arrange visits and provide requested information.</p>
      <p>We do not intentionally request sensitive personal information. Please avoid submitting passwords, financial credentials or other confidential information through this website.</p>
      <p>For questions about your submitted information, contact us using the details shown on the Contact page.</p>
    </div></section>
  </main>
);

export const Terms = () => (
  <main className="legal-page">
    <PageHero eyebrow="LEGAL" title="Terms & Conditions" description="General terms for using the Vasavi Bhuvi website." />
    <section className="legal-content"><div className="container">
      <h2>Terms &amp; Conditions</h2>
      <p>Website content is provided for general project information and is subject to change without notice.</p>
      <p>Images, plans, specifications, areas, availability, pricing and timelines should be verified with the project team before making a purchase decision.</p>
      <p>Use of this website indicates acceptance of these general terms.</p>
    </div></section>
  </main>
);
