import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const pacientes = [
    { id: 1, nombre: "Juan Pérez" },
    { id: 2, nombre: "María López" },
    { id: 3, nombre: "Carlos Ramírez" },
  ];

  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = hoy.getMonth();
  const diasEnMes = new Date(año, mes + 1, 0).getDate();

  const [vista, setVista] = useState("menu");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const [config, setConfig] = useState(() => {
    const guardado = localStorage.getItem("config");
    return guardado
      ? JSON.parse(guardado)
      : { inicio: 9, fin: 18 };
  });

  const [citas, setCitas] = useState(() => {
    const guardado = localStorage.getItem("citas");
    return guardado ? JSON.parse(guardado) : {};
  });

  useEffect(() => {
    localStorage.setItem("citas", JSON.stringify(citas));
  }, [citas]);

  useEffect(() => {
    localStorage.setItem("config", JSON.stringify(config));
  }, [config]);

  const obtenerClaveFecha = (dia) => {
    return `${dia}-${mes + 1}-${año}`;
  };

  const generarHorarios = () => {
    const horas = [];
    for (let h = config.inicio; h <= config.fin; h++) {
      let periodo = h >= 12 ? "PM" : "AM";
      let hora12 = h > 12 ? h - 12 : h;
      if (hora12 === 0) hora12 = 12;
      horas.push(`${hora12}:00 ${periodo}`);
    }
    return horas;
  };

  const manejarCita = (hora) => {
    if (!pacienteSeleccionado) {
      alert("Selecciona un paciente primero");
      return;
    }

    const clave = obtenerClaveFecha(fechaSeleccionada);
    const citasDelDia = citas[clave] || [];

    const existe = citasDelDia.find(c => c.hora === hora);

    if (existe) {
      const nuevas = citasDelDia.filter(c => c.hora !== hora);
      setCitas({ ...citas, [clave]: nuevas });
    } else {
      setCitas({
        ...citas,
        [clave]: [...citasDelDia, { hora, pacienteId: pacienteSeleccionado }]
      });
    }
  };

  const dias = [];
  for (let i = 1; i <= diasEnMes; i++) dias.push(i);

  const horarios = generarHorarios();

  const botonBase = {
    padding: "12px",
    margin: "6px",
    borderRadius: "10px",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 3px 6px rgba(0,0,0,0.1)"
  };

  return (
    <div style={{
      padding: 20,
      fontFamily: "Arial",
      maxWidth: 500,
      margin: "auto"
    }}>

      <h1 style={{ textAlign: "center" }}>Consultorio Médico</h1>

      {vista === "menu" && (
        <>
          <button
            style={{ ...botonBase, width: "100%", backgroundColor: "#1976D2", color: "white" }}
            onClick={() => setVista("config")}
          >
            ⚙ Configuración
          </button>

          <button
            style={{ ...botonBase, width: "100%", backgroundColor: "#388E3C", color: "white" }}
            onClick={() => setVista("citas")}
          >
            📅 Citas
          </button>
        </>
      )}

      {vista === "config" && (
        <>
          <button
            style={{ ...botonBase, backgroundColor: "#999", color: "white" }}
            onClick={() => setVista("menu")}
          >
            ⬅ Volver
          </button>

          <h2>Horario laboral</h2>

          <p>Hora inicio:</p>
          <input
            type="number"
            value={config.inicio}
            onChange={(e) =>
              setConfig({ ...config, inicio: parseInt(e.target.value) })
            }
            style={{ width: "100%", padding: 10, fontSize: 16 }}
          />

          <p>Hora fin:</p>
          <input
            type="number"
            value={config.fin}
            onChange={(e) =>
              setConfig({ ...config, fin: parseInt(e.target.value) })
            }
            style={{ width: "100%", padding: 10, fontSize: 16 }}
          />
        </>
      )}

      {vista === "citas" && (
        <>
          <button
            style={{ ...botonBase, backgroundColor: "#999", color: "white" }}
            onClick={() => setVista("menu")}
          >
            ⬅ Volver
          </button>

          <h3>Selecciona paciente:</h3>
          {pacientes.map((p) => (
            <button
              key={p.id}
              onClick={() => setPacienteSeleccionado(p.id)}
              style={{
                ...botonBase,
                width: "100%",
                backgroundColor:
                  pacienteSeleccionado === p.id ? "#4CAF50" : "#e0e0e0",
                color: pacienteSeleccionado === p.id ? "white" : "black"
              }}
            >
              {p.nombre}
            </button>
          ))}

          <h3>Calendario</h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: 6
          }}>
            {dias.map((dia) => (
              <button
                key={dia}
                onClick={() => setFechaSeleccionada(dia)}
                style={{
                  ...botonBase,
                  padding: "10px",
                  backgroundColor:
                    fechaSeleccionada === dia ? "#4CAF50" : "#f5f5f5"
                }}
              >
                {dia}
              </button>
            ))}
          </div>

          {fechaSeleccionada && (
            <>
              <h3>Horarios</h3>
              {horarios.map((hora) => {
                const clave = obtenerClaveFecha(fechaSeleccionada);
                const citasDelDia = citas[clave] || [];
                const cita = citasDelDia.find(c => c.hora === hora);

                const nombrePaciente = cita
                  ? pacientes.find(p => p.id === cita.pacienteId)?.nombre
                  : null;

                return (
                  <button
                    key={hora}
                    onClick={() => manejarCita(hora)}
                    style={{
                      ...botonBase,
                      width: "100%",
                      backgroundColor: cita ? "#D32F2F" : "#1976D2",
                      color: "white"
                    }}
                  >
                    {hora} {nombrePaciente ? `- ${nombrePaciente}` : ""}
                  </button>
                );
              })}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;