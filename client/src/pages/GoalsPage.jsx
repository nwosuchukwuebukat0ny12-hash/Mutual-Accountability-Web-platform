import { useOutletContext } from "react-router-dom";
import { useGoalStore } from "../store/useGoalStore";

const GoalsPage = () => {
  const context = useOutletContext();

  const {
    authUser, goals, activePartnersList, setIsNewGoalModalOpen, checkInHistory,
    handleToggleMilestone, getDaysLeft
  } = context;


  return (
    <>
      <div className="animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.length === 0 ? (
            <div className="col-span-2 text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-sm font-bold text-gray-400">No active goals yet.</p>
            </div>
          ) : (
            goals.map((goal) => {
              const partner = activePartnersList.find(p => p.goalId === goal._id);
              return (
                <div key={goal._id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-[#e6f4f2] text-[#00685f] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {goal.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-[#c26d2e] text-xs font-bold bg-orange-50 px-2.5 py-1 rounded-full">
                        <span>🔥</span> {authUser?.currentStreak || 0} Streak
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 mb-4 tracking-tight leading-snug">{goal.title}</h4>

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

                    {/* GitHub-Style Habit Heatmap */}
                    <div className="mb-6">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">30-Day Consistency</span>
                      <div className="grid grid-cols-10 gap-1">
                        {Array.from({ length: 30 }).map((_, i) => {
                          const d = new Date();
                          d.setDate(d.getDate() - (29 - i));
                          const dateStr = d.toISOString().split('T')[0];
                          const history = checkInHistory[goal._id] || [];
                          const checkIn = history.find(c => c.createdAt.startsWith(dateStr));
                          
                          let statusClass = "bg-[#e2e8f0]";
                          let tooltipMsg = `No check-in (${dateStr})`;
                          
                          if (checkIn) {
                            if (checkIn.status === 'approved') {
                              statusClass = "bg-[#10b981]";
                              tooltipMsg = `Verified check-in! (${dateStr})`;
                            } else {
                              statusClass = "bg-[#f97316]";
                              tooltipMsg = `Pending partner approval (${dateStr})`;
                            }
                          } else if (new Date(dateStr) < new Date(goal.createdAt).setHours(0,0,0,0)) {
                            statusClass = "bg-[#e2e8f0]";
                            tooltipMsg = `Before goal creation (${dateStr})`;
                          } else if (new Date(dateStr) < new Date().setHours(0,0,0,0)) {
                            statusClass = "bg-[#ef4444]";
                            tooltipMsg = `Missed check-in (${dateStr})`;
                          }

                          return (
                            <div key={i} className={`w-full pt-[100%] rounded-sm ${statusClass} relative group cursor-pointer`}>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block z-20 whitespace-nowrap bg-gray-800 text-white text-[10px] font-bold py-1 px-2 rounded">
                                {tooltipMsg}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mb-6 mt-auto">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-500">Progress</span>
                        <span className="text-xs font-bold text-gray-700">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out bg-[#00685f]"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
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
    </>
  );
};

export default GoalsPage;
