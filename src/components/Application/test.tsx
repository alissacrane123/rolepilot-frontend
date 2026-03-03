// import { useState } from "react";

// // --- Data ---
// const APP_DATA = {
//   company: "NVIDIA",
//   logo: "N",
//   logoColor: "#76b900",
//   title: "Frontend Web Developer",
//   team: "Hardware Infrastructure",
//   salary: "$152,000 – $287,500",
//   location: "Santa Clara, CA or Westford, MA",
//   tags: ["hybrid", "senior"],
//   stage: "Applied",
//   stageColor: "#6366f1",
//   matchScore: 76,
//   appliedDate: "Feb 15, 2026",
//   url: "nvidia.com/careers",
//   aboutCompany:
//     "NVIDIA is a technology company that invented the GPU in 1999 and has continuously reinvented itself, leading in PC gaming, computer graphics, parallel computing, and modern AI through GPU deep learning.",
//   aboutRole:
//     "Frontend Web Developer role on NVIDIA's Hardware Infrastructure team building highly available services and scalable web applications. The role involves frontend design and development, UI/UX collaboration, and maintaining infrastructure tools used across the company for data processing workflows.",
//   requiredSkills: ["HTML", "CSS", "JavaScript", "Vue.js", "Node.js", "REST APIs", "Web Architectures", "Object-oriented design", "Data structures and algorithms"],
//   niceToHave: ["Distributed microservices", "Cross-browser compatibility", "Python", "Golang"],
//   technologies: ["Vue.js", "Node.js", "HTML", "CSS", "JavaScript", "REST APIs"],
// };

// const INITIAL_STRENGTHS = [
//   "7 years experience exceeds 5+ requirement",
//   "Strong frontend development background with React/TypeScript",
//   "Extensive REST API experience from Coinbase and personal projects",
//   "Full-stack experience including Node.js",
//   "Experience building scalable web applications for millions of users",
//   "Infrastructure and tooling experience from OnchainKit team leadership",
// ];

// const INITIAL_GAPS = [
//   "No Vue.js experience (uses React instead)",
//   "Limited experience with hardware infrastructure teams",
//   "No mentioned experience with data visualization frameworks",
// ];

// const INITIAL_TALKING_POINTS = [
//   "Led OnchainKit team building reusable frontend components with 22,000+ weekly downloads",
//   "Architected DEX trading surfaces handling millions of users at Coinbase",
//   "Built 37-endpoint REST API for Memo photo-sharing platform",
//   "Experience with full-stack TypeScript/React applications at Blockpoint Systems",
//   "Delivered scalable trading flows across web and mobile platforms",
// ];

// const INITIAL_FOCUS_AREAS = [
//   "Vue.js vs React experience and transferability",
//   "REST API architecture and design patterns",
//   "Cross-browser compatibility solutions",
//   "UI/UX collaboration experience",
//   "Scalable frontend architecture",
// ];

// const INITIAL_MEETINGS = [
//   {
//     id: 1,
//     title: "Recruiter Phone Screen",
//     date: "Mar 5, 2026",
//     time: "10:00 AM",
//     duration: "30 min",
//     with: "Sarah Kim, Technical Recruiter",
//     type: "phone",
//     status: "upcoming",
//     notes: "Initial screening call. Be ready to discuss background and interest in NVIDIA.",
//     talkingPoints: [
//       { id: 1, text: "Mention OnchainKit leadership and scale of impact", done: false },
//       { id: 2, text: "Ask about team structure and day-to-day workflow", done: false },
//       { id: 3, text: "Discuss Vue.js learning plan — highlight React transferability", done: false },
//     ],
//   },
//   {
//     id: 2,
//     title: "Technical Interview — Round 1",
//     date: "Mar 12, 2026",
//     time: "2:00 PM",
//     duration: "60 min",
//     with: "David Chen, Staff Engineer",
//     type: "technical",
//     status: "scheduled",
//     notes: "",
//     talkingPoints: [
//       { id: 1, text: "Prepare REST API system design examples", done: false },
//       { id: 2, text: "Review Vue.js fundamentals and composition API", done: false },
//     ],
//   },
// ];

// const STAGES_PIPELINE = [
//   { key: "applied", label: "Applied", color: "#6366f1" },
//   { key: "response", label: "Response", color: "#8b5cf6" },
//   { key: "phone", label: "Phone Screen", color: "#a78bfa" },
//   { key: "technical", label: "Technical", color: "#c4b5fd" },
//   { key: "onsite", label: "Onsite", color: "#ddd6fe" },
// ];

// // --- Icons ---
// const Icons = {
//   back: (
//     <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//       <path d="M8.5 2.5L4 7L8.5 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
//   calendar: (
//     <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//       <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.1"/>
//       <line x1="1.5" y1="5.5" x2="12.5" y2="5.5" stroke="currentColor" strokeWidth="1.1"/>
//       <line x1="4.5" y1="1" x2="4.5" y2="3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
//       <line x1="9.5" y1="1" x2="9.5" y2="3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
//     </svg>
//   ),
//   clock: (
//     <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//       <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.1"/>
//       <path d="M6 3V6L8 7.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
//   user: (
//     <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//       <circle cx="6" cy="3.5" r="2.5" stroke="currentColor" strokeWidth="1.1"/>
//       <path d="M1 11C1 8.5 3 7 6 7C9 7 11 8.5 11 11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
//     </svg>
//   ),
//   plus: (
//     <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//       <line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
//       <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
//     </svg>
//   ),
//   check: (
//     <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
//       <path d="M2 5L4.5 7.5L8 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
//   x: (
//     <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
//       <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
//     </svg>
//   ),
//   link: (
//     <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//       <path d="M5 7L7 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
//       <path d="M7.5 4.5L8.5 3.5C9.3 2.7 9.3 1.5 8.5 0.7V0.7C7.7-0.1 6.5-0.1 5.7 0.7L4.5 1.9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" transform="translate(0,2)"/>
//       <path d="M4.5 7.5L3.5 8.5C2.7 9.3 1.5 9.3 0.7 8.5V8.5C-0.1 7.7-0.1 6.5 0.7 5.7L1.9 4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" transform="translate(1,0)"/>
//     </svg>
//   ),
//   mapPin: (
//     <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//       <path d="M6 1C4.067 1 2.5 2.567 2.5 4.5C2.5 7.25 6 11 6 11C6 11 9.5 7.25 9.5 4.5C9.5 2.567 7.933 1 6 1Z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
//       <circle cx="6" cy="4.5" r="1" stroke="currentColor" strokeWidth="1"/>
//     </svg>
//   ),
//   dollar: (
//     <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//       <path d="M6 1V11M8.5 3.5C8.5 2.7 7.4 2 6 2C4.6 2 3.5 2.7 3.5 3.5C3.5 4.3 4.6 5 6 5C7.4 5 8.5 5.7 8.5 6.5C8.5 7.3 7.4 8 6 8C4.6 8 3.5 7.3 3.5 6.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
//     </svg>
//   ),
// };

// export default function ApplicationDetail() {
//   const [meetings, setMeetings] = useState(INITIAL_MEETINGS);
//   const [expandedMeeting, setExpandedMeeting] = useState(1);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [newTalkingPoint, setNewTalkingPoint] = useState({});
//   const [editingNotes, setEditingNotes] = useState({});
//   const [showAddMeeting, setShowAddMeeting] = useState(false);
//   const [newMeeting, setNewMeeting] = useState({ title: "", date: "", time: "", duration: "30 min", with: "", notes: "" });

//   const app = APP_DATA;
//   const currentStageIdx = 0;

//   const toggleTalkingPoint = (meetingId, tpId) => {
//     setMeetings((prev) =>
//       prev.map((m) =>
//         m.id === meetingId
//           ? { ...m, talkingPoints: m.talkingPoints.map((tp) => (tp.id === tpId ? { ...tp, done: !tp.done } : tp)) }
//           : m
//       )
//     );
//   };

//   const addTalkingPoint = (meetingId) => {
//     const text = newTalkingPoint[meetingId]?.trim();
//     if (!text) return;
//     setMeetings((prev) =>
//       prev.map((m) =>
//         m.id === meetingId
//           ? { ...m, talkingPoints: [...m.talkingPoints, { id: Date.now(), text, done: false }] }
//           : m
//       )
//     );
//     setNewTalkingPoint((p) => ({ ...p, [meetingId]: "" }));
//   };

//   const removeTalkingPoint = (meetingId, tpId) => {
//     setMeetings((prev) =>
//       prev.map((m) =>
//         m.id === meetingId
//           ? { ...m, talkingPoints: m.talkingPoints.filter((tp) => tp.id !== tpId) }
//           : m
//       )
//     );
//   };

//   const updateNotes = (meetingId, notes) => {
//     setMeetings((prev) => prev.map((m) => (m.id === meetingId ? { ...m, notes } : m)));
//   };

//   const addMeeting = () => {
//     if (!newMeeting.title.trim()) return;
//     const meeting = {
//       id: Date.now(),
//       ...newMeeting,
//       type: "general",
//       status: "scheduled",
//       talkingPoints: [],
//     };
//     setMeetings((prev) => [...prev, meeting]);
//     setNewMeeting({ title: "", date: "", time: "", duration: "30 min", with: "", notes: "" });
//     setShowAddMeeting(false);
//     setExpandedMeeting(meeting.id);
//   };

//   const TABS = [
//     { key: "overview", label: "Overview" },
//     { key: "meetings", label: `Meetings (${meetings.length})` },
//     { key: "analysis", label: "AI Analysis" },
//   ];

//   return (
//     <div style={s.page}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500&display=swap');
//         * { margin: 0; padding: 0; box-sizing: border-box; }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
//         @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 800px; } }
//         input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
//         input:focus, textarea:focus { outline: none; border-color: rgba(99,102,241,0.4) !important; background: rgba(99,102,241,0.04) !important; }
//         textarea { resize: vertical; }
//       `}</style>

//       {/* Header */}
//       <header style={s.header}>
//         <div style={s.headerLeft}>
//           <div style={s.logoMark}>
//             <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
//               <circle cx="9" cy="9" r="8" stroke="#6366f1" strokeWidth="1.5" />
//               <circle cx="9" cy="9" r="3" fill="#6366f1" />
//             </svg>
//           </div>
//           <span style={s.logoText}>RolePilot</span>
//         </div>
//         <nav style={s.nav}>
//           <span style={{ ...s.navItem, ...s.navItemActive }}>Board</span>
//           <span style={s.navItem}>Profile</span>
//           <span style={s.navItem}>Analytics</span>
//         </nav>
//         <div style={s.headerRight}>
//           <div style={s.avatar}>AC</div>
//         </div>
//       </header>

//       <main style={s.main}>
//         {/* Back link */}
//         <div style={s.backRow}>
//           <button style={s.backBtn}>{Icons.back} Applications</button>
//         </div>

//         {/* Hero card */}
//         <div style={{ ...s.heroCard, animation: "fadeInUp 0.4s ease both" }}>
//           <div style={s.heroTop}>
//             <div style={s.heroIdentity}>
//               <div style={{ ...s.companyLogo, borderColor: `${app.logoColor}33` }}>
//                 <span style={{ color: app.logoColor, fontSize: 20, fontWeight: 800 }}>{app.logo}</span>
//               </div>
//               <div>
//                 <div style={s.heroBadges}>
//                   <span style={s.stageBadge}>
//                     <span style={{ ...s.stageDot, background: app.stageColor }} />
//                     {app.stage}
//                   </span>
//                   <span style={s.matchBadge}>{app.matchScore}% match</span>
//                 </div>
//                 <h1 style={s.heroTitle}>{app.title}</h1>
//                 <p style={s.heroCompany}>{app.company} · {app.team}</p>
//               </div>
//             </div>
//             <button style={s.moveStageBtn}>Move Stage</button>
//           </div>

//           {/* Meta row */}
//           <div style={s.metaRow}>
//             <span style={s.metaItem}>{Icons.dollar} {app.salary}</span>
//             <span style={s.metaDivider} />
//             <span style={s.metaItem}>{Icons.mapPin} {app.location}</span>
//             <span style={s.metaDivider} />
//             <span style={s.metaItem}>{Icons.calendar} Applied {app.appliedDate}</span>
//             <div style={s.tagGroup}>
//               {app.tags.map((t) => (
//                 <span key={t} style={s.heroTag}>{t}</span>
//               ))}
//             </div>
//           </div>

//           {/* Stage pipeline */}
//           <div style={s.pipeline}>
//             {STAGES_PIPELINE.map((stage, i) => (
//               <div key={stage.key} style={s.pipelineStep}>
//                 <div style={{
//                   ...s.pipelineNode,
//                   background: i <= currentStageIdx ? stage.color : "rgba(255,255,255,0.06)",
//                   borderColor: i <= currentStageIdx ? stage.color : "rgba(255,255,255,0.1)",
//                 }} />
//                 {i < STAGES_PIPELINE.length - 1 && (
//                   <div style={{
//                     ...s.pipelineLine,
//                     background: i < currentStageIdx ? stage.color : "rgba(255,255,255,0.06)",
//                   }} />
//                 )}
//                 <span style={{
//                   ...s.pipelineLabel,
//                   color: i <= currentStageIdx ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
//                 }}>{stage.label}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Tab bar */}
//         <div style={s.tabBar}>
//           {TABS.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               style={{
//                 ...s.tab,
//                 ...(activeTab === tab.key ? s.tabActive : {}),
//               }}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Overview tab */}
//         {activeTab === "overview" && (
//           <div style={s.overviewGrid}>
//             <div style={{ ...s.card, animation: "fadeInUp 0.35s ease both", animationDelay: "0ms" }}>
//               <h3 style={s.cardLabel}>About the Company</h3>
//               <p style={s.cardBody}>{app.aboutCompany}</p>
//             </div>
//             <div style={{ ...s.card, animation: "fadeInUp 0.35s ease both", animationDelay: "60ms" }}>
//               <h3 style={s.cardLabel}>About the Role</h3>
//               <p style={s.cardBody}>{app.aboutRole}</p>
//             </div>
//             <div style={{ ...s.card, animation: "fadeInUp 0.35s ease both", animationDelay: "120ms" }}>
//               <h3 style={s.cardLabel}>Required Skills</h3>
//               <div style={s.skillChips}>
//                 {app.requiredSkills.map((sk) => (
//                   <span key={sk} style={s.skillChip}>{sk}</span>
//                 ))}
//               </div>
//             </div>
//             <div style={{ ...s.card, animation: "fadeInUp 0.35s ease both", animationDelay: "150ms" }}>
//               <h3 style={s.cardLabel}>Nice to Have</h3>
//               <div style={s.skillChips}>
//                 {app.niceToHave.map((sk) => (
//                   <span key={sk} style={{ ...s.skillChip, ...s.skillChipAlt }}>{sk}</span>
//                 ))}
//               </div>
//             </div>
//             <div style={{ ...s.card, animation: "fadeInUp 0.35s ease both", animationDelay: "180ms" }}>
//               <h3 style={s.cardLabel}>Technologies</h3>
//               <div style={s.skillChips}>
//                 {app.technologies.map((sk) => (
//                   <span key={sk} style={{ ...s.skillChip, ...s.skillChipTech }}>{sk}</span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Meetings tab */}
//         {activeTab === "meetings" && (
//           <div style={{ animation: "fadeInUp 0.35s ease both" }}>
//             <div style={s.meetingsHeader}>
//               <p style={s.meetingsSubtitle}>
//                 {meetings.length} meeting{meetings.length !== 1 ? "s" : ""} scheduled
//               </p>
//               <button onClick={() => setShowAddMeeting(!showAddMeeting)} style={s.addMeetingBtn}>
//                 {Icons.plus}
//                 <span>Add Meeting</span>
//               </button>
//             </div>

//             {/* Add meeting form */}
//             {showAddMeeting && (
//               <div style={{ ...s.card, marginBottom: 12, animation: "fadeInUp 0.25s ease both" }}>
//                 <h3 style={{ ...s.cardLabel, marginBottom: 16 }}>New Meeting</h3>
//                 <div style={s.formGrid}>
//                   <div style={s.formField}>
//                     <label style={s.formLabel}>Title</label>
//                     <input
//                       value={newMeeting.title}
//                       onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
//                       placeholder="e.g. Recruiter Call"
//                       style={s.formInput}
//                     />
//                   </div>
//                   <div style={s.formField}>
//                     <label style={s.formLabel}>With</label>
//                     <input
//                       value={newMeeting.with}
//                       onChange={(e) => setNewMeeting({ ...newMeeting, with: e.target.value })}
//                       placeholder="e.g. Jane Doe, Engineering Manager"
//                       style={s.formInput}
//                     />
//                   </div>
//                   <div style={s.formField}>
//                     <label style={s.formLabel}>Date</label>
//                     <input
//                       value={newMeeting.date}
//                       onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
//                       placeholder="Mar 15, 2026"
//                       style={s.formInput}
//                     />
//                   </div>
//                   <div style={s.formField}>
//                     <label style={s.formLabel}>Time</label>
//                     <input
//                       value={newMeeting.time}
//                       onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
//                       placeholder="2:00 PM"
//                       style={s.formInput}
//                     />
//                   </div>
//                   <div style={s.formField}>
//                     <label style={s.formLabel}>Duration</label>
//                     <input
//                       value={newMeeting.duration}
//                       onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })}
//                       placeholder="30 min"
//                       style={s.formInput}
//                     />
//                   </div>
//                 </div>
//                 <div style={s.formActions}>
//                   <button onClick={() => setShowAddMeeting(false)} style={s.cancelBtn}>Cancel</button>
//                   <button onClick={addMeeting} style={s.confirmBtn}>Add Meeting</button>
//                 </div>
//               </div>
//             )}

//             {/* Meeting timeline */}
//             <div style={s.timeline}>
//               {meetings.map((meeting, mi) => {
//                 const isExpanded = expandedMeeting === meeting.id;
//                 const isEditing = editingNotes[meeting.id];
//                 const completedTPs = meeting.talkingPoints.filter((tp) => tp.done).length;
//                 const totalTPs = meeting.talkingPoints.length;

//                 return (
//                   <div
//                     key={meeting.id}
//                     style={{
//                       ...s.timelineItem,
//                       animation: "fadeInUp 0.35s ease both",
//                       animationDelay: `${mi * 70}ms`,
//                     }}
//                   >
//                     {/* Timeline connector */}
//                     <div style={s.timelineTrack}>
//                       <div style={{
//                         ...s.timelineDot,
//                         background: meeting.status === "upcoming" ? "#6366f1" : "rgba(255,255,255,0.15)",
//                         boxShadow: meeting.status === "upcoming" ? "0 0 0 4px rgba(99,102,241,0.15)" : "none",
//                       }} />
//                       {mi < meetings.length - 1 && <div style={s.timelineConnector} />}
//                     </div>

//                     {/* Meeting card */}
//                     <div style={{ flex: 1, minWidth: 0 }}>
//                       <button
//                         onClick={() => setExpandedMeeting(isExpanded ? null : meeting.id)}
//                         style={s.meetingCardHeader}
//                       >
//                         <div style={s.meetingInfo}>
//                           <h3 style={s.meetingTitle}>{meeting.title}</h3>
//                           <div style={s.meetingMeta}>
//                             <span style={s.meetingMetaItem}>{Icons.calendar} {meeting.date}</span>
//                             <span style={s.meetingMetaItem}>{Icons.clock} {meeting.time} · {meeting.duration}</span>
//                             <span style={s.meetingMetaItem}>{Icons.user} {meeting.with}</span>
//                           </div>
//                         </div>
//                         <div style={s.meetingRight}>
//                           {totalTPs > 0 && (
//                             <span style={s.tpCounter}>
//                               {completedTPs}/{totalTPs}
//                             </span>
//                           )}
//                           <svg
//                             width="14" height="14" viewBox="0 0 14 14" fill="none"
//                             style={{
//                               transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
//                               transition: "transform 0.2s ease",
//                               opacity: 0.35,
//                             }}
//                           >
//                             <path d="M3.5 5L7 8.5L10.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
//                           </svg>
//                         </div>
//                       </button>

//                       {isExpanded && (
//                         <div style={s.meetingExpanded}>
//                           {/* Notes section */}
//                           <div style={s.meetingSection}>
//                             <div style={s.meetingSectionHeader}>
//                               <h4 style={s.meetingSectionTitle}>Notes</h4>
//                               <button
//                                 onClick={() => setEditingNotes((p) => ({ ...p, [meeting.id]: !p[meeting.id] }))}
//                                 style={s.editBtn}
//                               >
//                                 {isEditing ? "Done" : "Edit"}
//                               </button>
//                             </div>
//                             {isEditing ? (
//                               <textarea
//                                 value={meeting.notes}
//                                 onChange={(e) => updateNotes(meeting.id, e.target.value)}
//                                 placeholder="Add notes about this meeting..."
//                                 style={s.notesTextarea}
//                                 rows={4}
//                               />
//                             ) : (
//                               <p style={s.notesDisplay}>
//                                 {meeting.notes || "No notes yet — click Edit to add some."}
//                               </p>
//                             )}
//                           </div>

//                           {/* Talking points section */}
//                           <div style={s.meetingSection}>
//                             <h4 style={s.meetingSectionTitle}>Talking Points</h4>
//                             <div style={s.tpList}>
//                               {meeting.talkingPoints.map((tp) => (
//                                 <div
//                                   key={tp.id}
//                                   style={{
//                                     ...s.tpItem,
//                                     opacity: tp.done ? 0.45 : 1,
//                                   }}
//                                 >
//                                   <button
//                                     onClick={() => toggleTalkingPoint(meeting.id, tp.id)}
//                                     style={{
//                                       ...s.tpCheckbox,
//                                       background: tp.done ? "#6366f1" : "transparent",
//                                       borderColor: tp.done ? "#6366f1" : "rgba(255,255,255,0.15)",
//                                     }}
//                                   >
//                                     {tp.done && Icons.check}
//                                   </button>
//                                   <span style={{
//                                     ...s.tpText,
//                                     textDecoration: tp.done ? "line-through" : "none",
//                                   }}>
//                                     {tp.text}
//                                   </span>
//                                   <button
//                                     onClick={() => removeTalkingPoint(meeting.id, tp.id)}
//                                     style={s.tpRemove}
//                                   >
//                                     {Icons.x}
//                                   </button>
//                                 </div>
//                               ))}
//                             </div>
//                             <div style={s.addTpRow}>
//                               <input
//                                 value={newTalkingPoint[meeting.id] || ""}
//                                 onChange={(e) => setNewTalkingPoint((p) => ({ ...p, [meeting.id]: e.target.value }))}
//                                 onKeyDown={(e) => e.key === "Enter" && addTalkingPoint(meeting.id)}
//                                 placeholder="Add a talking point..."
//                                 style={s.addTpInput}
//                               />
//                               <button onClick={() => addTalkingPoint(meeting.id)} style={s.addTpBtn}>
//                                 {Icons.plus}
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* AI Analysis tab */}
//         {activeTab === "analysis" && (
//           <div style={s.analysisGrid}>
//             <AnalysisCard
//               title="Your Strengths"
//               items={INITIAL_STRENGTHS}
//               color="#22c55e"
//               delay={0}
//             />
//             <AnalysisCard
//               title="Potential Gaps"
//               items={INITIAL_GAPS}
//               color="#f59e0b"
//               delay={60}
//             />
//             <AnalysisCard
//               title="Suggested Talking Points"
//               items={INITIAL_TALKING_POINTS}
//               color="#6366f1"
//               delay={120}
//             />
//             <AnalysisCard
//               title="Interview Focus Areas"
//               items={INITIAL_FOCUS_AREAS}
//               color="#ec4899"
//               delay={180}
//             />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// function AnalysisCard({ title, items, color, delay }) {
//   return (
//     <div style={{
//       ...s.card,
//       animation: "fadeInUp 0.35s ease both",
//       animationDelay: `${delay}ms`,
//     }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
//         <div style={{
//           width: 6, height: 6, borderRadius: "50%", background: color,
//         }} />
//         <h3 style={{ ...s.cardLabel, marginBottom: 0, color }}>{title}</h3>
//       </div>
//       <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//         {items.map((item, i) => (
//           <div key={i} style={s.analysisItem}>
//             <span style={{
//               width: 3, height: 3, borderRadius: "50%",
//               background: "rgba(255,255,255,0.2)", flexShrink: 0, marginTop: 7,
//             }} />
//             <span style={s.analysisText}>{item}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // --- Styles ---
// const s = {
//   page: {
//     minHeight: "100vh",
//     background: "#09090b",
//     color: "#fafafa",
//     fontFamily: "'DM Sans', -apple-system, sans-serif",
//   },
//   header: {
//     display: "flex", alignItems: "center", justifyContent: "space-between",
//     padding: "0 32px", height: 56,
//     borderBottom: "1px solid rgba(255,255,255,0.06)",
//     background: "rgba(9,9,11,0.9)", backdropFilter: "blur(12px)",
//     position: "sticky", top: 0, zIndex: 50,
//   },
//   headerLeft: { display: "flex", alignItems: "center", gap: 10 },
//   logoMark: { display: "flex", alignItems: "center" },
//   logoText: { fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em", color: "#fafafa" },
//   nav: { display: "flex", gap: 4 },
//   navItem: {
//     fontSize: 13, fontWeight: 450, color: "rgba(255,255,255,0.4)",
//     padding: "6px 14px", borderRadius: 6, cursor: "pointer",
//   },
//   navItemActive: { color: "#fafafa", background: "rgba(255,255,255,0.06)" },
//   headerRight: { display: "flex", alignItems: "center" },
//   avatar: {
//     width: 30, height: 30, borderRadius: "50%",
//     background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     fontSize: 11, fontWeight: 600, color: "#fff",
//   },

//   main: { maxWidth: 880, margin: "0 auto", padding: "24px 32px 80px" },

//   // Back
//   backRow: { marginBottom: 20 },
//   backBtn: {
//     display: "flex", alignItems: "center", gap: 6,
//     background: "none", border: "none", color: "rgba(255,255,255,0.4)",
//     fontSize: 13, fontWeight: 450, cursor: "pointer",
//     fontFamily: "'DM Sans', sans-serif", padding: 0,
//   },

//   // Hero
//   heroCard: {
//     borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)",
//     background: "rgba(255,255,255,0.015)", padding: 28, marginBottom: 0,
//   },
//   heroTop: {
//     display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20,
//   },
//   heroIdentity: { display: "flex", gap: 16, alignItems: "flex-start" },
//   companyLogo: {
//     width: 48, height: 48, borderRadius: 12,
//     background: "rgba(255,255,255,0.04)", border: "1.5px solid",
//     display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//   },
//   heroBadges: { display: "flex", gap: 6, marginBottom: 6 },
//   stageBadge: {
//     display: "inline-flex", alignItems: "center", gap: 5,
//     fontSize: 11, fontWeight: 550, color: "rgba(255,255,255,0.6)",
//     background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.15)",
//     borderRadius: 5, padding: "3px 9px",
//   },
//   stageDot: { width: 5, height: 5, borderRadius: "50%" },
//   matchBadge: {
//     fontSize: 11, fontWeight: 600, color: "#22c55e",
//     background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)",
//     borderRadius: 5, padding: "3px 9px",
//     fontFamily: "'JetBrains Mono', monospace",
//   },
//   heroTitle: {
//     fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", color: "#fafafa", lineHeight: 1.2,
//   },
//   heroCompany: { fontSize: 14, color: "rgba(255,255,255,0.45)", marginTop: 3, fontWeight: 400 },
//   moveStageBtn: {
//     background: "#6366f1", color: "#fff", border: "none", borderRadius: 8,
//     padding: "8px 18px", fontSize: 13, fontWeight: 550,
//     fontFamily: "'DM Sans', sans-serif", cursor: "pointer", whiteSpace: "nowrap",
//   },
//   metaRow: {
//     display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
//     paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.05)",
//   },
//   metaItem: {
//     display: "flex", alignItems: "center", gap: 5,
//     fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 450,
//   },
//   metaDivider: {
//     width: 1, height: 12, background: "rgba(255,255,255,0.08)",
//   },
//   tagGroup: { display: "flex", gap: 4, marginLeft: "auto" },
//   heroTag: {
//     fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.4)",
//     background: "rgba(255,255,255,0.04)", padding: "3px 8px", borderRadius: 4,
//     textTransform: "uppercase", letterSpacing: "0.02em",
//   },

//   // Pipeline
//   pipeline: {
//     display: "flex", alignItems: "flex-start", gap: 0, marginTop: 20,
//     paddingTop: 0,
//   },
//   pipelineStep: {
//     display: "flex", flexDirection: "column", alignItems: "center",
//     flex: 1, position: "relative",
//   },
//   pipelineNode: {
//     width: 10, height: 10, borderRadius: "50%",
//     border: "2px solid", zIndex: 2,
//   },
//   pipelineLine: {
//     position: "absolute", top: 4, left: "calc(50% + 5px)",
//     right: "calc(-50% + 5px)", height: 2,
//   },
//   pipelineLabel: {
//     fontSize: 10, fontWeight: 500, marginTop: 8,
//     letterSpacing: "0.02em", textTransform: "uppercase",
//   },

//   // Tabs
//   tabBar: {
//     display: "flex", gap: 2, marginTop: 16, marginBottom: 20,
//     borderBottom: "1px solid rgba(255,255,255,0.06)",
//   },
//   tab: {
//     padding: "12px 18px", fontSize: 13, fontWeight: 500,
//     color: "rgba(255,255,255,0.35)", background: "none", border: "none",
//     borderBottom: "2px solid transparent", cursor: "pointer",
//     fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
//   },
//   tabActive: {
//     color: "#fafafa", borderBottomColor: "#6366f1",
//   },

//   // Overview
//   overviewGrid: {
//     display: "grid", gridTemplateColumns: "1fr 1fr",
//     gap: 12,
//   },
//   card: {
//     borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)",
//     background: "rgba(255,255,255,0.015)", padding: 22,
//   },
//   cardLabel: {
//     fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)",
//     letterSpacing: "0.02em", textTransform: "uppercase", marginBottom: 12,
//   },
//   cardBody: {
//     fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, fontWeight: 400,
//   },
//   skillChips: { display: "flex", flexWrap: "wrap", gap: 5 },
//   skillChip: {
//     fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.6)",
//     background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
//     padding: "4px 10px", borderRadius: 5,
//   },
//   skillChipAlt: {
//     background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.12)",
//     color: "rgba(245,158,11,0.8)",
//   },
//   skillChipTech: {
//     background: "rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.15)",
//     color: "rgba(139,92,246,0.8)",
//   },

//   // Meetings
//   meetingsHeader: {
//     display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20,
//   },
//   meetingsSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.35)", fontWeight: 400 },
//   addMeetingBtn: {
//     display: "flex", alignItems: "center", gap: 6,
//     background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
//     borderRadius: 8, padding: "7px 14px",
//     fontSize: 12, fontWeight: 550, color: "rgba(255,255,255,0.6)",
//     fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
//   },

//   // Timeline
//   timeline: { display: "flex", flexDirection: "column", gap: 0 },
//   timelineItem: {
//     display: "flex", gap: 16, minHeight: 60,
//   },
//   timelineTrack: {
//     display: "flex", flexDirection: "column", alignItems: "center",
//     width: 20, flexShrink: 0, paddingTop: 14,
//   },
//   timelineDot: {
//     width: 10, height: 10, borderRadius: "50%", flexShrink: 0, zIndex: 2,
//     transition: "all 0.2s",
//   },
//   timelineConnector: {
//     width: 1, flex: 1, background: "rgba(255,255,255,0.06)", marginTop: 4,
//   },

//   // Meeting card
//   meetingCardHeader: {
//     width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
//     background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
//     borderRadius: 10, padding: "14px 18px",
//     cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
//     transition: "all 0.15s", textAlign: "left",
//   },
//   meetingInfo: { display: "flex", flexDirection: "column", gap: 6, minWidth: 0 },
//   meetingTitle: {
//     fontSize: 14, fontWeight: 600, color: "#fafafa", letterSpacing: "-0.01em",
//   },
//   meetingMeta: {
//     display: "flex", gap: 12, flexWrap: "wrap",
//   },
//   meetingMetaItem: {
//     display: "flex", alignItems: "center", gap: 4,
//     fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 400,
//   },
//   meetingRight: {
//     display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
//   },
//   tpCounter: {
//     fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)",
//     fontFamily: "'JetBrains Mono', monospace",
//     background: "rgba(255,255,255,0.04)", padding: "2px 7px", borderRadius: 4,
//   },

//   // Expanded meeting
//   meetingExpanded: {
//     borderLeft: "1px solid rgba(255,255,255,0.06)",
//     marginLeft: 18, marginTop: 8, marginBottom: 20,
//     paddingLeft: 20, paddingTop: 4,
//   },
//   meetingSection: { marginBottom: 20 },
//   meetingSectionHeader: {
//     display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10,
//   },
//   meetingSectionTitle: {
//     fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)",
//     letterSpacing: "0.04em", textTransform: "uppercase",
//   },
//   editBtn: {
//     background: "none", border: "none", color: "rgba(99,102,241,0.7)",
//     fontSize: 12, fontWeight: 550, cursor: "pointer",
//     fontFamily: "'DM Sans', sans-serif",
//   },
//   notesTextarea: {
//     width: "100%", background: "rgba(255,255,255,0.03)",
//     border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
//     padding: "10px 14px", fontSize: 13, color: "#fafafa", lineHeight: 1.6,
//     fontFamily: "'DM Sans', sans-serif", resize: "vertical",
//   },
//   notesDisplay: {
//     fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, fontWeight: 400,
//   },

//   // Talking points
//   tpList: { display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 },
//   tpItem: {
//     display: "flex", alignItems: "flex-start", gap: 10, padding: "6px 0",
//     transition: "opacity 0.2s",
//   },
//   tpCheckbox: {
//     width: 18, height: 18, borderRadius: 4, flexShrink: 0,
//     border: "1.5px solid", display: "flex", alignItems: "center", justifyContent: "center",
//     cursor: "pointer", transition: "all 0.15s", color: "#fff", marginTop: 1,
//   },
//   tpText: {
//     fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.4, fontWeight: 400, flex: 1,
//   },
//   tpRemove: {
//     background: "none", border: "none", color: "rgba(255,255,255,0.15)",
//     cursor: "pointer", display: "flex", alignItems: "center", padding: "2px",
//     transition: "color 0.15s", flexShrink: 0, marginTop: 2,
//   },
//   addTpRow: { display: "flex", gap: 6 },
//   addTpInput: {
//     flex: 1, background: "rgba(255,255,255,0.03)",
//     border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6,
//     padding: "7px 12px", fontSize: 12, color: "#fafafa",
//     fontFamily: "'DM Sans', sans-serif",
//   },
//   addTpBtn: {
//     width: 30, height: 30, borderRadius: 6,
//     background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     cursor: "pointer", color: "rgba(255,255,255,0.4)",
//   },

//   // Add meeting form
//   formGrid: {
//     display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16,
//   },
//   formField: { display: "flex", flexDirection: "column", gap: 5 },
//   formLabel: {
//     fontSize: 11, fontWeight: 550, color: "rgba(255,255,255,0.35)",
//     letterSpacing: "0.03em", textTransform: "uppercase",
//   },
//   formInput: {
//     background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
//     borderRadius: 7, padding: "8px 12px", fontSize: 13, color: "#fafafa",
//     fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
//   },
//   formActions: { display: "flex", justifyContent: "flex-end", gap: 8 },
//   cancelBtn: {
//     background: "none", border: "1px solid rgba(255,255,255,0.08)",
//     borderRadius: 7, padding: "7px 16px", fontSize: 12, fontWeight: 550,
//     color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
//   },
//   confirmBtn: {
//     background: "#6366f1", border: "none", borderRadius: 7,
//     padding: "7px 16px", fontSize: 12, fontWeight: 550, color: "#fff",
//     fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
//   },

//   // Analysis
//   analysisGrid: {
//     display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
//   },
//   analysisItem: {
//     display: "flex", gap: 10, alignItems: "flex-start",
//   },
//   analysisText: {
//     fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, fontWeight: 400,
//   },
// };