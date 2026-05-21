import { useOutletContext } from "react-router-dom";

const CommunityPage = () => {
  const context = useOutletContext();
  const {
    authUser, goals, partner, activePartnersList, activePactsList,
    feed, approveCheckin, respondToInvite, searchUser, sendInvite,
    isGoalsLoading, pendingMilestonesCount, hasUncheckedActiveGoal, getDaysLeft, incomingPendingInvites,
    sidebarOpen, setSidebarOpen, isNewGoalModalOpen, setIsNewGoalModalOpen,
    goalTitle, setGoalTitle, goalCategory, setGoalCategory, goalDescription, setGoalDescription, goalDeadline, setGoalDeadline, goalFrequency, setGoalFrequency, goalMilestones, setGoalMilestones, goalError, setGoalError,
    searchUsername, setSearchUsername, searchResult, setSearchResult, searchError, setSearchError, isSearching, setIsSearching, inviteSent, setInviteSent, inviteGoalId, setInviteGoalId,
    isCheckInModalOpen, setIsCheckInModalOpen, checkInGoalId, setCheckInGoalId, checkInNote, setCheckInNote, checkInStake, setCheckInStake, checkInProgress, setCheckInProgress, checkInError, setCheckInError, isSubmittingCheckIn, setIsSubmittingCheckIn,
    showToast, handleToggleMilestone, handleApproveCheckin, handleAddMilestoneField, handleMilestoneFieldChange, handleRemoveMilestoneField, handleCreateGoalSubmit, handleSearchPartnerSubmit, handleInvitePartnerSubmit, handleCreateCheckInSubmit,
    settingsTimezone, setSettingsTimezone, settingsBio, setSettingsBio, settingsCategories, setSettingsCategories, updateProfileSettings
  } = context;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
              <div className="lg:col-span-2 space-y-8">
                {/* Proof of work Feed */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#00685f] mb-2 block">Global Network Pulse</span>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Proof of Work Feed</h3>

                  <div className="space-y-6">
                    {[
                      { id: 1, name: "Ebuka Tony", username: "ebuka", goal: "Backend Schema Validation", note: "Integrated anti-spam length controls inside the invite routes. All tests passing! 🚀", avatar: "ebuka", time: "10m ago", streak: 5 },
                      { id: 2, name: "Mufeeda", username: "mufeeda", goal: "State Actions Setup", note: "Connected partnership status handlers inside the Zustand stores. Code builds clean.", avatar: "mufeeda", time: "2h ago", streak: 3 },
                      { id: 3, name: "Nabila", username: "nabila", goal: "Database indexing", note: "Optimized mongoose schemas for compound index key lookups on username.", avatar: "nabila", time: "5h ago", streak: 7 }
                    ].map(post => (
                      <div key={post.id} className="p-5 border border-gray-150 rounded-2xl hover:border-gray-200 transition-colors bg-slate-50/50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <img src={`https://ui-avatars.com/api/?name=${post.name}&background=b2f5ea`} className="w-10 h-10 rounded-full border shadow-sm" alt={post.name} />
                            <div>
                              <h4 className="font-bold text-sm text-gray-900 leading-tight">{post.name}</h4>
                              <p className="text-[10px] text-gray-500 font-medium">@{post.username} • {post.time}</p>
                            </div>
                          </div>
                          <span className="bg-orange-50 text-[#c26d2e] text-[9px] font-bold px-2 py-0.5 rounded-full border border-orange-100 shadow-sm">
                            🔥 {post.streak} Streak
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed font-medium mb-3">
                          {post.note}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-[10px] font-bold text-gray-500">
                          <span>Target: <span className="text-[#00685f]">{post.goal}</span></span>
                          <button type="button" onClick={() => showToast(`Nudged ${post.name}! 🚀`)} className="text-[#00685f] hover:underline flex items-center gap-1">
                            👍 Nudge Support
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Leaderboard Column */}
              <div className="space-y-6">
                <div className="bg-[#f8fafc] rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-4">🏆 Streak Leaderboard</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Ebuka Tony", username: "ebuka", streak: 12, rank: "🥇" },
                      { name: "Fawaz", username: "fawaz", streak: 8, rank: "🥈" },
                      { name: "Nabila", username: "nabila", streak: 7, rank: "🥉" },
                      { name: "Mufeeda", username: "mufeeda", streak: 4, rank: "4" }
                    ].map(user => (
                      <div key={user.username} className="flex justify-between items-center p-3 bg-white border border-gray-150 rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold w-6">{user.rank}</span>
                          <div>
                            <h4 className="text-xs font-bold text-gray-900 leading-tight">{user.name}</h4>
                            <p className="text-[9px] text-gray-500 font-medium">@{user.username}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#c26d2e]">🔥 {user.streak} days</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
    </>
  );
};

export default CommunityPage;
