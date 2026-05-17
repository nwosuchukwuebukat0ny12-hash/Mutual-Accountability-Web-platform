import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
  const { login, isLoggingIn } = useAuthStore();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "", // Can be username or email depending on how backend handles it
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter all credentials.");
      return;
    }

    const res = await login(formData);
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
            WELCOME BACK <br />
            <span className="text-primary italic">TO THE LOOP.</span>
          </h2>
          <p className="text-text-muted text-sm lg:text-base max-w-sm leading-relaxed">
            Re-align with your partner, verify pending milestones, and keep your consistency streak on track.
          </p>
        </div>

        {/* Decorative ambient blurred spots */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-secondary/5 blur-3xl"></div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="lg:w-1/2 bg-white flex flex-col justify-center p-8 lg:p-24 border-t lg:border-t-0 lg:border-l border-outline-variant">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-heading font-bold tracking-tighter mb-2">Initialize Session</h1>
            <p className="text-text-muted text-sm">Enter your credentials to access the command center.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container border border-error/20 rounded text-sm font-heading tracking-wide">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email / Username */}
            <div>
              <label className="block text-xs font-heading font-bold uppercase tracking-wider text-text/80 mb-2">Email or Username</label>
              <input 
                type="text" 
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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-text/80">Password</label>
                <a href="#forgot" className="text-[10px] font-heading font-bold text-primary hover:underline uppercase tracking-wider">Forgot?</a>
              </div>
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 font-heading font-bold text-xs uppercase tracking-widest rounded transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/10 hover:shadow-primary/20"
            >
              {isLoggingIn ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* Redirect to Register */}
          <div className="mt-8 text-center text-xs font-heading">
            <span className="text-text-muted">New to the system? </span>
            <Link to="/register" className="text-primary font-bold hover:underline transition-all">Apply for Access</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
