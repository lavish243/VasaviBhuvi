import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import apiClient from "../../api/apiClient";
import siteConfig from "../../config/siteConfig";
import "./Enquiry.css";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  configuration: "",
  message: "",
};

const Enquiry = () => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setApiError("");
    setSubmitted(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number.";
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.configuration) {
      newErrors.configuration = "Please select a configuration.";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setApiError("");

    try {
      await apiClient.post("/Enquiries", {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        configuration: formData.configuration,
        message: formData.message.trim(),
      });

      setSubmitted(true);
      setErrors({});
      setFormData(initialForm);
    } catch (error) {
      console.error("Enquiry submission failed:", error);

      setApiError(
        error.response?.data?.message ||
          error.response?.data?.title ||
          "Unable to submit your enquiry. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="enquiry section" id="enquiry">
      <div className="container">
        <div className="enquiry-wrapper">
          <div className="enquiry-content">
            <span className="section-eyebrow">ENQUIRE NOW</span>

            <h2>
              Find Your
              <br />
              New Address
            </h2>

            <p>
              Share your details and our team will get in touch with you to help
              you explore Vasavi Bhuvi.
            </p>

            <div className="enquiry-contact-info">
              <div className="enquiry-contact-item">
                <div className="enquiry-contact-icon">
                  <Phone size={18} />
                </div>
                <div>
                  <span>CALL US</span>
                  <strong>{siteConfig.contact.phone}</strong>
                </div>
              </div>

              <div className="enquiry-contact-item">
                <div className="enquiry-contact-icon">
                  <Mail size={18} />
                </div>
                <div>
                  <span>EMAIL US</span>
                  <strong>{siteConfig.contact.email}</strong>
                </div>
              </div>

              <div className="enquiry-contact-item">
                <div className="enquiry-contact-icon">
                  <MapPin size={18} />
                </div>
                <div>
                  <span>LOCATION</span>
                  <strong>Kompally, Hyderabad</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="enquiry-form-wrapper">
            {submitted ? (
              <div className="enquiry-success">
                <div className="enquiry-success-icon">
                  <CheckCircle2 size={48} />
                </div>

                <h3>Thank You for Your Enquiry</h3>

                <p>
                  Your enquiry has been saved successfully. Our team will get in
                  touch with you shortly.
                </p>

                <button
                  type="button"
                  className="enquiry-reset"
                  onClick={() => setSubmitted(false)}
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
                <div className="enquiry-form-header">
                  <span>GET IN TOUCH</span>
                  <h3>Request a Callback</h3>
                </div>

                <div className="enquiry-form-grid">
                  <div className="enquiry-field">
                    <label htmlFor="enquiry-name">Full Name</label>

                    <div className="enquiry-input-wrapper">
                      <User size={17} />
                      <input
                        id="enquiry-name"
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    {errors.name && <small>{errors.name}</small>}
                  </div>

                  <div className="enquiry-field">
                    <label htmlFor="enquiry-phone">Phone Number</label>

                    <div className="enquiry-input-wrapper">
                      <Phone size={17} />
                      <input
                        id="enquiry-phone"
                        type="tel"
                        name="phone"
                        placeholder="Enter 10-digit number"
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    {errors.phone && <small>{errors.phone}</small>}
                  </div>

                  <div className="enquiry-field">
                    <label htmlFor="enquiry-email">Email Address</label>

                    <div className="enquiry-input-wrapper">
                      <Mail size={17} />
                      <input
                        id="enquiry-email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    {errors.email && <small>{errors.email}</small>}
                  </div>

                  <div className="enquiry-field">
                    <label htmlFor="enquiry-configuration">Configuration</label>

                    <select
                      id="enquiry-configuration"
                      name="configuration"
                      value={formData.configuration}
                      onChange={handleChange}
                    >
                      <option value="">Select configuration</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="2.5 BHK">2.5 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                    </select>

                    {errors.configuration && (
                      <small>{errors.configuration}</small>
                    )}
                  </div>

                  <div className="enquiry-field enquiry-field-full">
                    <label htmlFor="enquiry-message">Message</label>

                    <textarea
                      id="enquiry-message"
                      name="message"
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {apiError && (
                  <p className="enquiry-api-error" role="alert">
                    {apiError}
                  </p>
                )}

                <button
                  type="submit"
                  className="enquiry-submit"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Enquiry"}
                  {!submitting && <ArrowRight size={17} />}
                </button>

                <p className="enquiry-note">
                  By submitting this form, you agree to be contacted regarding
                  Vasavi Bhuvi.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Enquiry;
