import React, { useEffect, useState } from "react";
import { useAdminStore } from "../../store/useAdminStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface CreateProfileFormData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  age: string;
  university: string;
  isStudent: boolean;
  isGraduate: boolean;
  description: string;
  lookingFor: string;
  gender: "Male" | "Female";
  guardianEmail?: string;
  guardianPhoneNumber?: string;
  isAdmin: boolean; // Added isAdmin to form data
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { profiles, isLoading, error, fetchProfiles, createProfile } =
    useAdminStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProfileData, setNewProfileData] = useState<CreateProfileFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    age: "",
    university: "",
    isStudent: false,
    isGraduate: false,
    description: "",
    lookingFor: "",
    gender: "Male",
    guardianEmail: "",
    guardianPhoneNumber: "",
    isAdmin: false, // Default to false
  });

  useEffect(() => {
    if (!user || user.isAdmin !== true) {
      toast.error("Access denied. You must be an admin to view this page.");
      navigate("/");
    } else {
      fetchProfiles();
    }
  }, [user, navigate, fetchProfiles]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setNewProfileData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newProfileData.email ||
      !newProfileData.firstName ||
      !newProfileData.lastName ||
      !newProfileData.age ||
      !newProfileData.university ||
      !newProfileData.description ||
      !newProfileData.lookingFor ||
      !newProfileData.gender
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (
      newProfileData.gender === "Female" &&
      (!newProfileData.guardianEmail || !newProfileData.guardianPhoneNumber)
    ) {
      toast.error("Female profiles require guardian email and phone number.");
      return;
    }

    if (newProfileData.isStudent && newProfileData.isGraduate) {
      toast.error("A user cannot be both a student and a graduate.");
      return;
    }
    if (!newProfileData.isStudent && !newProfileData.isGraduate) {
      toast.error("Please specify if the user is a student or a graduate.");
      return;
    }

    const payload = {
      ...newProfileData,
      age: parseInt(newProfileData.age),
    };

    if (payload.gender === "Male") {
      delete payload.guardianEmail;
      delete payload.guardianPhoneNumber;
    }

    if (!payload.password) {
      delete payload.password;
    }

    const success = await createProfile(payload);
    if (success) {
      setNewProfileData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        age: "",
        university: "",
        isStudent: false,
        isGraduate: false,
        description: "",
        lookingFor: "",
        gender: "Male",
        guardianEmail: "",
        guardianPhoneNumber: "",
        isAdmin: false,
      });
      setShowCreateForm(false);
    }
  };

  if (isLoading && profiles.length === 0) {
    return <div className="text-center p-8">Loading admin data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  }

  if (!user || user.isAdmin !== true) {
    return null;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-rose-700">Admin Dashboard</h2>

      <div className="mb-8">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all shadow-md"
        >
          {showCreateForm ? "Hide Create Profile Form" : "Create New Profile"}
        </button>

        {showCreateForm && (
          <div className="mt-6 p-6 border border-gray-200 rounded-lg bg-gray-50 animate-slideInDown">
            <h3 className="text-xl font-semibold mb-4">
              Create New User Profile
            </h3>
            <form
              onSubmit={handleCreateProfileSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={newProfileData.email}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password (Optional):
                </label>
                <input
                  type="password"
                  name="password"
                  value={newProfileData.password}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Leave empty for auto-generated password"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  First Name:
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={newProfileData.firstName}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Last Name:
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={newProfileData.lastName}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Age:
                </label>
                <input
                  type="number"
                  name="age"
                  value={newProfileData.age}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  University:
                </label>
                <input
                  type="text"
                  name="university"
                  value={newProfileData.university}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="flex items-center mb-4 col-span-1">
                <input
                  type="checkbox"
                  name="isStudent"
                  id="isStudent"
                  checked={newProfileData.isStudent}
                  onChange={handleInputChange}
                  className="mr-2 leading-tight"
                />
                <label htmlFor="isStudent" className="text-sm">
                  Student
                </label>
              </div>
              <div className="flex items-center mb-4 col-span-1">
                <input
                  type="checkbox"
                  name="isGraduate"
                  id="isGraduate"
                  checked={newProfileData.isGraduate}
                  onChange={handleInputChange}
                  className="mr-2 leading-tight"
                />
                <label htmlFor="isGraduate" className="text-sm">
                  Graduate
                </label>
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Describe Themselves:
                </label>
                <textarea
                  name="description"
                  value={newProfileData.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                  required
                ></textarea>
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  What They're Looking For:
                </label>
                <textarea
                  name="lookingFor"
                  value={newProfileData.lookingFor}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Gender:
                </label>
                <select
                  name="gender"
                  value={newProfileData.gender}
                  onChange={handleInputChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              {newProfileData.gender === "Female" && (
                <>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Guardian Email:
                    </label>
                    <input
                      type="email"
                      name="guardianEmail"
                      value={newProfileData.guardianEmail}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required={newProfileData.gender === "Female"}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Guardian Phone Number:
                    </label>
                    <input
                      type="text"
                      name="guardianPhoneNumber"
                      value={newProfileData.guardianPhoneNumber}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required={newProfileData.gender === "Female"}
                    />
                  </div>
                </>
              )}
              {/* Admin Role Toggle */}
              <div className="col-span-2 flex items-center mt-4">
                <input
                  type="checkbox"
                  name="isAdmin"
                  id="isAdmin"
                  checked={newProfileData.isAdmin}
                  onChange={handleInputChange}
                  className="mr-2 h-5 w-5 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isAdmin"
                  className="text-gray-700 font-bold text-sm"
                >
                  Grant Admin Privileges
                </label>
              </div>
              <div className="col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold mb-4">All User Profiles</h3>
      {isLoading && profiles.length === 0 ? (
        <div className="text-center text-gray-500">Loading profiles...</div>
      ) : profiles.length === 0 ? (
        <div className="text-center text-gray-500">No profiles found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                  ID
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                  Age
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                  Gender
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                  Role
                </th>{" "}
                {/* Added Role header */}
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                  University
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                  Guardian Info
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b text-sm text-gray-800 truncate max-w-[100px]">
                    {profile.id}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-800">
                    {profile.firstName} {profile.lastName}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-800">
                    {profile.email}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-800">
                    {profile.age}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-800">
                    {profile.gender}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-800">
                    {profile.isAdmin ? "Admin" : "User"} {/* Display Role */}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-800">
                    {profile.isStudent ? "Student" : ""}
                    {profile.isGraduate ? "Graduate" : ""}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-800">
                    {profile.university}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-800">
                    {profile.gender === "Female" ? (
                      <>
                        {profile.guardianEmail}
                        <br />
                        {profile.guardianPhoneNumber}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-800">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
