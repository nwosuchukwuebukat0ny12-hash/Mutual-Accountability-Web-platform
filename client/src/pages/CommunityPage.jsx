import { useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const CommunityPage = () => {
  const context = useOutletContext() || {};
  const publicFeed = context.publicFeed || [];
  const leaderboard = context.leaderboard || [];
  const publicFeedHasMore = context.publicFeedHasMore || false;
  const publicFeedIsLoadingMore = context.publicFeedIsLoadingMore || false;
  const fetchMorePublicFeed = context.fetchMorePublicFeed || (() => {});

  const observerRef = useRef(null);

  useEffect(() => {
    if (!publicFeedHasMore || publicFeedIsLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMorePublicFeed();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [publicFeedHasMore, publicFeedIsLoadingMore, fetchMorePublicFeed]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
      <style>{`
        @keyframes premium-shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-premium-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          animation: premium-shimmer 1.6s infinite linear;
        }
        .animate-premium-pulse {
          animation: premium-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes premium-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: .85;
            transform: scale(0.995);
          }
        }
      `}</style>
      
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
                          src={post.user?.avatar || `https://ui-avatars.com/api/?name=${post.user?.name || post.userName || 'User'}&background=ecfdf5&color=10B981`} 
                          alt={post.user?.name || post.userName || "User"} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 leading-tight">
                          {post.user?.name || post.userName || "Anonymous User"}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium">
                          @{post.user?.username || post.username || "user"} • {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : "recently"}
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
                      onClick={() => context.showToast?.(`Nudged ${post.user?.name || post.userName || 'User'}! 🚀`)}
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

            {/* IntersectionObserver Infinite Scroll Trigger and Skeletons */}
            {publicFeedHasMore && (
              <div ref={observerRef} className="pt-4 space-y-6">
                {publicFeedIsLoadingMore ? (
                  <div className="space-y-6">
                    {[1, 2].map((n) => (
                      <div 
                        key={n} 
                        className="p-5 border border-slate-200/50 rounded-md bg-slate-50/30 backdrop-blur-md relative overflow-hidden animate-premium-pulse shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3 w-full">
                            <div className="w-10 h-10 rounded-md border border-slate-200/50 bg-white/60 shrink-0 overflow-hidden relative">
                              <div className="absolute inset-0 animate-premium-shimmer"></div>
                            </div>
                            <div className="space-y-2 w-1/2">
                              <div className="h-3.5 bg-slate-200/70 rounded w-2/3 relative overflow-hidden">
                                <div className="absolute inset-0 animate-premium-shimmer"></div>
                              </div>
                              <div className="h-2 bg-slate-200/40 rounded w-1/2 relative overflow-hidden">
                                <div className="absolute inset-0 animate-premium-shimmer"></div>
                              </div>
                            </div>
                          </div>
                          {/* Streak badge skeleton */}
                          <div className="h-5 bg-orange-100/40 border border-orange-200/30 rounded w-16 relative overflow-hidden shrink-0">
                            <div className="absolute inset-0 animate-premium-shimmer"></div>
                          </div>
                        </div>
                        
                        {/* Note body skeleton */}
                        <div className="space-y-2 mb-5">
                          <div className="h-3.5 bg-slate-200/60 rounded w-11/12 relative overflow-hidden">
                            <div className="absolute inset-0 animate-premium-shimmer"></div>
                          </div>
                          <div className="h-3.5 bg-slate-200/60 rounded w-5/6 relative overflow-hidden">
                            <div className="absolute inset-0 animate-premium-shimmer"></div>
                          </div>
                        </div>
                        
                        {/* Bottom metadata row skeleton */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100/50">
                          <div className="h-3 bg-slate-200/40 rounded w-1/3 relative overflow-hidden">
                            <div className="absolute inset-0 animate-premium-shimmer"></div>
                          </div>
                          <div className="h-3 bg-slate-200/40 rounded w-20 relative overflow-hidden">
                            <div className="absolute inset-0 animate-premium-shimmer"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-6 flex items-center justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/60 animate-pulse">
                      Loading older updates...
                    </span>
                  </div>
                )}
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
