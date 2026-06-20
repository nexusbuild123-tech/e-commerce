import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // FIX: Lazy Initialization (useEffect ki zaroorat nahi padi state ke liye)
  const [formData, setFormData] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : { name: "", email: "", mobile: "", password: "", address: "" };
  });

  const navigate = useNavigate();

  // Redirect logic (Only for side-effect like navigation)
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
    console.log("Update Called");

    try {
      const response = await fetch("http://127.0.0.1:5000/update-profile", {
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
        setStatus({
          type: "success",
          message: "Profile updated successfully!",
        });
        setIsEditing(false);
      } else {
        setStatus({
          type: "error",
          message: result.message || "Failed to update profile.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Server error, please try again.",
        error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100">
        <h2 className="text-2xl font-black text-slate-900 mb-6">My Profile</h2>

        {status.message && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border rounded-xl ${isEditing ? "bg-white border-blue-300" : "bg-slate-50 border-gray-200"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Mobile Number
            </label>
            <input
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border rounded-xl ${isEditing ? "bg-white border-blue-300" : "bg-slate-50 border-gray-200"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border rounded-xl ${isEditing ? "bg-white border-blue-300" : "bg-slate-50 border-gray-200"}`}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border rounded-xl ${isEditing ? "bg-white border-blue-300" : "bg-slate-50 border-gray-200"}`}
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border rounded-xl ${
                isEditing
                  ? "bg-white border-blue-300"
                  : "bg-slate-50 border-gray-200"
              }`}
            />
          </div>

          <div className="flex space-x-4 pt-4">
            {!isEditing ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setStatus({ type: "", message: "" }); // <-- Yeh line purane error ko hata degi
                  setIsEditing(true); // <-- Yeh edit mode on karegi
                }}
                className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setStatus({ type: "", message: "" }); // <-- Cancel karne par bhi error hata dein
                    setIsEditing(false);
                  }}
                  className="px-6 py-3 bg-gray-200 text-slate-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
                >
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
