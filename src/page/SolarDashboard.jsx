
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MapView from "../components/MapView";
import DataTable from "../components/DataTable";
import Footer from "../components/Footer";
import config from "../config";

const SolarDashboard = () => {
  const [selectedLayer, setSelectedLayer] = useState("Solar:UPNEDA");
  const [opacity, setOpacity] = useState(1);
  const [baseMap, setBaseMap] = useState("osm");
  const [tableData, setTableData] = useState([]);
  const [mouseCoords, setMouseCoords] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [summaryData, setSummaryData] = useState({});
const [CapacityData, setCapacityData] = useState({});

const [selectedFeatureId, setSelectedFeatureId] = useState(null);


useEffect(() => {
  const layers = [
    "Solar:UPNEDA",
    "Solar:Solar",
    "Solar:BIO ENERGY PROJECTS 2024",
    "Solar:GeoTagged Solar Power Plants V3",
    "Solar:On Grid Solar Power Plant 2024",
    "Solar:Smart Solar Street Light 2024",
    "Solar:Solar High Mast 2024",
    "Solar:Offgrid solar plant"
  ];

  const fetchData = async () => {
    const countResults = {};
    const capacityResults = {};

    for (const layer of layers) {
      try {
        const url = `${config.GEOSERVER_URL}/ows?service=WFS&request=GetFeature&typeName=${layer}&outputFormat=application/json`;

        const res = await fetch(url);
        const data = await res.json();

        const features = data.features || [];

        // ✅ COUNT
        countResults[layer] = features.length;

        // ✅ CAPACITY SUM
      let totalCap = 0;

features.forEach(f => {
  const props = f.properties || {};

  let cap = 0;

  // 🔥 capacity calculation LAYER-WISE FIX
  if (layer === "Solar:BIO ENERGY PROJECTS 2024" ) {
    cap = props["capacity o"]||props.capacity;   // ✔ your actual column
  }
  else if (layer === "Solar:UPNEDA") {
    cap = props["Capacity"]||props.capacity;   // ✔ your actual column
  }
  else if (layer === "Solar:Offgrid solar plant") {
    cap = props["capacity o"]||props.capacity;   // ✔ your actual column
  }
  else if (layer === "Solar:GeoTagged Solar Power Plants V3") {
    cap = props["Capacity (in kW)"]|| props.capacity;     // adjust if needed
  }
  else if (layer === "Solar:On Grid Solar Power Plant 2024") {
    cap = props["Capacity of Plant (KW)"] || props.capacity;
  }
  else if (layer === "Solar:Solar High Mast 2024") {
    cap = props["Capacity of Plant (KW)"] || props.capacity;
  }
  else if (layer === "Solar:Smart Solar Street Light 2024") {
    cap = props["Capacity of Plant (KW)"] || props.capacity;
  }
  else if (layer === "Solar:Solar") {
    cap = props["area (sqr. mt.)"] || props.area;
  }
  else {
    cap =
    props["Capacity of Plant (KW)"] ||
    props["Capacity (in kW)"] ||
     props["capacity o"] ||
      props.capacity ||
      props.capacity_mw ||
      props.cap_mw ||
      props.capacity_kw ||
       props["area (sqr. mt.)"] ||
      0;
  }

  // ✅ safe number conversion
  totalCap += Number(cap) || 0;
});
        capacityResults[layer] = totalCap;

          } catch (err) {
            console.error("Summary fetch failed:", layer, err);
            countResults[layer] = 0;
            capacityResults[layer] = 0;
          }
    }

const totalCount = Object.values(countResults)
  .reduce((sum, val) => sum + (Number(val) || 0), 0);

const totalCapacity = Object.values(capacityResults)
  .reduce((sum, val) => {
    return typeof val === "number"
      ? sum + val
      : sum;
  }, 0);

// ✅ add total row
countResults["TOTAL"] = totalCount;
capacityResults["TOTAL"] = totalCapacity;


    setSummaryData(countResults);
    setCapacityData(capacityResults);
  };

  fetchData();
}, []);


  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      <Header />

      {/* Main Layout */}
      <div style={{ display: "flex", flex: 1 }}>

        {/* Sidebar 20% */}
       <Sidebar
  selectedLayer={selectedLayer}
  setSelectedLayer={setSelectedLayer}
  opacity={opacity}
  setOpacity={setOpacity}
  setBaseMap={setBaseMap}
  baseMap={baseMap}
  mouseCoords={mouseCoords}  
  totalCount={totalCount} 
  CapacityData={CapacityData} 
  summaryData={summaryData}
   // ✅ ADD THIS
/>

        <MapView
          selectedLayer={selectedLayer}
          opacity={opacity}
          baseMap={baseMap}
          setTableData={setTableData}
          setMouseCoords={setMouseCoords}
          setTotalCount={setTotalCount}
          setCapacityData={setCapacityData}
          selectedFeatureId={selectedFeatureId}
  setSelectedFeatureId={setSelectedFeatureId}

        />

       <DataTable data={tableData}
        selectedLayer={selectedLayer} 
       selectedFeatureId={selectedFeatureId}
  setSelectedFeatureId={setSelectedFeatureId}
/>

      </div>
      <Footer/>
    </div>
  );
};

export default SolarDashboard;