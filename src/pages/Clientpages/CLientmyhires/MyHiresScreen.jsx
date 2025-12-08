

// // src/screens/MyHiresScreen.jsx

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//     collection,
//     query,
//     where,
//     onSnapshot,
//     doc,
//     getDoc,
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "../../../firbase/Firebase"; // ✅ UNMA existing config file (config object illa)
// import { deleteDoc } from "firebase/firestore";

// // --------------------------
// // Rubik font inject (single time)
// // --------------------------
// if (typeof document !== "undefined" && !document.getElementById("myhires-style")) {
//     const style = document.createElement("style");
//     style.id = "myhires-style";
//     style.innerHTML = `
//  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap');

//  :root {
//  --mh-yellow: #FDFD96;
//  --mh-purple: #7C3CFF;
//  --mh-text: #111827;
//  }

//  body {
//  font-family: 'Rubik', system-ui, -apple-system, BlinkMacSystemFont,
//  'Segoe UI', sans-serif !important;
//  background-color: #ffffff;
//  }
//  `;
//     document.head.appendChild(style);
// }


// const styles = {

//     deleteBtn: {
//         padding: "10px 14px",
//         borderRadius: 10,
//         backgroundColor: "#EF4444",
//         cursor: "pointer",
//     },
//     deleteBtnText: {
//         fontSize: 12,
//         fontWeight: 400,
//         color: "#FFFFFF",
//         whiteSpace: "nowrap",
//     },

//     page: {
//         minHeight: "100vh",
//         backgroundColor: "#FFFFFF",
//         fontFamily:
//             "'Rubik', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
//     },
//     container: {
//         maxWidth: 600,
//         margin: "0 auto",
//         padding: "12px 16px 24px 16px",
//         display: "flex",
//         flexDirection: "column",
//     },
//     headerRow: {
//         display: "flex",
//         alignItems: "center",
//         marginBottom: 14,
//     },
//     backBtn: {
//         width: 32,
//         height: 32,
//         borderRadius: 999,
//         border: "1px solid rgba(0,0,0,0.08)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontSize: 16,
//         cursor: "pointer",
//     },
//     headerTitle: {
//         flex: 1,
//         textAlign: "center",
//         fontSize: 22,
//         fontWeight: 500,
//         color: "#111827",
//     },
//     topTabsRow: {
//         display: "flex",
//         justifyContent: "center",
//         gap: 10,
//         marginTop: 4,
//     },
//     topTab: (active) => ({
//         padding: "8px 64px",
//         borderRadius: "40px 40px 0 0",
//         backgroundColor: active ? "#7C3CFF" : "transparent",
//         transition: "background-color 0.2s ease",
//         cursor: "pointer",
//     }),
//     topTabText: (active) => ({
//         fontSize: 16,
//         fontWeight: 500,
//         color: active ? "#FFFFFF" : "#111827",
//         whiteSpace: "nowrap",
//     }),
//     innerTabsRow: {
//         display: "flex",
//         justifyContent: "space-evenly",
//         alignItems: "flex-start",
//         marginTop: 16,
//         marginBottom: 12,
//     },
//     innerTabWrapper: {
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         cursor: "pointer",
//     },
//     innerTabLabel: {
//         fontSize: 16,
//         fontWeight: 500,
//         color: "#111827",
//     },
//     innerTabBar: (active) => ({
//         marginTop: 4,
//         height: 5,
//         width: 120,
//         borderRadius: 999,
//         backgroundColor: active ? "#FDFD96" : "transparent",
//         transition: "background-color 0.2s ease",
//     }),
//     listWrapper: {
//         marginTop: 4,
//         flex: 1,
//         overflowY: "auto",
//         paddingBottom: 16,
//     },
//     emptyText: {
//         marginTop: 40,
//         textAlign: "center",
//         fontSize: 16,
//         color: "#6B7280",
//     },
//     card: {
//         marginBottom: 14,
//         padding: 16,
//         borderRadius: 10,
//         backgroundColor: "#FDFD96",
//         display: "flex",
//         alignItems: "center",
//     },
//     avatar: {
//         width: 64,
//         height: 64,
//         borderRadius: "50%",
//         objectFit: "cover",
//         flexShrink: 0,
//     },
//     cardTextCol: {
//         marginLeft: 14,
//         display: "flex",
//         flexDirection: "column",
//         gap: 4,
//     },
//     cardName: {
//         fontSize: 20,
//         fontWeight: 500,
//         color: "#111827",
//     },
//     cardRole: {
//         fontSize: 14,
//         fontWeight: 400,
//         color: "#6B7280",
//     },
//     cardSpacer: {
//         flex: 1,
//     },
//     chatBtn: {
//         padding: "10px 14px",
//         borderRadius: 10,
//         backgroundColor: "#7C3CFF",
//         cursor: "pointer",
//     },
//     chatBtnText: {
//         fontSize: 12,
//         fontWeight: 400,
//         color: "#FFFFFF",
//         whiteSpace: "nowrap",
//     },
// };


// const handleDeleteRequest = async (id) => {
//     try {
//         await deleteDoc(doc(db, "myWorks", id));
//         alert("Request deleted successfully!");
//     } catch (err) {
//         console.error("Delete error:", err);
//         alert("Failed to delete request");
//     }
// };


// export default function MyHiresScreen() {
//     const navigate = useNavigate();

//     const [selectedTab, setSelectedTab] = useState("Hired"); // default as Flutter
//     const [selectedInnerTabIndex, setSelectedInnerTabIndex] = useState(0); // 0=Work, 1=24 Hours

//     const [currentUser, setCurrentUser] = useState(null);
//     const [userLoading, setUserLoading] = useState(true);

//     const [items, setItems] = useState([]);
//     const [listLoading, setListLoading] = useState(true);

//     // ------------------ AUTH ------------------
//     useEffect(() => {
//         const unsub = onAuthStateChanged(auth, (u) => {
//             setCurrentUser(u || null);
//             setUserLoading(false);
//         });
//         return () => unsub();
//     }, []);

//     // ------------------ FIRESTORE LIST ------------------
//     useEffect(() => {
//         if (!currentUser) return;

//         setListLoading(true);

//         const q = query(
//             collection(db, "myWorks"),
//             where("senderId", "==", currentUser.uid),
//             where("status", "==", selectedTab === "Requested" ? "sent" : "accepted"),
//             where("jobData.is24h", "==", selectedInnerTabIndex === 1)
//         );

//         const unsub = onSnapshot(
//             q,
//             async (snap) => {
//                 const promises = snap.docs.map(async (docSnap) => {
//                     const data = docSnap.data();
//                     const receiverId = data.receiverId;
//                     let userProfile = null;

//                     try {
//                         const uRef = doc(db, "users", receiverId);
//                         const uSnap = await getDoc(uRef);
//                         if (uSnap.exists()) {
//                             userProfile = uSnap.data();
//                         }
//                     } catch (err) {
//                         console.error("Error fetching user profile", err);
//                     }

//                     return {
//                         id: docSnap.id,
//                         ...data,
//                         receiverId,
//                         userProfile,
//                     };
//                 });

//                 const list = await Promise.all(promises);
//                 setItems(list);
//                 setListLoading(false);
//             },
//             (err) => {
//                 console.error("myWorks snapshot error:", err);
//                 setListLoading(false);
//             }
//         );

//         return () => unsub();
//     }, [currentUser, selectedTab, selectedInnerTabIndex]);

//     // ------------------ RENDER ------------------
//     if (userLoading) {
//         return (
//             <div style={styles.page}>
//                 <div style={styles.container}>
//                     <p>Loading...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!currentUser) {
//         return (
//             <div style={styles.page}>
//                 <div style={styles.container}>
//                     <p style={styles.emptyText}>Please login</p>
//                 </div>
//             </div>
//         );
//     }

//     const handleBack = () => {
//         navigate(-1);
//     };

//     const handleOpenChat = (receiverId, name, image) => {
//         navigate("/chat", {
//             state: {
//                 currentUid: currentUser.uid,
//                 otherUid: receiverId,
//                 otherName: name,
//                 otherImage: image,
//             },
//         });
//     };

//     return (
//         <div style={styles.page}>
//             <div style={styles.container}>
//                 {/* HEADER */}
//                 <div style={styles.headerRow}>
//                     <div style={styles.backBtn} onClick={handleBack}>
//                         {/* simple back icon */}
//                         <span>&lt;</span>
//                     </div>
//                     <div style={styles.headerTitle}>Hire Freelancer</div>
//                     <div style={{ width: 32 }} /> {/* right spacer */}
//                 </div>

//                 {/* TOP TABS (Requested / Hired) */}
//                 <div style={styles.topTabsRow}>
//                     {["Requested", "Hired"].map((label) => {
//                         const active = selectedTab === label;
//                         return (
//                             <div
//                                 key={label}
//                                 style={styles.topTab(active)}
//                                 onClick={() => setSelectedTab(label)}
//                             >
//                                 <span style={styles.topTabText(active)}>{label}</span>
//                             </div>
//                         );
//                     })}
//                 </div>

//                 {/* INNER TABS (Work / 24 Hours) */}
//                 <div style={styles.innerTabsRow}>
//                     {["Work", "24 Hours"].map((label, index) => {
//                         const active = selectedInnerTabIndex === index;
//                         return (
//                             <div
//                                 key={label}
//                                 style={styles.innerTabWrapper}
//                                 onClick={() => setSelectedInnerTabIndex(index)}
//                             >
//                                 <span style={styles.innerTabLabel}>{label}</span>
//                                 <div style={styles.innerTabBar(active)} />
//                             </div>
//                         );
//                     })}
//                 </div>

//                 {/* LIST */}
//                 <div style={styles.listWrapper}>
//                     {listLoading ? (
//                         <p style={styles.emptyText}>Loading...</p>
//                     ) : items.length === 0 ? (
//                         <p style={styles.emptyText}>
//                             No {selectedTab.toLowerCase()} freelancers found
//                         </p>
//                     ) : (
//                         items.map((item) => {
//                             const u = item.userProfile || {};
//                             const name = `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Freelancer";
//                             const role =
//                                 (item.jobData && item.jobData.title) || "Freelancer";
//                             const image =
//                                 u.profileImage ||
//                                 "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

//                             return (
//                                 <div key={item.id} style={styles.card}>
//                                     <img src={image} alt={name} style={styles.avatar} />

//                                     <div style={styles.cardTextCol}>
//                                         <div style={styles.cardName}>{name}</div>
//                                         <div style={styles.cardRole}>{role}</div>
//                                     </div>

//                                     <div style={styles.cardSpacer} />
//                                     <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

//                                         {selectedTab === "Requested" && (
//                                             <div
//                                                 style={styles.deleteBtn}
//                                                 onClick={() => handleDeleteRequest(item.id)}
//                                             >
//                                                 <span style={styles.deleteBtnText}>Delete</span>
//                                             </div>
//                                         )}

//                                         <div
//                                             style={styles.chatBtn}
//                                             onClick={() =>
//                                                 handleOpenChat(item.receiverId, name, image)
//                                             }
//                                         >
//                                             <span style={styles.chatBtnText}>View chat</span>
//                                         </div>

//                                     </div>




//                                 </div>
//                             );
//                         })
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// src/screens/MyHiresScreen.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firbase/Firebase"; // ✅ UNMA existing config file (config object illa)
import { deleteDoc } from "firebase/firestore";

// --------------------------
// Rubik font inject (single time)
// --------------------------
if (typeof document !== "undefined" && !document.getElementById("myhires-style")) {
    const style = document.createElement("style");
    style.id = "myhires-style";
    style.innerHTML = `
 @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap');

 :root {
 --mh-yellow: #FDFD96;
 --mh-purple: #7C3CFF;
 --mh-text: #111827;
 }

 body {
 font-family: 'Rubik', system-ui, -apple-system, BlinkMacSystemFont,
 'Segoe UI', sans-serif !important;
 background-color: #ffffff;
 }
 `;
    document.head.appendChild(style);
}


const styles = {

    deleteBtn: {
        padding: "10px 14px",
        borderRadius: 10,
        backgroundColor: "#EF4444",
        cursor: "pointer",
    },
    deleteBtnText: {
        fontSize: 12,
        fontWeight: 400,
        color: "#FFFFFF",
        whiteSpace: "nowrap",
    },

    page: {
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        fontFamily:
            "'Rubik', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    container: {
        maxWidth: 600,
        margin: "0 auto",
        padding: "12px 16px 24px 16px",
        display: "flex",
        flexDirection: "column",
    },
    headerRow: {
        display: "flex",
        alignItems: "center",
        marginBottom: 14,
    },
    backBtn: {
        width: 32,
        height: 32,
        borderRadius: 999,
        border: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        cursor: "pointer",
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 22,
        fontWeight: 500,
        color: "#111827",
    },
    topTabsRow: {
        display: "flex",
        justifyContent: "center",
        gap: 10,
        marginTop: 4,
    },
    topTab: (active) => ({
        padding: "8px 64px",
        borderRadius: "40px 40px 0 0",
        backgroundColor: active ? "#7C3CFF" : "transparent",
        transition: "background-color 0.2s ease",
        cursor: "pointer",
    }),
    topTabText: (active) => ({
        fontSize: 16,
        fontWeight: 500,
        color: active ? "#FFFFFF" : "#111827",
        whiteSpace: "nowrap",
    }),
    innerTabsRow: {
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "flex-start",
        marginTop: 16,
        marginBottom: 12,
    },
    innerTabWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
    },
    innerTabLabel: {
        fontSize: 16,
        fontWeight: 500,
        color: "#111827",
    },
    innerTabBar: (active) => ({
        marginTop: 4,
        height: 5,
        width: 120,
        borderRadius: 999,
        backgroundColor: active ? "#FDFD96" : "transparent",
        transition: "background-color 0.2s ease",
    }),
    listWrapper: {
        marginTop: 4,
        flex: 1,
        overflowY: "auto",
        paddingBottom: 16,
    },
    emptyText: {
        marginTop: 40,
        textAlign: "center",
        fontSize: 16,
        color: "#6B7280",
    },
    card: {
        marginBottom: 14,
        padding: 16,
        borderRadius: 10,
        backgroundColor: "#FDFD96",
        display: "flex",
        alignItems: "center",
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: "50%",
        objectFit: "cover",
        flexShrink: 0,
    },
    cardTextCol: {
        marginLeft: 14,
        display: "flex",
        flexDirection: "column",
        gap: 4,
    },
    cardName: {
        fontSize: 20,
        fontWeight: 500,
        color: "#111827",
    },
    cardRole: {
        fontSize: 14,
        fontWeight: 400,
        color: "#6B7280",
    },
    cardSpacer: {
        flex: 1,
    },
    chatBtn: {
        padding: "10px 14px",
        borderRadius: 10,
        backgroundColor: "#7C3CFF",
        cursor: "pointer",
    },
    chatBtnText: {
        fontSize: 12,
        fontWeight: 400,
        color: "#FFFFFF",
        whiteSpace: "nowrap",
    },
};


const handleDeleteRequest = async (id) => {
    try {
        await deleteDoc(doc(db, "myWorks", id));
        alert("Request deleted successfully!");
    } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete request");
    }
};


export default function MyHiresScreen() {
    const navigate = useNavigate();

    const [selectedTab, setSelectedTab] = useState("Hired"); // default as Flutter
    const [selectedInnerTabIndex, setSelectedInnerTabIndex] = useState(0); // 0=Work, 1=24 Hours

    const [currentUser, setCurrentUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    const [items, setItems] = useState([]);
    const [listLoading, setListLoading] = useState(true);

    // ------------------ AUTH ------------------
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setCurrentUser(u || null);
            setUserLoading(false);
        });
        return () => unsub();
    }, []);

    // ------------------ FIRESTORE LIST ------------------
    useEffect(() => {
        if (!currentUser) return;

        setListLoading(true);

        const q = query(
            collection(db, "myWorks"),
            where("senderId", "==", currentUser.uid),
            where("status", "==", selectedTab === "Requested" ? "sent" : "accepted"),
            where("jobData.is24h", "==", selectedInnerTabIndex === 1)
        );

        const unsub = onSnapshot(
            q,
            async (snap) => {
                const promises = snap.docs.map(async (docSnap) => {
                    const data = docSnap.data();
                    const receiverId = data.receiverId;
                    let userProfile = null;

                    try {
                        const uRef = doc(db, "users", receiverId);
                        const uSnap = await getDoc(uRef);
                        if (uSnap.exists()) {
                            userProfile = uSnap.data();
                        }
                    } catch (err) {
                        console.error("Error fetching user profile", err);
                    }

                    return {
                        id: docSnap.id,
                        ...data,
                        receiverId,
                        userProfile,
                    };
                });

                const list = await Promise.all(promises);
                setItems(list);
                setListLoading(false);
            },
            (err) => {
                console.error("myWorks snapshot error:", err);
                setListLoading(false);
            }
        );

        return () => unsub();
    }, [currentUser, selectedTab, selectedInnerTabIndex]);

    // ------------------ RENDER ------------------
    if (userLoading) {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <p style={styles.emptyText}>Please login</p>
                </div>
            </div>
        );
    }

    const handleBack = () => {
        navigate(-1);
    };

    const handleOpenChat = (receiverId, name, image) => {
        navigate("/chat", {
            state: {
                currentUid: currentUser.uid,
                otherUid: receiverId,
                otherName: name,
                otherImage: image,
            },
        });
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                {/* HEADER */}
                <div style={styles.headerRow}>
                    <div style={styles.backBtn} onClick={handleBack}>
                        {/* simple back icon */}
                        <span>&lt;</span>
                    </div>
                    <div style={styles.headerTitle}>Hire Freelancer</div>
                    <div style={{ width: 32 }} /> {/* right spacer */}
                </div>

                {/* TOP TABS (Requested / Hired) */}
                <div style={styles.topTabsRow}>
                    {["Requested", "Hired"].map((label) => {
                        const active = selectedTab === label;
                        return (
                            <div
                                key={label}
                                style={styles.topTab(active)}
                                onClick={() => setSelectedTab(label)}
                            >
                                <span style={styles.topTabText(active)}>{label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* INNER TABS (Work / 24 Hours) */}
                <div style={styles.innerTabsRow}>
                    {["Work", "24 Hours"].map((label, index) => {
                        const active = selectedInnerTabIndex === index;
                        return (
                            <div
                                key={label}
                                style={styles.innerTabWrapper}
                                onClick={() => setSelectedInnerTabIndex(index)}
                            >
                                <span style={styles.innerTabLabel}>{label}</span>
                                <div style={styles.innerTabBar(active)} />
                            </div>
                        );
                    })}
                </div>

                {/* LIST */}
                <div style={styles.listWrapper}>
                    {listLoading ? (
                        <p style={styles.emptyText}>Loading...</p>
                    ) : items.length === 0 ? (
                        <p style={styles.emptyText}>
                            No {selectedTab.toLowerCase()} freelancers found
                        </p>
                    ) : (
                        items.map((item) => {
                            const u = item.userProfile || {};
                            const name = `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Freelancer";
                            const role =
                                (item.jobData && item.jobData.title) || "Freelancer";
                            const image =
                                u.profileImage ||
                                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

                            return (
                                <div key={item.id} style={styles.card}>
                                    <img src={image} alt={name} style={styles.avatar} />

                                    <div style={styles.cardTextCol}>
                                        <div style={styles.cardName}>{name}</div>
                                        <div style={styles.cardRole}>{role}</div>
                                    </div>

                                    <div style={styles.cardSpacer} />
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

                                        {selectedTab === "Requested" && (
                                            <div
                                                style={styles.deleteBtn}
                                                onClick={() => handleDeleteRequest(item.id)}
                                            >
                                                <span style={styles.deleteBtnText}>Delete</span>
                                            </div>
                                        )}

                                        <div
                                            style={styles.chatBtn}
                                            onClick={() =>
                                                handleOpenChat(item.receiverId, name, image)
                                            }
                                        >
                                            <span style={styles.chatBtnText}>View chat</span>
                                        </div>

                                    </div>




                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}