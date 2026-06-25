import React from "react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  tooltipText?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = "917749900124",
  message = "Hello, I would like to know more about your services.",
  tooltipText = "Chat with us on WhatsApp",
}) => {
  // Properly encode the message for URL usage
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] group">
      {/* Tooltip */}
      <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden md:block border border-transparent dark:border-slate-200">
        <div className="relative">
          {tooltipText}
          {/* Tooltip Arrow */}
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-slate-900 dark:border-l-white w-0 h-0"></div>
        </div>
      </div>

      {/* Pulse Ripple Effect behind the button */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-whatsapp-pulse pointer-events-none"></span>

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={tooltipText}
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba56] text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      >
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:rotate-[12deg]"
        >
          <path d="M12.012 2c-5.506 0-9.988 4.479-9.988 9.984 0 1.76.459 3.475 1.332 4.992L2 22l5.163-1.354a9.954 9.954 0 0 0 4.849 1.258h.004c5.505 0 9.988-4.479 9.988-9.984C22 7.479 17.518 2 12.012 2Zm5.849 14.194c-.252.71-1.463 1.38-2.014 1.474-.475.081-1.096.149-3.176-.71-2.662-1.1-4.382-3.812-4.515-3.99-.133-.178-1.077-1.431-1.077-2.729 0-1.298.674-1.937.915-2.193.242-.256.527-.32.703-.32.176 0 .352.004.505.011.162.008.38-.062.595.453.22.53.75 1.83.815 1.964.066.134.11.29.022.466-.088.176-.132.285-.264.44-.132.155-.277.346-.396.464-.132.132-.27.276-.117.54.152.263.68 1.121 1.455 1.811.998.89 1.837 1.166 2.098 1.299.26.133.41.11.562-.063.153-.173.655-.762.83-.984.175-.221.352-.186.595-.097.243.088 1.54.726 1.803.858.264.133.44.2.505.31.066.11.066.636-.186 1.346Z" />
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppButton;
