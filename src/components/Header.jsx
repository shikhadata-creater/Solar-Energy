import upnedaLogo from "../assets/logo/UPNEDA.png";
import rsacLogo from "../assets/logo/RSAC_logo.jpg";
import upLogo from "../assets/logo/UP_logo.png";

const Header = () => {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      background: "#0b2a4a",
      color: "white",
      padding: "10px 20px"
    }}>

      {/* LEFT SIDE (2 logos) */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: "25%"
      }}>
        <img src={upnedaLogo} alt="UPNEDA" style={{ height: "45px" }} />
       
      </div>

      {/* CENTER TITLE */}
      <div style={{
        width: "50%",
        textAlign: "center",
        fontSize: "25px", fontFamily: "Arial, sans-serif",
        fontWeight: "bold"
      }}>
       <u>UPNEDA - Solar Energy Project</u>
      </div>

      {/* RIGHT SIDE (UP LOGO) */}
      <div style={{
        width: "25%",
        display: "flex",
        justifyContent: "flex-end"
      }}>
         <img src={rsacLogo} alt="RSAC" style={{ height: "45px" ,  borderRadius:"6px"}} />
&nbsp;        <img src={upLogo} alt="UP Logo" style={{ height: "45px" , borderRadius:"6px"}} />
        
      </div>

    </div>
  );
};

export default Header;