import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const CATEGORIES = [
  { id: "fitness", label: "Fitness" },
  { id: "study", label: "Study" },
  { id: "career", label: "Career" },
  { id: "habit", label: "Habit" },
  { id: "other", label: "Other" }
];

const RegisterPage = () => {
  const { register, isSigningUp } = useAuthStore();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    categories: []
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryToggle = (catId) => {
    setFormData((prev) => {
      const alreadySelected = prev.categories.includes(catId);
      const updatedCategories = alreadySelected
        ? prev.categories.filter((id) => id !== catId)
        : [...prev.categories, catId];
      return { ...prev, categories: updatedCategories };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const res = await register(formData);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row font-inter text-text overflow-hidden">
      {/* Left Panel - Hero Visual */}
      <div className="lg:w-1/2 bg-surface-container-low flex flex-col justify-center p-12 lg:p-24 relative overflow-hidden">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 group z-20">
          <div className="w-8 h-8 bg-primary flex items-center justify-center text-white font-heading font-bold text-xl transition-transform group-hover:scale-110">M</div>
          <span className="font-heading font-bold tracking-tighter text-2xl group-hover:italic transition-all">MUTUAL</span>
        </Link>

        <div className="max-w-md mx-auto z-10 flex flex-col justify-center items-center text-center mt-12 lg:mt-0">
          <div className="relative w-full aspect-square max-w-sm rounded-xl overflow-hidden shadow-2xl mb-8 bg-white/40 backdrop-blur border border-white/20 p-4">
            <img 
              src="/mutual_high_five.png" 
              alt="Mutual High Five" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold tracking-tighter leading-none mb-4">
            ACHIEVE MORE <br />
            <span className="text-primary italic">IN MUTUAL.</span>
          </h2>
          <p className="text-text-muted text-sm lg:text-base max-w-sm leading-relaxed">
            The premium accountability platform designed to keep you highly consistent. Match with a partner, set custom milestones, and build real consistency.
          </p>
        </div>

        {/* Decorative ambient blurred spots */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-secondary/5 blur-3xl"></div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="lg:w-1/2 bg-white flex flex-col justify-center p-8 lg:p-24 border-t lg:border-t-0 lg:border-l border-outline-variant">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-heading font-bold tracking-tighter mb-2">Join the System</h1>
            <p className="text-text-muted text-sm">Create your account to initiate mutual goal tracking.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container border border-error/20 rounded text-sm font-heading tracking-wide">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name & Username in 2 Columns on large screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-text/80 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ebuka N."
                  className="w-full px-4 py-3 rounded border border-outline-variant focus:outline-none focus:border-primary font-inter text-sm transition-colors"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-text/80 mb-2">Username</label>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="ebuka_dev"
                  className="w-full px-4 py-3 rounded border border-outline-variant focus:outline-none focus:border-primary font-inter text-sm transition-colors"
                  required 
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-heading font-bold uppercase tracking-wider text-text/80 mb-2">Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="ebuka@mutual.com"
                className="w-full px-4 py-3 rounded border border-outline-variant focus:outline-none focus:border-primary font-inter text-sm transition-colors"
                required 
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-heading font-bold uppercase tracking-wider text-text/80 mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded border border-outline-variant focus:outline-none focus:border-primary font-inter text-sm transition-colors pr-12"
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-heading font-bold text-primary hover:text-primary-dark transition-colors uppercase tracking-widest"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-[10px] text-text-muted mt-1 leading-normal">Must be at least 8 characters long.</p>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-xs font-heading font-bold uppercase tracking-wider text-text/80 mb-2">Timezone</label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded border border-outline-variant bg-white focus:outline-none focus:border-primary font-inter text-sm transition-colors appearance-none cursor-pointer"
              >
                <option value={formData.timezone}>{formData.timezone} (Auto-detected)</option>
                <option value="UTC">UTC (Universal Coordinated Time)</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Africa/Lagos">Africa/Lagos</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
              </select>
            </div>

            {/* Core Categories Selector */}
            <div>
              <label className="block text-xs font-heading font-bold uppercase tracking-wider text-text/80 mb-3">Focus Areas (Select Multi)</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = formData.categories.includes(cat.id);
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => handleCategoryToggle(cat.id)}
                      className={`px-4 py-2 text-xs font-heading font-bold tracking-wider rounded-full border transition-all duration-300 uppercase ${
                        isSelected 
                          ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                          : "border-outline-variant bg-white text-text-muted hover:border-primary hover:text-primary"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 font-heading font-bold text-xs uppercase tracking-widest rounded transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/10 hover:shadow-primary/20 mt-4"
            >
              {isSigningUp ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Redirect to Login */}
          <div className="mt-8 text-center text-xs font-heading">
            <span className="text-text-muted">Already have an account? </span>
            <Link to="/login" className="text-primary font-bold hover:underline transition-all">Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
