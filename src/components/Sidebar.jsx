import { useState } from "react";
import TransparencySlider from "./TransparencySlider";

const Sidebar = ({
  selectedLayer,
  setSelectedLayer,
  opacity,
  setOpacity,
  setBaseMap,
  mouseCoords ,
  baseMap,
  CapacityData,
  summaryData
}) => {

  const [showBaseMap, setShowBaseMap] = useState(false);
  const [showSolarLayers, setShowSolarLayers] = useState(false);
   const [showSolarLayers_Summary, setShowSolarLayers_Summary] = useState(false);
 // const [summaryData, setSummaryData] = useState();
  // const [showTransparency, setShowTransparency] = useState(false);

  const layers = [
    "Solar:upneda",
    "Solar:solar",
    "Solar:BIO ENERGY PROJECTS 2024",
    "Solar:GeoTagged Solar Power Plants V3",
    "Solar:ON GRID SOLAR POWER PLANT 2024",
    "Solar:SMART SOLAR STREET LIGHT 2024",
     "Solar:offgrid solar plant"
  ];

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 0fr",
  gap: "10px",
  marginTop: "10px",
 
};
const cardStyle = {
  background: "linear-gradient(180deg, #92beeb, #59c09e)",
  borderRadius: "10px",
  padding: "6px",width: "120px", marginLeft: "3px",
  color: "#000"
};

const labelStyle = {
  fontSize: "12px",
   fontWeight: "bold",
  color: "#050505"
};

const valueStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#062f5e"
};



  // ✅ FIXED image URLs (no {z})
  const baseMaps = [
    {
      name: "Satellite",
      value: "satellite",
      img: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/2/1/2"
    },
    {
      name: "OSM",
      value: "osm",
      img: "https://tile.openstreetmap.org/2/2/1.png"
    },
    {
      name: "Topo",
      value: "topo",
      img: "https://tile.opentopomap.org/2/2/1.png"
    },
    {
      name: "CartoDB",
      value: "carto",
      img: "https://basemaps.cartocdn.com/light_all/2/2/1.png"
    }
  ];

  return (
    <div style={{
      width: "15%",
      background: "rgb(11, 42, 74)",
      padding: "15px",
      overflowY: "hidden",
      border: "2px solid #ccc",
      color: "white"
    }}>

      {/* BASE MAP */}
     <div
  onClick={() => setShowBaseMap(!showBaseMap)}
  style={{
    display: "flex",
    justifyContent: "space-between", // 🔥 pushes arrow right
    alignItems: "center",
    cursor: "pointer", fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "10px"
  }}
>
  <span>BASE MAPS</span>
  <span>{showBaseMap ? "▼" : "▶"}</span>
</div>

      {showBaseMap && (
        <div>
          {baseMaps.map(item => (
            <div
              key={item.value}
              onClick={() => setBaseMap(item.value)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: baseMap === item.value ? "#334155" : "#1e293b",
                padding: "6px",
                margin: "8px 0",
                borderRadius: "10px",
                cursor: "pointer",
                border: baseMap === item.value ? "2px solid #3b82f6" : "1px solid #475569"
              }}
            >
              {/* <input
                type="radio"
                name="basemap"
                checked={baseMap === item.value}
                onChange={() => setBaseMap(item.value)}
style={{ accentColor: "green" , background: baseMap === item.value ? "#1d4ed8" : "#1e293b"}}

/> */}

              <span>{item.name}</span>

              <img
                src={item.img}
                alt=""
                style={{ width: "35px", height: "35px", borderRadius: "6px" }}
              />
            </div>
          ))}
        </div>
      )}

      <hr />

      {/* SOLAR LAYERS */}
      <div onClick={() => setShowSolarLayers(!showSolarLayers)}
       style={{
    display: "flex",
    justifyContent: "space-between", // 🔥 pushes arrow right
    alignItems: "center",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "10px"
  }}
  >
  <span>SOLAR LAYERS</span>
  <span>{showSolarLayers ? "▼" : "▶"}</span>
      </div>

      {showSolarLayers && (
        <div>
          {layers.map(layer => (
            <button
              key={layer}
              onClick={() => setSelectedLayer(layer)}
              style={{
                width: "100%",
                margin: "6px 0",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #999",
                background: selectedLayer === layer ? "#1976d2" : "#e0e0e0",
                color: selectedLayer === layer ? "#fff" : "#000"
              }}
            >
              {layer}
            </button>
          ))}
        </div>
      )}

      <hr />
{/* //----------------summary card------------------------------// */}

 <div onClick={() => setShowSolarLayers_Summary(!showSolarLayers_Summary)}
 style={{
 display: "flex",
justifyContent: "space-between", // 🔥 pushes arrow right
    alignItems: "center",
    cursor: "pointer",
   
   fontSize: "14px",
  marginTop: "10px",
 
}}>
  <span>📊 SOLAR SUMMARY</span>
   <span>{showSolarLayers_Summary ? "▼" : "▶"}</span>
</div>
{showSolarLayers_Summary && (
<div style={{
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  marginTop: "10px"
}}>

  <div style={gridStyle}>

{/* UPNEDA */}
  <div style={cardStyle}>
    <div style={labelStyle}>UPNEDA</div>
    <div style={valueStyle}>
      {summaryData?.["Solar:upneda"] || 0}
    </div>
  </div>

  <div style={cardStyle}>
    <div style={labelStyle}>Capacity</div>
    <div style={valueStyle}>
      {(CapacityData?.["Solar:upneda"] || 0).toFixed(3)} KW
    </div>
  </div>
<div style={cardStyle}>
    <div style={labelStyle}>Airport Panel</div>
    <div style={valueStyle}>
      {summaryData?.["Solar:solar"] || 0}
    </div>
  </div>

  <div style={cardStyle}>
    <div style={labelStyle}>Area</div>
    <div style={valueStyle}>
      {(CapacityData?.["Solar:solar"] || 0).toFixed(3)} sqr. mt.
    </div>
  </div>
  {/* BIO ENERGY */}
  <div style={cardStyle}>
    <div style={labelStyle}>Bio Energy</div>
    <div style={valueStyle}>
      {summaryData?.["Solar:BIO ENERGY PROJECTS 2024"] || 0}
    </div>
  </div>

  <div style={cardStyle}>
    <div style={labelStyle}>Capacity</div>
    <div style={valueStyle}>
      {(CapacityData?.["Solar:BIO ENERGY PROJECTS 2024"] || 0).toFixed(3)} KW
    </div>
  </div>

  {/* SOLAR */}
  <div style={cardStyle}>
    <div style={labelStyle}>Solar Power Plants</div>
    <div style={valueStyle}>
      {summaryData?.["Solar:GeoTagged Solar Power Plants V3"] || 0}
    </div>
  </div>

  <div style={cardStyle}>
    <div style={labelStyle}>Capacity</div>
    <div style={valueStyle}>
      {(CapacityData?.["Solar:GeoTagged Solar Power Plants V3"] || 0).toFixed(3)} KW
    </div>
  </div>

  {/* ON GRID */}
  <div style={cardStyle}>
    <div style={labelStyle}>On Grid Solar</div>
    <div style={valueStyle}>
      {summaryData?.["Solar:ON GRID SOLAR POWER PLANT 2024"] || 0}
    </div>
  </div>

  <div style={cardStyle}>
    <div style={labelStyle}>Capacity</div>
    <div style={valueStyle}>
      {(CapacityData?.["Solar:ON GRID SOLAR POWER PLANT 2024"] || 0).toFixed(3)} KW
    </div>
  </div>

 {/* offgrid solar plant */}
  <div style={cardStyle}>
    <div style={labelStyle}>Off Grid Solar</div>
    <div style={valueStyle}>
      {summaryData?.["Solar:offgrid solar plant"] || 0}
    </div>
  </div>

  <div style={cardStyle}>
    <div style={labelStyle}>Capacity</div>
    <div style={valueStyle}>
      {(CapacityData?.["Solar:offgrid solar plant"] || 0).toFixed(3)} KW
    </div>
  </div>

{/* SMART SOLAR STREET LIGHT 2024 */}
  {/* <div style={cardStyle}>
    <div style={labelStyle}>Solar Street Light</div>
    <div style={valueStyle}>
      {summaryData?.["Solar:SMART SOLAR STREET LIGHT 2024"] || 0}
    </div>
  </div>

  <div style={cardStyle}>
    <div style={labelStyle}>Capacity</div>
    <div style={valueStyle}>
      {(CapacityData?.["Solar:SMART SOLAR STREET LIGHT 2024"] || 0).toFixed(3)} KW
    </div>
  </div> */}


</div>







</div>
)}

<hr/>

      {/* TRANSPARENCY */}
      <div
  //onClick={() => setShowTransparency(!showTransparency)}
  style={{
   
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "10px", fontSize: "14px",
  }}
>
  <span>TRANSPARENCY</span>
  {/* <span>{showTransparency ? "▼" : "▶"}</span> */}
</div>
{/* <h4>Transparency</h4> 
<TransparencySlider opacity={opacity} setOpacity={setOpacity} /> */}
<input
  type="range"
  min="0"
  max="1"
  step="0.1"
  value={opacity}
  onChange={(e) => setOpacity(parseFloat(e.target.value))}
  className="custom-slider"
/>
      {/* {showTransparency && (
        <TransparencySlider opacity={opacity} setOpacity={setOpacity} />
      )} */}

      <hr />

      {/* MOUSE */}
     <h4>Mouse Position</h4>

<div style={{
  background: "#fff",
  padding: "6px",
  color: "#000",
  borderRadius: "4px"
}}>
  {mouseCoords
    ? `Lon: ${mouseCoords.lon}, Lat: ${mouseCoords.lat}`
    : "Move mouse on map"}
</div>
    </div>
  );
};

export default Sidebar;