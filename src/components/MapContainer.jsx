// import { useEffect, useRef } from "react";

// import Map from "ol/Map";
// import View from "ol/View";

// import TileLayer from "ol/layer/Tile";
// import OSM from "ol/source/OSM";
// import XYZ from "ol/source/XYZ";
// import TileWMS from "ol/source/TileWMS";

// import ImageLayer from "ol/layer/Image";
// import ImageWMS from "ol/source/ImageWMS";

// import VectorLayer from "ol/layer/Vector";
// import VectorSource from "ol/source/Vector";

// import GeoJSON from "ol/format/GeoJSON";
// import { Style, Icon, Circle as CircleStyle, Fill, Stroke } from "ol/style";

// import Point from "ol/geom/Point";
// import Feature from "ol/Feature";

// import { fromLonLat, toLonLat } from "ol/proj";
// import solarIcon from "../assets/logo/solarimg2.png";


// import config from "../config.js";

// const MapView = ({
//   selectedLayer,
//   opacity,
//   baseMap,
//   setTableData,
//   setMouseCoords,
//   setTotalCount,
//   selectedFeatureId,
//   setSelectedFeatureId
// }) => {

//   const mapRef = useRef();
//   const mapObj = useRef();
//   const wmsLayerRef = useRef();
//   const markerLayerRef = useRef();

//   // ================= MAP INIT =================
//   useEffect(() => {

//     const baseLayer = new TileLayer({
//       source: new OSM()
//     });

//     const upBoundaryLayer = new ImageLayer({
//       source: new ImageWMS({
//         url: `${config.GEOSERVER_URL}/wms`,   // ✅ FIXED
//         params: { LAYERS: "Solar:up_district" }
//       })
//     });

//     const wmsLayer = new TileLayer({
//       opacity: opacity,
//       source: new TileWMS({
//         url: `${config.GEOSERVER_URL}/wms`,   // ✅ FIXED
//         params: {
//           LAYERS: selectedLayer,
//           FORMAT: "image/png",
//           TILED: true
//         }
//       })
//     });

//     wmsLayerRef.current = wmsLayer;

//     const markerLayer = new VectorLayer({
//       source: new VectorSource()
//     });

//     markerLayerRef.current = markerLayer;

//     const map = new Map({
//       target: mapRef.current,
//       layers: [baseLayer, upBoundaryLayer, wmsLayer, markerLayer],
//       view: new View({
//         center: fromLonLat([80, 26]),
//         zoom: 7
//       })
//     });

//     mapObj.current = map;

//     map.on("pointermove", (evt) => {
//       const coord = toLonLat(evt.coordinate);
//       setMouseCoords({
//         lon: coord[0].toFixed(6),
//         lat: coord[1].toFixed(6)
//       });
//     });

//     return () => map.setTarget(null);

//   }, []);

//   // ================= WMS SWITCH =================
//   useEffect(() => {
//   if (!mapObj.current) return;

//   const map = mapObj.current;

//   // Set the default center and zoom level when the layer changes
//   const defaultCenter = fromLonLat([80.9458, 26.8467]);  // Lucknow coordinates
//   const defaultZoom = 7;  // Adjust this zoom level as needed

//   // Adjust the map to default view when switching layers
//   map.getView().animate({
//     center: defaultCenter,
//     zoom: defaultZoom,
//     duration: 500  // Smooth transition for 500ms
//   });

//   if (wmsLayerRef.current) {
//     wmsLayerRef.current.getSource().updateParams({
//       LAYERS: selectedLayer
//     });
//   }
// }, [selectedLayer]);
//   // useEffect(() => {
//   //   if (wmsLayerRef.current) {
//   //     wmsLayerRef.current.getSource().updateParams({
//   //       LAYERS: selectedLayer
//   //     });
//   //   }
//   // }, [selectedLayer]);

//   // ================= OPACITY =================
//   useEffect(() => {
//     if (wmsLayerRef.current) {
//       wmsLayerRef.current.setOpacity(opacity);
//     }
//   }, [opacity]);

//   // ================= MARKERS + TABLE =================
//   useEffect(() => {

//     if (!markerLayerRef.current || !selectedLayer) return;

//     const source = markerLayerRef.current.getSource();
//     source.clear();

//     const url = `${config.GEOSERVER_URL}/ows?service=WFS&request=GetFeature&typeName=${encodeURIComponent(selectedLayer)}&outputFormat=application/json`;

//     console.log("WFS URL:", url);

//     fetch(url)
//       .then(res => res.json())
//       .then(data => {

//         console.log("WFS DATA:", data);

//         if (!data.features || data.features.length === 0) {
//           setTableData([]);
//           setTotalCount(0);
//           return;
//         }

//         const format = new GeoJSON();

//         const features = format.readFeatures(data, {
//           dataProjection: "EPSG:4326",
//           featureProjection: "EPSG:3857"
//         });

//        const rows = [];
// const seen = new Set();   // ✅ ADD THIS LINE

//        features.forEach((f, i) => {

//   const props = f.getProperties();
//   const geom = f.getGeometry();
//   if (!geom) return;

//   const rawId = props.id || props.objectid || props.gid || i;
//   const id = `${selectedLayer}_${rawId}`;

//   if (seen.has(id)) return;
//   seen.add(id);

//   f.setId(id);
// const { geometry, geom:dbGeom, the_geom, ...cleanProps } = props;

// rows.push({
//   ...cleanProps,
//   __id: id
// });
//   // rows.push({
//   //   ...props,
//   //   __id: id
//   // });

//   const geomType = geom.getType();

//   // ✅ DECLARE HERE (TOP)
//   let markerFeature;

//   // 🔷 POLYGON
//   if (geomType === "Polygon" || geomType === "MultiPolygon") {

//     const extent = geom.getExtent();

//     const center = [
//       (extent[0] + extent[2]) / 2,
//       (extent[1] + extent[3]) / 2
//     ];

//     markerFeature = new Feature({
//       geometry: new Point(center)
//     });

//     markerFeature.setId(id);

//     markerFeature.setStyle(
//       new Style({
//         image: new Icon({
//           src: solarIcon,
//           scale: 0.06
//         })
//       })
//     );

//     source.addFeature(markerFeature);
//   }

//   // 🔴 POINT
//   else if (geomType === "Point") {

//     markerFeature = new Feature({
//       geometry: new Point(geom.getCoordinates())
//     });

//     markerFeature.setId(id);

//     markerFeature.setStyle(
//       new Style({
//         image: new CircleStyle({
//           radius: 6,
//           fill: new Fill({ color: "#ff3b30" }),
//           stroke: new Stroke({
//             color: "#fff",
//             width: 2
//           })
//         })
//       })
//     );

//     source.addFeature(markerFeature);
//   }

// });

//         setTableData(rows);
//         setTotalCount(rows.length);

//       })
//       .catch(err => {
//         console.error("WFS ERROR:", err);
//         setTableData([]);
//         setTotalCount(0);
//       });

//   }, [selectedLayer]);

//   // ================= FEATURE SELECT =================
//   useEffect(() => {

//     if (!markerLayerRef.current) return;

//     const source = markerLayerRef.current.getSource();
//     const map = mapObj.current;

//     source.getFeatures().forEach(f => {

//       f.setStyle(
//         new Style({
//           image: new CircleStyle({
//             radius: 6,
//             fill: new Fill({ color: "#ff3b30" }),
//             stroke: new Stroke({ color: "#fff", width: 2 })
//           })
//         })
//       );

//       if (f.getId() === selectedFeatureId) {

//         f.setStyle(
//           new Style({
//             image: new CircleStyle({
//               radius: 10,
//               fill: new Fill({ color: "#00ff00" }),
//               stroke: new Stroke({ color: "#fff", width: 3 })
//             })
//           })
//         );

//         const coord = f.getGeometry().getCoordinates();

//         map.getView().animate({
//           center: coord,
//           zoom: 13,
//           duration: 700
//         });
//       }

//     });

//   }, [selectedFeatureId]);

//   // ================= MAP CLICK =================
//   useEffect(() => {

//     if (!mapObj.current) return;

//     const map = mapObj.current;

//     const clickHandler = (evt) => {
//       map.forEachFeatureAtPixel(evt.pixel, (feature) => {
//         setSelectedFeatureId(feature.getId());
//       });
//     };

//     map.on("singleclick", clickHandler);

//     return () => map.un("singleclick", clickHandler);

//   }, []);

//   return (
//     <div
//       ref={mapRef}
//       style={{
//         width: "85%",
//         height: "100%"
//       }}
//     />
//   );
// };

// export default MapView;