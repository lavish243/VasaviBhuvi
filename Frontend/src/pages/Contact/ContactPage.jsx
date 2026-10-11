import PageHero from "../../components/PageHero/PageHero";
import Enquiry from "../../components/Enquiry/Enquiry";
import Contact from "../../components/Contact/Contact";
import Location from "../../components/Location/Location";

const ContactPage = () => {
  return (
    <main className="inner-page">
      <PageHero
        eyebrow="CONTACT US"
        title="Let's Connect"
        description="Get in touch with the Vasavi Bhuvi team."
      />

      <Enquiry />

      <Contact />

      <Location />
    </main>
  );
};

export default ContactPage;
