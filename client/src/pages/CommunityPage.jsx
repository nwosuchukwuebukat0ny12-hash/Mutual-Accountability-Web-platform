import { useOutletContext } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const CommunityPage = () => {
  const context = useOutletContext() || {};
  // The user instructed: const { publicFeed, leaderboard } = useOutletContext();
  // We'll safely default to empty arrays to prevent mapping errors if context is not yet updated
  const publicFeed = context.publicFeed || context.feed || [];
  const leaderboard = context.leaderboard || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
      
      {/* Proof of work Feed */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-md border border-slate-200 p-8 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#10B981] mb-2 block">
            Global Network Pulse
          </span>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">
            Proof of Work Feed
          </h3>

          <div className="space-y-6">
            {publicFeed.length > 0 ? (
              publicFeed.map((post, index) => (
                <div 
                  key={post._id || index} 
                  className="p-5 border border-slate-200 rounded-md hover:border-slate-300 transition-colors bg-slate-50/50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md border border-slate-200 shadow-sm overflow-hidden bg-white shrink-0">
                        <img 
                          src={post.user?.avatar || `https://ui-avatars.com/api/?name=${post.user?.name || 'User'}&background=ecfdf5&color=10B981`} 
                          alt={post.user?.name || "User"} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 leading-tight">
                          {post.user?.name || "Anonymous User"}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium">
                          @{post.user?.username || "user"} • {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : "recently"}
                        </p>
                      </div>
                    </div>
                    {(post.user?.currentStreak > 0 || post.streak > 0) && (
                      <span className="bg-orange-50 text-[#F97316] text-[9px] font-bold px-2 py-0.5 rounded-sm border border-orange-100 shadow-sm">
                        🔥 {post.user?.currentStreak || post.streak} Streak
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-700 leading-relaxed font-medium mb-4">
                    {post.note || post.content || "Completed a check-in."}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[10px] font-bold text-slate-500">
                    <span>
                      Target: <span className="text-[#10B981]">{post.goal?.title || "Accountability Goal"}</span>
                    </span>
                    <button 
                      type="button" 
                      onClick={() => context.showToast?.(`Nudged ${post.user?.name || 'User'}! 🚀`)}
                      className="text-[#10B981] hover:text-emerald-700 hover:underline flex items-center gap-1 transition-colors"
                    >
                      👍 Nudge Support
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-md">
                <p className="text-slate-500 font-medium text-sm">No recent check-ins. Be the first to post!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard Column */}
      <div className="space-y-6">
        <div className="bg-[#f8fafc] rounded-md border border-slate-200 p-6 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#F97316] mb-2 block">
            Top Performers
          </span>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4">
            🏆 Streak Leaderboard
          </h3>
          
          <div className="space-y-3">
            {leaderboard.length > 0 ? (
              leaderboard.map((user, index) => {
                let rankIcon = `${index + 1}`;
                if (index === 0) rankIcon = "🥇";
                if (index === 1) rankIcon = "🥈";
                if (index === 2) rankIcon = "🥉";

                return (
                  <div 
                    key={user._id || index} 
                    className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-md shadow-sm hover:shadow transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold w-6 text-center text-slate-400">
                        {rankIcon}
                      </span>
                      <div className="w-8 h-8 rounded-md border border-slate-200 overflow-hidden bg-slate-50 shrink-0">
                        <img 
                          src={user.avatar || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=fff7ed&color=F97316`} 
                          alt={user.name || "User"} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {user.name || "Anonymous"}
                        </h4>
                        <p className="text-[9px] text-slate-500 font-medium">
                          @{user.username || "user"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#F97316] bg-orange-50 px-2 py-1 rounded-sm border border-orange-100">
                      🔥 {user.currentStreak || 0}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 text-xs font-medium">Leaderboard is currently empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default CommunityPage;
