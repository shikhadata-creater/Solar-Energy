import { useEffect, useRef } from "react";
import MousePosition from "ol/control/MousePosition";
import { createStringXY } from "ol/coordinate";

const MousePositionControl = ({ map }) => {
  const controlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const mouseControl = new MousePosition({
      coordinateFormat: createStringXY(6), // 6 decimal precision
      projection: "EPSG:4326", // lat/lon
      className: "mouse-position",
      target: controlRef.current,
      undefinedHTML: "0.000000, 0.000000",
    });

    map.addControl(mouseControl);

    return () => {
      map.removeControl(mouseControl);
    };
  }, [map]);

  return (
    <div
      ref={controlRef}
      style={{
        position: "absolute",
        bottom: "10px",
        right: "10px",
        background: "white",
        padding: "5px 10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 1000,
      }}
    />
  );
};

export default MousePositionControl;