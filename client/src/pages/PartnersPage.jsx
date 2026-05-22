import { useOutletContext } from "react-router-dom";

const PartnersPage = () => {
  const context = useOutletContext();
  const {
    authUser, goals, partner, activePartnersList, activePactsList,
    feed, approveCheckin, respondToInvite, searchUser, sendInvite, dissolvePartnership, fetchPartnerships,
    isGoalsLoading, pendingMilestonesCount, hasUncheckedActiveGoal, getDaysLeft, incomingPendingInvites,
    sidebarOpen, setSidebarOpen, isNewGoalModalOpen, setIsNewGoalModalOpen,
    goalTitle, setGoalTitle, goalCategory, setGoalCategory, goalDescription, setGoalDescription, goalDeadline, setGoalDeadline, goalFrequency, setGoalFrequency, goalMilestones, setGoalMilestones, goalError, setGoalError,
    searchUsername, setSearchUsername, searchResult, setSearchResult, searchError, setSearchError, isSearching, setIsSearching, inviteSent, setInviteSent, inviteGoalId, setInviteGoalId,
    isCheckInModalOpen, setIsCheckInModalOpen, checkInGoalId, setCheckInGoalId, checkInNote, setCheckInNote, checkInStake, setCheckInStake, checkInProgress, setCheckInProgress, checkInError, setCheckInError, isSubmittingCheckIn, setIsSubmittingCheckIn,
    showToast, handleToggleMilestone, handleApproveCheckin, handleAddMilestoneField, handleMilestoneFieldChange, handleRemoveMilestoneField, handleCreateGoalSubmit, handleSearchPartnerSubmit, handleInvitePartnerSubmit, handleCreateCheckInSubmit, handleSendNudge,
    settingsTimezone, setSettingsTimezone, settingsBio, setSettingsBio, settingsCategories, setSettingsCategories, updateProfileSettings
  } = context;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
        <div className="lg:col-span-2 space-y-8">
          {/* Find Accountability Peer */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
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
                    &quot;{searchResult.bio}&quot;
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

                  {!inviteSent && goals.filter(g => g.status === 'active').length > 0 && (
                    <div className="mt-4">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Select Associated Goal</label>
                      <select
                        value={inviteGoalId}
                        onChange={(e) => setInviteGoalId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f] text-sm text-gray-700 font-medium"
                      >
                        <option value="">-- Choose Goal --</option>
                        {goals.filter(g => g.status === 'active').map((goal) => (
                          <option key={goal._id} value={goal._id}>
                            {goal.title} ({goal.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {inviteSent ? (
                    <div className="w-full bg-green-50 border border-green-200 text-green-700 py-3.5 font-bold text-sm uppercase tracking-widest rounded-xl text-center shadow-sm flex items-center justify-center gap-2 mt-4">
                      <span className="text-lg">✓</span> Invitation Pending
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleInvitePartnerSubmit(searchResult.username)}
                      className="w-full bg-[#00685f] hover:bg-[#004d46] text-white py-3.5 font-bold text-sm uppercase tracking-widest rounded-xl transition-all shadow-md mt-4"
                    >
                      Send Accountability Invite
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Active Partnerships Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Active Partnerships</h3>
              <span className="bg-[#ebf4ff] text-[#4c51bf] text-xs font-bold px-2.5 py-1 rounded-full">{activePactsList.length} Active</span>
            </div>

            {activePactsList.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-200">
                <p className="text-sm font-bold text-gray-400">No active accountability partnerships yet.</p>
                <p className="text-xs text-gray-400 mt-1">Search for a teammate above to send a pact request!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activePactsList.map((pact, idx) => {
                  const p = pact.partner;
                  return (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:border-[#00685f] transition-all hover:shadow-md duration-300">

                      {/* Header details */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${p.name}&background=b2f5ea`} className="w-12 h-12 rounded-full border-2 border-white shadow-md" alt={p.name} />
                          <div>
                            <h4 className="font-bold text-gray-900 leading-tight">{p.name}</h4>
                            <p className="text-xs text-gray-500 font-medium">@{p.username}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[#c26d2e] text-xs font-bold bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100 shadow-sm">
                          <span>🔥</span> {p.currentStreak || p.streak || 0} Streak
                        </div>
                      </div>

                      {/* Linked Goal details */}
                      <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl relative overflow-hidden">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Associated Pact Goal</span>
                        <h5 className="text-sm font-bold text-gray-800 leading-tight mb-3">{pact.goalTitle}</h5>

                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-semibold text-gray-500">Pact Progress</span>
                          <span className="text-[10px] font-bold text-gray-700">{pact.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000 ease-out bg-[#00685f]" style={{ width: `${pact.progress}%` }} ></div>
                        </div>
                      </div>

                      {p.bio && (
                        <p className="text-xs text-gray-600 italic line-clamp-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">&quot;{p.bio}&quot;</p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-50">
                        <button
                          type="button"
                          onClick={() => handleSendNudge(p._id)}
                          className="flex-1 py-2.5 bg-[#fff7ed] hover:bg-[#ffedd5] text-[#ea580c] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-orange-100 shadow-sm active:scale-95"
                        >
                          <span>⚡</span> Send Fire Nudge
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to dissolve this partnership pact with ${p.name}? This cannot be undone.`)) {
                              const res = await dissolvePartnership(pact.id);
                              if (res.success) {
                                showToast("Partnership dissolved successfully.");
                              } else {
                                showToast(res.message, "error");
                              }
                            }
                          }}
                          className="px-4 py-2.5 text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all active:scale-95"
                        >
                          Dissolve Pact
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Inbox only */}
        <div className="space-y-8">
          {/* Inbox Container */}
          <div className="bg-[#f8fafc] rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-4 flex items-center justify-between">
              <span>Pending Invites</span>
              {incomingPendingInvites.length > 0 && (
                <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest">{incomingPendingInvites.length} New</span>
              )}
            </h3>

            {incomingPendingInvites.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm font-bold text-gray-400">Your inbox is clear.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incomingPendingInvites.map((invite) => {
                  const sender = invite.requester || { name: "User", username: "user" };
                  const goal = invite.goal || { title: "Custom Goal" };
                  return (
                    <div key={invite._id} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                          {sender.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 leading-tight">{sender.name}</h4>
                          <p className="text-[10px] text-gray-500 font-medium">@{sender.username}</p>
                        </div>
                      </div>
                      <div className="mb-4 p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-700 font-medium">
                        <span className="font-bold text-[9px] text-[#00685f] uppercase block mb-1">Target Pact:</span>
                        &quot;{goal.title}&quot;
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            const res = await respondToInvite(invite._id, "accept");
                            if (res.success) {
                              showToast("Partnership accepted! 🤝");
                              fetchPartnerships();
                            }
                          }}
                          className="flex-grow bg-[#00685f] hover:bg-[#004d46] text-white py-1.5 font-bold text-xs rounded-lg transition-colors shadow-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={async () => {
                            const res = await respondToInvite(invite._id, "reject");
                            if (res.success) {
                              showToast("Invitation declined.", "error");
                              fetchPartnerships();
                            }
                          }}
                          className="px-3 border border-gray-300 hover:bg-gray-50 text-gray-600 font-medium py-1.5 text-xs rounded-lg transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnersPage;
