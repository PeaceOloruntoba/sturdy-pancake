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
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotos();
    fetchSentRequests();
    fetchReceivedRequests();
  }, [fetchPhotos, fetchSentRequests, fetchReceivedRequests]);

  // Debugging: Log sentRequests to verify data structure
  useEffect(() => {
    console.log("Sent Requests:", sentRequests);
  }, [sentRequests]);

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

  const handleRespondToRequest = async (requestId: string, status: "accepted" | "rejected") => {
    await respondToPhotoRequest(requestId, status);
  };

  const openProfileDetailModal = (userId: string) => {
    if (!userId) {
      console.error("Invalid userId:", userId);
      toast.error("Cannot open profile: Invalid user ID");
      return;
    }
    console.log("Opening profile modal for userId:", userId);
    setSelectedUserForDetail(userId);
    setIsProfileDetailOpen(true);
  };

  const closeProfileDetailModal = () => {
    console.log("Closing profile modal");
    setIsProfileDetailOpen(false);
    setSelectedUserForDetail(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg animate-fadeIn max-w-4xl mx-auto relative">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Photos & Requests</h2>

      {isLoading && <div className="text-center text-lg">Loading...</div>}

      {/* Photo Upload Section */}
      <section className="mb-8 p-4 border rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload New Photo 📸</h3>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewPhoto(e.target.files ? e.target.files[0] : null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-rose-600 file:text-white file:hover:bg-rose-700"
          />
          <button
            onClick={handlePhotoUpload}
            disabled={!newPhoto || isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <FaUpload /> Upload
          </button>
        </div>
        {newPhoto && (
          <p className="mt-2 text-sm text-gray-600">Selected: {newPhoto.name}</p>
        )}
      </section>

      <hr className="my-8" />

      {/* Your Photos Section */}
      <section className="mb-8 p-4 border rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Uploaded Photos 🖼️</h3>
        {photos.length === 0 && !isLoading ? (
          <p className="text-gray-600">You haven't uploaded any photos yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group overflow-hidden rounded-lg shadow-md">
                <img
                  src={photo.cloudinaryUrl}
                  alt="User Upload"
                  className="w-full h-40 object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700"
                  title="Delete Photo"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <hr className="my-8" />

      {/* Received Photo Requests Section */}
      <section className="mb-8 p-4 border rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Received Photo Requests 📥</h3>
        {receivedRequests.length === 0 && !isLoading ? (
          <p className="text-gray-600">No photo requests received.</p>
        ) : (
          <ul className="space-y-3">
            {receivedRequests.map((request) => (
              <li
                key={request._id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex-grow">
                  <p className="font-medium text-gray-700">
                    <span className="text-rose-600">{request.requesterId.firstName} {request.requesterId.lastName}</span> requested to see your photos.
                  </p>
                  <p className="text-sm text-gray-500">Status: <span className={`font-semibold ${request.status === 'pending' ? 'text-yellow-600' : request.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>{request.status}</span></p>
                </div>
                {request.status === "pending" && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleRespondToRequest(request._id, "accepted")}
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      title="Accept Request"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => handleRespondToRequest(request._id, "rejected")}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Reject Request"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
                {request.status === "accepted" && (
                  <span className="text-green-600 text-sm ml-4">Access Granted</span>
                )}
                {request.status === "rejected" && (
                  <span className="text-red-600 text-sm ml-4">Access Denied</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <hr className="my-8" />

      {/* Sent Photo Requests Section */}
      <section className="p-4 border rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Sent Photo Requests 📤</h3>
        {sentRequests.length === 0 && !isLoading ? (
          <p className="text-gray-600">No photo requests sent.</p>
        ) : (
          <ul className="space-y-3">
            {sentRequests.map((request) => (
              <li
                key={request._id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex-grow">
                  <p className="font-medium text-gray-700">
                    Request sent to <span className="text-rose-600">{request.targetUserId.firstName} {request.targetUserId.lastName}</span>.
                  </p>
                  <p className="text-sm text-gray-500">Status: <span className={`font-semibold ${request.status === 'pending' ? 'text-yellow-600' : request.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>{request.status}</span></p>
                </div>
                {request.status === "accepted" && (
                  <button
                    onClick={() => {
                      console.log("Eye button clicked for request:", request);
                      openProfileDetailModal(request.targetUserId._id);
                    }}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors ml-4 cursor-pointer"
                    title="View Photos"
                  >
                    <FaEye />
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
          <div className="fixed inset-y-0 left-0 w-[80%] h-full bg-white shadow-xl transform transition-transform duration-300 ease-out translate-x-0 mx-auto">
            <div className="p-6 h-full overflow-y-auto">
              <button
                onClick={closeProfileDetailModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
              >
                <FaTimes />
              </button>
              <UserProfileDetail userId={selectedUserForDetail} onClose={closeProfileDetailModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
