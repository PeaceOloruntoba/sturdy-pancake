import { useEffect, useState } from "react";
import {
  FaImage,
  FaLock,
  FaUnlock,
  FaHourglassHalf,
  FaTimesCircle,
  FaComments,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { usePhotoStore } from "../../store/usePhotoStore";
import { useChatStore } from "../../store/useChatStore";
import { Filter } from "bad-words";
import { toast } from "sonner";

const filter = new Filter();

interface ProfileWithPhotos {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  university: string;
  status: string;
  description: string;
  lookingFor: string;
  photos: { id: string; url: string }[];
  photoAccessStatus:
    | "restricted"
    | "pending"
    | "accepted"
    | "rejected"
    | "granted_self"
    | "granted_by_request";
}

interface UserProfileDetailProps {
  userId: string;
  onClose: () => void;
}

export default function UserProfileDetail({
  userId,
  onClose,
}: UserProfileDetailProps) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const {
    isLoading,
    error,
    fetchUserProfileWithPhotos,
    sendPhotoRequest,
    fetchSentRequests,
    sentRequests,
  } = usePhotoStore();
  const { sendMessage } = useChatStore();
  const [profileData, setProfileData] = useState<ProfileWithPhotos | null>(
    null
  );
  const [isRequestingPhoto, setIsRequestingPhoto] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (userId) {
        const data = await fetchUserProfileWithPhotos(userId);
        setProfileData(data);
      }
    };
    loadProfile();
    fetchSentRequests();
  }, [userId, fetchUserProfileWithPhotos, fetchSentRequests]);

  const handleRequestPhotos = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to request photos.");
      return;
    }
    if (!userId) {
      toast.error("Invalid user profile.");
      return;
    }
    setIsRequestingPhoto(true);
    try {
      await sendPhotoRequest(userId);
      setProfileData((prev) =>
        prev ? { ...prev, photoAccessStatus: "pending" } : null
      );
    } catch (err) {
      // Error handled by zustand store
    } finally {
      setIsRequestingPhoto(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    if (!profileData) {
      toast.error("No user profile data available to send message to.");
      return;
    }
    if (!currentUser?.id) {
      toast.error("Your user ID is not available. Please log in again.");
      return;
    }
    const cleanedMessage = filter.clean(message);
    await sendMessage(currentUser.id, profileData._id, cleanedMessage);
    toast.success(`Message sent to ${profileData.firstName}.`);
    setMessage("");
    setIsMessageModalOpen(false);
    onClose();
    navigate(`/chats?userId=${profileData._id}`);
  };

  const getPhotoRequestButtonState = () => {
    if (!profileData) return { text: "Loading...", disabled: true, icon: null };
    const sentRequestStatus = sentRequests.find(
      (req) => req.targetUserId._id === profileData._id
    )?.status;
    switch (profileData.photoAccessStatus) {
      case "granted_by_request":
        return {
          text: "Photos Accessible",
          disabled: true,
          icon: <FaUnlock className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />,
        };
      case "pending":
        return {
          text: "Request Pending",
          disabled: true,
          icon: <FaHourglassHalf className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />,
        };
      case "rejected":
        return {
          text: "Request Rejected",
          disabled: true,
          icon: <FaTimesCircle className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />,
        };
      case "restricted":
      default:
        if (sentRequestStatus === "pending") {
          return {
            text: "Request Pending",
            disabled: true,
            icon: <FaHourglassHalf className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />,
          };
        } else if (sentRequestStatus === "rejected") {
          return {
            text: "Request Rejected",
            disabled: true,
            icon: <FaTimesCircle className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />,
          };
        }
        return {
          text: isRequestingPhoto ? "Sending Request..." : "Request Photos",
          disabled: isRequestingPhoto,
          icon: <FaImage className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />,
        };
    }
  };

  const {
    text: buttonText,
    disabled: buttonDisabled,
    icon: buttonIcon,
  } = getPhotoRequestButtonState();

  if (isLoading && !profileData) {
    return (
      <div className="p-4 sm:p-6 text-center text-sm sm:text-base">
        Loading profile...
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="p-4 sm:p-6 text-center text-red-500 text-sm sm:text-base">
        Error: {error || "Profile not found."}
      </div>
    );
  }

  const blurredImageUrl =
    "https://placehold.co/400x300/cccccc/999999?text=Private+Photos";

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg animate-fadeIn h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {profileData.firstName}'s Profile
        </h2>
      </div>
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 flex-grow overflow-y-auto">
        <p className="text-gray-700 text-sm sm:text-base">
          <span className="font-semibold">Age:</span> {profileData.age}
        </p>
        <p className="text-gray-700 text-sm sm:text-base">
          <span className="font-semibold">Gender:</span> {profileData.gender}
        </p>
        <p className="text-gray-700 text-sm sm:text-base">
          <span className="font-semibold">University:</span>{" "}
          {profileData.university}
        </p>
        <p className="text-gray-700 text-sm sm:text-base">
          <span className="font-semibold">Status:</span> {profileData.status}
        </p>
        <p className="text-gray-700 text-sm sm:text-base">
          <span className="font-semibold">Description:</span>{" "}
          {profileData.description}
        </p>
        <p className="text-gray-700 text-sm sm:text-base">
          <span className="font-semibold">Looking For:</span>{" "}
          {profileData.lookingFor}
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-4 sm:mt-6 mb-3 sm:mb-4">
          Photos
        </h3>
        {profileData.photoAccessStatus === "granted_self" ||
        profileData.photoAccessStatus === "granted_by_request" ? (
          <div>
            {profileData.photos.length > 0 ? (
              <div className="flex flex-col gap-3 sm:gap-4">
                {profileData.photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.url}
                    alt={`${profileData.firstName}'s photo`}
                    className="w-full object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm sm:text-base">
                This user has no photos uploaded or displayed.
              </p>
            )}
          </div>
        ) : (
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg text-center text-gray-600 flex flex-col items-center justify-center min-h-[150px] sm:min-h-[200px] relative overflow-hidden">
            <img
              src={blurredImageUrl}
              alt="Private Photos"
              className="absolute inset-0 w-full h-full object-cover filter blur-md"
            />
            <div className="relative z-10 flex flex-col items-center">
              <FaLock className="text-3xl sm:text-4xl mb-2 sm:mb-3 text-gray-500" />
              <p className="mb-2 sm:mb-3 font-semibold text-sm sm:text-lg text-gray-800">
                Photos are private.
              </p>
              {profileData.photoAccessStatus === "pending" && (
                <p className="text-yellow-700 font-medium text-sm sm:text-base">
                  Your request is pending review.
                </p>
              )}
              {profileData.photoAccessStatus === "rejected" && (
                <p className="text-red-700 font-medium text-sm sm:text-base">
                  Your request was rejected.
                </p>
              )}
              {profileData.photoAccessStatus === "restricted" && (
                <button
                  onClick={handleRequestPhotos}
                  disabled={buttonDisabled}
                  className={`mt-3 sm:mt-4 px-4 sm:px-6 py-2 rounded-lg text-white font-semibold transition-colors duration-200 text-sm sm:text-base ${
                    buttonDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-rose-600 hover:bg-rose-700"
                  } flex items-center justify-center`}
                >
                  {buttonIcon} {buttonText}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-200 flex justify-center gap-3 sm:gap-4">
        {profileData.photoAccessStatus === "granted_self" ? (
          <button
            onClick={() => {
              onClose();
              window.location.href = "/photos";
            }}
            className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-sm sm:text-base"
          >
            <FaImage className="h-4 sm:h-5 w-4 sm:w-5" /> Manage Your Photos
          </button>
        ) : (
          <button
            onClick={() => setIsMessageModalOpen(true)}
            className="px-4 sm:px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all flex items-center gap-2 text-sm sm:text-base"
          >
            <FaComments className="h-4 sm:h-5 w-4 sm:w-5" /> Chat with{" "}
            {profileData.firstName}
          </button>
        )}
      </div>
      {/* Message Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center animate-fadeIn z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-11/12 sm:max-w-sm">
            <button
              onClick={() => setIsMessageModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl sm:text-2xl"
            >
              <FaTimes />
            </button>
            <h3 className="text-lg sm:text-xl font-bold mb-4">
              Send Message to {profileData?.firstName}
            </h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600 text-sm sm:text-base"
              placeholder="Type your message..."
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="px-3 sm:px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-all text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-3 sm:px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all text-sm sm:text-base"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
