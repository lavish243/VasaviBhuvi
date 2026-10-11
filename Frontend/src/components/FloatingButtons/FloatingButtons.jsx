import { Phone, MessageCircle, ArrowUp } from "lucide-react";
import siteConfig from "../../config/siteConfig";
import "./FloatingButtons.css";

const FloatingButtons = () => {
  const phone = siteConfig.contact.phone.replace(/[^\d+]/g, "");
  const whatsapp = siteConfig.contact.whatsapp.replace(/\D/g, "");
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="floating-buttons">
      <a href={`tel:${phone}`} className="floating-button floating-call" aria-label="Call Vasavi Bhuvi"><Phone size={19} /><span>Call</span></a>
      <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="floating-button floating-whatsapp" aria-label="WhatsApp Vasavi Bhuvi"><MessageCircle size={20} /><span>WhatsApp</span></a>
      <button type="button" className="floating-button floating-top" onClick={scrollToTop} aria-label="Scroll to top"><ArrowUp size={19} /></button>
    </div>
  );
};
export default FloatingButtons;
