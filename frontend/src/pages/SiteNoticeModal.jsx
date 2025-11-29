import React, { useEffect, useState } from "react";
import { X, Info } from "lucide-react";
import "./SiteNoticeModal.css";

const SiteNoticeModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show modal on page load unless navbar clicked in this session
    const navbarClicked = sessionStorage.getItem("navbar_clicked");
    if (!navbarClicked) {
      setOpen(true);
    }
  }, []);

  const handleNavbarClick = () => {
    setOpen(false);
    sessionStorage.setItem("navbar_clicked", "true");
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box professional">
        {/* Close button */}
        <button className="close-btn" onClick={() => setOpen(false)}>
          <X size={20} />
        </button>

        {/* Icon + Title */}
        <div className="modal-header">
          <Info size={28} className="modal-icon" />
          <h2 className="modal-title">Notice from the Development Team</h2>
        </div>

        {/* Description */}
        <p className="modal-description">
          Welcome to our platform! We are continuously improving the website to provide
          you with the best experience. During this period, you may encounter minor
          issues such as broken pages or unexpected behavior.
        </p>

        <p className="modal-description">
          If you notice any problems, please report them to our support team via the
          contact form in the footer.
          Your feedback is invaluable.
        </p>

        {/* Action button */}
        <div className="modal-actions">
          <button className="ok-btn" onClick={() => setOpen(false)}>
            Acknowledged
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteNoticeModal;
