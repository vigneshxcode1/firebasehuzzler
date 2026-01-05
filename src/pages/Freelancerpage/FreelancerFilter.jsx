

// import React, { useEffect, useState } from "react";
// import { X } from "lucide-react";

// /* ================= DEFAULT FILTERS ================= */
// const DEFAULT_FILTERS = {
//   categories: [],
//   skills: [],
//   postingTime: "",
//   budgetRange: { start: 0, end: 100000 },
// };

// export default function JobFiltersFullScreen({
//   currentFilters = DEFAULT_FILTERS,
//   onApply = () => {},
//   onClose = () => {},
// }) {
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [selectedSkills, setSelectedSkills] = useState([]);
//   const [selectedTime, setSelectedTime] = useState("");
//   const [minPrice, setMinPrice] = useState("0");
//   const [maxPrice, setMaxPrice] = useState("100000");
//   const [showAllCategories, setShowAllCategories] = useState(false);
//   const [showAllSkills, setShowAllSkills] = useState(false);

//   const allCategories = [
//     "Web Development","Mobile App Development","UI/UX Design","Graphic Design",
//     "Video Editing","Digital Marketing","SEO Optimization","Content Writing",
//     "Copywriting","Social Media Management","Virtual Assistant","Customer Support",
//     "E-commerce Setup","Data Entry","Translation","3D Modeling",
//     "Game Development","Product Photography","Voice Over","Project Management",
//   ];

//   const allSkills = [
//     "Logo Design","Website Design","App Design","UX Design","Illustration",
//     "Photoshop Editing","React","Python","SQL","Node.js","Flutter","SEO",
//     "Content Marketing","Video Editing","Animation","AI Development",
//     "Machine Learning","Blockchain","DevOps","Cloud Computing",
//   ];

//   useEffect(() => {
//     if (!currentFilters) return;
//     setSelectedCategories(currentFilters.categories ?? []);
//     setSelectedSkills(currentFilters.skills ?? []);
//     setSelectedTime(currentFilters.postingTime ?? "");
//     setMinPrice(String(currentFilters.budgetRange?.start ?? 0));
//     setMaxPrice(String(currentFilters.budgetRange?.end ?? 100000));
//   }, [currentFilters]);

//   const toggleItem = (value, list, setList) => {
//     setList((prev) =>
//       prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
//     );
//   };

//   const handleApply = () => {
//     onApply({
//       categories: selectedCategories,
//       skills: selectedSkills,
//       postingTime: selectedTime,
//       budgetRange: {
//         start: Number(minPrice) || 0,
//         end: Number(maxPrice) || 100000,
//       },
//     });
//     onClose();
//   };

//   return (
//     <>
//       <style>{css}</style>

//       <div className="filter-overlay" onClick={onClose}>
//         <div className="filter-container" onClick={(e) => e.stopPropagation()}>
          
//           {/* HEADER */}
//           <div className="filter-header">
//             <button onClick={onClose} className="icon-btn">
//               <X size={22} />
//             </button>
//             <h2>Filters</h2>
//             <div style={{ width: 22 }} />
//           </div>

//           {/* BODY */}
//           <div className="filter-body">
//             <SectionTitle
//               title="Categories"
//               action={showAllCategories ? "See Less" : "See All"}
//               onAction={() => setShowAllCategories(!showAllCategories)}
//             />

//             <ChipGroup
//               items={showAllCategories ? allCategories : allCategories.slice(0, 3)}
//               selected={selectedCategories}
//               onToggle={(v) =>
//                 toggleItem(v, selectedCategories, setSelectedCategories)
//               }
//             />

//             <SectionTitle
//               title="Skills & Tools"
//               action={showAllSkills ? "See Less" : "See All"}
//               onAction={() => setShowAllSkills(!showAllSkills)}
//             />

//             <ChipGroup
//               items={showAllSkills ? allSkills : allSkills.slice(0, 3)}
//               selected={selectedSkills}
//               onToggle={(v) => toggleItem(v, selectedSkills, setSelectedSkills)}
//             />

//             <SectionTitle title="Price Range" />
//             <div className="price-row">
//               <PriceBox value={minPrice} onChange={setMinPrice} />
//               <PriceBox value={maxPrice} onChange={setMaxPrice} />
//             </div>

//             <SectionTitle title="Posting Time" />
//             {["Posted Today", "Last 3 Days", "Last 7 Days", "Last 30 Days"].map(
//               (t) => (
//                 <RadioRow
//                   key={t}
//                   label={t}
//                   active={selectedTime === t}
//                   onClick={() => setSelectedTime(t)}
//                 />
//               )
//             )}
//           </div>

//           {/* FOOTER */}
//           <div className="filter-footer">
//             <button className="clear-btn" onClick={() => window.location.reload()}>
//               Clear All
//             </button>
//             <button className="apply-btn" onClick={handleApply}>
//               Apply Filters
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// /* ================= SMALL COMPONENTS ================= */

// function SectionTitle({ title, action, onAction }) {
//   return (
//     <div className="section-title">
//       <h3>{title}</h3>
//       {action && <button onClick={onAction}>{action}</button>}
//     </div>
//   );
// }

// function ChipGroup({ items, selected, onToggle }) {
//   return (
//     <div className="chip-group">
//       {items.map((item) => {
//         const active = selected.includes(item);
//         return (
//           <button
//             key={item}
//             className={`chip ${active ? "active" : ""}`}
//             onClick={() => onToggle(item)}
//           >
//             {item} {active && <X size={14} />}
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// function PriceBox({ value, onChange }) {
//   return (
//     <input
//       type="number"
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="price-box"
//     />
//   );
// }

// function RadioRow({ label, active, onClick }) {
//   return (
//     <div className="radio-row" onClick={onClick}>
//       <span>{label}</span>
//       <input type="radio" checked={active} readOnly />
//     </div>
//   );
// }

// /* ================= CSS ================= */

// const css = `
// .filter-overlay {
//   position: fixed;
//   inset: 0;
//   background: rgba(0,0,0,0.45);
//   display: flex;
//   justify-content: center;
//   align-items: flex-end;
//   z-index: 9999;
// }

// .filter-container {
//   width: 100%;
//   max-width: 480px;
//   height: 92%;
//   background: #fff;
//   border-radius: 18px 18px 0 0;
//   display: flex;
//   flex-direction: column;
//   animation: slideUp .25s ease;
//   font-family: sans-serif;
// }

// @keyframes slideUp {
//   from { transform: translateY(100%); }
//   to { transform: translateY(0); }
// }

// .filter-header {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 14px 16px;
//   border-bottom: 1px solid #ddd;
// }

// .filter-body {
//   flex: 1;
//   overflow-y: auto;
//   padding: 16px;
// }

// .filter-footer {
//   display: flex;
//   gap: 12px;
//   padding: 14px;
//   border-top: 1px solid #ddd;
// }

// .section-title {
//   display: flex;
//   justify-content: space-between;
//   margin: 12px 0 10px;
// }

// .section-title button {
//   background: none;
//   border: none;
//   color: #6d28d9;
//   cursor: pointer;
// }

// .chip-group {
//   display: flex;
//   flex-wrap: wrap;
//   gap: 8px;
// }

// .chip {
//   padding: 8px 14px;
//   border-radius: 10px;
//   background: #fde68a;
//   border: none;
//   cursor: pointer;
//   font-size: 14px;
// }

// .chip.active {
//   background: #facc15;
// }

// .price-row {
//   display: flex;
//   gap: 12px;
// }

// .price-box {
//   flex: 1;
//   height: 44px;
//   padding: 0 10px;
//   border-radius: 8px;
//   border: none;
//   background: #fde68a;
// }

// .radio-row {
//   display: flex;
//   justify-content: space-between;
//   padding: 10px 0;
//   cursor: pointer;
// }

// .clear-btn {
//   flex: 1;
//   padding: 12px;
//   background: #ede9fe;
//   color: #6d28d9;
//   border: none;
//   border-radius: 12px;
// }

// .apply-btn {
//   flex: 1;
//   padding: 12px;
//   background: #6d28d9;
//   color: #fff;
//   border: none;
//   border-radius: 12px;
// }

// .icon-btn {
//   background: none;
//   border: none;
//   cursor: pointer;
// }
// `;





import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

/* ================= DEFAULT FILTERS ================= */
const DEFAULT_FILTERS = {
  categories: [],
  skills: [],
  postingTime: "",
  budgetRange: { start: 0, end: 100000 },
};

export default function JobFiltersFullScreen({
  currentFilters = DEFAULT_FILTERS,
  onApply = () => { },
  onClose = () => { },
}) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("100000");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);





  const allCategories = [
    "Web Development", "Mobile App Development", "UI/UX Design", "Graphic Design",
    "Video Editing", "Digital Marketing", "SEO Optimization", "Content Writing",
    "Copywriting", "Social Media Management", "Virtual Assistant", "Customer Support",
    "E-commerce Setup", "Data Entry", "Translation", "3D Modeling",
    "Game Development", "Product Photography", "Voice Over", "Project Management",
  ];

  const allSkills = [
    "Logo Design", "Website Design", "App Design", "UX Design", "Illustration",
    "Photoshop Editing", "React", "Python", "SQL", "Node.js", "Flutter", "SEO",
    "Content Marketing", "Video Editing", "Animation", "AI Development",
    "Machine Learning", "Blockchain", "DevOps", "Cloud Computing",
  ];

  useEffect(() => {
    if (!currentFilters) return;
    setSelectedCategories(currentFilters.categories ?? []);
    setSelectedSkills(currentFilters.skills ?? []);
    setSelectedTime(currentFilters.postingTime ?? "");
    setMinPrice(String(currentFilters.budgetRange?.start ?? 0));
    setMaxPrice(String(currentFilters.budgetRange?.end ?? 100000));
  }, [currentFilters]);

  const toggleItem = (value, list, setList) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleApply = () => {
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || 100000;

    onApply({
      categories: selectedCategories,
      skills: selectedSkills,
      postingTime: selectedTime,
      budgetRange: {
        start: Math.min(min, max),
        end: Math.max(min, max),
      },
    });

    onClose();
  };


  return (
    <>
      <style>{css}</style>

      <div className="filter-overlay" onClick={onClose}>
        <div className="filter-container" onClick={(e) => e.stopPropagation()}>

          {/* HEADER */}
          <div className="filter-header">
            <button onClick={onClose} className="icon-btn">
              <X size={22} />
            </button>
            <h2>Filters</h2>
            <div style={{ width: 22 }} />
          </div>

          {/* BODY */}
          <div className="filter-body">
            <SectionTitle
              title="Categories"
              action={showAllCategories ? "See Less" : "See All"}
              onAction={() => setShowAllCategories(!showAllCategories)}
            />

            <ChipGroup
              items={showAllCategories ? allCategories : allCategories.slice(0, 3)}
              selected={selectedCategories}
              onToggle={(v) =>
                toggleItem(v, selectedCategories, setSelectedCategories)
              }
            />

            <SectionTitle
              title="Skills & Tools"
              action={showAllSkills ? "See Less" : "See All"}
              onAction={() => setShowAllSkills(!showAllSkills)}
            />

            <ChipGroup
              items={showAllSkills ? allSkills : allSkills.slice(0, 3)}
              selected={selectedSkills}
              onToggle={(v) => toggleItem(v, selectedSkills, setSelectedSkills)}
            />

            <SectionTitle title="Price Range" />
            <div className="price-row">
              <PriceBox value={minPrice} onChange={setMinPrice} />
              <PriceBox value={maxPrice} onChange={setMaxPrice} />
            </div>

            <SectionTitle title="Posting Time" />
            {["Posted Today", "Last 3 Days", "Last 7 Days", "Last 30 Days"].map(
              (t) => (
                <RadioRow
                  key={t}
                  label={t}
                  active={selectedTime === t}
                  onClick={() => setSelectedTime(t)}
                />
              )
            )}
          </div>

          {/* FOOTER */}
          <div className="filter-footer">
            <button
              className="clear-btn"
              onClick={() => {
                onApply({
                  categories: [],
                  skills: [],
                  postingTime: "",
                  budgetRange: { start: 0, end: 100000 },
                });
                onClose();
              }}
            >
              Clear All
            </button>

            <button className="apply-btn" onClick={handleApply}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= SMALL COMPONENTS ================= */

function SectionTitle({ title, action, onAction }) {
  return (
    <div className="section-title">
      <h3>{title}</h3>
      {action && <button onClick={onAction}>{action}</button>}
    </div>
  );
}

function ChipGroup({ items, selected, onToggle }) {
  return (
    <div className="chip-group">
      {items.map((item) => {
        const active = selected.includes(item);
        return (
          <button
            key={item}
            className={`chip ${active ? "active" : ""}`}
            onClick={() => onToggle(item)}
          >
            {item} {active && <X size={14} />}
          </button>
        );
      })}
    </div>
  );
}

function PriceBox({ value, onChange }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="price-box"
    />
  );
}

function RadioRow({ label, active, onClick }) {
  return (
    <div className="radio-row" onClick={onClick}>
      <span>{label}</span>
      <input type="radio" checked={active} readOnly />
    </div>
  );
}

/* ================= CSS ================= */

const css = `
.filter-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 9999;
}

.filter-container {
  width: 100%;
  max-width: 480px;
  height: 92%;
  background: #fff;
  border-radius: 18px 18px 0 0;
  display: flex;
  flex-direction: column;
  animation: slideUp .25s ease;
  font-family: sans-serif;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #ddd;
}

.filter-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.filter-footer {
  display: flex;
  gap: 12px;
  padding: 14px;
  border-top: 1px solid #ddd;
}

.section-title {
  display: flex;
  justify-content: space-between;
  margin: 12px 0 10px;
}

.section-title button {
  background: none;
  border: none;
  color: #6d28d9;
  cursor: pointer;
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 8px 14px;
  border-radius: 10px;
  background: #fde68a;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.chip.active {
  background: #facc15;
}

.price-row {
  display: flex;
  gap: 12px;
}

.price-box {
  flex: 1;
  height: 44px;
  padding: 0 10px;
  border-radius: 8px;
  border: none;
  background: #fde68a;
}

.radio-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  cursor: pointer;
}

.clear-btn {
  flex: 1;
  padding: 12px;
  background: #ede9fe;
  color: #6d28d9;
  border: none;
  border-radius: 12px;
}

.apply-btn {
  flex: 1;
  padding: 12px;
  background: #6d28d9;
  color: #fff;
  border: none;
  border-radius: 12px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
}
`;
