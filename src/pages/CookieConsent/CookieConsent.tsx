import { useState, useEffect } from "react";

const CookieConsent = () => {
  const [showCookie, setShowCookie] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookieAccepted");

    if (!accepted) {
      setShowCookie(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieAccepted", "true");
    setShowCookie(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieAccepted", "false");
    setShowCookie(false);
  };

  if (!showCookie) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">

        <div className="text-5xl mb-4">🍪</div>

        <h2 className="text-2xl font-bold text-[#201064]">
          We Value Your Privacy
        </h2>

        <p className="mt-4 text-gray-600 leading-7">
          We use cookies to enhance your browsing experience,
          analyze traffic and personalize content.
          By clicking "Accept All", you consent to our use of cookies.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">

          <button
            onClick={handleAccept}
            className="flex-1 bg-[#201064] text-white py-3 rounded-xl font-semibold hover:bg-[#2f1a8a]"
          >
            Accept All
          </button>

          <button
            onClick={handleReject}
            className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-100"
          >
            Reject
          </button>

          <button
            className="flex-1 border border-[#201064] text-[#201064] py-3 rounded-xl font-semibold hover:bg-[#201064] hover:text-white"
          >
            Settings
          </button>

        </div>

      </div>
    </div>
  );
};

export default CookieConsent;