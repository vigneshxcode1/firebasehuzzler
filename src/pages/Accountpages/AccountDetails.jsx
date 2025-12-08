import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AccountDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address1: "",
    address2: "",
    city: "",
    zip: "",
    state: "",
    phone: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/createaccount",
        formData
      );
      alert("Account Created Successfully!");
      navigate("/client-dashboard");
    } catch (err) {
      alert("Something went wrong!");
    }
  };

  return (
    <>
      {/* MAIN UI */}
      <div className="account-container">
        <div className="account-card">
          <div className="account-header">
            <button className="back-btn" onClick={() => navigate("/client-dashboard")}>
              ←
            </button>
            <div>
              <h2 className="account-title">Account Details</h2>
              <p className="account-subtitle">Complete Your Profile to Get Noticed.</p>
            </div>
          </div>

          <form className="account-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" name="name" placeholder="Your name"
                className="form-input" value={formData.name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" placeholder="youremail@email.com"
                className="form-input" value={formData.email} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" placeholder="Enter password"
                className="form-input" value={formData.password} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input type="text" name="address1" placeholder="Address line 1"
                className="form-input" value={formData.address1} onChange={handleChange} />

              <input type="text" name="address2" placeholder="Address line 2"
                className="form-input" value={formData.address2} onChange={handleChange} />

              <div className="address-row">
                <input type="text" name="city" placeholder="City / Town"
                  className="form-input city" value={formData.city} onChange={handleChange} />

                <input type="text" name="zip" placeholder="Zip / Postal code"
                  className="form-input zip" value={formData.zip} onChange={handleChange} />

                <input type="text" name="state" placeholder="State / Region"
                  className="form-input state" value={formData.state} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Phone Number <span className="required">*</span>
              </label>
              <div className="phone-row">
                <input type="text" value="+91" readOnly className="form-input country-code" />
                <input type="text" name="phone" placeholder="Phone number"
                  className="form-input phone" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn cancel-btn"
                onClick={() => navigate("/client-dashboard")}>
                Cancel
              </button>
              <button type="submit" className="btn save-btn">Save</button>
            </div>
          </form>

          {/* DELETE BUTTON */}
          <div className="delete-section">
            <button className="delete-btn" onClick={() => setShowPopup(true)}>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRM POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <div className="popup-icon">⚠️</div>

            <h3 className="popup-title">Delete account</h3>
            <p className="popup-text">
              This will permanently delete your huzzler account.<br />
              Are you sure you want to delete your account?
            </p>

            <div className="popup-actions">
              <button
                className="popup-delete"
                onClick={() => {
                  setShowPopup(false);
                  setShowSuccess(true);
                }}
              >
                Yes, I want to delete
              </button>

              <button className="popup-cancel" onClick={() => setShowPopup(false)}>
                Don’t Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="success-card">
            <div className="success-icon">⚠️</div>

            <h3 className="success-title">Account Deleted</h3>
            <p className="success-text">Your account has been permanently deleted.</p>

            <div className="success-actions">
              <button className="success-ok" onClick={() => navigate("/")}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL CSS */}
      <style>{`
        .account-container {
          flex: 1;
          height: 100vh;
          background: linear-gradient(to bottom, #fef9c3, #ffffff);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .account-card {
          width: 90%;
          max-width: 700px;
          background: #fff;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          border-radius: 1.25rem;
          padding: 2rem;
        }

        .account-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .back-btn {
          color: #4b5563;
          font-size: 1.25rem;
          margin-right: 0.75rem;
          background: none;
          border: none;
          cursor: pointer;
        }

        .account-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: #1f2937;
        }

        .account-subtitle {
          font-size: 0.9rem;
          color: #6b7280;
        }

        .account-form { display: flex; flex-direction: column; gap: 1rem; }

        .form-label { font-weight: 500; margin-bottom: 0.25rem; }

        .form-input {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
        }

        .form-input:focus {
          border-color: #fde68a;
          box-shadow: 0 0 0 3px #fef9c3;
        }

        .address-row { display: flex; gap: 0.5rem; }

        .city { flex: 1; }
        .zip, .state { width: 25%; }

        .phone-row { display: flex; gap: 0.5rem; }

        .country-code { width: 4rem; background: #f9fafb; text-align: center; }

        .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }

        .btn { padding: 0.5rem 1.25rem; border-radius: 9999px; cursor: pointer; }

        .save-btn { background: #7c3aed; color: white; }

        .delete-section { margin-top: 1.5rem; text-align: center; }

        .delete-btn {
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 0.5rem 1.25rem;
          border-radius: 9999px;
          cursor: pointer;
        }

        /* POPUP OVERLAY */
        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(3px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }

        /* DELETE POPUP */
        .popup-card {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          width: 420px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          text-align: center;
          animation: popupIn .25s ease;
        }

        @keyframes popupIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .popup-icon { font-size: 2rem; margin-bottom: .5rem; }

        .popup-title { color: #dc2626; font-size: 1.4rem; font-weight: 600; }

        .popup-text { color: #4b5563; margin: 1rem 0 1.5rem; }

        .popup-actions { display: flex; justify-content: center; gap: 1rem; }

        .popup-delete { background: #7c3aed; color: white; border-radius: 9999px; padding: .6rem 1rem; }

        .popup-cancel { background: #f3f4f6; border-radius: 9999px; padding: .6rem 1rem; }

        /* SUCCESS POPUP */
        .success-card {
          background: white;
          padding: 2rem 2.5rem;
          border-radius: 1rem;
          width: 420px;
          text-align: center;
          animation: popupIn .25s ease;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }

        .success-icon {
          font-size: 2.5rem;
          color: #dc2626;
          margin-bottom: .5rem;
        }

        .success-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #dc2626;
        }

        .success-text {
          margin: 1rem 0 1.5rem;
          color: #4b5563;
        }

        .success-actions { display: flex; justify-content: center; }

        .success-ok {
          background: #7c3aed;
          color: white;
          padding: .6rem 1.2rem;
          border-radius: 9999px;
        }
      `}</style>
    </>
  );
};

export default AccountDetails;


