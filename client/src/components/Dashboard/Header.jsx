import { Link } from "react-router-dom";

const Header = ({ headerContent, currentView, authUser, goals, activePactsList, setIsNewGoalModalOpen }) => {
  return (
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
  );
};

export default Header;
