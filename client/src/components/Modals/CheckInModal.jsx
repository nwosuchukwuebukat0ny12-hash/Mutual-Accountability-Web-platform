const CheckInModal = ({
  isOpen,
  onClose,
  goals,
  checkInGoalId,
  setCheckInGoalId,
  checkInNote,
  setCheckInNote,
  checkInStake,
  setCheckInStake,
  checkInProgress,
  setCheckInProgress,
  checkInError,
  isSubmittingCheckIn,
  handleCreateCheckInSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
        <button
          onClick={onClose}
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
  );
};

export default CheckInModal;
