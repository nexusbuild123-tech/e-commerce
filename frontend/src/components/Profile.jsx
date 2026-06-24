import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;


const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  
  // OTP Flow management states
  const [showOtpFields, setShowOtpFields] = useState({ email: false, mobile: false });

  const [formData, setFormData] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : { name: "", email: "", mobile: "", password: "", address: "", email_otp: "", mobile_otp: "" };
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    const originalUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isEmailChanged = formData.email !== originalUser.email;
    const isMobileChanged = formData.mobile !== originalUser.mobile;

    // STEP 1: Agar content badla hai aur OTP abhi tak generate/verify step par nahi gaya
    if ((isEmailChanged && !showOtpFields.email) || (isMobileChanged && !showOtpFields.mobile)) {
      try {
        let triggerEmailOtp = isEmailChanged && !showOtpFields.email;
        let triggerMobileOtp = isMobileChanged && !showOtpFields.mobile;

        if (triggerEmailOtp) {
          await fetch(`${apiUrl}/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-api-key": "nexusBuild@123+!" },
            body: JSON.stringify({ target: formData.email, type: "email" })
          });
        }

        if (triggerMobileOtp) {
          await fetch(`${apiUrl}/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-api-key": "nexusBuild@123+!" },
            body: JSON.stringify({ target: formData.mobile, type: "mobile" })
          });
        }

        setShowOtpFields({ email: isEmailChanged, mobile: isMobileChanged });
        setStatus({ type: "success", message: "Security Verification OTP sent to modified fields! Check terminal." });
        setIsLoading(false);
        return; 
      } catch (err) {
        setStatus({ type: "error", message: "Failed to dispatch verification security tokens." },err);
        setIsLoading(false);
        return;
      }
    }

    // STEP 2: Main Update Trigger Execution
    try {
      const response = await fetch(`${apiUrl}/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "nexusBuild@123+!",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(result.user));
        setStatus({ type: "success", message: "Profile updated successfully!" });
        setIsEditing(false);
        setShowOtpFields({ email: false, mobile: false });
      } else {
        setStatus({ type: "error", message: result.message || "Failed to update profile." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Server error, please try again." },error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100">
        <h2 className="text-2xl font-black text-slate-900 mb-6">My Profile</h2>

        {status.message && (
          <div className={`mb-6 p-4 rounded-xl text-sm ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <input name="name" type="text" value={formData.name} onChange={handleChange} disabled={!isEditing} className={`w-full px-4 py-3 border rounded-xl ${isEditing ? "bg-white border-blue-300" : "bg-slate-50 border-gray-200"}`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile Number</label>
              <input name="mobile" type="tel" value={formData.mobile} onChange={handleChange} disabled={!isEditing} className={`w-full px-4 py-3 border rounded-xl ${isEditing ? "bg-white border-blue-300" : "bg-slate-50 border-gray-200"}`} />
            </div>
            {showOtpFields.mobile && (
              <div>
                <label className="block text-sm font-bold text-emerald-600 mb-1">Verify Mobile OTP</label>
                <input name="mobile_otp" type="text" required value={formData.mobile_otp || ""} onChange={handleChange} className="w-full px-4 py-3 border-2 border-emerald-300 bg-emerald-50/50 rounded-xl" placeholder="Enter Mobile OTP" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input name="password" type="password" value={formData.password || ""} onChange={handleChange} disabled={!isEditing} className={`w-full px-4 py-3 border rounded-xl ${isEditing ? "bg-white border-blue-300" : "bg-slate-50 border-gray-200"}`} placeholder="••••••••" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
            <textarea name="address" value={formData.address || ""} onChange={handleChange} disabled={!isEditing} className={`w-full px-4 py-3 border rounded-xl ${isEditing ? "bg-white border-blue-300" : "bg-slate-50 border-gray-200"}`} rows="3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} disabled={!isEditing} className={`w-full px-4 py-3 border rounded-xl ${isEditing ? "bg-white border-blue-300" : "bg-slate-50 border-gray-200"}`} />
            </div>
            {showOtpFields.email && (
              <div>
                <label className="block text-sm font-bold text-blue-600 mb-1">Verify Email OTP</label>
                <input name="email_otp" type="text" required value={formData.email_otp || ""} onChange={handleChange} className="w-full px-4 py-3 border-2 border-blue-300 bg-blue-50/50 rounded-xl" placeholder="Enter Email OTP" />
              </div>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            {!isEditing ? (
              <button type="button" onClick={(e) => { e.preventDefault(); setStatus({ type: "", message: "" }); setIsEditing(true); }} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
                Edit Profile
              </button>
            ) : (
              <>
                <button type="submit" disabled={isLoading} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
                  {isLoading ? "Saving..." : (showOtpFields.email || showOtpFields.mobile) ? "Confirm & Save" : "Save Changes"}
                </button>
                <button type="button" onClick={(e) => { e.preventDefault(); setStatus({ type: "", message: "" }); setIsEditing(false); setShowOtpFields({ email: false, mobile: false }); }} className="px-6 py-3 bg-gray-200 text-slate-700 font-bold rounded-xl hover:bg-gray-300 transition-all">
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;