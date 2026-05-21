import { useEffect, useRef } from "react";

import Map from "ol/Map";
import View from "ol/View";

import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";

import TileWMS from "ol/source/TileWMS";

import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

import GeoJSON from "ol/format/GeoJSON";
import { Style, Icon, Circle as CircleStyle, Fill, Stroke } from "ol/style";

import Point from "ol/geom/Point";
import Feature from "ol/Feature";

import { fromLonLat, toLonLat } from "ol/proj";
import solarIcon from "../assets/logo/solarimg2.png";
import config from "../config.js";

const MapView = ({
  selectedLayer,
  opacity,
  baseMap,
  setTableData,
  setMouseCoords,
  setTotalCount,
  selectedFeatureId,
  setSelectedFeatureId,
}) => {

  const mapRef = useRef();
  const mapObj = useRef();
  const wmsLayerRef = useRef();
  const markerLayerRef = useRef();
  const abortControllerRef = useRef(null);
  const baseLayerRef = useRef();

//--------baselayer code-------------------//
const getBaseSource = (type) => {
  if (type === "satellite") {
    return new XYZ({
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      crossOrigin: "anonymous",
    });
  }

  if (type === "topo") {
    return new XYZ({
      url: "https://tile.opentopomap.org/{z}/{x}/{y}.png",
      crossOrigin: "anonymous",
    });
  }

  if (type === "carto") {
    return new XYZ({
      url: "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      crossOrigin: "anonymous",
    });
  }

  return new OSM({
    crossOrigin: "anonymous",
  });
};

  const createWMSSource = (layerName) =>
    new TileWMS({
      url: `${config.GEOSERVER_URL}/wms`,
      params: { LAYERS: layerName, FORMAT: "image/png", TILED: true },
      tileLoadFunction: (imageTile, src) => {
        setTimeout(() => { imageTile.getImage().src = src; }, Math.random() * 300);
      },
      transition: 0,
    });

  useEffect(() => {
   const baseLayer = new TileLayer({
  source: getBaseSource(baseMap),
});

baseLayerRef.current = baseLayer;
    const upBoundaryLayer = new ImageLayer({
      source: new ImageWMS({
        url: `${config.GEOSERVER_URL}/wms`,
        params: { LAYERS: "Solar:UP District" },
      }),
     });
    const wmsLayer = new TileLayer({
      opacity: opacity,
      source: createWMSSource(selectedLayer),
    });
    wmsLayerRef.current = wmsLayer;
    const markerLayer = new VectorLayer({ source: new VectorSource() });
  
    markerLayerRef.current = markerLayer;
   
    const map = new Map({
      target: mapRef.current,
      layers: [baseLayer, upBoundaryLayer, wmsLayer, markerLayer],
      view: new View({ center: fromLonLat([80, 26]), zoom: 7 }),
    });
   mapObj.current = map;
   map.on("pointermove", (evt) => {
      const coord = toLonLat(evt.coordinate);
      setMouseCoords({ lon: coord[0].toFixed(6), lat: coord[1].toFixed(6) });
   });
    return () => map.setTarget(null);
   }, []);
useEffect(() => {
  if (!baseLayerRef.current) return;

  baseLayerRef.current.setSource(getBaseSource(baseMap));
}, [baseMap]);
useEffect(() => {
    if (!mapObj.current || !wmsLayerRef.current) return;
    wmsLayerRef.current.setSource(createWMSSource(selectedLayer));
    wmsLayerRef.current.setOpacity(opacity);
    mapObj.current.getView().animate({
      center: fromLonLat([80.9458, 26.8467]),
      zoom: 7,
      duration: 500,
    });
  }, [selectedLayer]);

  useEffect(() => {
    if (wmsLayerRef.current) {
      wmsLayerRef.current.setOpacity(opacity);
    }
  }, [opacity]);


  useEffect(() => {

   
 if (!markerLayerRef.current || !selectedLayer) return;
    const source = markerLayerRef.current.getSource();
    source.clear();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const params = new URLSearchParams({
      service: "WFS",
      version: "1.0.0",
      request: "GetFeature",
      typeName: selectedLayer,
      outputFormat: "application/json",
      srsName: "EPSG:4326",
    });
    const url = `${config.GEOSERVER_URL}/ows?${params.toString()}`;
    console.log("WFS URL:", url);
    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error("WFS failed: " + text);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("WFS DATA:", data);

        if (!data.features || data.features.length === 0) {
          setTableData([]);
          setTotalCount(0);
          return;
        }

        const format = new GeoJSON();

        const features = format.readFeatures(data, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        });
        const rows = [];
        const seen = new Set();
        features.forEach((f, i) => {
          const props = f.getProperties();
          const geom = f.getGeometry();
          if (!geom) return;
          const rawId = props.id || props.objectid || props.gid || i;
          const id = `${selectedLayer}_${rawId}`;
          if (seen.has(id)) return;
          seen.add(id);
          f.setId(id);
          const { geometry, geom: dbGeom, the_geom, ...cleanProps } = props;
          rows.push({ ...cleanProps, __id: id });
          const geomType = geom.getType();
          if (geomType === "Polygon" || geomType === "MultiPolygon") {
            const extent = geom.getExtent();
            const center = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
            const marker = new Feature({ geometry: new Point(center) });
            marker.setId(id);
            marker.set("markerType", "icon");
            marker.setStyle(new Style({ image: new Icon({ src: solarIcon, scale: 0.06 }) }));
            source.addFeature(marker);
          } else if (geomType === "Point" || geomType === "MultiPoint") {
            const coordinate = geomType === "Point" ? geom.getCoordinates() : geom.getCoordinates()[0];
            const marker = new Feature({ geometry: new Point(coordinate) });
            marker.setId(id);
            marker.set("markerType", "circle");
            marker.setStyle(new Style({
              image: new CircleStyle({
                radius: 6,
                fill: new Fill({ color: "#ff3b30" }),
                stroke: new Stroke({ color: "#fff", width: 2 }),
              }),
            }));
            source.addFeature(marker);
          }
        });
        setTableData(rows);
        setTotalCount(rows.length);

      })
    
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("WFS ERROR:", err);
        setTableData([]);
        setTotalCount(0);
      });
    return () => controller.abort();
  }, [selectedLayer]);


  useEffect(() => {

    if (!markerLayerRef.current) return;
   
    const source = markerLayerRef.current.getSource();
    const map = mapObj.current;
    source.getFeatures().forEach((f) => {
      const markerType = f.get("markerType");
      if (markerType === "icon") {
        f.setStyle(new Style({ image: new Icon({ src: solarIcon, scale: 0.06 }) }));
      } else {
        f.setStyle(new Style({
          image: new CircleStyle({
            radius: 6,
            fill: new Fill({ color: "#ff3b30" }),
            stroke: new Stroke({ color: "#fff", width: 2 }),
          }),
        }));
      }
      if (f.getId() === selectedFeatureId) {
        f.setStyle(new Style({
          image: new CircleStyle({
            radius: 10,
            fill: new Fill({ color: "#00ff00" }),
            stroke: new Stroke({ color: "#fff", width: 3 }),
          }),
        }));
        const coord = f.getGeometry().getCoordinates();
        map.getView().animate({ center: coord, zoom: 13, duration: 700 });
      }

    });
  
  }, [selectedFeatureId]);

 
  useEffect(() => {
    if (!mapObj.current || !selectedLayer) return;
   
   
   const map = mapObj.current;
    const clickHandler = (evt) => {
      map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        setSelectedFeatureId(feature.getId());
      });
    };
 
    map.on("singleclick", clickHandler);
  
    return () => map.un("singleclick", clickHandler);
  }, [selectedLayer]);

  return <div ref={mapRef} style={{ width: "85%", height: "100%" }} />;
};

export default MapView;