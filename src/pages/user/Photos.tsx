import { useEffect, useState } from "react";
import { usePhotoStore } from "../../store/usePhotoStore";
import { FaUpload, FaTrash, FaEye, FaTimes, FaCheck } from "react-icons/fa";
import { toast } from "sonner";
import UserProfileDetail from "./UserProfileDetail";

export default function PhotosPage() {
  const {
    photos,
    sentRequests,
    receivedRequests,
    isLoading,
    fetchPhotos,
    uploadPhoto,
    deletePhoto,
    fetchSentRequests,
    fetchReceivedRequests,
    respondToPhotoRequest,
  } = usePhotoStore();
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [isProfileDetailOpen, setIsProfileDetailOpen] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<
    string | null
  >(null);

  useEffect(() => {
    fetchPhotos();
    fetchSentRequests();
    fetchReceivedRequests();
  }, [fetchPhotos, fetchSentRequests, fetchReceivedRequests]);

  useEffect(() => {}, [sentRequests]);

  const handlePhotoUpload = async () => {
    if (newPhoto) {
      await uploadPhoto(newPhoto);
      setNewPhoto(null);
    } else {
      toast.error("Please select a photo to upload.");
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (window.confirm("Are you sure you want to delete this photo?")) {
      await deletePhoto(photoId);
    }
  };

  const handleRespondToRequest = async (
    requestId: string,
    status: "accepted" | "rejected"
  ) => {
    await respondToPhotoRequest(requestId, status);
  };

  const openProfileDetailModal = (userId: string) => {
    if (!userId) {
      console.error("Invalid userId:", userId);
      toast.error("Cannot open profile: Invalid user ID");
      return;
    }
    setSelectedUserForDetail(userId);
    setIsProfileDetailOpen(true);
  };

  const closeProfileDetailModal = () => {
    setIsProfileDetailOpen(false);
    setSelectedUserForDetail(null);
  };

  console.log(photos)

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg animate-fadeIn max-w-3xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        Your Photos & Requests
      </h2>
      {isLoading && (
        <div className="text-center text-sm sm:text-base">Loading...</div>
      )}
      {/* Photo Upload Section */}
      <section className="mb-6 sm:mb-8 p-3 sm:p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
          Upload New Photo 📸
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewPhoto(e.target.files ? e.target.files[0] : null)
            }
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:bg-rose-600 file:text-white file:hover:bg-rose-700"
          />
          <button
            onClick={handlePhotoUpload}
            disabled={!newPhoto || isLoading}
            className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50 w-full sm:w-auto"
          >
            <FaUpload className="h-4 sm:h-5 w-4 sm:w-5" /> Upload
          </button>
        </div>
        {newPhoto && (
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            Selected: {newPhoto.name}
          </p>
        )}
      </section>
      <hr className="my-6 sm:my-8" />
      {/* Your Photos Section */}
      <section className="mb-6 sm:mb-8 p-3 sm:p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
          Your Uploaded Photos 🖼️
        </h3>
        {photos.length === 0 && !isLoading ? (
          <p className="text-gray-600 text-sm sm:text-base">
            You haven't uploaded any photos yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative group overflow-hidden rounded-lg shadow-md"
              >
                <img
                  src={photo.cloudinaryUrl}
                  alt="User Upload"
                  className="w-full h-32 sm:h-40 object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700"
                  title="Delete Photo"
                >
                  <FaTrash className="h-3 sm:h-4 w-3 sm:w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
      <hr className="my-6 sm:my-8" />
      {/* Received Photo Requests Section */}
      <section className="mb-6 sm:mb-8 p-3 sm:p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
          Received Photo Requests 📥
        </h3>
        {receivedRequests.length === 0 && !isLoading ? (
          <p className="text-gray-600 text-sm sm:text-base">
            No photo requests received.
          </p>
        ) : (
          <ul className="space-y-2 sm:space-y-3">
            {receivedRequests.map((request) => (
              <li
                key={request._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex-grow">
                  <p className="font-medium text-sm sm:text-base text-gray-700">
                    <span
                      className="text-rose-600 cursor-pointer hover:underline"
                      onClick={() =>
                        openProfileDetailModal(request.requesterId._id)
                      }
                    >
                      {request.requesterId.firstName}{" "}
                      {request.requesterId.lastName}
                    </span>{" "}
                    requested to see your photos.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        request.status === "pending"
                          ? "text-yellow-600"
                          : request.status === "accepted"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {request.status}
                    </span>
                  </p>
                </div>
                {request.status === "pending" && (
                  <div className="flex space-x-2 mt-2 sm:mt-0 sm:ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRespondToRequest(request._id, "accepted");
                      }}
                      className="p-1 sm:p-2 flex gap-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      title="Accept Request"
                    >
                      Accept
                      <FaCheck className="h-3 sm:h-4 w-3 sm:w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRespondToRequest(request._id, "rejected");
                      }}
                      className="p-1 sm:p-2 flex-1 gap-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Reject Request"
                    >
                      Decline
                      <FaTimes className="h-3 sm:h-4 w-3 sm:w-4" />
                    </button>
                  </div>
                )}
                {request.status === "accepted" && (
                  <span className="text-green-600 text-xs sm:text-sm mt-2 sm:mt-0 sm:ml-4">
                    Access Granted
                  </span>
                )}
                {request.status === "rejected" && (
                  <span className="text-red-600 text-xs sm:text-sm mt-2 sm:mt-0 sm:ml-4">
                    Access Denied
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
      <hr className="my-6 sm:my-8" />
      {/* Sent Photo Requests Section */}
      <section className="p-3 sm:p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
          Sent Photo Requests 📤
        </h3>
        {sentRequests.length === 0 && !isLoading ? (
          <p className="text-gray-600 text-sm sm:text-base">
            No photo requests sent.
          </p>
        ) : (
          <ul className="space-y-2 sm:space-y-3">
            {sentRequests.map((request) => (
              <li
                key={request._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex-grow">
                  <p className="font-medium text-sm sm:text-base text-gray-700">
                    Request sent to{" "}
                    <span
                      className="text-rose-600 cursor-pointer hover:underline"
                      onClick={() =>
                        openProfileDetailModal(request.targetUserId._id)
                      }
                    >
                      {request.targetUserId.firstName}{" "}
                      {request.targetUserId.lastName}
                    </span>
                    .
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        request.status === "pending"
                          ? "text-yellow-600"
                          : request.status === "accepted"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {request.status}
                    </span>
                  </p>
                </div>
                {request.status === "accepted" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openProfileDetailModal(request.targetUserId._id);
                    }}
                    className="p-1 sm:p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors mt-2 sm:mt-0 sm:ml-4"
                    title="View Photos"
                  >
                    <FaEye className="h-3 sm:h-4 w-3 sm:w-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
      {/* Profile Detail Modal */}
      {isProfileDetailOpen && selectedUserForDetail && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeProfileDetailModal}
          ></div>
          <div className="fixed inset-y-0 left-0 w-11/12 sm:w-96 h-full bg-white shadow-xl transform transition-transform duration-300 ease-out translate-x-0">
            <div className="p-4 sm:p-6 h-full overflow-y-auto">
              <button
                onClick={closeProfileDetailModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl sm:text-2xl"
              >
                <FaTimes />
              </button>
              <UserProfileDetail
                userId={selectedUserForDetail}
                onClose={closeProfileDetailModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
