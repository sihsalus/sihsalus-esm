import { useState, useCallback } from "react";
import Odontogram from "./components/Odontogram";
import { adultConfig } from "./config/adultConfig";
import { createEmptyOdontogramData } from "./types/odontogram";
import type { OdontogramData } from "./types/odontogram";
import { serializeOdontogramData, getOdontogramStats } from "./utils/serializeOdontogramData";
import { mergeOdontogramData } from "./utils/mergeOdontogramData";
import samplePatientJson from "./data/samplePatient.json";
import "./App.css";

const COLORS = ["#2196f3", "#4caf50", "#ff9800"];
const LABELS = ["Paciente 1", "Paciente 2", "Paciente 3"];

// ─── Datos de ejemplo que llegarían de BBDD ───────────────────────────────────

/** Registro vacío (paciente nuevo sin hallazgos) */
const DB_EMPTY: Partial<OdontogramData> = {
  teeth: [],
  spacingFindings: {},
  legendSpaces: [],
};

/** Registro con hallazgos (paciente con datos previos) */
const DB_WITH_DATA: Partial<OdontogramData> = {
  teeth: [
    {
      toothId: 15,
      findings: [
        { id: "1771549696325-g72cxkveu", findingId: 1, color: { id: 101, name: "blue" }, designNumber: 1 },
      ],
    },
    {
      toothId: 14,
      findings: [
        { id: "1771549696640-b0fr5lnlz", findingId: 1, color: { id: 101, name: "blue" }, designNumber: 2 },
      ],
    },
    {
      toothId: 13,
      findings: [
        { id: "1771549720479-yfi0gjui9", findingId: 1, color: { id: 101, name: "blue" }, designNumber: 1 },
        { id: "1771549728100-py1s3dcnf", findingId: 5, color: { id: 102, name: "red" }, subOptionId: 502, designNumber: 1 },
        { id: "1771549728323-gfpyh2t48", findingId: 5, color: { id: 102, name: "red" }, subOptionId: 502, designNumber: 2 },
        { id: "1771549728629-fvu44deob", findingId: 5, color: { id: 102, name: "red" }, subOptionId: 502, designNumber: 3 },
      ],
    },
    {
      toothId: 12,
      findings: [
        { id: "1771549721034-ujjhae7vq", findingId: 1, color: { id: 101, name: "blue" }, designNumber: 2 },
      ],
    },
  ],
  spacingFindings: {
    1: [
      {
        leftToothId: 15,
        rightToothId: 14,
        findings: [
          { id: "1771549697181-mos1jhrd2", findingId: 1, color: { id: 101, name: "blue" }, designNumber: 3 },
        ],
      },
      {
        leftToothId: 13,
        rightToothId: 12,
        findings: [
          { id: "1771549721880-dhl4amctc", findingId: 1, color: { id: 101, name: "blue" }, designNumber: 3 },
        ],
      },
    ],
  },
  legendSpaces: [],
};

function ExportPanel({ data, color }: { data: OdontogramData; color: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const pruned = serializeOdontogramData(data);
  const json = JSON.stringify(pruned, null, 2);
  const stats = getOdontogramStats(data);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [json]);

  return (
    <div className="export-panel">
      <div className="export-panel-bar">
        <div className="export-stats">
          <span className="export-stat">
            <strong>{stats.totalFindings}</strong>
            {stats.totalFindings === 1 ? " hallazgo" : " hallazgos"}
          </span>
          {stats.totalFindings > 0 && (
            <>
              <span className="export-stat-sep">·</span>
              <span className="export-stat">
                <strong>{stats.teethWithFindings}</strong>{" "}
                {stats.teethWithFindings === 1 ? "diente" : "dientes"}
              </span>
              {stats.spacingFindingsTotal > 0 && (
                <>
                  <span className="export-stat-sep">·</span>
                  <span className="export-stat">
                    <strong>{stats.spacingFindingsTotal}</strong> en espacios
                  </span>
                </>
              )}
              {stats.legendFindingsTotal > 0 && (
                <>
                  <span className="export-stat-sep">·</span>
                  <span className="export-stat">
                    <strong>{stats.legendFindingsTotal}</strong> en leyendas
                  </span>
                </>
              )}
            </>
          )}
        </div>
        <div className="export-actions">
          <button
            className="export-btn export-btn-ghost"
            onClick={handleCopy}
            title="Copiar JSON al portapapeles"
          >
            {copied ? "✓ Copiado" : "Copiar JSON"}
          </button>
          <button
            className="export-btn"
            style={{ background: color }}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Ocultar JSON" : "Ver JSON"}
          </button>
        </div>
      </div>

      {open && (
        <div className="export-json-panel">
          <div className="export-json-header">
            <span className="export-json-meta">
              Solo datos con registros · {json.length.toLocaleString()} caracteres
            </span>
            <button className="export-btn-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <pre className="export-json-body">{json}</pre>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [data1, setData1] = useState(() => createEmptyOdontogramData(adultConfig));
  const [data2, setData2] = useState(() => createEmptyOdontogramData(adultConfig));
  const [data3, setData3] = useState(() => createEmptyOdontogramData(adultConfig));

  // Inicializados desde BBDD — mergeOdontogramData hidrata el esqueleto con los datos guardados
  const [dataFromDbEmpty, setDataFromDbEmpty] = useState(() =>
    mergeOdontogramData(adultConfig, DB_EMPTY)
  );
  const [dataFromDbWithData, setDataFromDbWithData] = useState(() =>
    mergeOdontogramData(adultConfig, DB_WITH_DATA)
  );
  const [dataFromFile, setDataFromFile] = useState(() =>
    mergeOdontogramData(adultConfig, samplePatientJson)
  );

  const editableInstances = [
    { label: LABELS[0], data: data1, onChange: setData1 },
    { label: LABELS[1], data: data2, onChange: setData2 },
    { label: LABELS[2], data: data3, onChange: setData3 },
  ];

  const dbInstances = [
    {
      label: "Desde BBDD — sin hallazgos",
      data: dataFromDbEmpty,
      onChange: setDataFromDbEmpty,
      color: "#9c27b0",
      badge: "DB",
      description: "Paciente nuevo · JSON vacío de BBDD",
    },
    {
      label: "Desde BBDD — con hallazgos",
      data: dataFromDbWithData,
      onChange: setDataFromDbWithData,
      color: "#e91e63",
      badge: "DB",
      description: "Paciente existente · JSON con registros de BBDD",
    },
    {
      label: "Desde archivo — samplePatient.json",
      data: dataFromFile,
      onChange: setDataFromFile,
      color: "#00897b",
      badge: "DB",
      description: "src/data/samplePatient.json · hallazgo 1 en dientes 13-15 (superior) y 43-45 (inferior)",
    },
  ];

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Odontograma</h1>
        <p>Instancias independientes — sin estado global compartido</p>
      </header>

      <section className="app-section">
        <h3 className="app-section-title">Nuevos (estado vacío)</h3>
        {editableInstances.map((inst, i) => (
          <div
            key={i}
            className="odontogram-card"
            style={{ borderLeftColor: COLORS[i] }}
          >
            <div className="odontogram-card-header">
              <span className="odontogram-card-badge" style={{ background: COLORS[i] }}>
                {i + 1}
              </span>
              <h2 className="odontogram-card-title" style={{ color: COLORS[i] }}>
                {inst.label}
              </h2>
            </div>
            <Odontogram config={adultConfig} data={inst.data} onChange={inst.onChange} title={inst.label} />
            <ExportPanel data={inst.data} color={COLORS[i]} />
          </div>
        ))}
      </section>

      <section className="app-section">
        <h3 className="app-section-title">Inicializados desde BBDD</h3>
        <p className="app-section-desc">
          Usan <code>mergeOdontogramData(config, savedJson)</code> para hidratar el esqueleto
          completo con los hallazgos guardados. Seguir editando no afecta a las demás instancias.
        </p>
        {dbInstances.map((inst, i) => (
          <div
            key={i}
            className="odontogram-card"
            style={{ borderLeftColor: inst.color }}
          >
            <div className="odontogram-card-header">
              <span className="odontogram-card-badge" style={{ background: inst.color }}>
                {inst.badge}
              </span>
              <div>
                <h2 className="odontogram-card-title" style={{ color: inst.color }}>
                  {inst.label}
                </h2>
                <p className="odontogram-card-desc">{inst.description}</p>
              </div>
            </div>
            <Odontogram config={adultConfig} data={inst.data} onChange={inst.onChange} title={inst.label} />
            <ExportPanel data={inst.data} color={inst.color} />
          </div>
        ))}
      </section>
    </div>
  );
}
