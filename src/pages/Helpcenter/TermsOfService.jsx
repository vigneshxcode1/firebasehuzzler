import React, { useState } from "react";
import helpcenterimg from "../../assets/logo.png";
import "./Helpcenter.css";

const HelpCenter = () => {
  const [activeTab, setActiveTab] = useState("terms");

  return (
    <div className="freelance-wrapper">
      {/* ================= NAVBAR ================= */}
      <div className="policy-navbar">
        <div className="policy-navbar-inner">
          <div className="policy-left">
            <img src={helpcenterimg} alt="logo" className="policy-logo" />
            <span className="policy-title">Policy</span>
          </div>

          <div className="policy-tabs">
            <button
              className={`policy-tab ${activeTab === "terms" ? "active" : ""}`}
              onClick={() => setActiveTab("terms")}
            >
              Terms
            </button>

            <button
              className={`policy-tab ${activeTab === "privacy" ? "active" : ""}`}
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
      <h2 className="title-head" >Terms of Service</h2>
      <br />

      <p>Last Updated: October 31, 2025</p>
      <br />
      <br />
      <p>
        Welcome to Huzzler by Zuntra Digital Private Limited ("Company", "we", "our", or "us").
        This Agreement ("Agreement") governs your overall access to and use of our website, mobile app, and services ("Platform"). The Agreement contains important information about your legal rights, remedies, and obligations, and is a legally binding agreement between you ("you" or "User") and the Company.
        By registering, accessing, or using the Platform, and by clicking accept when prompted on the Platform, you ("User", "Client", or "Freelancer") agree to be legally bound by all agreements which constitutes our Terms of Service. "Terms of Service" means every agreement linked herein and includes our Terms & Conditions, Privacy Policy, IP Rights Policy, Image Rights, and Disclaimers. You affirm that you: (i) have read and understood this Agreement; (ii) consent to be bound by it; and (iii) have legally sufficient capacity to contract under the Indian Contract Act, 1872.You should read all of our terms carefully because you are promising not to break any agreements in the Terms of Service. If you do not agree, please discontinue use of the Platform immediately. If you are using our Services on behalf of a business or legal entity, you may only do so if you have authority to agree to the Terms of Service on behalf of that business or legal entity.
        If you are using the Platform on behalf of a business entity, you represent and warrant that you are authorised to bind that business to this Agreement, and references to "you" will include that entity.
      </p>
      <br />

      {/* ----------------------------- 1. DEFINITIONS ----------------------------- */}
      <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>1. DEFINITIONS</h1>
      <br />
      <p>


        a)	“Charges/Platform Fees” means any fees charged by the Company for use of the Platform or premium features, if and when applicable and publicly notified.

        <br />
        b)	“Client” means any User (individual or entity) seeking freelance services or posting requirements on the Platform.

        <br />c)	“Confidential Information” means non-public information disclosed by one User to another (or to the Company) that is marked confidential or would reasonably be considered confidential by its nature (including business, technical, financial, or personal data), but excluding information that is publicly available without breach, independently developed, or lawfully obtained from a third party without confidentiality obligations.
        <br />
        d)    “Data Fiduciary” shall have the meaning assigned to it under Section 2(i) of the Digital Personal Data Protection Act, 2023, and refers to any person who alone or in conjunction with other persons determines the purpose and means of processing personal data.
        <br />
        e)    “Data Principal” shall have the meaning assigned to it under Section 2(j) of the said Act and means the individual to whom the personal data relates and includes the parent or lawful guardian of a child, and the lawful guardian of a person with disability.
        <br />

        f) 	“Engagement” means any freelance work, communication, or transaction between a Freelancer and a Client outside the Platform.
        <br />
        g)	“Freelancer” means any authorised user and/or independent professional offering services to Clients via the Platform.
        <br />
        h)	“Grievance Officer” means the person designated by the Company under the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 to receive and address grievances.
        <br />
        i)  	“Images” include, but are not limited to: Profile photos, logos, brand marks, banners; Screenshots, photographs, artwork, illustrations, and designs; Portfolio samples, project visuals, and thumbnails; Any other visual content uploaded or displayed on the Platform.

        <br />j)  	“Intellectual Property Rights” means all copyrights, trademarks, patents, designs, trade secrets, and other proprietary rights recognized under Indian or international law.

        <br />
        k)	“Platform” means our website, mobile app, and associated services.
        <br />
        l)  	“User” means any registered or unregistered person using the Platform.
        <br />
        m)   “User Content” means all information, text, graphics, files, and materials uploaded by a User on the Platform (e.g., profiles, portfolios, messages).
        <br />
        n)	“Work Product” means any deliverable, creation, code, design, writing, or other output produced by a Freelancer for a Client.


      </p>
      <br />
      {/* ----------------------------- 2. NATURE OF PLATFORM ----------------------------- */}
      <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>2. NATURE OF PLATFORM</h1>
      <br />
      <p>
        a)	The Platform acts solely as an online intermediary to connect Freelancers and Clients.
        <br />
        We do not:
        <br /><br />

        i.Employ or represent Freelancers;<br />
        ii.Control or supervise any work or deliverables;<br />
        iii.Guarantee the quality, accuracy, timeliness, or legality of services offered by the Freelancer;<br />
        iv.Handle, process, or facilitate payments.<br />
        v.Claim ownership over any Work Product or transaction between Freelancers and Clients.<br />
        vi.Become a party to or assume responsibility for any Engagement,contract or transaction entered between a Client and a Freelancer.<br />
        b)	All contracts, payments, arrangements, rights and obligations concerning an Engagement are strictly between the Client and the Freelancer, and the Platform is not responsible for enforcing or collecting payment, delivering services, supervising performance or resolving disputes between them.<br />
        c)	All Intellectual Property Rights over Work Product or other deliverables exchanged between Client and Freelancer are governed exclusively by their own agreement. The Platform does not claim any ownership in such Work Product.<br />
      </p>
      <br />
      {/* ----------------------------- 3. USER ELIGIBILITY ----------------------------- */}
      <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>3. USER ELIGIBILITY & ACCOUNT CREATION</h1>
      <br />
      <p>

        a)	Users must be a legal entity or 18 years or older and have legal capacity to contract under the Indian Contract Act, 1872. <br />
        b)	Users below 18 years may use the Platform only through a parent or legal guardian who assumes full responsibility for the minor’s use.<br />
        c)	Users must provide accurate and complete information during registration.<br />
        d)	Users are responsible for maintaining the confidentiality of their login credentials and safeguarding them.<br />
        e)	You agree that all activity under your account is your sole responsibility.<br />
        f) 	You agree to use our Platform for business purposes only<br />
        g)	You agree to use the Platform only for lawful business purposes in compliance with all applicable national, state, local or international laws, rules, regulations or conventions.<br />
        h)	Users must comply with any and all applicable local, state, federal and/or international laws, regulations, and/or conventions in using our Site and Services
      </p>
      <br />
      {/* ----------------------------- 4. USER OBLIGATIONS ----------------------------- */}
      <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>4. USER OBLIGATIONS</h1>
      <br />

      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>4.1 General Obligations</h2>
      <br />
      <p>

        a) By accessing or using the Platform, you (“User”) agree to the following general obligations: <br />
        b)	You shall use the Platform only for lawful purposes, in good faith, and in accordance with this Agreement, all applicable laws, and the community standards and acceptable-use rules published by the Company from time to time.<br />
        c)	You shall provide complete, accurate and up-to-date information during registration and use of the Platform and shall not misrepresent your identity, age, qualifications, affiliations, skills, or professional credentials. You shall update your account information promptly when changes occur.<br />
        d)	You shall not upload, transmit, post, publish or share any content that is:<br />
        i.unlawful, defamatory, obscene, pornographic, harassing, hateful, violent, or discriminatory.<br />
        ii.infringing any Intellectual Property Rights, privacy, or proprietary rights of any person;<br />
        iii.false or misleading, including impersonating another individual or entity;<br />
        iv.spam, malware, or technologically harmful; or
        v.otherwise contrary to applicable law or these Terms.<br /><br />

        e)	You shall not solicit, collect, harvest or misuse personal data of other Users, or engage in unauthorised communications, phishing, scraping or spamming. Processing or storing of another User’s personal data must comply with the Digital Personal Data Protection Act, 2023 (DPDP Act) and this Agreement.<br />
        f) 	You are solely responsible for safeguarding your login credentials and for all activity that occurs under your Account. You shall notify the Company immediately of any unauthorised access or security breach.<br />
        g)	You shall not use the Platform to advertise or promote products or services unrelated to freelance engagements, to solicit investment or employment, or for any purpose other than legitimate freelance collaboration.
      </p><br />

      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>4.2 Freelancer Obligations</h2><br />
      <p>

        In addition to the General Obligations, every User acting as a Freelancer agrees to the following:<br />
        a)	You shall perform all services and produce Work Product diligently, professionally, and ethically, following industry standards and applicable laws, including the Indian Contract Act, 1872, and the Copyright Act, 1957.<br />
        b)	You acknowledge that you act solely as an independent contractor and not as an employee, partner, or agent of the Company or of any Client. No employment, agency, partnership, or joint-venture relationship is created by your use of the Platform.<br />
        c)	You shall provide truthful and accurate details about your qualifications, education, certifications, prior work and professional experience. Misrepresentation constitutes a material breach of these Terms.<br />
        d)	You are solely responsible for your own taxation, accounting, GST registration, TDS compliance, and invoicing obligations under Indian law. The Company neither deducts nor remits taxes on your behalf.<br />
        e)	You warrant that all Work Product and deliverables you produce are your original work or lawfully licensed and do not infringe the Intellectual Property Rights or moral rights of any third party.<br />
        f) 	You shall treat all Client information, project data, and communications as confidential, and shall not disclose or use them except for performing the relevant Engagement, subject to any confidentiality agreement with the Client.<br />
        g)	You shall maintain appropriate work records and cooperate with the Company in addressing any complaints, takedown requests, or legal notices arising from your conduct on the Platform.<br />
        h)	You shall not solicit or receive payments through unauthorised channels, bypass the Platform to avoid any applicable service fees (if imposed), or misrepresent the status of a transaction.<br />
      </p>
      <br />

      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>4.3 Client Obligations</h2><br />
      <p>

        In addition to the General Obligations, every User acting as a Client agrees to the following:<br />
        a) You shall post clear, truthful, and complete project descriptions, scope, deliverables, timelines and payment terms, and shall not solicit work that is illegal, unethical, or violates third-party rights.<br />
        b) You shall communicate with Freelancers courteously, engage in good faith, and pay for services rendered in accordance with mutually agreed terms, without unjustified delay or denial of payment.<br />
        c) You acknowledge that the Company does not vet or guarantee any Freelancer’s competence or background. You must independently verify credentials, experience, and suitability before entering an Engagement.<br />
        d) You shall handle all payments, invoices, and taxation obligations (including TDS under the Income-tax Act 1961, if applicable) directly with the Freelancer, without involving the Company.<br />
        e) You shall not request, post or commission any content or services that are unlawful, defamatory, pornographic, infringing, or contrary to public policy, nor induce a Freelancer to perform such work.<br />
        f) You shall respect the Freelancer’s Intellectual Property and Confidential Information and shall not use any Work Product prior to full payment or in breach of the applicable Engagement Contract.<br />
        g) You shall cooperate with Freelancers and, where appropriate, the Company in resolving disputes, grievances, or infringement claims in good faith and through the mechanisms set out in these Terms.<br />
        h) The Company does not conduct any formal verification, background check, or credential validation of Freelancers unless expressly stated otherwise in writing or as part of a specific verification program.<br />
        i) While the Company may, at its discretion, implement limited identity verification (such as KYC checks, document validation, or professional license confirmation) to enhance trust and safety, such actions are not guarantees of authenticity, skill, qualification, reliability, or suitability of any Freelancer.<br />
        j) The Company disclaims all warranties, express or implied, regarding the accuracy, completeness, or reliability of any Freelancer’s profile, background information, feedback, or performance.<br />
        k) Clients are solely responsible for conducting their own independent due diligence, background checks, or reference verification before entering into any Engagement or relying on a Freelancer’s representations.

      </p><br />

      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>4.4 Special Obligations</h2><br />
      <p>

        a)	All Users must comply with the Information Technology Act, 2000, the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and the Digital Personal Data Protection Act, 2023, including refraining from publishing, transmitting or storing prohibited or sensitive personal data without lawful basis.<br />
        b)	Users shall treat others with respect and without discrimination on the basis of gender, caste, religion, race, disability, age, or sexual orientation, and shall follow the principles set out in the Platform’s Diversity, Equity and Inclusion ( DEI ) Policy.<br />
        c)	Users shall not, whether directly or indirectly, solicit, engage, employ, or permit the engagement of any individual below the age of eighteen (18) years for any paid or unpaid services, assignments, or activities through the Platform<br />
        d)	Users shall promptly report any content, conduct, or activity on the Platform that appears unlawful, fraudulent, abusive, or in violation of these Terms to the Company via the Grievance Officer.<br />
        e)	Any violation of these User Obligations may, at the Company’s sole discretion, result in suspension or termination of the User’s Account, removal of content, restriction of Platform access, or referral to competent authorities under applicable law.<br />
      </p><br />

      {/* ----------------------------- 5. RELATIONSHIP ----------------------------- */}
      <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>5. RELATIONSHIP BETWEEN CLIENTS & FREELANCERS</h1><br />
      <p>

        a)	Freelancers are independent contractors; no employment, agency, partnership, or joint venture relationship exists between the Company and any User.<br />
        b)	The Clients and Freelancers may enter into separate written agreements governing their Engagement; the Platform is not a party to those agreements and has no obligation or liability for their performance, payment or content.<br />
        c)	The Platform does not guarantee, validate or endorse any Freelancer or Client, nor does it guarantee completion or quality of services or payment outcomes.

      </p><br />

      {/* ----------------------------- 6. PAYMENTS ----------------------------- */}
      <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>6. PAYMENTS AND TRANSACTIONS</h1><br />
      <p>
        a) At present, the Platform functions solely as a digital directory and networking interface comparable to a “Yellow Pages” for Freelancers and Clients that enables Users to discover, connect, and communicate with each other. The Platform does not intermediate, process, or participate in any financial transaction between Users. All dealings, including negotiations, contracts, and payments, occur independently outside the Platform and entirely at the discretion and risk of the Users involved.<br />
        b) All payments, charges, fee arrangements, invoicing, taxes (including Goods and Services Tax (GST), Tax Deducted at Source (TDS)), and any refunds between Clients and Freelancers are the sole and exclusive responsibility of the respective contracting Users. Users are expected to comply with all applicable laws, including the Income-tax Act, 1961, GST Act, 2017, and related rules governing invoicing, taxation, and accounting.<br />
        c) The Platform does not act as a payment processor, collection agent, escrow service, financial intermediary, or guarantor of payment. The Company neither holds nor handles User funds and has no authority to receive or disburse payments on behalf of Users. The Platform is not registered with the Reserve Bank of India (RBI) as a payment aggregator or intermediary and expressly disclaims any such role.<br />
        d) The Company shall bear no liability whatsoever for any non-payment, delay, fraud, misrepresentation, overpayment, underpayment, refund request, chargeback, or other financial loss or dispute arising out of any Engagement between Users. Users are strongly advised to exercise diligence, verify counterparties, and use secure, traceable payment methods when settling payments outside the Platform.<br />
        e) If the Company, in future, introduces any optional subscription plans, premium listings, advertising services, or verification programs, such fees shall be transparently displayed to Users and governed by a separate Fee Schedule or Commercial Terms of Service. Unless otherwise stated, such charges shall relate solely to Platform-access services and not to any User-to-User transaction.<br />
        f) The Company is not a party to any contract, invoice, or payment arrangement between Clients and Freelancers and shall not intervene in, mediate, or adjudicate any monetary or contractual dispute arising between Users. Any such dispute must be resolved directly between the concerned parties, in accordance with their independent agreements and applicable law.
      </p><br />

      {/* ----------------------------- 7. INTELLECTUAL PROPERTY ----------------------------- */}
      <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>7. INTELLECTUAL PROPERTY</h1><br />
      <p>

        a)	Users retain ownership of their uploaded content (profiles, portfolios, resumes, etc.). <br />
        b)	By uploading content, you grant the Company a non-exclusive, worldwide, royalty-free license to host, display, and promote your content within the Platform. <br />
        c)	All Company trademarks, software, and content remain the exclusive property of the Company. <br />
        d)	IP rights over any deliverable are governed solely by agreements between Client and Freelancer.

      </p><br />

      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>7.1 Ownership of Freelancer Work Product</h2><br />
      <p>

        (a) Default Rule (Before Payment) <br />
        i.Until full payment is made (as agreed directly between the Client and Freelancer), all rights, title, and interest in the Work Product remain with the Freelancer. <br />
        (b) Transfer of Rights (After Payment)
        i.Upon full payment, the Freelancer automatically assigns all rights, title, and interest in the Work Product to the Client, unless otherwise agreed in writing between both parties.<br />
        ii.After transfer, the Client becomes the sole and exclusive owner of the Work Product and may use it for any lawful purpose.<br />
        (c) Freelancer Retained Rights <br />
        i.Freelancers may retain:<br />
        ○ 	The right to include the Work Product in their personal portfolio (unless the Client requests confidentiality in writing); and<br />
        ○ 	Moral rights of authorship, where applicable under the Copyright Act, 1957.
      </p><br />

      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>7.1 Ownership of Freelancer Work Product</h2><br />
      <p>

        (a) Default Rule (Before Payment) <br />
        i.Until full payment is made (as agreed directly between the Client and Freelancer), all rights, title, and interest in the Work Product remain with the Freelancer. <br />
        (b) Transfer of Rights (After Payment)
        i.Upon full payment, the Freelancer automatically assigns all rights, title, and interest in the Work Product to the Client, unless otherwise agreed in writing between both parties.<br />
        ii.After transfer, the Client becomes the sole and exclusive owner of the Work Product and may use it for any lawful purpose.<br />
        (c) Freelancer Retained Rights <br />
        i.Freelancers may retain:<br />
        ○ 	The right to include the Work Product in their personal portfolio (unless the Client requests confidentiality in writing); and<br />
        ○ 	Moral rights of authorship, where applicable under the Copyright Act, 1957.
      </p><br />

      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>

        7.2. Client Ownership and Usage Rights</h2><br />
      <p>

        i.Once IP is transferred and payment completed, the Client holds exclusive ownership of the Work Product. <br />
        ii.Clients may use, modify, reproduce, distribute, or sell the Work Product as desired. <br />
        iii.Clients may not claim authorship for work created entirely by a Freelancer unless expressly permitted by the Freelancer.
      </p><br />

      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>7.3. Platform Ownership and Limited License</h2><br />
      <p>
        (a) Platform IP <br />
        All content, features, code, design, layout, trademarks, and data on the Platform are the exclusive property of Zuntra Digital Private Limited and protected under: <br />
        1.The Copyright Act, 1957, <br />
        2.The Trade Marks Act, 1999, and <br />
        3.Applicable international treaties.<br />
        Users are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for lawful purposes only.<br />
        (b) User Content License to the Platform <br />
        By uploading or posting content (e.g., profiles, portfolios, descriptions, reviews), Users grant the Platform a non-exclusive, worldwide, royalty-free license to: <br />
        1.Host, display, reproduce, and publicly show such content on the Platform;<br />
        2.Use it for platform operation, marketing, and improvement;<br />
        3.Remove or disable such content if it violates law or this Policy. <br />
        (c) The Platform does not claim ownership of User Content.
      </p><br />

      <h2 style={{ color: "#622AD3", fontWeight: '400' }}> 7.4. Third-Party Intellectual Property</h2><br />
      <p>


        a)	Users must ensure that: <br />
        i.Any content, design, or material they upload or deliver does not infringe on third-party rights;<br />
        ii.They have valid rights, licenses, or permissions to use such material.<br />
        b)	The Platform will not be responsible for any IP infringement caused by Users.
      </p><br />
      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>7.5. Ownership of Images</h2><br />
      <p>
        a)	User-Owned Content: <br />
        i.Users retain ownership of all images they upload or create.<br />
        ii.Uploading an image does not transfer ownership to the Platform or the Company.<br />
        b)Freelancer Work Product:<br />
        i.Images forming part of project deliverables (“Work Product”) remain the Freelancer’s property until full payment by the Client, after which ownership transfers to the Client, as outlined above.<br />
        c)Company-Owned Assets:<br />
        i.All Platform interface graphics, logos, icons, and promotional visuals created by the Company remain its exclusive property and may not be reused without permission.
      </p><br />
      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>7.6. License Granted to the Platform</h2><br />
      <p>

        a) By uploading or displaying images on the Platform, the User grants the Company a non-exclusive, royalty-free, worldwide license to: <br />
        i.Host, store, reproduce, display, and distribute such images on or through the Platform; <br />
        ii.Use such images for Platform operations, marketing, and promotional materials (e.g., website banners, case studies, app screenshots); <br />
        iii.Resize, crop, or modify images for technical or aesthetic display purposes without altering ownership. <br />
        c) This license is revocable by the User upon written request, except where the image has been used in prior promotional materials or archived copies. <br />
      </p><br />


      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>7.7. Third-Party Images and Responsibility</h2><br />
      <p>

        a)	Users may upload only images they own or are licensed to use. <br />
        b)	Use of stock photos, copyrighted materials, or third-party images must comply with the license terms (e.g., Creative Commons, royalty-free agreements). <br />
        c)	The Platform is not responsible for verifying ownership or license status of images uploaded by Users. <br />
        d)	Any disputes over image ownership or misuse must be resolved directly between the concerned parties.

      </p>

      <br />


      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>7.8. Image Disclaimers</h2><br />
      <p>
        a)	User Responsibility: <br />
        i.All images uploaded by Users represent their own content and opinions.<br />
        ii.The Company does not endorse, verify, or guarantee the accuracy, legality, or originality of any image.<br />
        b)	Public Display Disclaimer:<br />
        i.User profile photos, logos, and project samples may be visible publicly.<br />
        ii.Users should avoid uploading images containing confidential, personal, or sensitive information unless they intend it for public display.<br />
        c)	No Warranty:<br />
        i.The Company provides no warranty—express or implied—that uploaded images are free from infringement, misrepresentation, or unauthorized reuse.<br />
        d)	Takedown Policy:<br />
        i.If you believe your image has been used without authorisation, notify the Grievance Officer at grievance@huzzler.io with proof of ownership and the image URL.<br />
        ii.The Company will review and, if justified, remove or disable access to the content within 36 hours, as per the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.

      </p>

      <br />


      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>7.9. Image Credits and Attribution</h2><br />
      <p>

        a)	Freelancer Work Credits: <br />
        i.Freelancers may request or negotiate attribution (“Credit: [Freelancer Name]”) in writing with Clients.<br />
        ii.The Company is not responsible for enforcing credit arrangements between Users.<br />
        b)	Platform Usage Credits:<br />
        i.If the Company uses User images in official marketing (e.g., social media posts, blog articles, newsletters), reasonable attribution will be provided unless the User opts out in writing.<br />
        c)	Third-Party Sources:<br />
        i.Any stock or external images used by the Company will include appropriate source attribution per the license terms.
      </p>

      <br />


      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>7.10. Restricted Image Content</h2><br />
      <p>
        a)Users shall not upload, post, publish, transmit, or share any image, visual content, or digital artwork on the Platform that: <br />

        i.Contains any copyrighted, trademarked, or proprietary material without the explicit authorisation or licence of the rightful owner, including third-party logos, brand marks, or creative works.<br />
        ii.Includes pornography, nudity, sexually suggestive depictions, or content that violates Sections 67 and 67A of the Information Technology Act, 2000, or is otherwise obscene, lascivious, or intended to corrupt public morality.<br />
        iii.Displays or promotes violence, cruelty, self-harm, terrorism, or hatred on the basis of religion, race, gender, sexual orientation, caste, disability, or any other protected characteristic, or encourages or incites others to do so.<br />
        iv.Uses, copies, or imitates distinctive marks, brand imagery, or design elements that may cause confusion or dilute the reputation of any third party.<br />
        v.Shows identifiable individuals, minors, or private property without the knowledge or lawful consent of such persons or owners, including surveillance images, personal photographs, or sensitive personal data.<br />
        vi.Uploads or distributes altered, synthetic, or computer-generated imagery intended to mislead viewers or impersonate real persons without consent, in violation of Rule 3(1)(b)(v) of the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.<br />
        vii.Includes content that promotes gambling, narcotics, trafficking, harassment, blackmail, or any activity prohibited under Indian law.<br />
        viii.Contains imagery inconsistent with public decency, cultural sensitivity, or the Platform’s Acceptable Use and DEI Policy.<br />
        b)Any violation of this clause may result in immediate removal or disabling of the content, suspension or termination of the User’s account, and reporting to appropriate governmental authorities as required under law.<br />
        c)The Company reserves the right to restrict or moderate content under the safe-harbour obligations of Section 79 of the Information Technology Act, 2000.<br />
        d)Users uploading prohibited images shall indemnify the Company against all claims, damages, or liabilities arising from such unlawful content.
      </p>

      <br />
      <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>8. PROHIBITED ACTIVITIES</h1>
      <br />
      <p>
        a)	Users shall not: <br />
        i.Post unacceptable content (8.1);<br />
        ii.Act in a misleading or fraudulent manner (8.2);<br />
        iii.Treat others unfairly (8.3);<br />
        iv.Abuse our feedback system (8.4);<br />
        v.Use the Platform for any other reason which may not be allowed (8.5).<br />
        b)Violation of these terms may lead to account suspension or termination without notice.
      </p><br />

      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>8.1. Posting unacceptable content</h2>
      <br />
      <p>
        a)You can't offer, share, support or try to find anything that:<br />
        i.is illegal or defamatory;<br />
        ii.is violent, discriminatory or harassing, either generally or towards a specific person or group (or encourages others to be), including anyone who is part of a legally protected group;<br />
        iii.is sexually explicit or related to sex work or escort services;<br />
        iv.is in any way related to child exploitation;<br />
        v.would infringe on any intellectual property rights, including copyrights;<br />
        vi.would violate our Terms of Service, another website’s terms of service, or any similar contract;<br />
        vii.would go against professional or academic standards or policies – including improperly submitting someone else’s work as your own, or by ghost-writing essays, tests, or certifications;<br />
        viii.involves purchasing or requesting a fake review or is connected in any way to making or sharing misleading content (like ‘deep fakes’ or ‘fake news’) which is intended to deceive others.
      </p>

      <br />

      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>8.2. Acting in a misleading or fraudulent manner</h2>
      <br />
      <p>

        a)	On Huzzler, you can’t do anything that is dishonest or meant to mislead others. <br />
        b)	You can’t misrepresent yourself, your experience, skills or professional qualifications, or that of others. This includes:<br />
        i.lying about your experience, skills or professional qualifications;<br />
        ii.using generative AI or other tools to substantially bolster your job proposals or work product if such use is restricted by your client or violates any third party’s rights;<br />
        iii.passing off any part of someone else’s profile or identity as your own;<br />
        iv.using a profile picture that isn’t you, misrepresents your identity or is someone else;<br />
        v.impersonating or falsely attributing statements to any person or entity, including an Upwork representative or forum leader;<br />
        vi.falsely claiming or implying you’re connected to a person or organization (including Upwork) – for example, you can’t say you work for a particular company when you don’t, and agencies can’t use a freelancer’s profile if they’ve stopped working together.<br />
        Similarly, you must always be honest about who’s doing the work. That means you can’t:<br />
        vii.allow someone else to use your account, which misleads other users or<br />
        viii.falsely claim one freelancer will do a job when another does it including submitting a proposal on behalf of a freelancer who can’t or won’t do the work.<br />
        We’re particularly invested in avoiding fraud and misrepresentations when it comes to payments. This means:<br />
        c)	Freelancers can’t fraudulently charge a client in any way, including by:<br />

        i.falsifying the hours, keystrokes or clicks recorded in the Platform;<br />
        ii.reporting or billing time you haven’t actually worked;<br />
        iii.reporting time worked by someone else and claiming you did the work;<br />
        iv.demanding bribes or other payments without the intention of or without providing services in exchange for the payment.<br />

        d)	Clients can’t engage in fraud related to payments, including by:<br />
        i.posting jobs with payment terms that are objectively unreasonable or disproportionate to the scope of services requested;<br />
        ii.hiring themselves as freelancers and paying themselves;<br />
        iii.demanding services without the intention of or without providing payment in exchange for the services.
      </p>

      <br />

      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>8.3. Treating others unfairly</h2>
      <br />
      <p>

        a) Everyone should be treated fairly and legally on Huzzler. <br />
        b) You can’t use Huzzler to:<br />
        i.express an unlawful preference in a job post or proposal;<br />
        ii.unlawfully discriminate against someone;<br />
        iii.incite or encourage violence;<br />
        iv.post personal identifying information or other sensitive, private data about another person;<br />
        v.spam other users with proposals or invites. This includes posting the same job several times at once and contacting people you connected with on Huzzler outside of Huzzler without their permission;<br />
        vi.make or demand bribes or payments for anything other than the work;<br />
        vii.ask for or demand free work – you can’t ask freelancers to submit work for little or no payment as part of a proposal bid or competition;<br />
        viii.request a fee to submit a proposal;<br />
        ix.request or provide services that primarily concern making purchases on behalf of another, including the purchase of cryptocurrency or NFTs.
      </p>

      <br />

      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>8.4. Abusing our feedback system</h2>
      <br />
      <p>


        a)	You must use our feedback system honestly and fairly.<br />

        b)	That means you can’t:<br />
        i.withhold payment or work until you’ve been given positive feedback;<br />
        ii. swap payment (or anything of value) for feedback, including with third parties;<br />
        iii.coerce another user by threatening negative feedback;<br />
        iv.use the system to share unrelated views (like about politics or religion);<br />
        v.offer or accept fake services to improve your feedback or rating score, which is called feedback building;<br />
        vi.hire and rate yourself.<br />
      </p>

      <br />

      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>8.5. Other uses which are not allowed</h2>
      <br />
      <p>

        a)	You can’t copy, share or give away your account. You can’t have multiple accounts and you can’t sell, trade or give your account to anyone else without our permission. <br />
        b)	You can’t go around us. You can’t talk to another user or ask for or share a way to get in touch - a means of direct contact - outside of Huzzler before you’ve agreed to a service contract. This means you can’t add your contact details to a job post, your profile, communications or other content. (There are exceptions to this for Enterprise clients.) <br />
        c)	You can’t interfere with our technology or tamper with our site or services. That means you can’t: <br />
        i.bypass any security features we’ve put in place to restrict how you use the site – you’re not allowed to try and get around restrictions on copying content <br />
        ii.interfere with or compromise our systems, server security, or transmissions <br />
        iii.use a robot, spider, scraper, or similar mechanisms on our site without written permission <br />
        iv.copy, distribute, or otherwise use any information you found on Huzzler, if whether directly or through third parties (like search engines), without our consent (no scraping allowed) <br />
        v.collect or use identifiable information, including account names <br />
        vi.overwhelm the site with an unreasonable or large amount of information <br />
        vii.introduce any malware or any other code or viruses that could harm us, our customers, or our services <br />
        viii.access our services through any technology other than our interface <br />
        ix.frame or link to the services without our written permission <br />
        x.use our services to build a similar service, identify or poach our users or publish any performance or benchmark analysis relating to the site <br />
        xi.reverse engineer, decipher, modify, or take source code from our site that is not open source without our written permission <br />
      </p>



      <br />
      <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>9. Content Responsibility</h1>
      <br />
      <p>
        a)	Users are solely and entirely responsible for all content, data, text, images, graphics, files, code, messages, or other materials (“User Content”) that they upload, publish, share, or transmit through the Platform.<br />
        b)	The Company does not pre-screen, endorse, or assume responsibility for any User Content. Publication or availability of content on the Platform does not constitute the Company’s endorsement or verification of its authenticity, legality, or quality.<br />
        c)	The Company functions solely as a “intermediary” and “online platform” as defined under Section 2(w) and Section 79 of the Information Technology Act, 2000, and is entitled to safe-harbour protection thereunder. Accordingly:<br />
        d)	The Company does not initiate, select the receiver of, or modify the information transmitted through the Platform.<br />
        e)	The Company shall not be liable for any content posted or transmitted by Users unless it has actual knowledge of unlawful material and fails to act upon such knowledge.<br />
        f) 	Upon receiving a valid written notice or court order or being notified by an appropriate governmental authority of any content that is unlawful or violative of these Terms, the Company will act expeditiously to remove or disable access to such content within the time prescribed under the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.<br />
        g)	Any person who believes that content on the Platform infringes their legal rights may submit a written notice/email to the Grievance Officer specifying the URL, description of the content, and grounds for complaint.<br />
        h)	The Company shall acknowledge such complaints within 24 hours and resolve them within 15 days as required by law.<br />
        i)  The User whose content is removed may submit a Counter-Notice with sufficient justification; the Company will review the same and, if appropriate, restore the content in accordance with applicable law.<br />
        j) 	The Company may also, at its discretion, suspend, restrict, or terminate a User’s account if repeated or flagrant violations occur.<br />
        k)	To the fullest extent permitted by law, the Company disclaims all liability for any claims, damages, losses, or expenses arising from or relating to User Content, including but not limited to infringement, defamation, obscenity, data protection breaches, or misinformation.<br />
        l) 	The Company may retain copies of removed content and related metadata for evidentiary purposes or as required by law, and may cooperate with law-enforcement agencies, regulators, or courts in good-faith compliance with legal obligations.<br />
      </p><br />

      <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>10. LIMITATION OF LIABILITY</h1>
      <br />
      <p>

        a)To the fullest extent permitted by applicable law, the Company, its directors, officers, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, including loss of profits, goodwill, business reputation, or data, whether arising out of contract, tort, negligence, or otherwise, in connection with the use or inability to use the Platform or its services.<br />

        b)The Company operates solely as a digital listing and discovery platform connecting Users (Clients and Freelancers) and acts as a passive intermediary under Section 79 of the Information Technology Act, 2000. The Platform does not control, monitor, or guarantee any User Content, engagement, or transaction that occurs between Users, and assumes no responsibility for its accuracy, legality, or completeness of content posted by Users; any act, omission, or representation made by Users; or the quality, timeliness, or outcome of services exchanged between Clients and Freelancers.<br />

        c)Without limiting the generality of the foregoing, the Company shall not be responsible or liable for: any infringing, unlawful, or misleading content uploaded by Users; any unauthorised use, reproduction, or disclosure of Work Product, Images, or intellectual property created or exchanged between Users; any dispute, claim, or allegation of IP ownership or authorship between Users; any non-payment, fraud, refund, or financial loss arising out of User-to-User transactions; or any delay, interruption, or failure of the Platform arising from technical, network, or third-party service issues.<br />

        d)The Platform does not undertake real-time or proactive monitoring of all content or images uploaded by Users. In compliance with Rule 3(1)(b) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the Company will act expeditiously to remove or disable access to unlawful content upon obtaining actual knowledge or receiving a valid notice in writing from a competent authority or affected person.<br />

        e)Users agree to indemnify and hold harmless the Company, its affiliates, officers, and employees from and against any claim, loss, damage, liability, cost, or expense (including reasonable legal fees) arising out of or related to: any content or material posted or transmitted by them through the Platform; any infringement, misuse, or unauthorised reproduction of Work Product, Images, or other IP; or any violation of these Terms, applicable law, or third-party rights.<br />

        f)Notwithstanding anything to the contrary, the total cumulative liability of the Company, if any, arising from or relating to any User’s use of the Platform shall in no event exceed INR 1,000 (Rupees One Thousand Only) or the total fees (if any) paid by the User to the Company for Platform services during the preceding three (3) months, whichever is lower.
      </p><br />


      <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>11. INDEMNITY</h1>
      <br />
      <p>
        a) You agree to indemnify, defend, and hold harmless the Company, its officers, and employees from any loss, damage, liability, or claim arising from:<br />
        i.Your use of the Platform;<br />
        ii.Your breach of this Agreement; or<br />
        iii.Any dispute or transaction between you and another User.<br />
        b) This indemnity survives termination of your account.<br />
        c) The Company reserves the right to assume exclusive defence and control of any matter subject to indemnification.
      </p><br />


      <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>12. TERMINATION</h1>
      <br />
      <p>
        a)	The Company may suspend or terminate any account for:<br />

        i.Violation of this Agreement;<br />
        ii.Suspicions of illegal or fraudulent conduct;<br />
        iii.Misuse of the Platform and/or its features.<br />
        b)	Users may deactivate their account at any time.<br />
        c)	Termination does not relieve any ongoing obligations between Freelancers and Clients - including any rights or obligations accrued prior to termination.<br />
        d)	Repeat infringers may have their accounts suspended or permanently terminated<br />
      </p><br />




      <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>13. Privacy and Data Protection</h1>
      <br />
      <p>
        a)The collection, processing, retention, and use of personal data by the Company are governed by its Privacy Policy annexed hereto as Annexure A, which forms an integral part of these Terms and is fully compliant with the Digital Personal Data Protection Act, 2023 (DPDP Act) and all allied rules and notifications thereunder..<br />

        b)By accessing or using the Platform, creating an account, or continuing to use the services, the User expressly acknowledges that they have read, understood, and agreed to be bound by the Privacy Policy (Annexure A) and consent to the lawful collection, processing, storage, and sharing of their personal data by the Company for operational, contractual, and legal compliance purposes..<br />

        c)Users shall have the right to access, correct, update, erase, or withdraw consent regarding their personal data in accordance with the DPDP Act and the procedures set out in the annexed Privacy Policy..<br />

        d)The Privacy Policy annexed herewith shall be deemed to have the same legal force and effect as if incorporated verbatim into this Agreement.<br />
      </p><br />

      <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>14. GOVERNING LAW & DISPUTE RESOLUTION</h1>
      <br />
      <p>
        a)	Users are encouraged to first resolve all disputes, including but not limited to those arising from engagements, intellectual property, or contractual performance, directly and amicably between themselves.<br />
        b)	In the event such direct negotiations fail, the parties shall make a bona fide attempt to resolve the dispute through mediation, in accordance with the provisions of the Mediation Act, 2023, or any statutory re-enactment thereof.<br />
        c)	The mediation shall be conducted in English, through an empanelled mediator mutually agreed upon, or if not agreed, as designated by the Company’s appointed Mediation Centre, with the venue being Chennai, Tamil Nadu.<br />
        Arbitration<br />
        a)	If the dispute remains unresolved after mediation, it shall be referred to and finally settled by arbitration under the Arbitration and Conciliation Act, 1996 (as amended).<br />
        b)	The arbitration shall be conducted by a sole arbitrator appointed by the Company, and the arbitral proceedings shall be conducted in English.<br />
        c)	The seat and venue of arbitration shall be Chennai, Tamil Nadu, India.<br />
        d)	The arbitral award shall be final and binding on all parties, and judgment upon the award may be entered and enforced in any court of competent jurisdiction.
      </p><br />



      <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>15. GRIEVANCE REDRESSAL / REPORTING IP INFRINGEMENT</h1>
      <br />
      <p>
        Pursuant to the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the details of our Grievance Officer are:<br />
        Name: VARADHARAJA PERUMAL JANAKIRAMAN <br /> Email: grievance@huzzler.io <br /> Address: ZUNTRA DIGITAL PRIVATE LIMITED - Developed Plot Estate, Plot No 61, Perungudi, Kanchipuram, Saidapet, Tamil Nadu, India, 600096 <br /> Complaints will be acknowledged within 24 hours and resolved within 15 days.<br />
        a)	Your notice must include:<br />
        1.Identification of the copyrighted or protected work;<br />
        2.URL or description of the allegedly infringing material;<br />
        3.Your contact details;<br />
        4.A declaration that your complaint is made in good faith;<br />
        5.Proof of ownership or authorization to act on behalf of the owner.<br />
        b)Action upon complaint:<br />
        i.The Platform will review, verify, and if appropriate, remove or disable access to the allegedly infringing content within 36 hours of obtaining actual knowledge, as per Rule 3(1)(d) of the IT Rules, 2021.<br />
        ii.The alleged infringer will be notified and may submit a counter-notice within 7 days with supporting documents.<br />
        iii.The Platform will restore such content only upon satisfaction that no infringement has occurred or upon receipt of a lawful direction from a competent authority or court.<br />
        iv.The Company reserves the right to suspend or terminate accounts for repeated or willful infringements, and to report serious violations to law enforcement or other competent authorities.<br />

        Note:<br />
        This mechanism also applies to any other grievance or violation under these Terms, including unlawful content, impersonation, abuse, or violation of personal rights
      </p><br />


      <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>16. MISCELLANEOUS</h1>
      <br />
      <p>
        1.This Agreement constitutes the entire agreement between you and the Company. <br />
        2.If any clause is held invalid, the remaining clauses shall remain enforceable. <br />
        3.Failure to enforce any right shall not be deemed a waiver. <br />
        4.No joint venture, partnership, or employment relationship exists between the Company and any User. <br />
        5.The Company may update these Terms at any time; continued use constitutes acceptance of the updated Terms
      </p><br />








      {/* (Shortened here but your full text is preserved above — everything is included in JSX properly.) */}
    </div>
  );
};
/* ============================== PRIVACY ============================== */
// 
const Privacy = () => (
  <div>
    <h2 className="title-head">Annexure A - Privacy Policy</h2> <br />
    <p>Last Updated: October 31, 2025</p>
    <br />
    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>1. Introduction</h1>
    <p>
      Welcome to Huzzler (“Company”, “we”, “our”, or “us”).
      This Privacy Policy (“Policy”) describes how we collect, use, store, share, and protect your personal data when you access or use our website, mobile application, and related services (collectively, the “Platform”). <br /> <br />

      We are committed to protecting your privacy and handling your information in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act), the Information Technology Act, 2000, and all applicable Indian data protection laws. <br /> <br />

      For the purposes of this Policy, Zuntra Digital Private Limited acts as the Data Fiduciary under the DPDP Act, and any third-party service providers engaged by us act as Data Processors under written contracts ensuring equivalent protection. <br /> <br />

      This Policy forms part of and shall be read with the Huzzler Terms of Service (effective 31 October 2025). <br /> <br />

      By using the Platform, you consent to the practices described in this Policy.
    </p>



    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>2. Scope and Applicability</h1>
    <p>
      a)This Policy applies to: <br />
      All users of the Platform, including Freelancers, Clients, and visitors; <br />
      All personal data collected, processed, or stored by the Company in India; <br />
      Any personal data transferred or accessed from outside India, as permitted by law. <br />
      This Policy does not apply to third-party websites or services linked from our Platform. <br />
      We encourage you to review the privacy policies of those third parties independently. <br />
    </p>



    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>3. Data We Collect</h1>
    <p> we may collect the following categories of data: <br /></p>
    <h2 style={{ color: "#622AD3", fontWeight: '400' }}>(a) Personal Information</h2>
    <p>
      Full name, phone number, email address; <br />
      Age / date of birth(for eligibility verification); <br />
      Address, city, state, and country; <br />
      Profile photo or avatar (optional) <br />
    </p>

    <h2 style={{ color: "#622AD3", fontWeight: '400' }}>(b) Account & Professional Data</h2>
    <p>
      Login credentials; <br />
      Freelancer skills, portfolio, and service details; <br />
      Client project descriptions; <br />
      Communication logs between freelancers and clients. <br />

    </p>


    <h2 style={{ color: "#622AD3", fontWeight: '400' }}>(c) Technical & Usage Data</h2>
    <p>
      IP address, browser type, device ID, and operating system; <br />
      Access time, pages visited, and referral links; <br />
      Cookies, analytics, and tracking technologies. <br />
      (d) Sensitive Personal Data (if applicable) <br />
      Government identification (e.g., PAN, Aadhar) only for verification purposes. <br />
      We do not collect biometric or financial data since the Platform does not process payments. <br />
    </p>


    <h2 style={{ color: "#622AD3", fontWeight: '400' }}>(d) Sensitive Personal Data</h2>
    <p>PAN/Aadhaar collected only for verification. No biometric or payment data collected.</p>

    <h2 style={{ color: "#622AD3", fontWeight: '400' }}>3.1 Information You Provide to Us Directly
    </h2>
    <p>
      a)	We receive your information when you provide this to us, when you use our Services, complete a transaction via our Services or when you otherwise use our Services, including: <br />
      i.   	Account Creation. We may collect information when you create an account, such as name, email business address, password, location and photograph. <br />
      Verification of Identity. We may use third parties to verify your identity, comply with “Know Your Customer” (KYC) and Anti-Money Laundering (AML) requirements, and/or prevent fraud. These third parties may collect your name, birthdate, address and government identification pursuant to the terms of their privacy policies. If you choose to use our Services, you consent to the processing of your data by these third parties. <br />
      Your Communications with Us. We may collect personal information, such as email address, phone number, or mailing address (home or work) when you request information about our Services, request customer or technical support, apply for or post an opportunity, or otherwise communicate with us. <br />
      Surveys & Interviews. We may contact you to voluntarily participate in surveys or User interviews. If you decide to participate, you may be asked to provide certain information which may include personal information. <br />
      Imported External Network Information. We may collect information that you voluntarily and optionally provide about your existing professional network from other internet platforms, through product features to import existing contacts and connections. This information is used to expedite migrating your existing professional relationships to our platform. <br />
      We and others who use our Services may collect personal information that you submit or make publicly available through the Portal. Any information you provide using the public sharing features of the Services (referred to herein as “User Content”) will be considered “public,” unless otherwise required by applicable law, and is not subject to the privacy protections referenced herein. <br />
      Live Events. We may collect personal information from individuals when we host in person events. <br />
      Business Development and Strategic Partnerships. We may collect personal information from individuals and third parties to assess and pursue potential business opportunities. <br />

    </p>

    <h2 style={{ color: "#622AD3", fontWeight: '400' }}>3.2 Information Collected Automatically
    </h2>
    <p>
      a)	We automatically collect data about you when you visit our website and use our services. The types of data we automatically collect include:<br />
      Device and Network Information. We may collect certain information automatically when you use our Services, such as your Internet protocol (IP) address, user settings, cookie identifiers, browser or device information, location information (including approximate location derived from IP address).<br />
      Usage Information. We may also automatically collect information regarding your use of our Services, such as pages that you visit before, during and after using our Services, information about the links you click, the types of content you interact with, the frequency and duration of your activities, and other information about how you use our Services. In addition, we may collect information that other people provide about you when they use our Services, including information about you when they tag you and/or provide referrals and/or feedback regarding your work performance and project results and/or other interactions between you and a Client or Independent.<br />
      Cookies, Pixel Tags/Web Beacons, and Other Technologies. We, as well as third parties that provide content, advertising, or other functionality on our Services, may use cookies, pixel tags, local storage, and other technologies (“Technologies”) to automatically collect information through your use of our Services. Cookies are small text files placed in device browsers that store preferences and facilitate and enhance your experience. A pixel tag (also known as a web beacon) is a piece of code embedded in our Services that collects information about engagement on our Services. The use of a pixel tag allows us to record, for example, that a user has visited a particular web page or clicked on a particular advertisement. We may also include web beacons in e-mails to understand whether messages have been opened, acted on, or forwarded. Our uses of these Technologies fall into the following general categories:<br />
      Operationally Necessary. This includes Technologies that allow you access to our Services, applications, and tools that are required to identify irregular website behavior, prevent fraudulent activity and improve security or that allow you to make use of our functionality;<br />
      Performance-Related. We may use Technologies to assess the performance of our Services, including as part of our analytic practices to help us understand how individuals use our Services (see Analytics below). For example, we may track your website activity, including recordings of your interactions with the website;<br />
      Functionality-Related. We may use Technologies that allow us to offer you enhanced functionality when accessing or using our Services. This may include identifying you when you sign into our Services or keeping track of your specified preferences, interests, or past items viewed;<br />
      Advertising- or Targeting-Related. We may use first-party or third-party Technologies to deliver content, including ads relevant to your interests, on our Services or on third-party websites.

    </p>

    <h2 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>4. How We Collect Data</h2>
    <p>
      We collect data through: <br />
      Direct input from users during registration, profile setup, or communication; <br />
      Automated collection via cookies and analytics tools; <br />
      Information shared voluntarily through emails, forms, or surveys. <br />

    </p>
    <h2 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>5. Purpose of Data Processing</h2>
    <p>
      We process your personal data for the following lawful purposes: <br /><br />

      Purpose <br />
      Legal Basis under DPDP Act<br />
      Account creation and management<br />
      Performance of contract / User consent<br />
      Displaying freelancer profiles and projects<br />
      User consent<br />
      Matching clients and freelancers<br />
      Legitimate use for service delivery<br />
      Communication and notifications<br />
      Consent / legitimate business interest<br />
      Security, fraud prevention, and compliance<br />
      Legal obligation<br />
      Data analytics and platform improvement<br />
      Legitimate business interest<br />
      Responding to legal or government requests<br />
      Legal obligation

    </p>

    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>6. Consent and User Rights</h1>
    <h2 style={{ color: "#622AD3", fontWeight: '400' }}>(a) Consent</h2>
    <p>By using the Platform and providing your personal data, you consent to: <br />
      The collection and processing of your information; <br />
      Communication via email, SMS, or in-app notifications; <br />
      Data transfers and disclosures as described herein. <br />
      <h2 style={{ color: "#622AD3", fontWeight: '400' }}>(b) Your Rights Under DPDP Act</h2>      You have the right to: <br />
      Access your personal data; <br />
      Correct or update inaccurate data; <br />
      Withdraw consent; <br />
      Request erasure of your data; <br />
      Nominate another person to exercise rights in case of death or incapacity. <br />
      Requests may be sent to our Company via: support@huzzler.io
    </p>

    <br />

    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>7. Data Storage and Retention</h1>
    <p>All personal data is stored securely on servers located within India, unless otherwise specified for backup or analytics. <br />
      We retain user data only for as long as necessary to fulfill the purposes described in this Policy or as required by law - which is 180 days for safety purposes under India’s IT Rules 2021. <br />
      Upon deletion of an account, we anonymise or securely erase personal data unless retention is legally mandated.</p>

    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>8. Data Security</h1>
    <p>
      a.	We implement reasonable security practices and procedures as required under Rule 8 of the IT (SPDI) Rules, 2011, including: <br />
      i.        Encryption of stored and transmitted data; <br />
      ii.        Secure access control and authentication; <br />
      iii.         Regular vulnerability assessments; <br />
      iv.        Limited employee access on a need-to-know basis. <br />
      b.	While we take all reasonable steps to protect your data, no electronic transmission or storage system can guarantee absolute security.
    </p>

    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>9. Cross-Border Data Transfers
    </h1>

    <p>
      Personal data may be transferred to or processed in other jurisdictions only where such transfer is compliant with Section 16 of the DPDP Act, 2023. <br />
      Any cross-border transfer will ensure that the receiving country or entity provides adequate data protection safeguards. <br />
      By using the Platform, you consent to such international transfers as necessary for service provision (e.g., cloud hosting, analytics).

    </p>

    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>10. Force Majeure and Ransomware / Cybersecurity Incidents
    </h1>
    <p>
      a) Definition of Force Majeure<br />

      The Company shall not be held liable for any delay, failure, loss, or disclosure of personal data resulting from events beyond its reasonable control, including but not limited to:<br />
      i.Natural disasters (fire, flood, earthquake, storm, or other acts of God);<br />
      ii.War, terrorism, sabotage, civil unrest, or political disturbances;<br />
      iii.Pandemic, epidemic, or governmental restrictions;<br />
      iv.Power outages, network failures, or telecommunications disruptions;<br />
      v.Widespread ransomware attacks, zero-day exploits, denial-of-service (DoS) incidents, or similar malicious cyber intrusions affecting the Company’s or its vendors’ infrastructure;<br />
      vi.Cloud service provider outages or third-party data centre failures; or<br />
      vii.Any act, omission, or circumstance which is not reasonably foreseeable or preventable despite implementation of industry-standard security measures.<br />

      b) Commitment to Security Standards<br />
      Zuntra Digital Private Limited (“the Company”) has always maintained and will continue to maintain the highest standards of information security, privacy protection, and data-governance compliance. The Company operates in full adherence to Section 43A of the Information Technology Act, 2000, Rule 8 of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023 (“DPDP Act”).<br />
      All internal controls, policies, and infrastructure are designed and periodically reviewed in accordance with ISO/IEC 27001 or equivalent global standards to ensure confidentiality, integrity, and availability of information assets.
      c) Ransomware or Data Encryption Attacks<br />
      In the event of a ransomware or similar encryption-based cyberattack:The Company swill immediately isolate affected systems, engage certified cybersecurity specialists, and notify the Indian Computer Emergency Response Team (CERT-In) as mandated under the Cyber Security Directions, 2022 (issued under s.70B of the IT Act) within six (6) hours of detection. The Company will also notify the Data Protection Board of India and affected Users under Section 8(6) and Section 33 of the DPDP Act, 2023, disclosing the nature of the breach, likely impact, and remedial measures taken. No ransom or unlawful demand will be paid by the Company unless legally mandated or approved by competent authorities.


      d) Mitigation and Restoration <br />
      The Company will make commercially reasonable efforts to restore systems, recover encrypted data (where possible), and prevent recurrence through patching, system hardening, and security upgrades. Users will be informed about measures taken and any required user-side actions (e.g., password resets).<br />
      e) Limitation of Liability in Force Majeure Events<br />
      While the Company will exercise due diligence, it shall not be liable for any consequential, incidental, or indirect loss of data, goodwill, or reputation caused by such force majeure or ransomware incidents, provided that:<br />
      i.It has complied with its legal obligations of prompt notification and mitigation under the DPDP Act and IT Act; and<br />
      ii.The event could not reasonably have been prevented by available security technologies or practices.<br />

      f) Post-Incident Review and Documentation<br />
      A post-incident forensic report will be documented within 30 days of containment, recording root cause, remedial steps, and timelines. Such reports will be preserved as required by Rule 7 of the CERT-In Directions, 2022, and may be shared with regulators upon request.<br />
    </p>


    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>11. Data Sharing & Disclosure</h1>
    <p>
      We may share your personal data with:<br />
      (a) Service Providers<br />
      Third-party vendors providing IT, hosting, analytics, communication, or verification services — under strict confidentiality obligations.<br />
      (b) Legal and Regulatory Authorities<br />
      When required by law, regulation, or valid legal process.<br />
      (c) Business Transfers<br />
      In case of merger, acquisition, or asset sale, user data may be transferred to the new entity, subject to this Policy.<br />
      We do not sell or rent personal data to advertisers or third parties.

    </p>

    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>12. Cookies and Tracking Technologies
    </h1>
    <p>We use cookies and similar technologies to:<br />
      Enable core platform functions;<br />
      Analyze site traffic and user behavior;<br />
      Remember preferences and login sessions.<br />
      You can manage cookie preferences through your browser settings, but disabling cookies may limit certain Platform features.
    </p>

    <h2 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>13. Third-Party Links and Integrations
    </h2>
    <p>
      The Platform may contain links to third-party websites or plugins (e.g., LinkedIn, company websites, or communication tools). <br /> <br />

      We are not responsible for the privacy practices or content of those external sites.

    </p>

    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>14. Grievance Redressal and Data Protection Officer
    </h1>
    <p>
      Zuntra Digital Private Limited (“the Company”) has appointed a Data Protection Officer (DPO) in accordance with Section 10(5) of the Digital Personal Data Protection Act, 2023, read with Rule 3(1)(b) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021. <br />
      The DPO serves as the single point of contact for all user grievances, privacy-related inquiries, and communications from the Data Protection Board of India or other lawful authorities <br />
      Name: VARADHARAJA PERUMAL  <br />
      Email: grievance@huzzler.io <br />
      Address:  ZUNTRA DIGITAL PRIVATE LIMITED - Developed Plot Estate, Plot No 61, Perungudi, Perungudi, Kanchipuram, Saidapet, Tamil Nadu, India, 600096 <br />
      Complaints will be acknowledged within 24 hours and resolved within 15 business days.

    </p>

    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>15. Updates to This Policy</h1>
    <p>We may amend this Policy periodically to reflect legal or technological changes. <br />
      Any updates will be posted on this page with a revised “Last Updated” date. <br />
      Continued use of the Platform after such changes constitutes your acceptance of the updated Policy.</p>

    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>16. Governing Law and Jurisdiction
    </h1>
    <p>This Policy shall be governed by and construed in accordance with the laws of India. <br />
      Any disputes arising under this Policy shall be subject to the exclusive jurisdiction of the courts of Chennai, Tamil Nadu, India.
    </p>
  </div>
);







/* ============================== DEI ============================== */
const DEI = () => (
  <div className="policy-container">
    <h2 className="title-head">Annexure B - Diversity, Inclusion, Equity (DEI) & Sustainability Policy</h2>

    <br /><br />
    <p>Last Updated: October 31, 2025</p>
    <p>Applies To: All Users (Freelancers & Clients), Employees, and Partners of Huzzler</p>
    <br />
    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>1. Purpose</h1>
    <p>
      Huzzler is committed to creating a safe, inclusive, and equitable digital workspace for everyone. We also recognise our responsibility to contribute to a sustainable digital and social ecosystem. This DEI & Sustainability Policy establishes our stance against all forms of discrimination and our commitment to respect, fairness. representation, environmental responsibility, ethical digital practices, and long-term societal impact.
    </p> <br />

    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>2. Our Core Principles</h1><br />

    <p>Diversity <br />

      We celebrate the all and any backgrounds, perspectives, and talents of our users and employees. We encourage participation regardless of: <br />

      Gender, gender identity or expression <br />

      Sexual orientation <br />

      Race, ethnicity, language, or nationality <br />

      Religion or belief system <br />

      Age, marital status, or socioeconomic background<br />

      Physical or cognitive ability<br />

      Geographic origin or digital access level <br />

      Equity<br />

      We are committed to ensuring fair treatment, access, and opportunity for all users.<br />
      This includes equitable:
      <br />
      Access to platform features and support<br />

      Visibility in listings and search results (no algorithmic bias)<br />

      Dispute handling and resolution without prejudice<br />

      Inclusion <br />

      We strive to ensure that every freelancer, client, and employee feels valued, heard, and safe to express themselves within our community guidelines. <br />

      Harassment, hate speech, and discriminatory behavior are strictly prohibited. <br />


      Sustainability<br />

      We are committed to:<br />

      Reducing our digital carbon footprint through efficient hosting, responsible data storage, and low-energy technologies.<br />

      Supporting remote, inclusive, and fair work to reduce unnecessary travel and promote flexible employment.<br />

      Partnering with vendors and service providers who adhere to ethical, environmental, and labor standards.<br />

      Encouraging our freelancers and clients to adopt sustainable work practices, such as paperless contracts, virtual collaboration, and resource optimization.<br />

      Continuously evaluating and improving our operational sustainability, including energy efficiency, waste reduction, and responsible consumption<br />

    </p> <br />





    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>3. Zero-Tolerance Policy on Discrimination and Harassment</h1>
    <p>We do not tolerate: <br />

      Any discriminatory messages, job posts, project descriptions, or conduct on the platform.<br />

      Harassment or intimidation based on any protected characteristic.<br />

      Exclusionary language or practices in professional engagements.<br />

      Any violation of this DEI & Sustainability Policy by a user, Freelancer, Client, Employee, or Partner shall attract appropriate disciplinary or corrective action, which may include warning, temporary suspension, content removal, or permanent termination of access to the Platform, depending on the severity of the violation.</p>


    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>4. Sustainability Implementation</h1>
    <p>To uphold this commitment, Huzzler will: <br />

      Host data on energy-efficient servers and seek partnerships with green data centers where feasible. <br />

      Use digital-first workflows to eliminate paper waste. <br />

      Encourage sustainable project practices, including remote collaboration tools and cloud storage over physical transfers. <br />

      Provide educational resources to users on eco-conscious freelancing and sustainable digital behavior. <br />

      Regularly monitor and report on sustainability performance indicators.</p>


    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>5. Social Sustainability</h1>
    <p>
      Beyond environmental responsibility, we aim to foster a sustainable digital workforce:<br />

      Empower freelancers with fair opportunities, regardless of geography or background.<br />

      Ensure accessibility and usability for differently-abled users.<br />

      Support digital literacy and inclusion in underrepresented communities.
    </p>

    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>6. Review, Reporting & Grievance Redressal</h1>
    <p>
      With regards to our commitment to sustainability, this Policy will be reviewed annually to ensure alignment with global sustainability goals such as the UN Sustainable Development Goals (SDG 8 – Decent Work and Economic Growth; SDG 12 – Responsible Consumption; SDG 13 – Climate Action).<br />

      To ensure that the platform remains a safe and inclusive space, users are encouraged to lodge a report in the event that they experience or witness discrimination. Users can report it via: grievance@huzzler.io<br />


      All reports will be handled confidentially by our DEI & Grievance Committee, with a commitment to respond within 72 hours.<br />

      The Company strictly prohibits retaliation or victimisation against any person who, in good faith, reports a concern, complaint, or suspected violation under this Policy or participates in an investigation. Any act of retaliation shall itself be treated as a serious violation of this Policy and may attract disciplinary measures, including suspension or termination.<br />
    </p>


    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>7. Responsibility & Training</h1>
    <p>
      Platform Leadership is responsible for integrating DEI values into product design, algorithms, and partnerships.<br />

      Employees and Moderators receive regular sensitivity and anti-bias training.<br />

      Users are expected to engage respectfully and uphold our inclusive culture.<br />

      All users, partners, and employees share responsibility for upholding our sustainability initiatives and ideals.<br />

      Leadership is accountable for ensuring our sustainability values are reflected in decisions, technology, and partnerships.
    </p>

    <h1 style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>8. Continuous Improvement</h1>
    <p>
      We will: <br />

      Regularly review this policy to reflect evolving social, environmental, and legal standards. <br />

      Collect anonymised demographic data (with consent) to assess equity outcomes.
    </p>

    <h1  style={{ color: "#622AD3", fontSize: "32px", fontWeight: '400' }}>9. Legal Alignment</h1>
    <p>The DEI parts of this Policy comply with: <br />

Article 15 and 16 of the Constitution of India (Equality and Non-Discrimination) <br />

Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 (safe and respectful online environment) <br />

DPDP Act, 2023 (fair and lawful data use without bias) <br />

POSH Act, 2013, where applicable (prevention of sexual harassment in workplace contexts)</p> <br /><br /><br />
<p>At Huzzler, respect is non-negotiable. We strive to facilitate connection – not division. <br />
Together, we hope to foster not only productivity – but responsibility as well.</p>
    
  </div>
);