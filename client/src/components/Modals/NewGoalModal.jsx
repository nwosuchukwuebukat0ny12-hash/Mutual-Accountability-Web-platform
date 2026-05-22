const NewGoalModal = ({
  isOpen,
  onClose,
  goalTitle,
  setGoalTitle,
  goalCategory,
  setGoalCategory,
  goalDescription,
  setGoalDescription,
  goalDeadline,
  setGoalDeadline,
  goalFrequency,
  setGoalFrequency,
  goalMilestones,
  goalError,
  handleCreateGoalSubmit,
  handleAddMilestoneField,
  handleMilestoneFieldChange,
  handleRemoveMilestoneField
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
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
  );
};

export default NewGoalModal;
