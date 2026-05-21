import { useState } from "react";

const PartnerPulseFeed = ({ partnership }) => {
  // Safe destructuring of partnership data
  const partner = partnership?.recipient || partnership?.requester || {
    name: "Partner",
    username: "partner",
    currentStreak: 3,
    badges: ["7_day_consistency"]
  };
  
  const partnerGoal = partnership?.partnerGoal || {
    title: "Complete MERN Dashboard Layout",
    category: "career",
    description: "Write full React architecture, hook up Zustand stores, and verify visual alignment.",
    progress: 65,
    milestones: [
      { _id: "m1", title: "Create useGoalStore Zustand", completed: true },
      { _id: "m2", title: "Create usePartnershipStore Zustand", completed: true },
      { _id: "m3", title: "Wire up Dynamic Protected Layouts", completed: false },
      { _id: "m4", title: "Verify full integration across pages", completed: false }
    ]
  };

  // Mock comments/approvals feed since we are frontend-only for now
  const [feedItems, setFeedItems] = useState([
    {
      id: "f1",
      user: partner,
      status: "done",
      note: "Finished writing the store files and verified all the API mappings with the backend schema!",
      progress: 65,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      approved: false,
      comments: [
        { id: "c1", author: { name: "You" }, text: "Clean code structure! Let's get this wired up on the Dashboard Page next.", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() }
      ]
    }
  ]);

  const [commentInput, setCommentInput] = useState("");
  const [activeFeedId, setActiveFeedId] = useState("f1");

  const handleApprove = (itemId) => {
    setFeedItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, approved: true, approvalTime: new Date().toISOString() }
          : item
      )
    );
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setFeedItems((prev) =>
      prev.map((item) =>
        item.id === activeFeedId
          ? {
              ...item,
              comments: [
                ...item.comments,
                {
                  id: Math.random().toString(),
                  author: { name: "You" },
                  text: commentInput.trim(),
                  createdAt: new Date().toISOString()
                }
              ]
            }
          : item
      )
    );
    setCommentInput("");
  };

  const getCategoryTheme = (category) => {
    switch (category) {
      case "fitness":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "study":
        return "text-indigo-600 bg-indigo-50 border-indigo-100";
      case "career":
        return "text-blue-600 bg-blue-50 border-blue-100";
      case "habit":
        return "text-amber-600 bg-amber-50 border-amber-100";
      default:
        return "text-slate-600 bg-slate-50 border-slate-100";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 font-inter">
      
      {/* Left Columns - Partner Pulse & Active Goals */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Partner Header Card */}
        <div className="p-6 bg-white border border-outline-variant rounded-md shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center font-heading font-bold text-primary border border-primary/15 text-xl uppercase shadow-inner">
              {partner.name.substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-xl text-on-surface leading-tight">{partner.name}</h2>
                <span className="bg-secondary-container text-on-secondary-container text-[10px] font-heading font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Partner Pulse Active
                </span>
              </div>
              <p className="text-xs text-text-muted">@{partner.username}</p>
            </div>
          </div>

          {/* Gamification Stats */}
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 border border-amber-200/50 px-4 py-2.5 rounded-md flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <div>
                <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-amber-800 leading-none">Streak</div>
                <div className="font-heading font-black text-secondary text-base leading-none mt-1">{partner.currentStreak || 0} Days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Goal Detail Card */}
        <div className="p-6 bg-white border border-outline-variant rounded-md shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider border mb-3 ${getCategoryTheme(partnerGoal.category)}`}>
                {partnerGoal.category}
              </span>
              <h3 className="font-heading font-bold text-lg text-on-surface tracking-tight mb-2">
                {partnerGoal.title}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed max-w-xl">{partnerGoal.description}</p>
            </div>
            
            {/* Radial-like completion summary */}
            <div className="text-right">
              <div className="font-heading font-black text-2xl text-primary">{partnerGoal.progress}%</div>
              <div className="text-[9px] font-heading font-bold uppercase tracking-wider text-text-muted">Completed</div>
            </div>
          </div>

          {/* Progress Bar - Thick 8px fill from DESIGN.md */}
          <div className="mb-8">
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500" 
                style={{ width: `${partnerGoal.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Milestones Checklist */}
          <div>
            <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-text/60 mb-3">Milestone Progress</h4>
            <div className="space-y-2">
              {partnerGoal.milestones.map((milestone) => (
                <div 
                  key={milestone._id} 
                  className={`flex items-center gap-3 p-3.5 border rounded-md transition-colors ${
                    milestone.completed 
                      ? "bg-emerald-50/40 border-emerald-100 text-slate-500" 
                      : "bg-white border-outline-variant/60"
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    milestone.completed 
                      ? "bg-emerald-500 border-emerald-500 text-white" 
                      : "border-outline-variant bg-white"
                  }`}>
                    {milestone.completed && <span className="text-xs font-bold">✓</span>}
                  </div>
                  <span className={`text-xs font-medium ${milestone.completed ? "line-through" : "text-on-surface"}`}>
                    {milestone.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Right Column - Verification Feed / Comments */}
      <div className="space-y-6">
        
        {/* Verification Feed */}
        <div className="p-6 bg-white border border-outline-variant rounded-md shadow-sm flex flex-col h-full">
          <h3 className="font-heading font-bold text-base text-on-surface tracking-tight border-b border-outline-variant/60 pb-3 mb-4">
            Verification Chamber
          </h3>

          <div className="flex-grow space-y-4">
            {feedItems.map((item) => (
              <div key={item.id} className="space-y-4">
                {/* Proof card */}
                <div className="p-4 bg-surface-container-low border border-outline-variant/50 rounded-md">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-heading font-bold text-on-surface uppercase">Daily Proof Log</span>
                      <p className="text-[10px] text-text-muted mt-0.5">{new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    {/* Status Pill - Success Green */}
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-heading font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface leading-relaxed mb-4 italic">
                    "{item.note}"
                  </p>

                  {/* Actions: Approve Checkin */}
                  {item.approved ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-md text-center text-[10px] font-heading font-bold text-emerald-800 uppercase tracking-widest">
                      ✓ Approved By You
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 font-heading font-bold text-[10px] uppercase tracking-widest rounded-md transition-all duration-300 shadow-sm"
                    >
                      Verify & Approve Check-in
                    </button>
                  )}
                </div>

                {/* Comments Thread */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-heading font-bold uppercase tracking-wider text-text/60">Comments Loop</h4>
                  
                  {item.comments.map((comment) => (
                    <div key={comment.id} className="text-xs p-3 bg-slate-50 border border-outline-variant/30 rounded-md">
                      <div className="flex justify-between font-heading font-bold text-[10px] text-primary uppercase tracking-wide mb-1">
                        <span>{comment.author.name}</span>
                        <span className="text-text-muted font-normal text-[9px]">
                          {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <p className="text-text-muted leading-relaxed">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mt-6 border-t border-outline-variant/60 pt-4 flex gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Leave some support or comments..."
              className="flex-grow px-3 py-2 border border-outline-variant rounded-md focus:outline-none focus:border-primary text-xs font-inter"
              required
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 font-heading font-bold text-[10px] uppercase tracking-widest rounded-md transition-all duration-300"
            >
              Post
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default PartnerPulseFeed;
