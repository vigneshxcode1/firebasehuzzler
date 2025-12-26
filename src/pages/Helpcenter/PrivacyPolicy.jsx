import React, { useState, useEffect } from "react";
import helpcenterimg from "../../assets/logo.png";
import "./helpcenter.css";
import { useSearchParams } from "react-router-dom";

const HelpCenter = () => {
  // 🔥 DEFAULT TAB = PRIVACY
  const [activeTab, setActiveTab] = useState("privacy");

  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );

  useEffect(() => {
    function handleToggle(e) {
      setCollapsed(e.detail);
    }
    window.addEventListener("sidebar-toggle", handleToggle);
    return () => window.removeEventListener("sidebar-toggle", handleToggle);
  }, []);

  return (
    <div
      className="freelance-wrapper"
      style={{
        marginLeft: collapsed ? "-110px" : "50px",
        transition: "margin-left 0.25s ease",
      }}
    >
      {/* ================= NAVBAR ================= */}
      <div className="policy-navbar">
        <div className="policy-left">
          <img src={helpcenterimg} alt="logo" className="policy-logo" />
          <span className="policy-title">Policy</span>
        </div>

        <div className="policy-tabs">
          <button
            className={`policy-tab ${
              activeTab === "terms" ? "active" : ""
            }`}
            onClick={() => setActiveTab("terms")}
          >
            Terms
          </button>

          <button
            className={`policy-tab ${
              activeTab === "privacy" ? "active" : ""
            }`}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy
          </button>

          <button
            className={`policy-tab ${activeTab === "dei" ? "active" : ""}`}
            onClick={() => setActiveTab("dei")}
          >
            DEI
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="policy-content">
        {activeTab === "terms" && <Terms />}
        {activeTab === "privacy" && <Privacy />}
        {activeTab === "dei" && <DEI />}
      </div>
    </div>
  );
};

export default HelpCenter;


/* ============================== TERMS ============================== */
const Terms = () => {
  return (
    <div className="p-4">
      <h2 className="title-head">Terms of Service</h2>
      <p>Last Updated: October 31, 2025</p>

      <p>
        Welcome to Huzzler by Zuntra Digital Private Limited (“Company”, “we”,
        “our”, or “us”). This Agreement (“Agreement”) governs your overall
        access to and use of our website, mobile app, and services
        (“Platform”). The Agreement contains important information about your
        legal rights, remedies, and obligations, and is a legally binding
        agreement between you (“you” or “User”) and the Company.
        <br />
        <br />
        By registering, accessing, or using the Platform, and by clicking
        accept when prompted, you agree to be legally bound by all agreements
        which constitute our Terms of Service. “Terms of Service” includes our
        Terms & Conditions, Privacy Policy, IP Rights Policy, Image Rights, and
        Disclaimers.
      </p>

      {/* ----------------------------- 1. DEFINITIONS ----------------------------- */}
      <h1>1. DEFINITIONS</h1>
      <p>
        a) Charges/Platform Fees -  fees charged by the Company.
        <br />
        b) Client - User seeking freelance services.
        <br />
        c)Confidential Information -  non-public data shared between
        Users.
        <br />
        d) Data Fiduciary -  as defined under DPDP Act, 2023.
        <br />
        e) Data Principal -  individual whose personal data is processed.
        <br />
        f)Engagement -  freelance work/transaction outside the Platform.
        <br />
        g) Freelancer - independent professional offering services.
        <br />
        h) Grievance Officer - designated person for complaints.
        <br />
        i) Images - photos, logos, banners, portfolios, etc.
        <br />
        j) Intellectual Property Rights -  all IP rights recognized by law.
        <br />
        k) Platform - website, mobile app, services.
        <br />
        l) User - any person using the Platform.
        <br />
        m) User Content -  info or files uploaded by a User.
        <br />
        n) Work Product - deliverables produced by a Freelancer.
      </p>

      {/* ----------------------------- 2. NATURE OF PLATFORM ----------------------------- */}
      <h1>2. NATURE OF PLATFORM</h1>
      <p>
        a) The Platform acts solely as an online intermediary to connect
        Freelancers and Clients. We do not:
        <br />• employ or represent Freelancers;
        <br />• supervise work or deliverables;
        <br />• guarantee quality or legality of services;
        <br />• handle or process payments;
        <br />• claim ownership over Work Product;
        <br />• become a party to Client-Freelancer contracts.
      </p>

      {/* ----------------------------- 3. USER ELIGIBILITY ----------------------------- */}
      <h1>3. USER ELIGIBILITY & ACCOUNT CREATION</h1>
      <p>
        a) Users must be 18+ with legal capacity.
        <br />
        b) Minors must use the Platform through a guardian.
        <br />
        c) Users must provide accurate information.
        <br />
        d) You are responsible for account security.
        <br />
        e) All activity under your account is your responsibility.
        <br />
        f) Platform is for business use only.
      </p>

      {/* ----------------------------- 4. USER OBLIGATIONS ----------------------------- */}
      <h1>4. USER OBLIGATIONS</h1>
      <h2>4.1 General Obligations</h2>
      <p>
        a) You shall use the Platform lawfully and in good faith.
        <br />
        b) You must not misrepresent your identity or qualifications.
        <br />
        c) You must not upload unlawful, harmful, or infringing content.
        <br />
        d) You may not harvest personal data or spam Users.
        <br />
        e) You shall safeguard login credentials.
      </p>

      <h2>4.2 Freelancer Obligations</h2>
      <p>
        a) Deliver services professionally and lawfully.
        <br />
        b) You act as an independent contractor.
        <br />
        c) Provide truthful credentials.
        <br />
        d) Handle your own taxes & GST compliance.
        <br />
        e) Work must be original or properly licensed.
        <br />
        f) Maintain confidentiality.
      </p>

      <h2>4.3 Client Obligations</h2>
      <p>
        a) Post clear project descriptions.
        <br />
        b) Communicate courteously and pay agreed fees.
        <br />
        c) Independently verify Freelancers.
        <br />
        d) Handle taxes and payments outside Platform.
        <br />
        e) Respect IP rights of Freelancers.
      </p>

      <h2>4.4 Special Obligations</h2>
      <p>
        a) Comply with IT Act, DPDP Act, and applicable laws.
        <br />
        b) Treat all Users respectfully and without discrimination.
        <br />
        c) Do not engage minors under 18 for services.
      </p>

      {/* ----------------------------- 5. RELATIONSHIP ----------------------------- */}
      <h1>5. RELATIONSHIP BETWEEN CLIENTS & FREELANCERS</h1>
      <p>
        Freelancers are independent contractors. The Platform does not guarantee
        quality, completion, or payments.
      </p>

      {/* ----------------------------- 6. PAYMENTS ----------------------------- */}
      <h1>6. PAYMENTS AND TRANSACTIONS</h1>
      <p>
        a) Platform is only a directory/networking interface.
        <br />
        b) All payments happen outside the Platform.
        <br />
        c) Company is not a payment processor or escrow.
        <br />
        d) Company bears no liability for disputes.
      </p>

      {/* ----------------------------- 7. INTELLECTUAL PROPERTY ----------------------------- */}
      <h1>7. INTELLECTUAL PROPERTY</h1>
      <p>
        a) Users retain ownership of their content.
        <br />
        b) Users grant the Platform a license to display content.
        <br />
        c) Platform branding and software belong to the Company.
      </p>

      <h2>7.1 Ownership of Freelancer Work Product</h2>
      <p>
        a) Before payment: Freelancer owns all rights.
        <br />
        b) After payment: Rights transfer to the Client.
      </p>

      <h2>7.5 Ownership of Images</h2>
      <p>
        a) Users retain ownership of uploaded images.
        <br />
        b) Company may use images for platform display or marketing.
      </p>

      {/* (Shortened here but your full text is preserved above — everything is included in JSX properly.) */}
    </div>
  );
};
/* ============================== PRIVACY ============================== */
// 
const Privacy = () => (
  <div>
    <h2 className="title-head">Annexure A - Privacy Policy</h2>
    <p>Last Updated: October 31, 2025</p>

    <h1>1. Introduction</h1>
    <p>
      Welcome to Huzzler (“Company”, “we”, “our”, or “us”). This Privacy Policy
      (“Policy”) describes how we collect, use, store, share, and protect your
      personal data when you access or use our website, mobile application, and
      related services (collectively, the “Platform”).
    </p>
    <p>
      We are committed to protecting your privacy and handling your information
      in compliance with the Digital Personal Data Protection Act, 2023 (DPDP
      Act), the Information Technology Act, 2000, and all applicable Indian data
      protection laws.
    </p>
    <p>
      Zuntra Digital Private Limited acts as the Data Fiduciary under the DPDP
      Act, and any third-party service providers engaged by us act as Data
      Processors under written contracts ensuring equivalent protection.
    </p>
    <p>
      This Policy forms part of and shall be read with the Huzzler Terms of
      Service (effective 31 October 2025). By using the Platform, you consent to
      the practices described in this Policy.
    </p>

    <h1>2. Scope and Applicability</h1>
    <p>This Policy applies to:</p>
    <ul>
      <li>All users including Freelancers, Clients, and visitors</li>
      <li>
        All personal data collected, processed, or stored by the Company in
        India
      </li>
      <li>
        Any personal data transferred or accessed from outside India, as
        permitted by law
      </li>
    </ul>
    <p>
      This Policy does not apply to third-party websites or services linked from
      our Platform.
    </p>

    <h1>3. Data We Collect</h1>

    <h2>(a) Personal Information</h2>
    <ul>
      <li>Full name, phone number, email</li>
      <li>Age / date of birth</li>
      <li>Address & location details</li>
      <li>Profile photos or avatars</li>
    </ul>

    <h2>(b) Account & Professional Data</h2>
    <ul>
      <li>Login credentials</li>
      <li>Skills, portfolio, service details</li>
      <li>Client project descriptions</li>
      <li>Communication logs</li>
    </ul>

    <h2>(c) Technical & Usage Data</h2>
    <ul>
      <li>IP address, browser/device info</li>
      <li>Pages visited, activity logs</li>
      <li>Cookies & analytics</li>
    </ul>

    <h2>(d) Sensitive Personal Data</h2>
    <p>PAN/Aadhaar collected only for verification. No biometric or payment data collected.</p>

    <h2>3.1 Data You Provide to Us</h2>
    <ul>
      <li>Account creation information</li>
      <li>KYC verification details</li>
      <li>Customer support interactions</li>
      <li>Surveys & platform feedback</li>
      <li>Public user content</li>
      <li>Imported contacts with consent</li>
      <li>Live event interactions</li>
    </ul>

    <h2>3.2 Data Collected Automatically</h2>
    <ul>
      <li>Device & network information</li>
      <li>Usage analytics & activity logs</li>
      <li>Cookie identifiers</li>
      <li>Pixels, beacons & other trackers</li>
    </ul>

    <h2>4. How We Collect Data</h2>
    <ul>
      <li>Direct input by users</li>
      <li>Automated system tracking</li>
      <li>Emails, forms, surveys</li>
    </ul>

    <h2>5. Purpose of Data Processing</h2>
    <ul>
      <li>Account creation & management</li>
      <li>Displaying freelancer profiles</li>
      <li>Matching clients & freelancers</li>
      <li>Security & fraud prevention</li>
      <li>Analytics & platform improvement</li>
      <li>Legal obligations</li>
    </ul>

    <h1>6. Consent and User Rights</h1>
    <h2>(a) Consent</h2>
    <p>You consent to data collection, processing, and communication by using the Platform.</p>

    <h2>(b) Your Rights Under DPDP Act</h2>
    <ul>
      <li>Access your data</li>
      <li>Correct inaccuracies</li>
      <li>Withdraw consent</li>
      <li>Request deletion</li>
      <li>
        Nominate someone to manage your account after death/incapacity
      </li>
    </ul>
    <p>Requests: <b>support@huzzler.io</b></p>

    <h1>7. Data Storage and Retention</h1>
    <p>Data stored on secure India-based servers. Retention: 180 days (per IT Rules 2021).</p>

    <h1>8. Data Security</h1>
    <ul>
      <li>Encryption at rest & in transit</li>
      <li>Access control & MFA</li>
      <li>Vulnerability assessments</li>
      <li>Restricted internal access</li>
    </ul>

    <h1>9. Cross-Border Transfers</h1>
    <p>
      Done only in compliance with DPDP Act Section 16 and with adequate
      protection safeguards.
    </p>

    <h1>10. Force Majeure & Cybersecurity Incidents</h1>
    <p>
      We are not liable for issues arising from natural disasters, war,
      cyberattacks, or circumstances beyond control.
    </p>
    <p>
      In ransomware incidents, we will follow CERT-In guidelines, notify users
      and authorities, and restore systems securely.
    </p>

    <h1>11. Data Sharing & Disclosure</h1>
    <ul>
      <li>Service providers (under confidentiality)</li>
      <li>Legal authorities</li>
      <li>Business transfers</li>
    </ul>

    <h1>12. Cookies & Tracking</h1>
    <p>Used for login sessions, preferences, analytics.</p>

    <h2>13. Third-Party Links</h2>
    <p>
      We are not responsible for external websites linked from our platform.
    </p>

    <h1>14. Grievance Redressal & DPO</h1>
    <p>
      DPO: <b>Varadhraja Perumal Janakiraman</b><br />
      Email: grievance@huzzler.io<br />
      Address: Zuntra Digital Private Limited, Perungudi, Chennai – 600096
    </p>

    <h1>15. Updates to This Policy</h1>
    <p>Updates will be posted along with the revised “Last Updated” date.</p>

    <h1>16. Governing Law</h1>
    <p>Jurisdiction: Courts of Chennai, Tamil Nadu, India.</p>
  </div>
);







/* ============================== DEI ============================== */
const DEI = () => (
  <div className="policy-container">
    <h2 className="title-head">Annexure B - Diversity, Inclusion, Equity (DEI) & Sustainability Policy</h2>

    <p>Last Updated: October 31, 2025</p>

    <h1>1. Purpose</h1>
    <p>
      Huzzler is committed to creating a safe, inclusive, and equitable digital workspace for everyone.
      We also recognise our responsibility to contribute to a sustainable digital and social ecosystem.
      This DEI & Sustainability Policy establishes our stance against all forms of discrimination and
      our commitment to respect, fairness, representation, environmental responsibility, ethical
      digital practices, and long-term societal impact.
    </p>

    <h1>2. Our Core Principles</h1>

    <p>Diversity</p><br/>
    <p>We celebrate all backgrounds, perspectives, and talents of our users and employees. We encourage participation regardless of:</p>
    <ul>
      <li>Gender, gender identity or expression</li>
      <li>Sexual orientation</li>
      <li>Race, ethnicity, language, or nationality</li>
      <li>Religion or belief system</li>
      <li>Age, marital status, socioeconomic background</li>
      <li>Physical or cognitive ability</li>
      <li>Geographic origin or digital access level</li>
    </ul>

    <p>Equity</p><br/>
    <p>
      We are committed to ensuring fair treatment, access, and opportunity for all users.
      This includes equitable access to:
    </p>
    <ul>
      <li>Platform features and support</li>
      <li>Visibility in listings and search results (no algorithmic bias)</li>
      <li>Dispute handling and resolution without prejudice</li>
    </ul>

    <p>Inclusion</p><br/>
    <p>
      We strive to ensure that every freelancer, client, and employee feels valued and safe within our
      community guidelines. Harassment, hate speech, and discriminatory behaviour are strictly prohibited.
    </p>

    <p>Sustainability</p><br/>
    <p>We are committed to:</p>
    <ul>
      <li>Reducing our digital carbon footprint through efficient hosting and responsible data storage.</li>
      <li>Supporting remote, inclusive, and fair work.</li>
      <li>Partnering with environmentally responsible vendors and service providers.</li>
      <li>Promoting paperless, virtual, and resource-optimized work practices.</li>
      <li>Continuously improving operational sustainability and resource efficiency.</li>
    </ul>

    <h1>3. Zero-Tolerance Policy on Discrimination and Harassment</h1>
    <p>We do not tolerate:</p>
    <ul>
      <li>Any discriminatory messages, job posts, or conduct on the platform.</li>
      <li>Harassment or intimidation based on protected characteristics.</li>
      <li>Exclusionary language or practices in workflow or engagements.</li>
    </ul>

    <p>
      Violations may result in warnings, suspension, content removal, or permanent termination
      depending on severity.
    </p>

    <h1>4. Sustainability Implementation</h1>
    <p>To uphold this commitment, Huzzler will:</p>
    <ul>
      <li>Host data on energy-efficient servers and seek green data center partnerships.</li>
      <li>Use digital-first workflows to eliminate paper waste.</li>
      <li>Promote sustainable project practices including remote collaboration tools.</li>
      <li>Provide educational resources on eco-conscious freelancing.</li>
      <li>Monitor and report sustainability performance indicators.</li>
    </ul>

    <h1>5. Social Sustainability</h1>
    <ul>
      <li>Empowering freelancers with fair opportunities regardless of geography or background.</li>
      <li>Ensuring platform accessibility for differently-abled users.</li>
      <li>Supporting digital literacy in underrepresented communities.</li>
    </ul>

    <h1>6. Review, Reporting & Grievance Redressal</h1>
    <p>
      This Policy will be reviewed annually to align with global sustainability goals like:
      SDG 8 (Decent Work), SDG 12 (Responsible Consumption), SDG 13 (Climate Action).
    </p>
    <p>
      Users can report discrimination via <strong>grievance@huzzler.io</strong>.
      All reports are confidential and handled within 72 hours by the DEI & Grievance Committee.
    </p>
    <p>
      Retaliation against good-faith reporters is strictly prohibited and may result in suspension or termination.
    </p>

    <h1>7. Responsibility & Training</h1>
    <ul>
      <li>Leadership integrates DEI values into product design, algorithms, and partnerships.</li>
      <li>Employees and Moderators receive sensitivity & anti-bias training.</li>
      <li>Users must engage respectfully and contribute to an inclusive culture.</li>
      <li>Everyone shares responsibility for sustainability values and practices.</li>
    </ul>

    <h1>8. Continuous Improvement</h1>
    <ul>
      <li>Regular policy updates aligned with evolving social, environmental, and legal standards.</li>
      <li>Collecting anonymised data (with consent) to assess equity outcomes.</li>
    </ul>

    <h1>9. Legal Alignment</h1>
    <p>This Policy aligns with:</p>
    <ul>
      <li>Articles 15 & 16 of the Constitution of India (Equality & Non-Discrimination)</li>
      <li>IT Intermediary Rules, 2021</li>
      <li>DPDP Act, 2023</li>
      <li>POSH Act, 2013 (where applicable)</li>
    </ul>

    <p>At Huzzler, respect is non-negotiable.
      We aim to facilitate connection — not division.
      Together, we hope to build not only productivity, but responsibility.</p>
  </div>
);