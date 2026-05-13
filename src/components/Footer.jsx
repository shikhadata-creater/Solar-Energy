const Footer = () => {
  return (
    <div style={{
      background: "rgb(11, 42, 74)", // Dark background
      color: "white",          // White text color
      textAlign: "center",     // Center align text
   
      position: "fixed",    // Fixed at bottom
      width: "100%",           // Full width
      bottom: 0,               // At the bottom of the page
      fontSize: "12px",        // Font size
    }}>
      <p>© 2026 UP Remote Sensing Applications Centre. All rights reserved.</p>
    </div>
  );
};

export default Footer;