import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useGoalStore } from "../store/useGoalStore";
import { usePartnershipStore } from "../store/usePartnershipStore";
import FindPartnerPanel from "../components/FindPartnerPanel";
import PartnerPulseFeed from "../components/PartnerPulseFeed";

const DashboardPage = () => {
  const { authUser } = useAuthStore();
  const { fetchGoals, isLoading: isGoalsLoading } = useGoalStore();
  const { 
    partnerships, 
    fetchPartnerships, 
    respondToInvite, 
    isLoading: isPartnershipsLoading 
  } = usePartnershipStore();

  const [initialLoading, setInitialLoading] = useState(true);
  const [partnershipFeedback, setPartnershipFeedback] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      setInitialLoading(true);
      await Promise.all([fetchGoals(), fetchPartnerships()]);
      setInitialLoading(false);
    };

    loadDashboardData();
  }, [fetchGoals, fetchPartnerships]);

  // Find active partnership where status is active
  const activePartnership = partnerships.find((p) => p.status === "active");

  // Find pending incoming invitations (where logged in user is the recipient)
  const incomingPendingInvites = partnerships.filter((p) => {
    // Determine if recipient is an object or an ID string
    const recipientId = p.recipient?._id || p.recipient;
    return p.status === "pending" && recipientId === authUser?._id;
  });

  const handleRespond = async (inviteId, responseStatus) => {
    setPartnershipFeedback("");
    const res = await respondToInvite(inviteId, responseStatus);
    if (res.success) {
      setPartnershipFeedback(`Successfully ${responseStatus === "active" ? "accepted" : "declined"} partnership invite.`);
    } else {
      setPartnershipFeedback(res.message);
    }
  };

  if (initialLoading || isGoalsLoading || isPartnershipsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-surface font-inter">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-xs font-heading font-bold uppercase tracking-wider text-text/60 animate-pulse">
            Configuring Command Center...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-10 px-4 lg:px-8 font-inter text-text">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Dashboard Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-outline-variant/60 pb-6">
          <div>
            <h1 className="font-heading font-bold text-3xl lg:text-4xl tracking-tighter text-on-surface mb-2">
              COMMAND <span className="text-primary italic">CENTER.</span>
            </h1>
            <p className="text-text-muted text-sm">
              Keep check-ins on schedule, monitor streaks, and review partnership logs.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-4 text-xs font-heading font-bold uppercase tracking-wider bg-white px-4 py-3 border border-outline-variant rounded-md shadow-sm">
            <div>
              Status: <span className="text-emerald-600">Secure ✅</span>
            </div>
            <div className="text-outline-variant">|</div>
            <div>
              Role: <span className="text-primary">Goal Owner</span>
            </div>
          </div>
        </div>

        {/* Action feedback banner */}
        {partnershipFeedback && (
          <div className="p-4 bg-primary-container text-on-primary-container border border-primary/20 rounded-md text-sm font-heading tracking-wide">
            {partnershipFeedback}
          </div>
        )}

        {/* Pending Partnerships Loop (Incoming Requests Inbox) */}
        {incomingPendingInvites.length > 0 && (
          <div className="p-6 bg-white border border-outline-variant rounded-md shadow-sm">
            <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-text/60 mb-4 flex items-center gap-2">
              <span>📥</span> Incoming Partnership Inboxes ({incomingPendingInvites.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingPendingInvites.map((invite) => {
                const sender = invite.requester || { name: "User", username: "user" };
                const goal = invite.goal || { title: "Custom Goal" };
                return (
                  <div
                    key={invite._id}
                    className="p-4 bg-surface-container-low border border-outline-variant/50 rounded-md flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-heading font-bold text-sm text-on-surface leading-tight">
                        Invitation from {sender.name}
                      </h4>
                      <p className="text-[11px] text-text-muted">@{sender.username}</p>
                      
                      <div className="mt-3 p-3 bg-white border border-outline-variant/35 rounded-md text-xs">
                        <span className="font-bold text-[10px] text-primary uppercase block mb-1">Target Goal Pact:</span>
                        "{goal.title}"
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-outline-variant/30">
                      <button
                        onClick={() => handleRespond(invite._id, "active")}
                        className="flex-grow bg-primary hover:bg-primary-dark text-white py-2 font-heading font-bold text-[9px] uppercase tracking-widest rounded transition-all duration-300"
                      >
                        Accept Pact
                      </button>
                      <button
                        onClick={() => handleRespond(invite._id, "declined")}
                        className="px-4 border border-outline hover:bg-slate-50 text-text py-2 font-heading font-bold text-[9px] uppercase tracking-widest rounded transition-all duration-300"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Display Panel */}
        <div className="w-full">
          {activePartnership ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-text/60">
                  Partnership Hub
                </h3>
              </div>
              <PartnerPulseFeed partnership={activePartnership} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-text/60">
                  Setup Required
                </h3>
              </div>
              <FindPartnerPanel />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
