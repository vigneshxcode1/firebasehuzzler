import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { 
  IoChatbubbleEllipsesOutline, 
  IoNotificationsOutline, 
  IoSearch,
  IoLocationOutline,
  IoTimeOutline,
  IoCashOutline,
  IoConstructOutline,
  IoBriefcaseOutline
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import profileImg from "../../../assets/profile.png";
import { 
  collection, 
  onSnapshot, 
  orderBy, 
  query, 
  Timestamp, 
  where,
  doc,
  updateDoc,
  deleteDoc,
  getDoc
} from "firebase/firestore";
import { db } from "../../../firbase/Firebase";

export default function HireFreelancer() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("requested");
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null); // For detail modal
  const [freelancerProfiles, setFreelancerProfiles] = useState({}); // Cache profiles

  /* ================= HELPERS ================= */

  const getStartMessage = (title) =>
    `Hi 👋 I've reviewed your application for "${title}". Let's discuss the next steps.`;

  const markAsRead = async (id) => {
    await updateDoc(doc(db, "notifications", id), { read: true });
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Delete this request?")) return;
    await deleteDoc(doc(db, "notifications", id));
  };

  const hireFreelancer = async (item) => {
    if (!window.confirm(`Hire ${item.freelancerName}?`)) return;
    await updateDoc(doc(db, "notifications", item.id), { read: true });
  };

  const timeAgo = (input) => {
    if (!input) return "N/A";
    const d = input instanceof Timestamp ? input.toDate() : new Date(input);
    const diff = (Date.now() - d.getTime()) / 1000;
    
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return `${Math.floor(diff / 604800)} weeks ago`;
  };

  const formatBudget = (from, to) => {
    if (!from && !to) return "Not specified";
    if (from && to) return `₹${from.toLocaleString()} - ₹${to.toLocaleString()}`;
    return `₹${(from || to).toLocaleString()}`;
  };

  /* ================= FETCH FREELANCER PROFILE ================= */
  
  const fetchFreelancerProfile = async (freelancerId) => {
    if (!freelancerId || freelancerProfiles[freelancerId]) return;
    
    try {
      // Try 'users' collection first
      let profileDoc = await getDoc(doc(db, "users", freelancerId));
      
      if (!profileDoc.exists()) {
        // Try 'freelancers' collection
        profileDoc = await getDoc(doc(db, "freelancers", freelancerId));
      }
      
      if (profileDoc.exists()) {
        setFreelancerProfiles(prev => ({
          ...prev,
          [freelancerId]: profileDoc.data()
        }));
      }
    } catch (err) {
      console.error("Error fetching freelancer profile:", err);
    }
  };

  /* ================= FIRESTORE ================= */

  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const q = query(
      collection(db, "notifications"),
      where("clientUid", "==", auth.currentUser.uid),
      where("type", "==", "application"),
      orderBy("timestamp", "desc")
    );

    return onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRequests(data);
      
      // Fetch profiles for all freelancers
      data.forEach(item => {
        if (item.freelancerId) {
          fetchFreelancerProfile(item.freelancerId);
        }
      });
    });
  }, [auth.currentUser?.uid]);

  const requestedList = requests.filter((r) => r.read === false);
  const hiredList = requests.filter((r) => r.read === true);

  const listToShow = activeTab === "requested" ? requestedList : hiredList;

  const finalList = listToShow.filter((i) =>
    i.freelancerName?.toLowerCase().includes(search.toLowerCase()) ||
    i.service?.title?.toLowerCase().includes(search.toLowerCase()) ||
    i.service?.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        * { font-family: "Rubik", sans-serif; box-sizing: border-box; }

        .hire-root {
          min-height: 100vh;
          background: linear-gradient(180deg, #ffffffff 0%, #fff 100%);
          padding: 26px;
        }

        /* HEADER */
        .hire-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .hire-title {
          font-size: 22px;
          font-weight: 700;
          color: #1f2937;
        }
        .header-icons {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .header-icons svg {
          cursor: pointer;
          color: #6b7280;
          transition: color 0.2s;
        }
        .header-icons svg:hover {
          color: #7c3aed;
        }
        .header-profile {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e5e7eb;
        }

        /* SEARCH */
        .hire-search {
          margin: 22px 0;
          height: 50px;
          background: #fff;
          padding: 0 20px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
        }
        .hire-search svg {
          color: #9ca3af;
          font-size: 20px;
        }
        .hire-search input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 14px;
          background: transparent;
        }

        /* TABS */
        .hire-tabs {
          display: flex;
          width: 100%;
          max-width: 400px;
          margin: 0 auto 18px;
          background: #fff;
          padding: 6px;
          border-radius: 40px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
        }
        .hire-tab {
          flex: 1;
          text-align: center;
          padding: 12px 0;
          font-weight: 600;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #6b7280;
        }
        .hire-tab:hover {
          background: #f3f4f6;
        }
        .hire-tab.active {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: #fff;
        }
        .hire-tab .count {
          background: #ef4444;
          color: #fff;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 10px;
          margin-left: 6px;
        }
        .hire-tab.active .count {
          background: #fff;
          color: #7c3aed;
        }

        /* FILTER BAR */
        .filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fff;
          padding: 12px 16px;
          border-radius: 14px;
          margin-bottom: 20px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        }
        .filter-left {
          display: flex;
          gap: 8px;
        }
        .filter-chip {
          background: #f3f4f6;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-chip:hover, .filter-chip.active {
          background: #ede9fe;
          color: #7c3aed;
        }
        .filter-right {
          color: #7c3aed;
          font-weight: 600;
          font-size: 14px;
        }

        /* GRID */
        .hire-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }

        /* CARD */
        .hire-card {
          background: #fff;
          border-radius: 22px;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .hire-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .card-top {
          height: 100px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%);
          position: relative;
        }

        .time-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255,255,255,0.95);
          padding: 6px 12px;
          border-radius: 18px;
          font-size: 11px;
          font-weight: 500;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .source-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          color: #fff;
          text-transform: uppercase;
        }

        .profile-img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 4px solid #fff;
          object-fit: cover;
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .card-body {
          padding: 50px 20px 20px;
        }

        .card-header {
          text-align: center;
          margin-bottom: 16px;
        }

        .name {
          font-weight: 700;
          font-size: 18px;
          color: #1f2937;
        }

        .role {
          color: #7c3aed;
          font-size: 14px;
          font-weight: 500;
          margin-top: 2px;
        }

        .location {
          font-size: 12px;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          margin-top: 4px;
        }

        /* SERVICE INFO */
        .service-section {
          background: #f9fafb;
          border-radius: 14px;
          padding: 14px;
          margin: 12px 0;
        }

        .service-title {
          font-weight: 600;
          font-size: 15px;
          color: #374151;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .service-desc {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .service-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #6b7280;
          background: #fff;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .meta-item svg {
          color: #7c3aed;
          font-size: 14px;
        }

        .budget-highlight {
          background: #dcfce7;
          color: #166534;
          font-weight: 600;
        }

        .category-badge {
          background: #ede9fe;
          color: #7c3aed;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 10px;
        }

        /* SKILLS */
        .skills-section {
          margin: 12px 0;
        }

        .skills-label {
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .skills span {
          background: #ede9fe;
          color: #5b21b6;
          padding: 5px 12px;
          border-radius: 14px;
          font-size: 11px;
          font-weight: 500;
        }

        .skills .more {
          background: #7c3aed;
          color: #fff;
        }

        /* TOOLS */
        .tools-section {
          margin: 12px 0;
        }

        .tools {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tools span {
          background: #fef3c7;
          color: #92400e;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 500;
        }

        /* ACTION BUTTONS */
        .card-actions {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .action-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 14px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #6d28d9, #5b21b6);
          transform: scale(1.02);
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .btn-danger {
          background: #fef2f2;
          color: #dc2626;
        }

        .btn-danger:hover {
          background: #fee2e2;
        }

        .btn-success {
          background: linear-gradient(135deg, #059669, #10b981);
          color: #fff;
        }

        /* VIEW MORE BUTTON */
        .view-more-btn {
          background: none;
          border: none;
          color: #7c3aed;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 6px 0;
          text-decoration: underline;
        }

        /* EMPTY STATE */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #9ca3af;
        }

        .empty-state svg {
          font-size: 60px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        /* MODAL */
        .detail-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px;
        }

        .detail-modal {
          background: #fff;
          border-radius: 24px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          padding: 24px;
          color: #fff;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255,255,255,0.2);
          border: none;
          color: #fff;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
        }

        .modal-body {
          padding: 24px;
        }

        .modal-section {
          margin-bottom: 20px;
        }

        .modal-section-title {
          font-size: 14px;
          font-weight: 700;
          color: #374151;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modal-desc {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.7;
          white-space: pre-wrap;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .hire-grid {
            grid-template-columns: 1fr;
          }
          
          .hire-tabs {
            max-width: 100%;
          }
          
          .filter-bar {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>

      <div className="hire-root">
        {/* HEADER */}
        <div className="hire-header">
          <div className="hire-title">Hire Freelancer</div>
          <div className="header-icons">
            <IoChatbubbleEllipsesOutline size={22} />
            <IoNotificationsOutline size={22} />
            <img src={profileImg} className="header-profile" alt="Profile" />
          </div>
        </div>

        {/* SEARCH */}
        <div className="hire-search">
          <IoSearch />
          <input
            placeholder="Search by name, service, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABS */}
        <div className="hire-tabs">
          <div
            className={`hire-tab ${activeTab === "requested" ? "active" : ""}`}
            onClick={() => setActiveTab("requested")}
          >
            Requested
            {requestedList.length > 0 && (
              <span className="count">{requestedList.length}</span>
            )}
          </div>
          <div
            className={`hire-tab ${activeTab === "hired" ? "active" : ""}`}
            onClick={() => setActiveTab("hired")}
          >
            Hired
            {hiredList.length > 0 && (
              <span className="count">{hiredList.length}</span>
            )}
          </div>
        </div>

        {/* FILTER */}
        <div className="filter-bar">
          <div className="filter-left">
            <span className="filter-chip active">All</span>
            <span className="filter-chip">Work</span>
            <span className="filter-chip">24 Hours</span>
          </div>
          <div className="filter-right">
            {finalList.length} {activeTab === "requested" ? "Requests" : "Hired"}
          </div>
        </div>

        {/* CARDS */}
        {finalList.length === 0 ? (
          <div className="empty-state">
            <IoBriefcaseOutline />
            <p>No {activeTab === "requested" ? "requests" : "hired freelancers"} found</p>
          </div>
        ) : (
          <div className="hire-grid">
            {finalList.map((item) => {
              const service = item.service || {};
              const profile = freelancerProfiles[item.freelancerId] || {};
              
              const skills = Array.isArray(service.skills) 
                ? service.skills 
                : [];
              
              const tools = Array.isArray(service.tools) 
                ? service.tools 
                : [];

              return (
                <div className="hire-card" key={item.id}>
                  {/* Card Top */}
                  <div className="card-top">
                    {service.source && (
                      <div className="source-badge">{service.source}</div>
                    )}
                    <div className="time-badge">
                      <IoTimeOutline />
                      {timeAgo(item.timestamp)}
                    </div>
                    <img
                      src={profile.profileImage || profile.photoURL || item.profileImage || profileImg}
                      className="profile-img"
                      alt={item.freelancerName}
                    />
                  </div>

                  {/* Card Body */}
                  <div className="card-body">
                    {/* Header Info */}
                    <div className="card-header">
                      <div className="name">{item.freelancerName}</div>
                      <div className="role">
                        {profile.role || profile.title || service.category || "Freelancer"}
                      </div>
                      <div className="location">
                        <IoLocationOutline />
                        {profile.location || profile.city || "Location not specified"}
                      </div>
                    </div>

                    {/* Category Badge */}
                    {service.category && (
                      <div style={{ textAlign: "center" }}>
                        <span className="category-badge">{service.category}</span>
                      </div>
                    )}

                    {/* Service Info */}
                    <div className="service-section">
                      <div className="service-title">
                        <IoBriefcaseOutline />
                        {service.title || item.title || "Service Request"}
                      </div>
                      
                      {service.description && (
                        <p className="service-desc">{service.description}</p>
                      )}

                      <div className="service-meta">
                        {(service.budget_from || service.budget_to) && (
                          <span className="meta-item budget-highlight">
                            <IoCashOutline />
                            {formatBudget(service.budget_from, service.budget_to)}
                          </span>
                        )}
                        
                        {service.deliveryDuration && (
                          <span className="meta-item">
                            <IoTimeOutline />
                            {service.deliveryDuration}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Skills */}
                    {skills.length > 0 && (
                      <div className="skills-section">
                        <div className="skills-label">Skills</div>
                        <div className="skills">
                          {skills.slice(0, 3).map((s, i) => (
                            <span key={i}>{s}</span>
                          ))}
                          {skills.length > 3 && (
                            <span className="more">+{skills.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tools */}
                    {tools.length > 0 && (
                      <div className="tools-section">
                        <div className="skills-label">Tools</div>
                        <div className="tools">
                          {tools.slice(0, 4).map((t, i) => (
                            <span key={i}>{t}</span>
                          ))}
                          {tools.length > 4 && (
                            <span>+{tools.length - 4}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* View More */}
                    <button
                      className="view-more-btn"
                      onClick={() => setSelectedRequest(item)}
                    >
                      View Full Details →
                    </button>

                    {/* Actions */}
                    <div className="card-actions">
                      {activeTab === "requested" ? (
                        <>
                          <button
                            className="action-btn btn-danger"
                            onClick={() => deleteRequest(item.id)}
                          >
                            Decline
                          </button>
                          <button
                            className="action-btn btn-success"
                            onClick={() => hireFreelancer(item)}
                          >
                            Hire Now
                          </button>
                        </>
                      ) : (
                        <button
                          className="action-btn btn-primary"
                          onClick={() =>
                            navigate("/chat", {
                              state: {
                                currentUid: auth.currentUser.uid,
                                otherUid: item.freelancerId,
                                otherName: item.freelancerName,
                                otherImage: profile.profileImage || item.profileImage,
                                initialMessage: getStartMessage(service.title || item.title),
                              },
                            })
                          }
                        >
                          <IoChatbubbleEllipsesOutline />
                          Start Conversation
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DETAIL MODAL */}
        {selectedRequest && (
          <div 
            className="detail-modal-backdrop"
            onClick={() => setSelectedRequest(null)}
          >
            <div 
              className="detail-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <button 
                  className="modal-close"
                  onClick={() => setSelectedRequest(null)}
                >
                  ✕
                </button>
                <h2 style={{ margin: 0, fontSize: 20 }}>
                  {selectedRequest.freelancerName}
                </h2>
                <p style={{ margin: "4px 0 0", opacity: 0.9, fontSize: 14 }}>
                  {selectedRequest.service?.category || "Freelancer"}
                </p>
              </div>

              <div className="modal-body">
                {/* Service Title */}
                <div className="modal-section">
                  <div className="modal-section-title">
                    <IoBriefcaseOutline /> Service
                  </div>
                  <p style={{ fontWeight: 600, color: "#1f2937" }}>
                    {selectedRequest.service?.title || selectedRequest.title}
                  </p>
                </div>

                {/* Description */}
                {selectedRequest.service?.description && (
                  <div className="modal-section">
                    <div className="modal-section-title">Description</div>
                    <p className="modal-desc">
                      {selectedRequest.service.description}
                    </p>
                  </div>
                )}

                {/* Budget */}
                <div className="modal-section">
                  <div className="modal-section-title">
                    <IoCashOutline /> Budget
                  </div>
                  <p style={{ color: "#059669", fontWeight: 600, fontSize: 18 }}>
                    {formatBudget(
                      selectedRequest.service?.budget_from,
                      selectedRequest.service?.budget_to
                    )}
                  </p>
                </div>

                {/* Delivery Duration */}
                {selectedRequest.service?.deliveryDuration && (
                  <div className="modal-section">
                    <div className="modal-section-title">
                      <IoTimeOutline /> Delivery Duration
                    </div>
                    <p>{selectedRequest.service.deliveryDuration}</p>
                  </div>
                )}

                {/* Skills */}
                {selectedRequest.service?.skills?.length > 0 && (
                  <div className="modal-section">
                    <div className="modal-section-title">Skills</div>
                    <div className="skills">
                      {selectedRequest.service.skills.map((s, i) => (
                        <span key={i}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tools */}
                {selectedRequest.service?.tools?.length > 0 && (
                  <div className="modal-section">
                    <div className="modal-section-title">
                      <IoConstructOutline /> Tools
                    </div>
                    <div className="tools">
                      {selectedRequest.service.tools.map((t, i) => (
                        <span key={i}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Client Requirements */}
                {selectedRequest.service?.clientRequirements && (
                  <div className="modal-section">
                    <div className="modal-section-title">Client Requirements</div>
                    <p className="modal-desc">
                      {selectedRequest.service.clientRequirements}
                    </p>
                  </div>
                )}

                {/* Meta Info */}
                <div className="modal-section" style={{ 
                  background: "#f9fafb", 
                  padding: 16, 
                  borderRadius: 12 
                }}>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "1fr 1fr", 
                    gap: 12,
                    fontSize: 13
                  }}>
                    <div>
                      <strong>Job ID:</strong><br />
                      <span style={{ color: "#6b7280" }}>{selectedRequest.jobId}</span>
                    </div>
                    <div>
                      <strong>Service ID:</strong><br />
                      <span style={{ color: "#6b7280" }}>
                        {selectedRequest.service?.serviceId || "N/A"}
                      </span>
                    </div>
                    <div>
                      <strong>Source:</strong><br />
                      <span style={{ color: "#6b7280" }}>
                        {selectedRequest.service?.source || "manual"}
                      </span>
                    </div>
                    <div>
                      <strong>Applied:</strong><br />
                      <span style={{ color: "#6b7280" }}>
                        {timeAgo(selectedRequest.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="card-actions" style={{ marginTop: 24 }}>
                  {activeTab === "requested" ? (
                    <>
                      <button
                        className="action-btn btn-danger"
                        onClick={() => {
                          deleteRequest(selectedRequest.id);
                          setSelectedRequest(null);
                        }}
                      >
                        Decline Request
                      </button>
                      <button
                        className="action-btn btn-success"
                        onClick={() => {
                          hireFreelancer(selectedRequest);
                          setSelectedRequest(null);
                        }}
                      >
                        Hire This Freelancer
                      </button>
                    </>
                  ) : (
                    <button
                      className="action-btn btn-primary"
                      style={{ width: "100%" }}
                      onClick={() => {
                        setSelectedRequest(null);
                        navigate("/chat", {
                          state: {
                            currentUid: auth.currentUser.uid,
                            otherUid: selectedRequest.freelancerId,
                            otherName: selectedRequest.freelancerName,
                            initialMessage: getStartMessage(
                              selectedRequest.service?.title || selectedRequest.title
                            ),
                          },
                        });
                      }}
                    >
                      <IoChatbubbleEllipsesOutline />
                      Start Conversation
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
