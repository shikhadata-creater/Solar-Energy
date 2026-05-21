

// const config = {
// //   API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
//   GEOSERVER_URL: import.meta.env.VITE_GEOSERVER_URL,
// };

// export default config;
// const config = {
//   GEOSERVER_URL: "/geoserver"
// };

// export default config;

const config = {
GEOSERVER_URL: import.meta.env.VITE_GEOSERVER_URL || "/geoserver",
};
export default config;