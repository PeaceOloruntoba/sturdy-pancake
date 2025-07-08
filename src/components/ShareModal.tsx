import React from "react";
import {
  FaTimes,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const siteUrl = "https://sturdy-pancake-kappa.vercel.app";
  const shareText =
    "Looking for a spouse who shares your faith and academic background? Check out Unistudents Match, the premier platform for Muslim university students and graduates. Trial available!";

  const encodedShareText = encodeURIComponent(shareText);
  const encodedSiteUrl = encodeURIComponent(siteUrl);

  const socialMediaLinks = [
    {
      name: "Twitter",
      icon: <FaTwitter className="h-6 w-6 text-blue-400" />,
      url: `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedSiteUrl}`,
    },
    {
      name: "Facebook",
      icon: <FaFacebook className="h-6 w-6 text-blue-600" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedSiteUrl}&quote=${encodedShareText}`,
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="h-6 w-6 text-blue-700" />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedSiteUrl}&title=${encodeURIComponent(
        "Unistudents Match: Find Your Muslim Spouse"
      )}&summary=${encodedShareText}`,
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp className="h-6 w-6 text-green-500" />,
      url: `https://api.whatsapp.com/send?text=${encodedShareText}%20${encodedSiteUrl}`,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative animate-scale-in-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FaTimes className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Share Unistudents Match
        </h2>

        <p className="text-gray-700 text-center mb-6">
          Spread the word about Unistudents Match!
        </p>

        <div className="flex justify-center space-x-6 mb-8">
          {socialMediaLinks.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-3 rounded-full hover:bg-gray-100 transition-all duration-200 group"
              title={`Share on ${platform.name}`}
            >
              {platform.icon}
              <span className="text-xs text-gray-600 mt-1 group-hover:text-gray-800">
                {platform.name}
              </span>
            </a>
          ))}
        </div>

        <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-800 font-semibold mb-2">
            Share Message:
          </p>
          <p className="text-sm text-gray-600 break-words">
            {shareText} {siteUrl}
          </p>
          <button
            onClick={() => {
              navigator.clipboard
                .writeText(`${shareText} ${siteUrl}`)
                .then(() => toast.success("Message copied to clipboard!"))
                .catch(() => toast.error("Failed to copy message."));
            }}
            className="mt-4 w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700 transition-colors text-sm"
          >
            Copy Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
