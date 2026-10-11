import { useState } from "react";
import { ArrowUpRight, Check, Mail, MapPin, Phone } from "lucide-react";
import siteConfig from "../../config/siteConfig";
import apiClient from "../../api/apiClient";

import "./Contact.css";

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  configuration: "",
  message: "",
};

const Contact = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      await apiClient.post("/Enquiries", {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        configuration: formData.configuration,
        message: formData.message.trim() || null,
      });

      setFormData(initialFormData);
      setSubmitted(true);
    } catch (err) {
      console.error("Enquiry submission failed:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.title ||
          "Unable to submit your enquiry. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-heading">
          <span className="contact-eyebrow">GET IN TOUCH</span>

          <h2>
            Take the next step
            <br />
            <span>towards your new home.</span>
          </h2>

          <p>
            Share your details and our project team will get in touch with you
            to provide availability, pricing and project information.
          </p>
        </div>

        <div className="contact-main">
          <div className="contact-information">
            <div className="contact-info-intro">
              <span>PROJECT ENQUIRY</span>

              <h3>
                Let's start
                <br />a conversation.
              </h3>
            </div>

            <div className="contact-details">
              <a
                href={`tel:${siteConfig.contact.phone.replace(/[^\d+]/g, "")}`}
                className="contact-detail"
              >
                <div className="contact-detail-icon">
                  <Phone size={19} />
                </div>

                <div>
                  <span>CALL US</span>
                  <strong>{siteConfig.contact.phone}</strong>
                </div>

                <ArrowUpRight size={17} />
              </a>

              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="contact-detail"
              >
                <div className="contact-detail-icon">
                  <Mail size={19} />
                </div>

                <div>
                  <span>EMAIL US</span>
                  <strong>{siteConfig.contact.email}</strong>
                </div>

                <ArrowUpRight size={17} />
              </a>

              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <MapPin size={19} />
                </div>

                <div>
                  <span>PROJECT LOCATION</span>
                  <strong>Hyderabad, Telangana</strong>
                </div>
              </div>
            </div>

            <div className="contact-note">
              <span>VISIT THE PROJECT</span>

              <p>
                Contact our team to schedule a site visit and learn more about
                the project.
              </p>
            </div>
          </div>

          <div className="contact-form-card">
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success-icon">
                  <Check size={26} />
                </div>

                <h3>Thank you.</h3>

                <p>
                  Your enquiry has been submitted successfully. Our team will
                  contact you shortly.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setError("");
                  }}
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-header">
                  <span>ENQUIRE NOW</span>

                  <h3>Tell us how we can help.</h3>
                </div>

                <div className="contact-form-grid">
                  <div className="contact-field">
                    <label htmlFor="name">Full Name</label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="contact-field">
                    <label htmlFor="phone">Phone Number</label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={20}
                      required
                    />
                  </div>

                  <div className="contact-field full">
                    <label htmlFor="email">Email Address</label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      maxLength={256}
                    />
                  </div>

                  <div className="contact-field full">
                    <label htmlFor="configuration">
                      Preferred Configuration
                    </label>

                    <select
                      id="configuration"
                      name="configuration"
                      value={formData.configuration}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select configuration</option>
                      <option value="2-bhk">2 BHK</option>
                      <option value="2-5-bhk">2.5 BHK</option>
                      <option value="3-bhk">3 BHK</option>
                    </select>
                  </div>

                  <div className="contact-field full">
                    <label htmlFor="message">Message</label>

                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      placeholder="Tell us what you would like to know..."
                      value={formData.message}
                      onChange={handleChange}
                      maxLength={2000}
                    />
                  </div>
                </div>

                {error && (
                  <p role="alert" className="contact-error">
                    {error}
                  </p>
                )}

                <div className="contact-form-bottom">
                  <p>
                    By submitting this form, you agree to be contacted regarding
                    the project.
                  </p>

                  <button
                    type="submit"
                    className="contact-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Enquiry"}

                    {!isSubmitting && <ArrowUpRight size={18} />}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
