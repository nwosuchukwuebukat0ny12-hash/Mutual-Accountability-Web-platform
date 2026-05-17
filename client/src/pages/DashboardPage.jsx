import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const MOCK_GOALS = [
  {
    _id: "g1",
    title: "Leetspeak Mastery (100 Problems)",
    category: "study",
    deadline: "2026-06-30",
    frequency: "daily",
    progress: 75,
    milestones: [
      { title: "Solve first 25 easy problems", completed: true },
      { title: "Finish 50 medium recursion problems", completed: true },
      { title: "Complete 25 hard dynamic programming problems", completed: false }
    ],
    status: "active"
  },
  {
    _id: "g2",
    title: "Hypertrophy Conditioning",
    category: "fitness",
    deadline: "2026-07-15",
    frequency: "every2days",
    progress: 40,
    milestones: [
      { title: "Run 5k under 22 mins", completed: true },
      { title: "4 strength cycles completed", completed: false }
    ],
    status: "active"
  }
];

const MOCK_PARTNER_FEED = [
  {
    id: "f1",
    partnerName: "Sarah Connor",
    action: "completed a check-in",
    goalTitle: "Conditioning Loop",
    timestamp: "10m ago",
    note: "Did 10 miles in the rain. Stake verified.",
    approved: false
  },
  {
    id: "f2",
    partnerName: "Sarah Connor",
    action: "unlocked a new badge",
    badgeName: "14-Day Vanguard",
    timestamp: "2h ago",
    isBadge: true
  }
];

const DashboardPage = () => {
  const { authUser, logout } = useAuthStore();
  const [goals, setGoals] = useState(MOCK_GOALS);
  const [feed, setFeed] = useState(MOCK_PARTNER_FEED);
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleApproveCheckin = (feedId) => {
    setFeed((prev) => 
      prev.map((item) => 
        item.id === feedId ? { ...item, approved: true } : item
      )
    );
  };

  const handleToggleMilestone = (goalId, milestoneIndex) => {
    setGoals((prev) => 
      prev.map((goal) => {
        if (goal._id === goalId) {
          const updatedMilestones = [...goal.milestones];
          updatedMilestones[milestoneIndex].completed = !updatedMilestones[milestoneIndex].completed;
          // Recalculate progress %
          const completedCount = updatedMilestones.filter(m => m.completed).length;
          const progress = Math.round((completedCount / updatedMilestones.length) * 100);
          return { ...goal, milestones: updatedMilestones, progress };
        }
        return goal;
      })
    );
  };

  return (
    <div className="min-h-screen bg-surface font-inter text-text flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-outline-variant transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="h-full flex flex-col justify-between p-6">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary flex items-center justify-center text-white font-heading font-bold text-xl">M</div>
              <span className="font-heading font-bold tracking-tighter text-2xl">MUTUAL</span>
            </div>

            {/* Navigation links */}
            <nav className="space-y-2">
              <a href="#dashboard" className="flex items-center gap-3 px-4 py-3 rounded-md bg-surface-container text-primary font-heading font-bold text-sm">
                <span className="text-lg">📊</span> Dashboard
              </a>
              <a href="#goals" className="flex items-center gap-3 px-4 py-3 rounded-md text-text-muted hover:bg-surface-container-low hover:text-text font-heading font-bold text-sm transition-colors">
                <span className="text-lg">🎯</span> My Goals
              </a>
              <a href="#partners" className="flex items-center gap-3 px-4 py-3 rounded-md text-text-muted hover:bg-surface-container-low hover:text-text font-heading font-bold text-sm transition-colors">
                <span className="text-lg">🤝</span> Partners
              </a>
            </nav>
          </div>

          {/* User profile details & logout */}
          <div className="border-t border-outline-variant pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center font-heading font-bold text-sm">
                  {authUser?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold tracking-tight truncate max-w-[120px]">{authUser?.name || "User"}</h4>
                  <span className="text-[10px] text-text-muted">@{authUser?.username || "username"}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full border border-error/20 hover:bg-error-container hover:text-on-error-container text-error text-xs font-heading font-bold uppercase tracking-widest py-3 rounded transition-all duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto w-full lg:pl-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-outline-variant px-6 py-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary flex items-center justify-center text-white font-heading font-bold text-lg">M</div>
            <span className="font-heading font-bold tracking-tighter text-xl">MUTUAL</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl focus:outline-none"
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-desktop-margin py-8 md:py-12 space-y-8">
          
          {/* Welcome Banner Row */}
          <div className="bg-white rounded-lg border border-outline-variant p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl shadow-primary/5">
            <div>
              <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-primary mb-2 block">Command Center</span>
              <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tighter">
                Welcome back, <span className="text-primary italic">{authUser?.name || "Ebuka"}</span>
              </h1>
              <p className="text-text-muted text-sm mt-1">Initiating daily accountability sequence. Keep your partner verified.</p>
            </div>

            {/* Streaks Widget (Amber Accents) */}
            <div className="flex items-center gap-4 bg-secondary-container/10 border border-secondary-container/20 px-6 py-4 rounded-lg">
              <div className="text-3xl">🔥</div>
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-secondary block">Current Streak</span>
                <span className="text-2xl font-heading font-bold text-secondary leading-none">
                  {authUser?.currentStreak || 3} Days
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg border border-outline-variant">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-text-muted block">Longest Streak</span>
              <span className="text-2xl font-heading font-bold text-text mt-1 block">{authUser?.longestStreak || 12} Days</span>
            </div>
            <div className="bg-white p-5 rounded-lg border border-outline-variant">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-text-muted block">Total Goals</span>
              <span className="text-2xl font-heading font-bold text-text mt-1 block">{goals.length}</span>
            </div>
            <div className="bg-white p-5 rounded-lg border border-outline-variant">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-text-muted block">Completed Goals</span>
              <span className="text-2xl font-heading font-bold text-text mt-1 block">{authUser?.completedGoals || 1}</span>
            </div>
            <div className="bg-white p-5 rounded-lg border border-outline-variant">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-text-muted block">Badges Unlocked</span>
              <span className="text-2xl font-heading font-bold text-secondary mt-1 block">🏆 {authUser?.badges?.length || 2}</span>
            </div>
          </div>

          {/* Bento Grid Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1 & 2: Active Goals progress tracker */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-heading font-bold tracking-tight">Active Performance Cycles</h3>
                <button 
                  onClick={() => setIsNewGoalModalOpen(true)}
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 font-heading font-bold text-xs uppercase tracking-widest rounded transition-all duration-300 shadow-md shadow-primary/10"
                >
                  + New Goal
                </button>
              </div>

              {/* Goal List */}
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal._id} className="bg-white rounded-lg border border-outline-variant p-6 hover:shadow-2xl hover:shadow-primary/5 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[9px] font-heading font-bold uppercase tracking-widest bg-surface-container px-2 py-0.5 rounded text-primary">
                          {goal.category}
                        </span>
                        <h4 className="text-lg font-heading font-bold tracking-tight mt-2">{goal.title}</h4>
                      </div>
                      <span className="font-heading font-bold text-lg text-primary">{goal.progress}%</span>
                    </div>

                    {/* Progress Bar (8px visual bar) */}
                    <div className="w-full bg-surface-container-low rounded-full h-2 mb-6">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>

                    {/* Milestones toggles */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-text-muted block">Milestones</span>
                      {goal.milestones.map((m, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => handleToggleMilestone(goal._id, idx)}
                          className="flex items-center gap-3 cursor-pointer group py-1"
                        >
                          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                            m.completed 
                              ? "bg-primary border-primary text-white" 
                              : "border-outline-variant group-hover:border-primary"
                          }`}>
                            {m.completed && <span className="text-xs">✓</span>}
                          </div>
                          <span className={`text-xs font-inter transition-colors ${
                            m.completed ? "line-through text-text-muted" : "text-text"
                          }`}>
                            {m.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Partner Pulse Feed */}
            <div className="space-y-6">
              <h3 className="text-xl font-heading font-bold tracking-tight">Partner Pulse Feed</h3>
              
              <div className="bg-white rounded-lg border border-outline-variant p-6 space-y-6">
                {/* Loop Feed Items */}
                {feed.map((item) => (
                  <div key={item.id} className="relative pb-6 border-b border-outline-variant last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-heading font-bold">{item.partnerName}</span>
                        <span className="text-xs text-text-muted">{item.action}</span>
                      </div>
                      <span className="text-[10px] text-text-muted uppercase tracking-wider">{item.timestamp}</span>
                    </div>

                    {item.isBadge ? (
                      <div className="bg-secondary-container/10 border border-secondary-container/20 rounded p-3 text-xs font-heading font-bold text-secondary uppercase tracking-wider">
                        🏆 {item.badgeName} Unlocked
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs text-text-muted italic bg-surface-container-low p-3 rounded border border-outline-variant">
                          "{item.note}"
                        </p>
                        
                        {/* Approval Action Trigger */}
                        <button
                          disabled={item.approved}
                          onClick={() => handleApproveCheckin(item.id)}
                          className={`w-full py-2.5 text-[10px] font-heading font-bold uppercase tracking-wider rounded border transition-all flex items-center justify-center gap-1 ${
                            item.approved
                              ? "bg-surface-container border-outline-variant text-text-muted cursor-not-allowed"
                              : "border-primary text-primary hover:bg-primary hover:text-white"
                          }`}
                        >
                          {item.approved ? "✓ Approved" : "Verify & Approve"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Search Partner/Invite link */}
                <div className="mt-4 pt-4 border-t border-outline-variant">
                  <span className="text-xs text-text-muted block mb-3">Looking to add another partner?</span>
                  <button className="w-full border border-primary/20 hover:bg-primary-container/10 text-primary font-heading font-bold text-xs uppercase tracking-widest py-3 rounded transition-all">
                    Search Username
                  </button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* New Goal Modal placeholder */}
      {isNewGoalModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-outline-variant max-w-md w-full p-8 shadow-2xl relative">
            <button 
              onClick={() => setIsNewGoalModalOpen(false)}
              className="absolute right-6 top-6 text-xl"
            >✕</button>
            <h3 className="text-2xl font-heading font-bold tracking-tight mb-6">Initialize New Cycle</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-text-muted mb-2">Goal Title</label>
                <input type="text" placeholder="e.g., Learn Rust" className="w-full px-4 py-3 rounded border border-outline-variant focus:outline-none focus:border-primary font-inter text-sm" />
              </div>
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-text-muted mb-2">Category</label>
                <select className="w-full px-4 py-3 rounded border border-outline-variant bg-white focus:outline-none focus:border-primary font-inter text-sm">
                  <option>fitness</option>
                  <option>study</option>
                  <option>career</option>
                  <option>habit</option>
                  <option>other</option>
                </select>
              </div>
              <button 
                onClick={() => setIsNewGoalModalOpen(false)}
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 font-heading font-bold text-xs uppercase tracking-widest rounded transition-all duration-300"
              >
                Provision Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
