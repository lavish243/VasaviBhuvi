import { useState } from "react";
import { Plus, Minus, ArrowRight } from "lucide-react";

import faqData from "../../data/faqData";
import "./FAQ.css";

const FAQ = () => {
  const [openId, setOpenId] = useState(1);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="faq-layout">
          {/* Left */}
          <div className="faq-intro">
            <span className="section-eyebrow">FAQ</span>

            <h2>
              Frequently Asked
              <span> Questions</span>
            </h2>

            <p>
              Find answers to the most common questions about Vasavi Bhuvi,
              including its location, configurations, brochure and possession
              information.
            </p>

            <a href="#enquiry" className="faq-enquiry-link">
              Have More Questions?
              <ArrowRight size={17} />
            </a>
          </div>

          {/* Right */}
          <div className="faq-list">
            {faqData.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  className={`faq-item ${isOpen ? "open" : ""}`}
                  key={faq.id}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFAQ(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span>
                      <small>{String(faq.id).padStart(2, "0")}</small>

                      {faq.question}
                    </span>

                    <div className="faq-icon">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </button>

                  <div
                    className={`faq-answer ${isOpen ? "faq-answer-open" : ""}`}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
