import React, { useState } from "react";

export default function PostJob() {
  const [serviceTitle, setServiceTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState([]);
  const [tools, setTools] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedTool, setSelectedTool] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [timeline, setTimeline] = useState("");

  const skillList = ["React", "Node.js", "Design", "UI/UX", "Flutter"];
  const toolList = ["Figma", "VS Code", "Photoshop", "Illustrator"];

  const addSkill = () => {
    if (selectedSkill && !skills.includes(selectedSkill)) {
      setSkills([...skills, selectedSkill]);
    }
  };

  const addTool = () => {
    if (selectedTool && !tools.includes(selectedTool)) {
      setTools([...tools, selectedTool]);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white p-6">
      {/* Header Section */}
      <div className="bg-yellow-300 rounded-b-3xl py-10 text-center text-2xl font-bold">
        Post a Job
      </div>

      {/* Main Card */}
      <div className="mt-6 border rounded-2xl p-6 shadow-md bg-white max-w-3xl mx-auto">

        {/* Service Title */}
        <label className="block font-semibold text-lg">Service Title</label>
        <input
          type="text"
          className="border w-full mt-2 p-3 rounded-xl"
          placeholder="e.g. Professional Logo Design"
          value={serviceTitle}
          onChange={(e) => setServiceTitle(e.target.value)}
        />

        {/* Description */}
        <label className="block font-semibold text-lg mt-5">Description</label>
        <textarea
          className="border w-full mt-2 p-3 rounded-xl"
          rows={4}
          placeholder="Describe your job requirements..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Category */}
        <label className="block font-semibold text-lg mt-5">Category</label>
        <select
          className="border w-full mt-2 p-3 rounded-xl"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select category</option>
          <option>Design</option>
          <option>Development</option>
          <option>Marketing</option>
          <option>Writing</option>
        </select>

        {/* Skills */}
        <label className="block font-semibold text-lg mt-5">Skills</label>

        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-yellow-200 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex gap-2 mt-3">
          <select
            className="border w-full p-2 rounded-xl"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            <option value="">Select Skill</option>
            {skillList.map((sk, i) => (
              <option key={i}>{sk}</option>
            ))}
          </select>
          <button
            onClick={addSkill}
            className="bg-yellow-300 px-4 rounded-xl"
          >
            Add
          </button>
        </div>

        {/* Tools */}
        <label className="block font-semibold text-lg mt-5">Tools</label>

        <div className="flex flex-wrap gap-2 mt-2">
          {tools.map((tool, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-200 rounded-full text-sm"
            >
              {tool}
            </span>
          ))}
        </div>

        <div className="flex gap-2 mt-3">
          <select
            className="border w-full p-2 rounded-xl"
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
          >
            <option value="">Select Tool</option>
            {toolList.map((tl, i) => (
              <option key={i}>{tl}</option>
            ))}
          </select>
          <button 
            onClick={addTool} 
            className="bg-blue-300 px-4 rounded-xl"
          >
            Add
          </button>
        </div>

        {/* Budget Range */}
        <label className="block font-semibold text-lg mt-5">Budget Range</label>
        <div className="flex gap-4 mt-2">
          <input
            type="number"
            className="border p-2 rounded-xl w-full"
            placeholder="₹ Min"
            value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)}
          />
          <input
            type="number"
            className="border p-2 rounded-xl w-full"
            placeholder="₹ Max"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
          />
        </div>

        {/* Timeline */}
        <label className="block font-semibold text-lg mt-5">Timeline</label>
        <select
          className="border w-full mt-2 p-3 rounded-xl"
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
        >
          <option value="">Select timeline</option>
          <option>1 Week</option>
          <option>2 Weeks</option>
          <option>1 Month</option>
          <option>Flexible</option>
        </select>

        {/* Buttons */}
        <div className="flex gap-4 mt-8 justify-end">
          <button className="border px-6 py-2 rounded-full">Cancel</button>
          <button className="bg-yellow-400 px-6 py-2 rounded-full font-semibold">
            Save Job
          </button>
        </div>
      </div>
    </div>
  );
}
