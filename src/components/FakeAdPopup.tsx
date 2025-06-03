import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Crown, Smartphone } from "lucide-react";

interface FakeAdPopupProps {
  isVisible: boolean;
  adType: "congratulations" | "winner" | "prize";
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  onClose: () => void;
  onAdClick: () => void;
}

const FakeAdPopup: React.FC<FakeAdPopupProps> = ({
  isVisible,
  adType,
  position,
  onClose,
  onAdClick,
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      default:
        return "top-4 right-4";
    }
  };

  const getAdContent = () => {
    switch (adType) {
      case "congratulations":
        return {
          title: "CONGRATULATIONS!",
          subtitle: "Lucky visitor!",
          prize: "FREE iPhone 15!",
          icon: <Smartphone className="text-white" size={24} />,
          bgColor: "from-yellow-400 to-yellow-600",
          buttonText: "CLAIM",
          expiry: "*Expires in 5 min",
        };
      case "winner":
        return {
          title: "YOU'RE A WINNER!",
          subtitle: "1000th visitor!",
          prize: "Win $1000 Gift Card!",
          icon: <Gift className="text-white" size={24} />,
          bgColor: "from-green-400 to-green-600",
          buttonText: "COLLECT NOW",
          expiry: "*Limited time offer",
        };
      case "prize":
        return {
          title: "EXCLUSIVE OFFER!",
          subtitle: "VIP Member!",
          prize: "Premium Account FREE!",
          icon: <Crown className="text-white" size={24} />,
          bgColor: "from-purple-400 to-purple-600",
          buttonText: "ACTIVATE",
          expiry: "*Today only",
        };
      default:
        return {
          title: "CONGRATULATIONS!",
          subtitle: "Lucky visitor!",
          prize: "FREE iPhone 15!",
          icon: <Smartphone className="text-white" size={32} />,
          bgColor: "from-yellow-400 to-yellow-600",
          buttonText: "CLAIM",
          expiry: "*Expires in 5 min",
        };
    }
  };

  const adContent = getAdContent();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed ${getPositionClasses()} z-50 w-64 h-48`}
        >
          {" "}
          {/* Popup Container */}
          <div className="relative w-full h-full">
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-2 right-2 z-20 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              aria-label="Close ad"
            >
              <X size={16} />
            </button>{" "}
            {/* Ad Content - Clickable Area */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                console.log("FakeAdPopup clicked!"); // Debug log
                onAdClick();
              }}
              className={`w-full h-full bg-gradient-to-br ${adContent.bgColor} rounded-lg shadow-2xl border-4 border-white cursor-pointer transform hover:scale-105 transition-transform duration-200`}
            >
              {" "}
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg">
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-white/20 rounded-full"></div>
                <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-white/20 rounded-full"></div>
                <div className="absolute top-1/2 -left-1 w-6 h-6 bg-white/10 rounded-full"></div>
              </div>
              {/* Main Content */}
              <div className="relative flex flex-col items-center justify-center h-full p-3 text-center">
                {/* Celebration Icons */}
                <div className="absolute top-1 left-1 text-yellow-300 text-sm">
                  🎉
                </div>
                <div className="absolute top-1 right-6 text-yellow-300 text-sm">
                  🎉
                </div>
                {/* Title */}
                <h2 className="text-lg font-bold text-white mb-1 font-heading tracking-wide">
                  {adContent.title}
                </h2>
                {/* Icon */}
                <div className="mb-1">{adContent.icon}</div>
                {/* Subtitle */}
                <p className="text-xs text-white/90 mb-1 font-semibold">
                  {adContent.subtitle}
                </p>
                {/* Prize */}
                <p className="text-sm font-bold text-white mb-2 drop-shadow-lg">
                  {adContent.prize}
                </p>{" "}
                {/* CTA Button */}
                <div className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full font-bold text-xs shadow-lg transform hover:scale-105 transition-all duration-200 animate-pulse">
                  {adContent.buttonText}
                </div>
                {/* Expiry Text */}
                <p className="text-xs text-white/80 mt-1">{adContent.expiry}</p>
              </div>{" "}
            </div>
          </div>{" "}
          {/* Backdrop for emphasis */}
          <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg animate-pulse opacity-50 pointer-events-none"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FakeAdPopup;
