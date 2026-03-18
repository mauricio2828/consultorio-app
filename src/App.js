import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [pagina, setPagina] = useState("menu");

  const [pacientes, setPacientes] = useState([]);
  const [citas, setCitas] = useState([]);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  const [horaInicio, setHoraInicio] = useState(9);
  const [horaFin, setHoraFin] = useState(18);
  const [duracion, setDuracion] = useState(60);

  // CARGAR
  useEffect(() => {
    const p = localStorage.getItem("pacientes");
    const c = localStorage.getItem("citas");
    const config = localStorage.getItem("config");

    if (p) setPacientes(JSON.parse(p));
    if (c) setCitas(JSON.parse(c));

    if (config) {
      const conf = JSON.parse(config);
      setHoraInicio(conf.inicio);
      setHoraFin(conf.fin);
      setDuracion(conf.duracion);
    }
  }, []);

  // GUARDAR
  useEffect(() => {
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
  }, [pacientes]);

  useEffect(() => {
    localStorage.setItem("citas", JSON.stringify(citas));
  }, [citas]);

  useEffect(() => {
    localStorage.setItem("config", JSON.stringify({
      inicio: horaInicio,
      fin: horaFin,
      duracion
    }));
  }, [horaInicio, horaFin, duracion]);

  // HORAS DINÁMICAS
  const horas = [];
  for (let h = horaInicio; h < horaFin; h++) {
    for (let m = 0; m < 60; m += duracion) {
      let hora = h;
      let minutos = m;
      let ampm = hora >= 12 ? "PM" : "AM";
      let hora12 = hora > 12 ? hora - 12 : hora;
      if (hora12 === 0) hora12 = 12;

      horas.push(`${hora12}:${minutos.toString().padStart(2, "0")} ${ampm}`);
    }
  }

  // PACIENTES
  const agregarPaciente = () => {
    if (!nombre || !telefono) return alert("Completa datos");

    const nuevo = {
      id: Date.now(),
      nombre,
      telefono,
      notas: ""
    };

    setPacientes([...pacientes, nuevo]);
    setNombre("");
    setTelefono("");
  };

  const eliminarPaciente = (id) => {
    setPacientes(pacientes.filter(p => p.id !== id));
  };

  // CITAS
  const agendarCita = (hora) => {
    if (!pacienteSeleccionado) return alert("Selecciona paciente");

    const nueva = {
      id: Date.now(),
      dia: diaSeleccionado,
      hora,
      paciente: pacienteSeleccionado.nombre
    };

    setCitas([...citas, nueva]);
  };

  const cancelarCita = (id) => {
    setCitas(citas.filter(c => c.id !== id));
  };

  const citasDelDia = citas.filter(c => c.dia === diaSeleccionado);

  // MENU
  if (pagina === "menu") {
    return (
      <div style={container}>
        <h1 style={titulo}>Consultorio Médico</h1>

        <button style={boton} onClick={() => setPagina("pacientes")}>
          👨‍⚕️ Pacientes
        </button>

        <button style={boton} onClick={() => setPagina("citas")}>
          📅 Citas
        </button>

        <button style={boton} onClick={() => setPagina("config")}>
          ⚙️ Configuración
        </button>
      </div>
    );
  }

  // PACIENTES
  if (pagina === "pacientes") {
    return (
      <div style={container}>
        <h2 style={titulo}>Pacientes</h2>

        <button style={boton} onClick={() => setPagina("menu")}>⬅ Volver</button>

        <input style={input} placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
        <input style={input} placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} />

        <button style={boton} onClick={agregarPaciente}>Guardar</button>

        {pacientes.map(p => (
          <div key={p.id} style={card}>
            <b>{p.nombre}</b>
            <p>{p.telefono}</p>

            <button style={botonPeq} onClick={() => setPacienteSeleccionado(p)}>Expediente</button>
            <button style={botonEliminar} onClick={() => eliminarPaciente(p.id)}>Eliminar</button>
          </div>
        ))}

        {pacienteSeleccionado && (
          <div style={cardGrande}>
            <h3>Expediente: {pacienteSeleccionado.nombre}</h3>

            <textarea
              style={input}
              value={pacienteSeleccionado.notas}
              onChange={(e) => {
                const actualizado = pacientes.map(p =>
                  p.id === pacienteSeleccionado.id
                    ? { ...p, notas: e.target.value }
                    : p
                );
                setPacientes(actualizado);
                setPacienteSeleccionado({ ...pacienteSeleccionado, notas: e.target.value });
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // CITAS
  if (pagina === "citas") {
    return (
      <div style={container}>
        <h2 style={titulo}>Citas</h2>

        <button style={boton} onClick={() => setPagina("menu")}>⬅ Volver</button>

        <div>
          {[...Array(30)].map((_, i) => (
            <button key={i} style={diaBtn} onClick={() => setDiaSeleccionado(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>

        {diaSeleccionado && (
          <>
            <h3>Día {diaSeleccionado}</h3>

            <select style={input} onChange={(e) => {
              const p = pacientes.find(x => x.id === Number(e.target.value));
              setPacienteSeleccionado(p);
            }}>
              <option>Seleccionar paciente</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>

            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {horas.map(h => {
                const ocupado = citas.some(c => c.dia === diaSeleccionado && c.hora === h);

                return (
                  <button
                    key={h}
                    style={{ ...horaBtn, background: ocupado ? "#ccc" : "#27ae60" }}
                    disabled={ocupado}
                    onClick={() => agendarCita(h)}
                  >
                    {h}
                  </button>
                );
              })}
            </div>

            {citasDelDia.map(c => (
              <div key={c.id} style={card}>
                {c.hora} - {c.paciente}
                <button style={botonEliminar} onClick={() => cancelarCita(c.id)}>Cancelar</button>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }

  // CONFIGURACIÓN
  if (pagina === "config") {
    return (
      <div style={container}>
        <h2 style={titulo}>Configuración</h2>

        <button style={boton} onClick={() => setPagina("menu")}>⬅ Volver</button>

        <p>Hora inicio</p>
        <input type="number" style={input} value={horaInicio} onChange={e => setHoraInicio(Number(e.target.value))} />

        <p>Hora fin</p>
        <input type="number" style={input} value={horaFin} onChange={e => setHoraFin(Number(e.target.value))} />

        <p>Duración cita (minutos)</p>
        <select style={input} value={duracion} onChange={e => setDuracion(Number(e.target.value))}>
          <option value={30}>30 minutos</option>
          <option value={60}>1 hora</option>
        </select>
      </div>
    );
  }
}

// ESTILOS
const container = { padding: 20, fontFamily: "Segoe UI", background: "#f4f6f9", minHeight: "100vh" };
const titulo = { fontSize: 26, marginBottom: 20 };
const boton = { padding: 12, margin: "10px 0", background: "#2c7be5", color: "white", border: "none", borderRadius: 8, width: "100%" };
const botonPeq = { marginRight: 10, padding: 6 };
const botonEliminar = { background: "red", color: "white", padding: 6, border: "none" };
const card = { background: "white", padding: 10, marginTop: 10, borderRadius: 8 };
const cardGrande = { background: "white", padding: 15, marginTop: 20 };
const input = { width: "100%", padding: 10, marginTop: 10 };
const diaBtn = { margin: 5, padding: 10 };
const horaBtn = { margin: 5, padding: 10, color: "white", border: "none", borderRadius: 6 };

export default App;