import React from "react";

const FormComponent = () => {
  return (
    <div style={{ width: "1000px", fontFamily: "Arial, sans-serif", marginTop: "10px" }}>
      {/* Resumen */}
      <div style={styles.container}>
        <label style={styles.label}><strong>Resumen</strong></label>
        <textarea style={styles.input}></textarea>
      </div>

      {/* Especificaciones */}
      <div style={styles.container}>
        <label style={styles.label}><strong>Especificaciones:</strong></label>
        <textarea style={styles.input}></textarea>
      </div>

      {/* Observaciones */}
      <div style={styles.container}>
        <label style={styles.label}><strong>Observaciones:</strong></label>
        <textarea style={styles.input}></textarea>
      </div>
    </div>
  );
};

// Estilos en línea para replicar la apariencia
const styles = {
  container: {
    border: "1px solid #ccc",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "5px",
  },
  label: {
    display: "block",
    marginBottom: "10px",
    fontSize: "16px",
  },
  input: {
    width: "100%",
    height: "80px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "14px",
  }
};

export default FormComponent;
