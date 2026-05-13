// const TablePanel = () => {
//   return (
//     <div style={{
//       background: "#0b1f3a",
//       color: "white",
//       padding: "10px"
//     }}>
//       <h3>Solar Table (Coming Next)</h3>
//     </div>
//   );
// };

// export default TablePanel;




import React from "react";

const DataTable = ({ data, selectedLayer , selectedFeatureId,
 setSelectedFeatureId}) => {

  if (!data || data.length === 0) {
    return <div style={{ padding: "10px" }}>No Data</div>;
  }

  // const columns = Object.keys(data[0]);
  const columns = Object.keys(data[0] || {}).filter(
  col =>
    col !== "__id" &&
    col !== "geometry" &&
    col !== "geom" &&
    col !== "the_geom"
);

const getRowId = (row, i) =>
  row.id || row.objectid || row.gid || i;

  return (
  <div style={{
    position: "absolute",
    bottom: "20px",
    left: "16.5%",
    width: "83.5%",
    maxHeight: "20%",
    overflow: "auto", 
   display: "flex",
    flexDirection: "column",
   // tableLayout: "fixed"   ,
    background: "white",
    borderTop: "2px solid #ccc"
  }}>

   

{/* 🔥 TITLE */}
<div
  style={{
    background: "#143658",
    color: "white",
    padding: "8px 12px",
    position: "sticky ",
    fontWeight: "bold",  
    width: "100%",
             // ✅ FIXED
    
  }}
>
  {selectedLayer.replace("Solar:", "")} Data :-
  <span style={{ fontSize: "14px" }}>
    Total: {data.length}
  </span>
</div>

{/* 🔥 TABLE */}
<table style={{ width: "100%", borderCollapse: "collapse", bottom: "20px",tableLayout:"Auto" }}>
  <thead
    style={{
      background: "#143658",
      color: "white",
      position: "sticky",
      top: 0,
      zIndex: 2                 // ✅ FIXED (important)
    }}
  >
    <tr>
      {columns.map((col) => (
        <th
          key={col}
          style={{
            padding: "8px",
            border: "1px solid #0e944a"
          }}
        >
          {col}
        </th>
      ))}
    </tr>
  </thead>

  <tbody>
    {data.map((row, i) => {
      const rowId = row.__id;

      return (
        <tr
          key={rowId}

          ref={(el) => {
            if (selectedFeatureId === rowId && el) {
              el.scrollIntoView({
                behavior: "smooth",
                block: "center"
              });
            }
          }}

          onClick={() => setSelectedFeatureId(rowId)}

          style={{
            background:
              selectedFeatureId === rowId
                ? "#ffd54f"
                : "linear-gradient(180deg, #92beeb, #68b89d)",
            cursor: "pointer",
            transition: "0.1s ease"   // ✅ smooth UI
          }}
        >
          {columns.map((col) => (
            <td
              key={col}
              style={{
                padding: "6px",
                border: "1px solid #228d4e",
                whiteSpace: "nowrap",
overflow: "hidden",
textOverflow: "ellipsis"
              }}
            >
              {String(row[col])}
            </td>
          ))}
        </tr>
      );
    })}
  </tbody>
</table>
    </div>
  );
};

export default DataTable;