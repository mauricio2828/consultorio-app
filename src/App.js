import { useState } from "react";
import "./App.css";

function App() {
  const [vista, setVista] = useState("menu");
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [citas, setCitas] = useState({});

  const pacientes = [
    { id: 1, nombre: "Juan Pérez" },
    { id: 2, nombre: "María López" },
    { id: 3, nombre: "Carlos Ramírez" },
  ];

  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = hoy.getMonth();
  const diasEnMes = new Date(año, mes + 1, 0).getDate();

  const dias = [];
  for (let i = 1; i <= diasEnMes; i++) {
    dias.push(i);
  }

  const generarHorarios = () => {
    const horas = [];
    for (let h = 9; h <= 18; h++) {
      let periodo = h >= 12 ? "PM" : "AM";
      let hora12 = h > 12 ? h - 12 : h;
      if (hora12 === 0) hora12 = 12;
      horas.push(`${hora12}:00 ${periodo}`);
    }
    return horas;
  };

  const horarios = generarHorarios();

  const obtenerClaveFecha = (dia) => {
    return `${dia}-${mes + 1}-${año}`;
  };

  const manejarCita = (hora) => {
    const clave = obtenerClaveFecha(fechaSeleccionada);
    const citasDelDia = citas[clave] || [];

    if (citasDelDia.includes(hora)) {
      // Cancelar cita
      const nuevasHoras = citasDelDia.filter(h => h !== hora);
      setCitas({
        ...citas,
        [clave]: nuevasHoras
      });
    } else {
      // Agendar cita
      setCitas({
        ...citas,
        [clave]: [...citasDelDia, hora]
      });
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Consultorio Médico</h1>

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

      {pacienteSeleccionado && (
        <>
          <button onClick={() => setPacienteSeleccionado(null)}>
            ⬅ Volver a Pacientes
          </button>
          <h2>Expediente</h2>
          <p><strong>Paciente:</strong> {pacienteSeleccionado.nombre}</p>
          <ul>
            <li>📋 Historial clínico</li>
            <li>💊 Tratamientos</li>
            <li>📝 Notas médicas</li>
          </ul>
        </>
      )}

      {vista === "citas" && (
        <>
          <button onClick={() => setVista("menu")}>⬅ Volver</button>
          <h2>Calendario</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 10,
              marginTop: 20,
            }}
          >
            {dias.map((dia) => (
              <button
                key={dia}
                onClick={() => setFechaSeleccionada(dia)}
                style={{
                  padding: 15,
                  backgroundColor:
                    fechaSeleccionada === dia ? "#4CAF50" : "#f0f0f0",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                {dia}
              </button>
            ))}
          </div>

          {fechaSeleccionada && (
            <>
              <p style={{ marginTop: 20 }}>
                Día seleccionado: {fechaSeleccionada}/{mes + 1}/{año}
              </p>

              <h3>Horarios</h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                {horarios.map((hora) => {
                  const clave = obtenerClaveFecha(fechaSeleccionada);
                  const ocupado =
                    citas[clave] && citas[clave].includes(hora);

                  return (
                    <button
                      key={hora}
                      onClick={() => manejarCita(hora)}
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        border: "none",
                        backgroundColor: ocupado
                          ? "#f44336"
                          : "#2196F3",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      {hora}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;