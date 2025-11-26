import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import "./SiteNoticeModal.css";

const SiteNoticeModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if modal was already shown before
    const alreadyShown = localStorage.getItem("site_notice_shown");

    if (!alreadyShown) {
      setOpen(true); 
      localStorage.setItem("site_notice_shown", "true"); // mark as shown
    }
  }, []);

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={() => setOpen(false)}>
          <X size={20} />
        </button>

        <h2>⚠️ Site Under Development</h2>
        <p>
          This website is currently under active development.  
          If you encounter any bugs, system errors, or broken pages,  
          kindly notify the development team.
        </p>

        <button className="ok-btn" onClick={() => setOpen(false)}>
          Got it
        </button>
      </div>
    </div>
  );
};

export default SiteNoticeModal;
