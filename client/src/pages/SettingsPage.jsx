import { useOutletContext, useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
  const context = useOutletContext();
  const {
    settingsTimezone, setSettingsTimezone,
    settingsBio, setSettingsBio,
    settingsCategories, setSettingsCategories,
    updateProfileSettings, showToast
  } = context;

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm max-w-2xl animate-in fade-in duration-300">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Timezone</label>
            <select
              value={settingsTimezone}
              onChange={(e) => setSettingsTimezone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f] text-sm text-gray-700 font-medium bg-white"
            >
              <option value="UTC">UTC (GMT+0)</option>
              <option value="Africa/Lagos">West Africa Time (GMT+1)</option>
              <option value="Europe/London">London (GMT+1)</option>
              <option value="America/New_York">Eastern Time (EST/EDT)</option>
              <option value="America/Los_Angeles">Pacific Time (PST/PDT)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Target Accountability Focus</label>
            <div className="flex gap-2 flex-wrap">
              {['fitness', 'study', 'career', 'habit', 'other'].map((cat) => {
                const active = settingsCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      if (active) {
                        setSettingsCategories(settingsCategories.filter(c => c !== cat));
                      } else {
                        setSettingsCategories([...settingsCategories, cat]);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wide transition-all border ${
                      active
                        ? 'bg-[#00685f] border-[#00685f] text-white shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Profile Bio</label>
              <span className="text-[10px] font-bold text-gray-400">
                {(settingsBio || "").length}/200
              </span>
            </div>
            <textarea
              value={settingsBio}
              onChange={(e) => setSettingsBio(e.target.value.slice(0, 200))}
              placeholder="Share a bit about your goals..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 focus:border-[#00685f] text-sm h-32 resize-none"
              maxLength={200}
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button
              onClick={async () => {
                const res = await updateProfileSettings({ timezone: settingsTimezone, bio: settingsBio, categories: settingsCategories });
                if (res.success) {
                  showToast("Profile settings updated!");
                  navigate("/dashboard");
                } else {
                  showToast("Failed to update profile", "error");
                }
              }}
              className="flex-1 bg-[#00685f] hover:bg-[#004d46] text-white py-3.5 font-bold text-sm uppercase tracking-widest rounded-xl transition-all shadow-md"
            >
              Save Preferences
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3.5 font-bold text-sm uppercase tracking-widest rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>

          <div className="pt-8 mt-8 border-t border-red-100">
            <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-2">Danger Zone</h3>
            <p className="text-sm text-gray-500 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={async () => {
                if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
                  const { useAuthStore } = await import("../store/useAuthStore");
                  const res = await useAuthStore.getState().deleteAccount();
                  if (res.success) {
                    showToast("Account deleted successfully");
                    navigate("/login");
                  } else {
                    showToast(res.message || "Failed to delete account", "error");
                  }
                }
              }}
              className="px-6 border border-red-200 hover:bg-red-50 text-red-600 py-3 font-bold text-sm uppercase tracking-widest rounded-xl transition-all"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
