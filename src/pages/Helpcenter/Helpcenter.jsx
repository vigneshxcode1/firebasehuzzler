import React, { useState, useEffect } from "react";
import { IoChevronBack } from "react-icons/io5";

const HelpCenter = () => {
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    const handleToggle = (e) => setCollapsed(e.detail);
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "How do I create or delete my account?",
      answer:
        "To delete an account, log in, find 'Settings' or 'Account,' then look for 'Data & Privacy' or a similar option."
    },
    {
      question: "How is my personal data protected under the DPDPA Act?",
      answer:
        "Your data is protected through strict encryption, access control, and legal compliance."
    },
    {
      question: "Can I withdraw my consent for data processing?",
      answer: "Yes – via email or profile settings."
    },
    {
      question: "Who can see my freelancer or client profile?",
      answer:
        "Visibility depends on your privacy settings. It may be public, private, or restricted."
    },
    {
      question: "Are payments handled?",
      answer: "Currently, payments are not handled directly."
    },
    {
      question: "What should I do if I face an issue with another user?",
      answer:
        "You can lodge a report to our Grievance Officer for investigation."
    },
    {
      question: "Who can I contact for data or privacy concerns?",
      answer:
        "You may contact our Privacy Office or support team via the contact page."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500&display=swap');

        * {
          box-sizing: border-box;
        }

        .help-center-container {
          min-height: 100vh;
          background: #fdfdf6;
          padding: 40px 30px 60px;
          font-family: "Rubik", sans-serif;
          transition: margin-left 0.25s ease;
        }

        /* ---------- Header ---------- */
        .header-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 36px;
          font-weight: 400;
          line-height: 40px;
        }

        /* ---------- Title ---------- */
        .faq-title {
          margin-top: 60px;
          margin-bottom: 50px;
          text-align: center;
          font-size: 52px;
          font-weight: 400;
          line-height: 130%;
          letter-spacing: 0.5px;
          color:#000
        }

        /* ---------- FAQ List ---------- */
        .faq-list {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        /* ---------- QUESTION CONTAINER (FIGMA EXACT) ---------- */
        .faq-item {
          width: 700px;
          background: #fdfcea;
          border-radius: 28px;
          padding: 10px 18px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .faq-item:hover {
          background: #faf3c8;
        }

        .faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          height: 52px;
          font-size: 16px;
          font-weight: 400;
        }

        .faq-question p {
          margin: 0;
        }

        /* ---------- PLUS ICON ---------- */
        .plus-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.2px solid #b47bff;
          color: #b47bff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 500;
          flex-shrink: 0;
        }

        /* ---------- ANSWER ---------- */
        .faq-answer {
          margin-top: 10px;
          font-size: 14px;
          line-height: 1.6;
          color: #6b6b6b;
          padding-left: 6px;
          animation: fade 0.25s ease;
        }

        @keyframes fade {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ---------- MOBILE ---------- */
        @media (max-width: 768px) {
          .faq-item {
            width: 100%;
          }

          .faq-title {
            font-size: 34px;
          }

          .faq-question {
            font-size: 14px;
          }
        }
      `}</style>

      <div
        className="help-center-container"
        style={{ marginLeft: collapsed ? "-110px" : "50px" }}
      >
        <div className="header-row">
          <IoChevronBack size={26} />
          <span>Help Center</span>
        </div>

        <h1 className="faq-title">
          Frequently Asked
          <br />
          Questions
        </h1>

        <div className="faq-list">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="faq-item"
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <p>{item.question}</p>
                <div className="plus-icon">
                  {openIndex === index ? "−" : "+"}
                </div>
              </div>

              {openIndex === index && (
                <div className="faq-answer">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HelpCenter;
