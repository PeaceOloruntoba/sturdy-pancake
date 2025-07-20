import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useAuthStore } from "../../store/useAuthStore";
import { useProfileStore } from "../../store/useProfileStore";
import { toast } from "sonner";

interface ProfileData {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  university: string;
  status: string;
  description: string;
  lookingFor: string;
  guardianEmail?: string;
  guardianPhone?: string;
}

export default function Profile() {
  const { user } = useAuthStore();
  const {
    profile,
    isLoading,
    fetchProfile,
    updateProfile,
    uploadPhoto,
    fetchPhotos,
  } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    age: 18,
    gender: "",
    university: "",
    status: "",
    description: "",
    lookingFor: "",
    guardianEmail: "",
    guardianPhone: "",
  });
  const [newPhotos, setNewPhotos] = useState<File[]>([]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPhotos();
    }
  }, [user, fetchProfile, fetchPhotos]);

  useEffect(() => {
    setFormData({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      age: profile.age || 18,
      gender: profile.gender || "",
      university: profile.university || "",
      status: profile.status || "",
      description: profile.description || "",
      lookingFor: profile.lookingFor || "",
      guardianEmail: profile.guardianEmail || "",
      guardianPhone: profile.guardianPhone || "",
    });
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.age ||
      !formData.gender ||
      !formData.university ||
      !formData.status ||
      !formData.description ||
      !formData.lookingFor ||
      (formData.gender === "female" &&
        (!formData.guardianEmail || !formData.guardianPhone))
    ) {
      toast.error("All required fields must be provided");
      return;
    }
    await updateProfile(formData);
    for (const photo of newPhotos) {
      await uploadPhoto(photo);
    }
    setNewPhotos([]);
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg animate-fadeIn max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Profile</h2>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email (Read-only)
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-600"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          {formData.gender === "female" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Guardian Email
                </label>
                <input
                  type="email"
                  name="guardianEmail"
                  value={formData.guardianEmail}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Guardian Phone
                </label>
                <input
                  type="text"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              University
            </label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-600"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Looking For
            </label>
            <textarea
              name="lookingFor"
              value={formData.lookingFor}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-600"
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-all flex items-center gap-2"
            >
              <FaEdit className="h-5 w-5" />
              {isEditing ? "Cancel" : "Edit"}
            </button>
            {isEditing && (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all"
              >
                Save
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
