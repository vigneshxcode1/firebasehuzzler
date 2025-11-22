// ClientProfileMenuScreen.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default function ClientProfileMenuScreen() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [isUploading, setUploading] = useState(false);

  // ---------------- Get User Data ----------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setUser(data);
          setProfileImage(data.profileImage || "");
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsub();
  }, []);

  // ---------------- Pick and Upload Image ----------------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const imageRef = ref(storage, `users/${auth.currentUser.uid}/profile.jpg`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);

      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        profileImage: downloadURL,
      });

      setProfileImage(downloadURL);
      alert("Profile image updated!");
    } catch (err) {
      alert("Image upload failed!");
    }

    setUploading(false);
  };

  // ---------------- Logout ----------------
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await signOut(auth);
      navigate("/firelogin");
    }
  };

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`;

  return (
    <div className="w-full bg-white min-h-screen">
      {/* ---------------- Header ---------------- */}
      <div className="w-full bg-yellow-200 rounded-b-3xl p-6 relative">
        <div className="flex gap-4 items-end">
          {/* Profile Avatar */}
          <div className="relative">
            <img
              src={profileImage || "/assets/profile.png"}
              className="w-20 h-20 rounded-full object-cover border"
              alt="profile"
            />
            <label className="absolute bottom-0 right-0 cursor-pointer">
              <div className="bg-yellow-400 p-2 rounded-full border">
                <img src="/assets/icons/edit.svg" className="w-4 h-4" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <div className="loader-small"></div>
              </div>
            )}
          </div>

          <h2 className="text-lg font-semibold">{fullName || "User"}</h2>
        </div>
      </div>

      {/* ---------------- Sections ---------------- */}
      <div className="px-6 mt-4 space-y-4">
        {/* My Account */}
        <h3 className="text-lg font-semibold">My Account</h3>

        <MenuItem
          icon="/assets/profile_icon/Bookmark.svg"
          title="Saved"
          onClick={() => navigate("/freelance-dashboard/saved")}
        />

        <MenuItem
          icon="/assets/profile_icon/User_03.svg"
          title="Profile"
          onClick={() => navigate("/freelance-dashboard/Profilebuilder")}
        />

        <MenuItem
          icon="/assets/profile_icon/myservice.svg"
          title="Job Section"
          onClick={() => navigate("/AddJobScreen")}
        />

        {/* <MenuItem
          icon="/assets/profile_icon/my work.svg"
          title="Hires"
          onClick={() => navigate("/my-hires")}
        /> */}

        
        <MenuItem
          icon="/assets/profile_icon/my work.svg"
          title="my works"
          onClick={() => navigate("/freelance-dashboard/freelancermyworks")}
        />

        <MenuItem
          icon="/assets/profile_icon/pause.svg"
          title="Paused Project"
          onClick={() => navigate("/paused")}
        />

        {/* Settings */}
        <h3 className="text-lg font-semibold mt-6">Settings</h3>

        <MenuItem
          icon="/assets/profile_icon/notifi bell.svg"
          title="Notifications"
          onClick={() => alert("Open browser settings for notification")}
        />

        <MenuItem
          icon="/assets/profile_icon/User_Circle.svg"
          title="Account Setting"
        />

        <MenuItem
          icon="/assets/profile_icon/Octagon_Help.svg"
          title="Help Center"
        />

        {/* Logout */}
        <div className="border-t pt-4 mt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-600 font-medium"
          >
            <img
              src="/assets/profile_icon/Log_Out.svg"
              className="w-6 h-6"
              alt=""
            />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- Menu Item Component ----------------
function MenuItem({ icon, title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between py-3 border-b cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <img src={icon} className="w-6 h-6" />
        <span className="font-medium">{title}</span>
      </div>
      <img
        src="/assets/icons/arrow-right.svg"
        className="w-4 h-4 opacity-50"
      />
    </div>
  );
}
