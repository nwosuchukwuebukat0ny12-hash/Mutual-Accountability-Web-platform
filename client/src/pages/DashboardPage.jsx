import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useGoalStore } from "../store/useGoalStore";
import { usePartnershipStore } from "../store/usePartnershipStore";

const DashboardPage = () => {
  const { authUser, logout } = useAuthStore();
  const { goals, createGoal, toggleMilestone, fetchGoals, submitCheckIn, isLoading: isGoalsLoading } = useGoalStore();
  
  const { 
    feed, 
    approveCheckin, 
    partner, 
    searchUser, 
    sendInvite,
    partnerships,
    fetchPartnerships,
    respondToInvite,
    fetchActivePartnership,
    fetchFeed
  } = usePartnershipStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  
  // New Goal Form State
  const [goalTitle, setGoalTitle] = useState("");
  const [goalCategory, setGoalCategory] = useState("study");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");
  const [goalFrequency, setGoalFrequency] = useState("daily");
  const [goalMilestones, setGoalMilestones] = useState([""]);
  const [goalError, setGoalError] = useState("");

  // Search Partner Drawer/Modal State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchUsername, setSearchUsername] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  // Success / Status Toasts
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Check-In Modal State
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [checkInGoalId, setCheckInGoalId] = useState("");
  const [checkInNote, setCheckInNote] = useState("");
  const [checkInStake, setCheckInStake] = useState("");
  const [checkInProgress, setCheckInProgress] = useState(10);
  const [checkInError, setCheckInError] = useState("");
  const [isSubmittingCheckIn, setIsSubmittingCheckIn] = useState(false);

  useEffect(() => {
    fetchGoals();
    fetchPartnerships();
    fetchActivePartnership();
    fetchFeed();
  }, [fetchGoals, fetchPartnerships, fetchActivePartnership, fetchFeed]);

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage("");
    }, 4000);
  };

  // Handle Milestone toggling with index mapped to backend
  const handleToggleMilestone = async (goalId, milestoneIndex) => {
    const res = await toggleMilestone(goalId, milestoneIndex);
    if (res.success) {
      showToast("Milestone status updated!");
    } else {
      showToast(res.message || "Failed to update milestone", "error");
    }
  };

  // Handle feed check-in approval
  const handleApproveCheckin = async (feedId, checkInId) => {
    const res = await approveCheckin(feedId, checkInId);
    if (res.success) {
      showToast("Partner check-in approved! Momentum maintained. 🤝");
    } else {
      showToast(res.message || "Failed to approve check-in", "error");
    }
  };

  // Milestone builder handlers
  const handleAddMilestoneField = () => {
    setGoalMilestones([...goalMilestones, ""]);
  };

  const handleMilestoneFieldChange = (index, value) => {
    const updated = [...goalMilestones];
    updated[index] = value;
    setGoalMilestones(updated);
  };

  const handleRemoveMilestoneField = (index) => {
    if (goalMilestones.length === 1) return;
    const updated = goalMilestones.filter((_, i) => i !== index);
    setGoalMilestones(updated);
  };

  // Submit Goal Handler
  const handleCreateGoalSubmit = async (e) => {
    e.preventDefault();
    setGoalError("");

    if (!goalTitle.trim()) {
      setGoalError("Goal Title is required.");
      return;
    }

    if (!goalDeadline) {
      setGoalError("A target deadline date is required.");
      return;
    }

    const filteredMilestones = goalMilestones.filter((m) => m.trim() !== "");
    if (filteredMilestones.length === 0) {
      setGoalError("At least one milestone is required.");
      return;
    }

    // Map milestone strings to targetDate objects for Fawaz's backend schema!
    const milestonesPayload = filteredMilestones.map(m => ({
      title: m,
      targetDate: goalDeadline // Fallback target date is the overall deadline
    }));

    const res = await createGoal({
      title: goalTitle,
      category: goalCategory,
      description: goalDescription,
      deadline: goalDeadline,
      frequency: goalFrequency,
      milestones: milestonesPayload
    });

    if (res.success) {
      showToast("New performance cycle initiated! 🎯");
      setIsNewGoalModalOpen(false);
      // Reset form
      setGoalTitle("");
      setGoalCategory("study");
      setGoalDescription("");
      setGoalDeadline("");
      setGoalFrequency("daily");
      setGoalMilestones([""]);
    } else {
      setGoalError(res.message || "Failed to create goal. Try again.");
    }
  };

  // Search Teammate Handler
  const handleSearchPartnerSubmit = async (e) => {
    e.preventDefault();
    setSearchError("");
    setSearchResult(null);
    setInviteSent(false);

    if (!searchUsername.trim()) {
      setSearchError("Please enter a username to search.");
      return;
    }

    setIsSearching(true);
    const res = await searchUser(searchUsername);
    setIsSearching(false);

    if (res.success) {
      setSearchResult(res.user);
    } else {
      setSearchError(res.message);
    }
  };

  // Invite Partner Handler
  const handleInvitePartnerSubmit = async (username) => {
    // Check if there is an active goal to connect with this partnership
    if (goals.length === 0) {
      showToast("Create at least one goal first before inviting a partner!", "error");
      return;
    }

    const firstActiveGoalId = goals[0]._id;
    const res = await sendInvite(username, firstActiveGoalId);
    if (res.success) {
      setInviteSent(true);
      showToast("Accountability invite successfully sent! ✉️");
    } else {
      showToast(res.message || "Failed to send invite.", "error");
    }
  };

  // Submit Check-In Handler
  const handleCreateCheckInSubmit = async (e) => {
    e.preventDefault();
    setCheckInError("");

    if (!checkInGoalId) {
      setCheckInError("Please select a goal to check-in for.");
      return;
    }

    if (!checkInNote.trim()) {
      setCheckInError("Please provide proof (note) of your progress.");
      return;
    }

    setIsSubmittingCheckIn(true);
    const res = await submitCheckIn(checkInGoalId, checkInNote, checkInStake, checkInProgress);
    setIsSubmittingCheckIn(false);

    if (res.success) {
      showToast("Check-in submitted! Waiting for partner verification. 🤝");
      setIsCheckInModalOpen(false);
      // Reset form
      setCheckInNote("");
      setCheckInStake("");
      setCheckInProgress(10);
    } else {
      setCheckInError(res.message || "Failed to submit check-in. Try again.");
    }
  };

  // Calculate pending milestones
  const pendingMilestonesCount = goals.flatMap(g => g.milestones || []).filter(m => !m.completed).length;

  // Calculate if there are active goals unchecked today
  const hasUncheckedActiveGoal = goals.length > 0 && goals.some(g => {
    if (g.status !== 'active') return false;
    if (!g.lastCheckinAt) return true;
    const todayStr = new Date().toDateString();
    const lastCheckinStr = new Date(g.lastCheckinAt).toDateString();
    return lastCheckinStr !== todayStr;
  });

  // Calculate days left helper
  const getDaysLeft = (deadlineStr) => {
    const days = Math.max(0, Math.ceil((new Date(deadlineStr) - new Date()) / (1000 * 60 * 60 * 24)));
    return days;
  };

  // Filter incoming pending partnership invites
  const incomingPendingInvites = partnerships ? partnerships.filter(p => {
    const recipientId = p.recipient?._id || p.recipient;
    return p.status === "pending" && recipientId === authUser?._id;
  }) : [];

  return (
    <div className="min-h-screen bg-white font-inter text-text flex overflow-hidden">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 border transition-all animate-bounce ${
          toastType === "success" 
            ? "bg-[#00685f]/95 border-[#00685f] text-white" 
            : "bg-red-500/95 border-red-500 text-white"
        }`}>
          <span className="text-lg">{toastType === "success" ? "✓" : "⚠"}</span>
          <span className="text-sm font-bold tracking-wider">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#f8fafc] border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 flex flex-col justify-between ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-[#00685f] tracking-tight">MUTUAL</h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">Progress as a Path</p>
          </div>
          <nav className="px-4 space-y-1 mt-4">
            <a href="#dashboard" className="flex items-center gap-3 px-4 py-3 bg-[#00685f] text-white rounded-lg font-medium text-sm transition-colors">
              <span className="text-lg">📊</span> Dashboard
            </a>
            <a href="#goals" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors">
              <span className="text-lg">🎯</span> My Goals
            </a>
            <button onClick={() => setIsSearchModalOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors text-left">
              <span className="text-lg">🤝</span> Partners
            </button>
            <a href="#community" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors">
              <span className="text-lg">💬</span> Community
            </a>
            <a href="#profile" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors">
              <span className="text-lg">👤</span> Profile
            </a>
          </nav>
        </div>
        <div className="p-6 space-y-4">
          <button 
            onClick={() => setIsNewGoalModalOpen(true)}
            className="w-full bg-[#00685f] hover:bg-[#004d46] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span className="text-xl leading-none">+</span> New Goal
          </button>
          <button 
            onClick={logout}
            className="w-full text-center text-xs text-red-500 font-medium hover:underline py-2"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto w-full lg:pl-0 bg-white">
        {/* Mobile Header */}
        <header className="lg:hidden bg-[#f8fafc] border-b border-gray-200 px-6 py-4 flex items-center justify-between z-30">
          <h1 className="text-xl font-bold text-[#00685f] tracking-tight">MUTUAL</h1>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl text-gray-600 focus:outline-none"
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 max-w-[1200px] w-full mx-auto p-6 md:p-10">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Welcome back, {authUser?.name?.split(' ')[0] || "Alex"}</h2>
              <p className="text-gray-500 text-sm mt-1 font-medium">You have {pendingMilestonesCount} milestones to complete today.</p>
            </div>
            <div className="flex items-center gap-5">
              <button className="text-gray-400 hover:text-gray-600 transition-colors text-xl">🔔</button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors text-xl">⚙️</button>
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-gray-600 overflow-hidden animate-pulse">
                <img src={`https://ui-avatars.com/api/?name=${authUser?.name || 'User'}&background=e2e8f0&color=475569`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </header>

          {/* Incoming Pending Partnerships Inbox Container */}
          {incomingPendingInvites.length > 0 && (
            <div className="p-6 bg-amber-50/50 border border-amber-200 rounded-2xl mb-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800 mb-4 flex items-center gap-2">
                <span>📥</span> Incoming Partnership Invites ({incomingPendingInvites.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incomingPendingInvites.map((invite) => {
                  const sender = invite.requester || { name: "User", username: "user" };
                  const goal = invite.goal || { title: "Custom Goal" };
                  return (
                    <div
                      key={invite._id}
                      className="p-5 bg-white border border-amber-200/60 rounded-xl flex flex-col justify-between shadow-sm"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                            {sender.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-gray-900 leading-tight">
                              Invite from {sender.name}
                            </h4>
                            <p className="text-xs text-gray-500 font-medium">@{sender.username}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-700 font-medium">
                          <span className="font-bold text-[9px] text-[#00685f] uppercase block mb-1">Target Goal Pact:</span>
                          "{goal.title}"
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={async () => {
                            const res = await respondToInvite(invite._id, "accept");
                            if (res.success) {
                              showToast("Partnership accepted! Sync sequence active. 🤝");
                              fetchPartnerships();
                            }
                          }}
                          className="flex-grow bg-[#00685f] hover:bg-[#004d46] text-white py-2 font-bold text-xs rounded-lg transition-colors shadow-sm"
                        >
                          Accept Pact
                        </button>
                        <button
                          onClick={async () => {
                            const res = await respondToInvite(invite._id, "reject");
                            if (res.success) {
                              showToast("Invitation declined.", "error");
                              fetchPartnerships();
                            }
                          }}
                          className="px-4 border border-gray-300 hover:bg-gray-50 text-gray-600 font-medium py-2 text-xs rounded-lg transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Active Goals</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#00685f] leading-none">{goals.filter(g => g.status === 'active').length}</span>
                <span className="text-xs font-bold text-[#c26d2e]">+2 this week</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Daily Streak</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#c26d2e] leading-none">{authUser?.currentStreak || 0}</span>
                <span className="text-sm font-medium text-gray-500">days</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Partners</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#4c51bf] leading-none">{partner ? 1 : 0}</span>
                <span className="text-sm font-medium text-gray-500">active</span>
              </div>
            </div>
            <button 
              onClick={() => {
                if (goals.filter(g => g.status === 'active').length === 0) {
                  showToast("Please create at least one active goal first before checking in!", "error");
                } else {
                  // Set default to first active goal
                  const firstActiveGoal = goals.find(g => g.status === 'active');
                  setCheckInGoalId(firstActiveGoal._id);
                  setIsCheckInModalOpen(true);
                }
              }}
              className="bg-[#00685f] hover:bg-[#004d46] rounded-2xl p-6 shadow-md flex flex-col justify-center text-left group transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -mr-8 -mt-8 transform scale-150"></div>
              <h3 className="text-sm font-semibold text-teal-100 mb-2 relative z-10">Quick Check-in</h3>
              <div className="flex items-center justify-between relative z-10 mt-auto">
                <span className="text-xl font-bold text-white">Log Progress</span>
                <span className="text-white text-2xl transform group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </button>
          </div>

          {/* Bento Grid Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1 & 2: Active Goals progress tracker */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Goal Overview</h3>
                <a href="#all" className="text-sm font-bold text-[#00685f] hover:underline">View all</a>
              </div>

              {/* Goal List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {isGoalsLoading ? (
                  <div className="col-span-2 flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00685f]"></div>
                  </div>
                ) : (
                  goals.map((goal, i) => {
                    // Visual assignments based on index
                    const colors = [
                      { bg: 'bg-[#b2f5ea]', text: 'text-teal-700', bar: 'bg-[#00685f]', icon: '🏋️' },
                      { bg: 'bg-[#c3dafe]', text: 'text-indigo-700', bar: 'bg-indigo-500', icon: '📖' },
                      { bg: 'bg-[#feebc8]', text: 'text-orange-700', bar: 'bg-[#8a5a33]', icon: '🎯' }
                    ];
                    const theme = colors[i % colors.length];

                    return (
                      <div key={goal._id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="flex justify-between items-start mb-5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${theme.bg} ${theme.text}`}>
                            {goal.category === 'fitness' ? '🏋️' : goal.category === 'study' ? '📖' : '🎯'}
                          </div>
                          <div className="flex items-center gap-1.5 text-[#c26d2e] text-xs font-bold bg-orange-50 px-2.5 py-1 rounded-full">
                            <span>🔥</span> {authUser?.currentStreak || 0} Streak
                          </div>
                        </div>
                        
                        <h4 className="text-lg font-bold text-gray-900 mb-4 tracking-tight leading-snug line-clamp-2">{goal.title}</h4>
                        
                        {/* Interactive Milestone Checkboxes Inside Goal Card */}
                        {goal.milestones && goal.milestones.length > 0 && (
                          <div className="space-y-2 mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Interactive Milestones</span>
                            {goal.milestones.map((m, idx) => (
                              <label key={idx} className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-gray-900 cursor-pointer font-medium">
                                <input 
                                  type="checkbox" 
                                  checked={m.completed} 
                                  onChange={() => handleToggleMilestone(goal._id, idx)}
                                  className="rounded text-[#00685f] focus:ring-[#00685f] border-gray-300 w-4 h-4 cursor-pointer"
                                />
                                <span className={m.completed ? "line-through text-gray-400" : ""}>{m.title}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        
                        <div className="mb-6 mt-auto">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-gray-500">Progress</span>
                            <span className="text-xs font-bold text-gray-700">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ease-out ${theme.bar}`} 
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-between items-end pt-2 border-t border-gray-50 mt-2">
                          <div className="flex -space-x-2">
                            <div className="w-7 h-7 rounded-full border-2 border-white shadow-sm overflow-hidden">
                              <img src={`https://ui-avatars.com/api/?name=${authUser?.name || 'User'}&background=e2e8f0`} alt="You" />
                            </div>
                            {partner && (
                              <div className="w-7 h-7 rounded-full border-2 border-white shadow-sm overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=${partner.name}&background=b2f5ea`} alt="Partner" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-medium text-gray-500">
                            {goal.frequency === 'daily' ? 'Daily Goal' : `${getDaysLeft(goal.deadline)} days left`}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Start a new journey card */}
                <div 
                  onClick={() => setIsNewGoalModalOpen(true)}
                  className="rounded-2xl border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors min-h-[240px] group"
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center text-gray-400 mb-4 text-2xl group-hover:scale-110 group-hover:text-[#00685f] group-hover:border-[#00685f] transition-all">
                    +
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1 tracking-tight group-hover:text-[#00685f] transition-colors">Start a new journey</h4>
                  <p className="text-sm text-gray-500 font-medium">Focus on what matters most.</p>
                </div>
              </div>
            </div>

            {/* Column 3: Partner Pulse Feed */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Activity Feed</h3>
                <button className="text-gray-400 hover:text-gray-600 text-xl font-bold pb-2">...</button>
              </div>
              
              <div className="bg-[#f8fafc] rounded-2xl border border-gray-200 p-6 space-y-6 shadow-sm">
                
                {/* Loop Feed Items */}
                <div className="space-y-6 relative">
                  {feed.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm font-bold text-gray-400">Activity feed is quiet.</p>
                      <p className="text-xs text-gray-400 mt-1">Pending check-ins will appear here.</p>
                    </div>
                  ) : (
                    feed.map((item, idx) => (
                      <div key={item.id} className="flex gap-4 relative">
                        {/* Vertical line connector */}
                        {idx !== feed.length - 1 && <div className="absolute top-10 left-5 w-px h-[calc(100%-10px)] bg-gray-200 z-0"></div>}
                        
                        <div className="w-10 h-10 shrink-0 rounded-full bg-white border border-gray-200 shadow-sm overflow-hidden relative z-10">
                          <img src={`https://ui-avatars.com/api/?name=${item.partnerName}&background=fff`} alt={item.partnerName} className="w-full h-full object-cover" />
                          {idx === 0 && <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#00685f] rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white">✓</div>}
                          {idx === 1 && <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white">⚡</div>}
                        </div>
  
                        <div className="flex-1 pb-2">
                          <p className="text-sm text-gray-800 font-medium leading-snug">
                            <span className="font-bold text-gray-900">{item.partnerName}</span> {item.action} {item.isBadge ? `"${item.badgeName}"` : ""}
                          </p>
                          <span className="text-[11px] font-medium text-gray-400 block mb-2">{item.timestamp}</span>
                          
                          {!item.isBadge && item.note && (
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-sm italic text-gray-600 mb-3 relative">
                              "{item.note}"
                              {/* Little triangle pointer */}
                              <div className="absolute -left-1.5 top-3 w-3 h-3 bg-white border-l border-b border-gray-200 transform rotate-45"></div>
                            </div>
                          )}
  
                          {/* Social Buttons */}
                          {item.isBadge && (
                            <div className="flex gap-2 mt-3">
                              <button className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full hover:bg-blue-100 flex items-center gap-1.5 transition-colors">
                                👍 High Five
                              </button>
                              <button className="px-3 py-1.5 bg-gray-200 text-gray-600 text-xs font-bold rounded-full hover:bg-gray-300 transition-colors">
                                Reply
                              </button>
                            </div>
                          )}
  
                          {/* Approval Trigger */}
                          {!item.isBadge && !item.approved && (
                             <button
                               onClick={async () => {
                                 const res = await approveCheckin(item.id, item.checkInId);
                                 if (res.success) {
                                   showToast("Check-in verified! Partner streak updated.");
                                 } else {
                                   showToast(res.message || "Failed to verify check-in", "error");
                                 }
                               }}
                               className="text-xs font-bold text-[#00685f] hover:underline"
                             >
                               Verify Check-in
                             </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Alert Banner for Streak at Risk */}
                {hasUncheckedActiveGoal && (
                  <div className="mt-8 bg-orange-500 rounded-xl p-5 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 text-7xl opacity-10">⚠️</div>
                    <h4 className="text-xs font-bold text-orange-100 uppercase tracking-widest mb-2 relative z-10">Streak at Risk!</h4>
                    <p className="text-sm text-white font-medium leading-relaxed mb-4 relative z-10">
                      You haven't checked in for your active goals yet today.
                    </p>
                    <button 
                      onClick={() => {
                        const firstActiveGoal = goals.find(g => g.status === 'active');
                        if (firstActiveGoal) {
                          setCheckInGoalId(firstActiveGoal._id);
                          setIsCheckInModalOpen(true);
                        }
                      }}
                      className="w-full bg-white hover:bg-orange-50 text-orange-600 font-bold text-sm py-2.5 rounded-lg transition-colors shadow-sm relative z-10"
                    >
                      Complete Now
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        </main>
      </div>

      {/* NEW GOAL MODAL (Interactive & Dynamic Milestone Builder) */}
      {isNewGoalModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative my-8">
            <button 
              onClick={() => setIsNewGoalModalOpen(false)}
              className="absolute right-6 top-6 text-2xl text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all"
            >✕</button>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Initialize New Cycle</h3>
            
            <form onSubmit={handleCreateGoalSubmit} className="space-y-5">
              {goalError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-bold">
                  ⚠️ {goalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Goal Title</label>
                <input 
                  type="text" 
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g., Leetcode mastery" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f] text-sm" 
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Description</label>
                <textarea 
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  placeholder="Briefly summarize your target..." 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f] text-sm h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Category</label>
                  <select 
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f] text-sm"
                  >
                    <option>study</option>
                    <option>fitness</option>
                    <option>career</option>
                    <option>habit</option>
                    <option>other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Frequency</label>
                  <select 
                    value={goalFrequency}
                    onChange={(e) => setGoalFrequency(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f] text-sm"
                  >
                    <option value="daily">Daily</option>
                    <option value="every2days">Every 2 Days</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Target Deadline</label>
                <input 
                  type="date" 
                  value={goalDeadline}
                  onChange={(e) => setGoalDeadline(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f] text-sm" 
                  required
                />
              </div>

              {/* Dynamic Milestones Section */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Partition Milestones</label>
                  <button 
                    type="button"
                    onClick={handleAddMilestoneField}
                    className="text-[#00685f] font-bold text-[10px] uppercase tracking-wider hover:underline flex items-center gap-1"
                  >
                    <span className="text-lg leading-none">+</span> Add milestone
                  </button>
                </div>
                
                <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
                  {goalMilestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</div>
                      <input 
                        type="text" 
                        value={milestone}
                        onChange={(e) => handleMilestoneFieldChange(idx, e.target.value)}
                        placeholder="e.g. Read Chapter 1"
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#00685f] text-sm" 
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => handleRemoveMilestoneField(idx)}
                        disabled={goalMilestones.length === 1}
                        className={`p-2 rounded-lg transition-colors ${
                          goalMilestones.length === 1 
                            ? "text-gray-300 cursor-not-allowed" 
                            : "text-red-400 hover:bg-red-50 hover:text-red-600"
                        }`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#00685f] hover:bg-[#004d46] text-white py-4 font-bold text-sm uppercase tracking-widest rounded-xl transition-all shadow-md mt-4"
              >
                Provision Goal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SEARCH PARTNER MODAL / SLIDE-OUT PANEL */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
            <button 
              onClick={() => {
                setIsSearchModalOpen(false);
                setSearchUsername("");
                setSearchResult(null);
                setSearchError("");
              }}
              className="absolute right-6 top-6 text-2xl text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all"
            >✕</button>
            
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00685f] mb-2 block">Sync Link Sequence</span>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Find Accountability Peer</h3>
            
            <form onSubmit={handleSearchPartnerSubmit} className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  placeholder="Search teammate's username..." 
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f] text-sm"
                  required
                />
                <button 
                  type="submit"
                  className="bg-[#00685f] hover:bg-[#004d46] text-white px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors shadow-sm"
                >
                  Search
                </button>
              </div>

              {searchError && (
                <p className="text-xs text-red-500 font-bold uppercase tracking-wider bg-red-50 p-3 rounded-lg border border-red-100">
                  ⚠️ {searchError}
                </p>
              )}

              {isSearching && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00685f]"></div>
                </div>
              )}

              {/* Animated Search Result Card */}
              {searchResult && (
                <div className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-6 mt-6 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl shadow-inner border border-teal-200">
                        {searchResult.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-gray-900 tracking-tight">{searchResult.name}</h4>
                        <span className="text-xs text-gray-500 font-medium">@{searchResult.username}</span>
                      </div>
                    </div>

                    {/* Compatibility Ring Indicator */}
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Compatibility</span>
                      <span className="px-2.5 py-1 rounded-md bg-green-100 text-green-700 font-bold text-[10px] border border-green-200 shadow-sm">
                        🎯 {searchResult.mutualCompatibility}%
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 italic bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    "{searchResult.bio}"
                  </p>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-2">Focus Areas</span>
                    <div className="flex gap-2 flex-wrap">
                      {searchResult.focusCategories.map((c, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-gray-600 text-[10px] font-bold uppercase tracking-wide shadow-sm">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {inviteSent ? (
                    <div className="w-full bg-green-50 border border-green-200 text-green-700 py-3.5 font-bold text-sm uppercase tracking-widest rounded-xl text-center shadow-sm flex items-center justify-center gap-2">
                      <span className="text-lg">✓</span> Invitation Pending
                    </div>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => handleInvitePartnerSubmit(searchResult.username)}
                      className="w-full bg-[#00685f] hover:bg-[#004d46] text-white py-3.5 font-bold text-sm uppercase tracking-widest rounded-xl transition-all shadow-md mt-2"
                    >
                      Send Accountability Invite
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* CHECK-IN SUBMISSION MODAL */}
      {isCheckInModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
            <button 
              onClick={() => {
                setIsCheckInModalOpen(false);
                setCheckInNote("");
                setCheckInStake("");
                setCheckInProgress(10);
                setCheckInError("");
              }}
              className="absolute right-6 top-6 text-2xl text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all"
            >✕</button>
            
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00685f] mb-2 block">Performance Verification</span>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Submit Check-In Proof</h3>
            
            <form onSubmit={handleCreateCheckInSubmit} className="space-y-4">
              {checkInError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-bold">
                  ⚠️ {checkInError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Select Active Goal</label>
                <select 
                  value={checkInGoalId}
                  onChange={(e) => setCheckInGoalId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f] text-sm"
                >
                  {goals.filter(g => g.status === 'active').map(goal => (
                    <option key={goal._id} value={goal._id}>
                      {goal.title} ({goal.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Check-in Note / Proof</label>
                <textarea 
                  value={checkInNote}
                  onChange={(e) => setCheckInNote(e.target.value)}
                  placeholder="What did you complete today? Be specific..." 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f] text-sm h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Financial/Social Stake (Optional)</label>
                <input 
                  type="text" 
                  value={checkInStake}
                  onChange={(e) => setCheckInStake(e.target.value)}
                  placeholder="e.g. $10 to charity if unverified" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f] text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Self-Assessed Progress Update</label>
                  <span className="text-xs font-bold text-gray-700">+{checkInProgress}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  step="5"
                  value={checkInProgress}
                  onChange={(e) => setCheckInProgress(Number(e.target.value))}
                  className="w-full accent-[#00685f]"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmittingCheckIn}
                className="w-full bg-[#00685f] hover:bg-[#004d46] text-white py-3.5 font-bold text-sm uppercase tracking-widest rounded-xl transition-all shadow-md mt-4 disabled:opacity-50"
              >
                {isSubmittingCheckIn ? "Logging Progress..." : "Commit Check-in Proof"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
