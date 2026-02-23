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

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Consultorio Médico</h1>

      {vista === "menu" && (
        <>
          <button onClick={() => setVista("config")}>⚙ Configuración</button>
          <br /><br />
          <button onClick={() => setVista("citas")}>📅 Citas</button>
        </>
      )}

      {vista === "config" && (
        <>
          <button onClick={() => setVista("menu")}>⬅ Volver</button>
          <h2>Horario laboral</h2>
          <p>Hora inicio:</p>
          <input
            type="number"
            value={config.inicio}
            onChange={(e) =>
              setConfig({ ...config, inicio: parseInt(e.target.value) })
            }
          />
          <p>Hora fin:</p>
          <input
            type="number"
            value={config.fin}
            onChange={(e) =>
              setConfig({ ...config, fin: parseInt(e.target.value) })
            }
          />
        </>
      )}

      {vista === "citas" && (
        <>
          <button onClick={() => setVista("menu")}>⬅ Volver</button>

          <h3>Selecciona paciente:</h3>
          {pacientes.map((p) => (
            <button
              key={p.id}
              onClick={() => setPacienteSeleccionado(p.id)}
              style={{
                margin: 5,
                backgroundColor:
                  pacienteSeleccionado === p.id ? "#4CAF50" : "#ddd",
              }}
            >
              {p.nombre}
            </button>
          ))}

          <h3>Calendario</h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: 5
          }}>
            {dias.map((dia) => (
              <button
                key={dia}
                onClick={() => setFechaSeleccionada(dia)}
                style={{
                  backgroundColor:
                    fechaSeleccionada === dia ? "#4CAF50" : "#eee"
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
                      display: "block",
                      margin: 5,
                      backgroundColor: cita ? "#f44336" : "#2196F3",
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