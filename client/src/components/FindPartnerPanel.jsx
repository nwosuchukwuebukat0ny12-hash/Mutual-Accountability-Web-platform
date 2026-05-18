import { useState } from "react";
import { Link } from "react-router-dom";
import { usePartnershipStore } from "../store/usePartnershipStore";
import { useGoalStore } from "../store/useGoalStore";

const FindPartnerPanel = () => {
  const { searchUser, searchResults, sendInvite, isLoading } = usePartnershipStore();
  const { goals } = useGoalStore();
  
  const [usernameQuery, setUsernameQuery] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [inviteSentStatus, setInviteSentStatus] = useState({}); // { [userId]: 'sending' | 'success' | 'error' }
  const [errorMessage, setErrorMessage] = useState("");

  const activeGoals = goals.filter((g) => g.status === "active");

  const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!usernameQuery.trim()) return;

    const res = await searchUser(usernameQuery.trim());
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const handleSendInvite = async (userId) => {
    setErrorMessage("");
    
    if (activeGoals.length === 0) {
      setErrorMessage("Create an active goal first before inviting a partner.");
      return;
    }

    // Default to the first active goal if none selected
    const targetGoalId = selectedGoalId || activeGoals[0]?._id;
    if (!targetGoalId) {
      setErrorMessage("Please select a goal to link with this partner.");
      return;
    }

    setInviteSentStatus((prev) => ({ ...prev, [userId]: "sending" }));

    const res = await sendInvite(userId, targetGoalId);
    if (res.success) {
      setInviteSentStatus((prev) => ({ ...prev, [userId]: "success" }));
    } else {
      setInviteSentStatus((prev) => ({ ...prev, [userId]: "error" }));
      setErrorMessage(res.message);
    }
  };

  // Soft category colors based on DESIGN.md
  const getCategoryStyles = (category) => {
    switch (category) {
      case "fitness":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case "study":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/50";
      case "career":
        return "bg-blue-50 text-blue-700 border-blue-200/50";
      case "habit":
        return "bg-amber-50 text-amber-700 border-amber-200/50";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200/50";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white border border-outline-variant rounded-md shadow-sm font-inter">
      {/* Headings - Montserrat */}
      <div className="mb-8">
        <h2 className="font-heading font-bold text-2xl lg:text-3xl tracking-tighter text-on-surface mb-2">
          FIND YOUR <span className="text-primary italic">ACCOUNTABILITY PEER.</span>
        </h2>
        <p className="text-text-muted text-sm leading-relaxed max-w-xl">
          Accountability works best when someone is watching. Search for a peer by username, scope your partnership to a goal, and invite them to form a pact.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container border border-error/15 rounded-md text-sm font-heading tracking-wide">
          {errorMessage}
        </div>
      )}

      {/* Goal Selection Safety check */}
      {activeGoals.length === 0 ? (
        <div className="mb-8 p-6 bg-surface-container-low border border-outline-variant/60 rounded-md text-center">
          <p className="text-sm text-text-muted mb-4 font-medium">
            ⚠️ You don't have any active goals. You must set a goal first before you can link up with a partner!
          </p>
          <Link
            to="/goals/new"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 font-heading font-bold text-xs uppercase tracking-widest rounded-md transition-all duration-300 shadow-md hover:shadow-lg shadow-primary/10"
          >
            Establish A Goal
          </Link>
        </div>
      ) : (
        <div className="mb-8 p-5 bg-surface-container-low border border-outline-variant/40 rounded-md">
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-text/80 mb-2">
            1. Select Which Goal This Partnership Scopes to:
          </label>
          <select
            value={selectedGoalId}
            onChange={(e) => setSelectedGoalId(e.target.value)}
            className="w-full md:w-1/2 px-4 py-3 rounded-md border border-outline-variant bg-white focus:outline-none focus:border-primary font-inter text-sm transition-colors cursor-pointer"
          >
            {activeGoals.map((goal) => (
              <option key={goal._id} value={goal._id}>
                {goal.title} ({goal.category})
              </option>
            ))}
          </select>
          <p className="mt-2 text-[11px] text-text-muted">
            Partnerships on Mutual are strictly 1:1 per goal to keep focus locked.
          </p>
        </div>
      )}

      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-grow">
          <input
            type="text"
            value={usernameQuery}
            onChange={(e) => setUsernameQuery(e.target.value)}
            placeholder="Search by username (e.g. fawaz, ebuka)..."
            className="w-full px-4 py-3.5 rounded-md border border-outline-variant focus:outline-none focus:border-primary font-inter text-sm transition-colors"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 font-heading font-bold text-xs uppercase tracking-widest rounded-md transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg shadow-primary/10"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Search Results */}
      <div className="space-y-4">
        {searchResults.length > 0 ? (
          <div>
            <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-text/60 mb-3">
              Search Results ({searchResults.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col justify-between p-5 bg-white border border-outline-variant rounded-md hover:shadow-md hover:border-outline transition-all duration-300"
                >
                  <div className="flex gap-4 items-start mb-4">
                    {/* Avatar placeholder / initials */}
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-heading font-bold text-primary border border-primary/15 text-lg uppercase shadow-sm">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.name.substring(0, 2)
                      )}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-base text-on-surface leading-snug">
                        {user.name}
                      </h4>
                      <p className="text-xs text-text-muted">@{user.username}</p>
                      {user.bio && <p className="text-xs text-text-muted mt-2 leading-relaxed">{user.bio}</p>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Categories of Interest */}
                    {user.categories && user.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {user.categories.map((cat) => (
                          <span
                            key={cat}
                            className={`px-2 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider border ${getCategoryStyles(
                              cat
                            )}`}
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Streak Info */}
                    <div className="flex items-center gap-4 text-xs font-medium text-text-muted border-t border-outline-variant/40 pt-3">
                      <div>
                        Streak: <span className="font-heading font-bold text-secondary text-sm">{user.currentStreak || 0}d</span> 🔥
                      </div>
                      <div>
                        Completed: <span className="font-heading font-semibold text-primary">{user.completedGoals || 0}</span>
                      </div>
                    </div>

                    {/* Invite Button */}
                    <button
                      onClick={() => handleSendInvite(user._id)}
                      disabled={
                        inviteSentStatus[user._id] === "sending" ||
                        inviteSentStatus[user._id] === "success" ||
                        activeGoals.length === 0
                      }
                      className={`w-full py-3 font-heading font-bold text-[10px] uppercase tracking-widest rounded-md transition-all duration-300 shadow-sm ${
                        inviteSentStatus[user._id] === "success"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default shadow-none"
                          : inviteSentStatus[user._id] === "sending"
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-primary hover:bg-primary-dark text-white hover:shadow-md"
                      }`}
                    >
                      {inviteSentStatus[user._id] === "success"
                        ? "✓ Invitation Transmitted"
                        : inviteSentStatus[user._id] === "sending"
                        ? "Transmitting..."
                        : "Send Partnership Invite"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          usernameQuery &&
          !isLoading && (
            <div className="text-center py-12 border border-dashed border-outline-variant/60 rounded-md">
              <p className="text-sm text-text-muted">No users found matching "{usernameQuery}".</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FindPartnerPanel;
