



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddService() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deliveryDays: "",
    skills: "",
    tools: "",
    requirements: "",
  });

  const [previewFiles, setPreviewFiles] = useState([]);
  const [error, setError] = useState("");

  // 🧩 Handle text input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🧩 Handle file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    let errorMsg = "";

    files.forEach((file) => {
      if (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
        validFiles.push(file);
      } else if (file.type.startsWith("video/") && file.size <= 20 * 1024 * 1024) {
        validFiles.push(file);
      } else {
        errorMsg = `❌ ${file.name} exceeds size limit (5MB for images / 20MB for videos).`;
      }
    });

    if (errorMsg) {
      setError(errorMsg);
      setTimeout(() => setError(""), 4000);
    } else {
      setError("");
    }

    setPreviewFiles(validFiles);
  };

  // 🧩 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("userEmail");
    if (!email) return alert("User not logged in!");

    const serviceData = {
      ...formData,
      userEmail: email,
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tools: formData.tools
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      images: previewFiles.map((file) => URL.createObjectURL(file)), // temporary preview (later AWS S3)
    };

    try {
      const res = await fetch("http://localhost:5000/api/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });

      if (res.ok) {
        alert("✅ Service saved successfully!");
        navigate("/service");
      } else {
        alert("❌ Failed to save service");
      }
    } catch (err) {
      console.error("Save service error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Add Your Service</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 🟡 Title */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Service Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Logo Design That Pops"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yellow-400"
            />
          </div>

          {/* 🟡 Description */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your service"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yellow-400"
            />
          </div>

          {/* 🟡 Category, Price, Delivery Days */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Select category</option>
                <option>Design</option>
                <option>Development</option>
                <option>Writing</option>
                <option>Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="₹500"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Delivery Days
              </label>
              <input
                type="number"
                name="deliveryDays"
                value={formData.deliveryDays}
                onChange={handleChange}
                placeholder="7"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
          </div>

          {/* 🟡 Skills & Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Skills
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Tools
              </label>
              <input
                type="text"
                name="tools"
                value={formData.tools}
                onChange={handleChange}
                placeholder="VS Code, Figma"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
          </div>

          {/* 🟡 File upload */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Sample Project
            </label>
            <input type="file" multiple onChange={handleFileChange} />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {/* 🟡 Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/service")}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
