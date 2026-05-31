import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import useStatsStore from "../store/useStatsStore";
import { useGoalStore } from "../store/useGoalStore";

const ProfilePage = () => {
  const context = useOutletContext();
  const { stats, fetchMyStats } = useStatsStore();
  const { completedGoals, fetchCompletedGoals } = useGoalStore();

  useEffect(() => {
    fetchMyStats();
    fetchCompletedGoals();
  }, [fetchMyStats, fetchCompletedGoals]);
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
      <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">

              {/* Header profile showcase */}
              <div className="bg-gradient-to-r from-[#00685f]/10 to-[#00685f]/5 rounded-3xl border border-gray-200/80 p-8 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00685f]/5 rounded-full blur-3xl -z-10 transform translate-x-20 -translate-y-20"></div>
                <img
                  src={`https://ui-avatars.com/api/?name=${authUser?.name || 'User'}&background=00685f&color=fff&size=128`}
                  className="w-28 h-28 rounded-full border-4 border-white shadow-xl shrink-0"
                  alt="Profile Avatar"
                />
                <div className="text-center md:text-left space-y-3 flex-1">
                  <div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{authUser?.name}</h3>
                      <span className="self-center bg-[#e6f4f2] text-[#00685f] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#00685f]/20">
                        verified peer
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 font-bold mt-1">@{authUser?.username}</p>
                  </div>
                  {authUser?.bio ? (
                    <p className="text-sm text-gray-600 italic bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-100/80 shadow-xs max-w-2xl leading-relaxed">
                      &quot;{authUser.bio}&quot;
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 italic bg-white/50 p-3 rounded-xl border border-gray-100/50">
                      &quot;No bio written yet. High consistency starts in the mind.&quot;
                    </p>
                  )}

                  {/* Category badges */}
                  <div>
                    <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                      {authUser?.categories && authUser.categories.length > 0 ? (
                        authUser.categories.map((c, idx) => (
                          <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-white text-[#00685f] text-xs font-bold uppercase tracking-wider border border-gray-200/80 shadow-xs">
                            🎯 {c}
                          </span>
                        ))
                      ) : (
                        ['Study', 'Career', 'Habits'].map((c, idx) => (
                          <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-white text-[#00685f] text-xs font-bold uppercase tracking-wider border border-gray-200/80 shadow-xs">
                            🎯 {c}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. Accountability Scorecard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Streaks Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 text-7xl opacity-5">🔥</div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Streak Records</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-orange-50/50 rounded-xl border border-orange-100/50">
                        <span className="text-xs font-bold text-orange-800">Current Active</span>
                        <span className="text-lg font-black text-[#ea580c]">🔥 {authUser?.currentStreak || 0} Days</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                        <span className="text-xs font-bold text-amber-800">All-Time Longest</span>
                        <span className="text-lg font-black text-[#c26d2e]">🏅 {authUser?.longestStreak || 0} Days</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pact Stats Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm relative overflow-hidden md:col-span-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Pact & Completion Statistics</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Active Pacts</span>
                      <span className="text-lg font-extrabold text-[#4c51bf]">{stats?.activePacts || activePactsList.length} Active</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Dissolved Pacts</span>
                      <span className="text-lg font-extrabold text-red-600">{stats?.dissolvedPacts || 0} dissolved</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Goals Metrics</span>
                      <span className="text-lg font-extrabold text-[#00685f]">{stats?.completedGoals || 0} / {stats?.failedGoals || 0}</span>
                      <span className="text-[9px] text-gray-400 block font-medium">completed / failed</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Verifications</span>
                      <span className="text-lg font-extrabold text-emerald-600">{stats?.totalVerifications || 0} checks</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. The Achievement Badge Showcase (Gamification) */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00685f] mb-2 block">Level Achievements</span>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Earned Badges</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                  {/* Badge 1 */}
                  <div className={`p-5 border rounded-2xl flex flex-col items-center text-center transition-colors ${authUser?.badges?.includes('pact_keeper') ? 'border-gray-200 bg-slate-50/50 hover:border-gray-300' : 'border-gray-100 bg-white opacity-50 grayscale'}`}>
                    <span className="text-4xl mb-3 filter drop-shadow-md">🛡️</span>
                    <h5 className="font-extrabold text-sm text-gray-900 leading-tight mb-1">Pact Keeper</h5>
                    <p className="text-[11px] text-gray-500 font-medium leading-normal mb-3">Completed 5 check-ins without a miss.</p>
                    {authUser?.badges?.includes('pact_keeper') ? (
                      <span className="bg-green-50 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-green-150">Earned</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-gray-200">Locked</span>
                    )}
                  </div>

                  {/* Badge 2 */}
                  <div className={`p-5 border rounded-2xl flex flex-col items-center text-center transition-colors ${authUser?.badges?.includes('nudge_master') ? 'border-gray-200 bg-slate-50/50 hover:border-gray-300' : 'border-gray-100 bg-white opacity-50 grayscale'}`}>
                    <span className="text-4xl mb-3 filter drop-shadow-md">⚡</span>
                    <h5 className="font-extrabold text-sm text-gray-900 leading-tight mb-1">Nudge Master</h5>
                    <p className="text-[11px] text-gray-500 font-medium leading-normal mb-3">Sent 15 fire nudges to support accountability partners.</p>
                    {authUser?.badges?.includes('nudge_master') ? (
                      <span className="bg-green-50 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-green-150">Earned</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-gray-200">Locked</span>
                    )}
                  </div>

                  {/* Badge 3 */}
                  <div className={`p-5 border rounded-2xl flex flex-col items-center text-center transition-colors relative overflow-hidden group ${authUser?.badges?.includes('streak_legend') ? 'border-gray-200 bg-slate-50/50' : 'border-gray-100 bg-white opacity-75'}`}>
                    <span className={`text-4xl mb-3 filter drop-shadow-md transition-all ${authUser?.badges?.includes('streak_legend') ? '' : 'grayscale group-hover:grayscale-0'}`}>🔥</span>
                    <h5 className="font-extrabold text-sm text-gray-900 leading-tight mb-1">Streak Legend</h5>
                    <p className="text-[11px] text-gray-500 font-medium leading-normal mb-3">Maintain a continuous 14-day check-in streak.</p>
                    <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
                      <div className="bg-orange-500 h-full rounded-full" style={{ width: `${Math.floor(Math.min((authUser?.currentStreak || 0) / 14 * 100, 100))}%` }}></div>
                    </div>
                    {authUser?.badges?.includes('streak_legend') ? (
                      <span className="bg-green-50 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-green-150">Earned</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {authUser?.currentStreak || 0}/14 days
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Public Goal Journey List */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00685f] mb-2 block">Track Record</span>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Goal Journeys</h3>

                <div className="space-y-6">

                  {/* Active Goals block */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Active Public Goals</h4>
                    <div className="space-y-3">
                      {goals.filter(g => g.status === 'active').map((goal) => (
                        <div key={goal._id} className="p-4 border border-gray-150 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/30">
                          <div>
                            <span className="text-[9px] font-bold text-[#00685f] uppercase tracking-wider">{goal.category}</span>
                            <h5 className="font-bold text-sm text-gray-900 leading-tight mt-0.5">{goal.title}</h5>
                          </div>
                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            <span className="text-xs font-bold text-gray-700">{goal.progress}% progress</span>
                            <div className="w-20 bg-gray-200 rounded-full h-1.5">
                              <div className="bg-[#00685f] h-1.5 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Completed Goals block */}
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Past Completed Successes</h4>
                    <div className="space-y-3">
                      {completedGoals && completedGoals.length > 0 ? completedGoals.map((item) => (
                        <div key={item._id} className="p-4 border border-gray-150 rounded-xl flex justify-between items-center bg-gray-50/50">
                          <div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{item.category}</span>
                            <h5 className="font-bold text-sm text-gray-700 leading-tight mt-0.5 line-through decoration-gray-400">{item.title}</h5>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                            ✓ {new Date(item.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )) : (
                        <p className="text-xs text-gray-400 italic">No completed goals yet. Keep going!</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
    </>
  );
};

export default ProfilePage;
