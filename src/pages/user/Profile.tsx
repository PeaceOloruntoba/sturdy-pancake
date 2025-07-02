import { useState, useEffect } from "react";
import { FaEdit, FaImage } from "react-icons/fa";
import { useAuthStore } from "../../store/useAuthStore";
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
}

export default function Profile() {
  const { user } = useAuthStore();
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
  });
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || 18,
        gender: user.gender || "",
        university: user.university || "",
        status: user.status || "",
        description: user.description || "",
        lookingFor: user.lookingFor || "",
      });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos([...photos, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.age ||
      !formData.gender ||
      !formData.university ||
      !formData.status ||
      !formData.description ||
      !formData.lookingFor
    ) {
      toast.error("All fields are required");
      return;
    }
    toast.success("Profile updated successfully");
    setIsEditing(false);
    // TODO: Send updated profile and photos to backend
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg animate-fadeIn max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Profile</h2>
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
          <label className="block text-sm font-medium text-gray-700">Age</label>
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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Photos
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              disabled={!isEditing}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-rose-600 file:text-white file:hover:bg-rose-700"
            />
            <FaImage className="h-6 w-6 text-rose-600" />
          </div>
          {photos.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Uploaded ${index}`}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
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
    </div>
  );
}
