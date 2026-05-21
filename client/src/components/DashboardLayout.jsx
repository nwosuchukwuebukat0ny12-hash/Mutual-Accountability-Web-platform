import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useGoalStore } from "../store/useGoalStore";
import { usePartnershipStore } from "../store/usePartnershipStore";

const DashboardLayout = () => {
  const { authUser, logout, updateProfileSettings } = useAuthStore();
  const { goals, createGoal, toggleMilestone, fetchGoals, submitCheckIn, isLoading: isGoalsLoading } = useGoalStore();

  const {
    feed,
    approveCheckin,
    partner,
    activePartners,
    activePartnershipData,
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

  // Sync state with authUser updates
  useEffect(() => {
    if (authUser) {
      setSettingsTimezone(authUser.timezone || "UTC");
      setSettingsBio(authUser.bio || "");
      setSettingsCategories(authUser.categories || []);
    }
  }, [authUser]);

  // Navigation & View State
  const [settingsTimezone, setSettingsTimezone] = useState(authUser?.timezone || "UTC");
  const [settingsBio, setSettingsBio] = useState(authUser?.bio || "");
  const [settingsCategories, setSettingsCategories] = useState(authUser?.categories || []);

  const activePartnersList = activePartners && activePartners.length > 0
    ? activePartners
    : (partner ? [partner] : []);

  const activePactsList = (() => {
    if (!activePartnershipData) {
      return activePartnersList.map(p => ({
        partner: p,
        goalTitle: "Custom Goal",
        progress: Math.floor(Math.random() * 50) + 30
      }));
    }
    if (Array.isArray(activePartnershipData)) {
      return activePartnershipData.map(p => {
        const partnerInfo = p.partner || (p.recipient?._id === authUser?._id ? p.requester : p.recipient) || { name: "User", username: "user" };
        const goalInfo = p.goal || p.partnerGoal;
        return {
          partner: partnerInfo,
          goalTitle: goalInfo?.title || "Custom Goal",
          progress: goalInfo?.progress || 0
        };
      });
    } else {
      const partnerInfo = activePartnershipData.partner || { name: "User", username: "user" };
      const goalInfo = activePartnershipData.myGoal || activePartnershipData.partnerGoal;
      return [{
        partner: partnerInfo,
        goalTitle: goalInfo?.title || "Custom Goal",
        progress: goalInfo?.progress || 0
      }];
    }
  })();

  const location = useLocation();
  const currentView = location.pathname.split("/").filter(Boolean).pop() || "dashboard";

  // New Goal Form State
  const [goalTitle, setGoalTitle] = useState("");
  const [goalCategory, setGoalCategory] = useState("study");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");
  const [goalFrequency, setGoalFrequency] = useState("daily");
  const [goalMilestones, setGoalMilestones] = useState([""]);
  const [goalError, setGoalError] = useState("");

  // Search Partner Drawer/Modal State
  const [searchUsername, setSearchUsername] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [inviteGoalId, setInviteGoalId] = useState("");

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
    const activeGoals = goals.filter(g => g.status === "active");
    if (activeGoals.length === 0) {
      showToast("Create at least one active goal first before inviting a partner!", "error");
      return;
    }

    const targetGoalId = inviteGoalId || activeGoals[0]._id;
    const res = await sendInvite(username, targetGoalId);
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

  // Get header details dynamically based on path
  const getHeaderContent = () => {
    switch (currentView) {
      case "dashboard":
        return {
          badge: "Overview",
          title: `Welcome back, ${authUser?.name?.split(' ')[0] || "Alex"} 👋`,
          description: `You have ${pendingMilestonesCount} milestones to complete today. Keep the momentum going!`,
          icon: "📊"
        };
      case "goals":
        return {
          badge: "Focus List",
          title: "Your Accountability Goals 🎯",
          description: "Define milestones, track check-ins, and build consistency.",
          icon: "🎯"
        };
      case "partners":
        return {
          badge: "Sync Link Sequence",
          title: "Accountability Pact Hub 🤝",
          description: "Establish agreements, search peers, and verify partner check-ins.",
          icon: "🤝"
        };
      case "community":
        return {
          badge: "Pulse",
          title: "Global Proof of Work 💬",
          description: "See what other accountability peers are achieving in real time.",
          icon: "💬"
        };
      case "profile":
        return {
          badge: "Personal Hub",
          title: "Consistency Performance 👤",
          description: "Analyze your streak records, verification statistics, and earned badges.",
          icon: "👤"
        };
      case "settings":
        return {
          badge: "Configuration",
          title: "Preferences & Profiles ⚙️",
          description: "Adjust your timezone, target accountability categories, and bio details.",
          icon: "⚙️"
        };
      default:
        return {
          badge: "Overview",
          title: `Welcome back, ${authUser?.name?.split(' ')[0] || "Alex"} 👋`,
          description: `You have ${pendingMilestonesCount} milestones to complete today.`,
          icon: "📊"
        };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="min-h-screen bg-white font-inter text-text flex overflow-hidden">

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 border transition-all animate-bounce ${toastType === "success"
            ? "bg-[#00685f]/95 border-[#00685f] text-white"
            : "bg-red-500/95 border-red-500 text-white"
          }`}>
          <span className="text-lg">{toastType === "success" ? "✓" : "⚠"}</span>
          <span className="text-sm font-bold tracking-wider">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#f8fafc] border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 flex flex-col justify-between ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-[#00685f] tracking-tight">MUTUAL</h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">Progress as a Path</p>
          </div>
          <nav className="px-4 space-y-1 mt-4">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${currentView === "dashboard" ? "bg-[#00685f] text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <span className="text-lg">📊</span> Dashboard
            </Link>
            <Link
              to="/goals"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${currentView === "goals" ? "bg-[#00685f] text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <span className="text-lg">🎯</span> My Goals
            </Link>
            <Link
              to="/partners"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${currentView === "partners" ? "bg-[#00685f] text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <span className="text-lg">🤝</span> Partners
            </Link>
            <Link
              to="/community"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${currentView === "community" ? "bg-[#00685f] text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <span className="text-lg">💬</span> Community
            </Link>
            <Link
              to="/profile"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${currentView === "profile" ? "bg-[#00685f] text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <span className="text-lg">👤</span> Profile
            </Link>
            <Link
              to="/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${currentView === "settings" ? "bg-[#00685f] text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <span className="text-lg">⚙️</span> Settings
            </Link>
          </nav>
        </div>
        <div className="p-6 space-y-4">
          <button
            onClick={() => setIsNewGoalModalOpen(true)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-sm text-white bg-[#00685f] hover:bg-[#004d46] transition-colors shadow-sm"
          >
            <span className="text-lg">✨</span> New Goal
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-sm text-red-600 bg-red-50 border border-red-200/40 hover:bg-red-100 hover:text-red-700 transition-colors duration-200 shadow-xs"
          >
            <span className="text-lg">🚪</span> Sign Out
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
          <header className="relative bg-gradient-to-r from-teal-50/30 via-white to-slate-50 border border-slate-200/80 rounded-2xl p-6 md:p-8 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden">
            {/* Decorative radial blur for a subtle premium glass glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#00685f]/5 rounded-full blur-3xl -z-10 pointer-events-none transform translate-x-12 -translate-y-12"></div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex w-14 h-14 rounded-xl bg-white border border-slate-200 shadow-sm items-center justify-center text-2xl">
                {headerContent.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-[#e6f4f2] text-[#00685f] text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest border border-[#00685f]/15">
                    {headerContent.badge}
                  </span>
                  {currentView === "dashboard" && authUser?.currentStreak > 0 && (
                    <span className="bg-orange-50 text-[#c26d2e] text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border border-orange-100 flex items-center gap-1 animate-pulse">
                      🔥 {authUser.currentStreak} day streak
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {headerContent.title}
                </h2>
                <p className="text-gray-500 text-sm mt-1.5 font-medium leading-relaxed max-w-2xl">
                  {headerContent.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 self-end md:self-auto">
              {currentView === "dashboard" && (
                <div className="hidden lg:flex flex-col items-end border-l border-slate-200 pl-6 h-10 justify-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Goals</span>
                  <span className="text-lg font-extrabold text-[#00685f] leading-none mt-1">
                    {goals.filter(g => g.status === 'active').length} Active
                  </span>
                </div>
              )}
              {currentView === "goals" && (
                <button
                  onClick={() => setIsNewGoalModalOpen(true)}
                  className="bg-[#00685f] hover:bg-[#004d46] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm border border-[#00685f]/10"
                >
                  + Add New Goal
                </button>
              )}
              {currentView === "partners" && activePactsList.length > 0 && (
                <div className="hidden lg:flex flex-col items-end border-l border-slate-200 pl-6 h-10 justify-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Pacts</span>
                  <span className="text-lg font-extrabold text-[#00685f] leading-none mt-1">
                    {activePactsList.length} Active
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs text-slate-500 hover:text-slate-700 transition-colors hover:border-slate-300">
                  🔔
                </button>
                <Link to="/settings" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs text-slate-500 hover:text-slate-700 transition-colors hover:border-slate-300">
                  ⚙️
                </Link>
                <div className="w-10 h-10 rounded-xl bg-gray-100 border border-slate-200 shadow-sm overflow-hidden shrink-0">
                  <img src={`https://ui-avatars.com/api/?name=${authUser?.name || 'User'}&background=e6f4f2&color=00685f`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </header>

          <Outlet context={{
            authUser, logout, updateProfileSettings,
            goals, createGoal, toggleMilestone, fetchGoals, submitCheckIn, isGoalsLoading,
            feed, approveCheckin, partner, activePartners, activePartnershipData,
            searchUser, sendInvite, partnerships, fetchPartnerships, respondToInvite, fetchActivePartnership, fetchFeed,
            sidebarOpen, setSidebarOpen,
            isNewGoalModalOpen, setIsNewGoalModalOpen,
            activePartnersList, activePactsList,
            goalTitle, setGoalTitle, goalCategory, setGoalCategory, goalDescription, setGoalDescription, goalDeadline, setGoalDeadline, goalFrequency, setGoalFrequency, goalMilestones, setGoalMilestones, goalError, setGoalError,
            searchUsername, setSearchUsername, searchResult, setSearchResult, searchError, setSearchError, isSearching, setIsSearching, inviteSent, setInviteSent, inviteGoalId, setInviteGoalId,
            isCheckInModalOpen, setIsCheckInModalOpen, checkInGoalId, setCheckInGoalId, checkInNote, setCheckInNote, checkInStake, setCheckInStake, checkInProgress, setCheckInProgress, checkInError, setCheckInError, isSubmittingCheckIn, setIsSubmittingCheckIn,
            showToast, handleToggleMilestone, handleApproveCheckin, handleAddMilestoneField, handleMilestoneFieldChange, handleRemoveMilestoneField, handleCreateGoalSubmit, handleSearchPartnerSubmit, handleInvitePartnerSubmit, handleCreateCheckInSubmit,
            pendingMilestonesCount, hasUncheckedActiveGoal, getDaysLeft, incomingPendingInvites,
            settingsTimezone, setSettingsTimezone, settingsBio, setSettingsBio, settingsCategories, setSettingsCategories
          }} />
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
                        className={`p-2 rounded-lg transition-colors ${goalMilestones.length === 1
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

export default DashboardLayout;
