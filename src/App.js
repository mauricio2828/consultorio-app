import { useState } from "react";
import "./App.css";

function App() {
  const [vista, setVista] = useState("menu");
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const pacientes = [
    { id: 1, nombre: "Juan Pérez" },
    { id: 2, nombre: "María López" },
    { id: 3, nombre: "Carlos Ramírez" },
  ];

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Consultorio Médico</h1>

      {/* MENU PRINCIPAL */}
      {vista === "menu" && (
        <>
          <p>Seleccione una opción:</p>
          <ul>
            <li>
              <button onClick={() => setVista("pacientes")}>
                👨‍⚕️ Pacientes
              </button>
            </li>
            <li>
              <button onClick={() => setVista("citas")}>
                📅 Citas médicas
              </button>
            </li>
          </ul>
        </>
      )}

      {/* PACIENTES */}
      {vista === "pacientes" && !pacienteSeleccionado && (
        <>
          <button onClick={() => setVista("menu")}>⬅ Volver</button>
          <h2>Lista de Pacientes</h2>
          <ul>
            {pacientes.map((p) => (
              <li key={p.id}>
                <button onClick={() => setPacienteSeleccionado(p)}>
                  {p.nombre}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* EXPEDIENTE */}
      {pacienteSeleccionado && (
        <>
          <button onClick={() => setPacienteSeleccionado(null)}>
            ⬅ Volver a Pacientes
          </button>
          <h2>Expediente</h2>
          <p><strong>Paciente:</strong> {pacienteSeleccionado.nombre}</p>

          <h3>Secciones:</h3>
          <ul>
            <li>📋 Historial clínico</li>
            <li>💊 Tratamientos</li>
            <li>📝 Notas médicas</li>
          </ul>
        </>
      )}

      {/* CITAS */}
      {vista === "citas" && (
        <>
          <button onClick={() => setVista("menu")}>⬅ Volver</button>
          <h2>Citas Médicas</h2>
          <p>Aquí irá el calendario tipo iPhone.</p>
        </>
      )}
    </div>
  );
}

export default App;