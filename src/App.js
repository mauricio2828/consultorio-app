import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [pagina, setPagina] = useState("menu");
  const [pacientes, setPacientes] = useState([]);
  const [citas, setCitas] = useState([]);

  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const [fechaActual, setFechaActual] = useState(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    edad: "",
    sexo: "",
    motivo: "",
    alergias: "",
    enfermedades: "",
    notas: ""
  });

  // CARGAR
  useEffect(() => {
    const p = localStorage.getItem("pacientes");
    const c = localStorage.getItem("citas");

    if (p) setPacientes(JSON.parse(p));
    if (c) setCitas(JSON.parse(c));
  }, []);

  // GUARDAR
  useEffect(() => {
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
  }, [pacientes]);

  useEffect(() => {
    localStorage.setItem("citas", JSON.stringify(citas));
  }, [citas]);

  // PACIENTES
  const agregarPaciente = () => {
    if (!form.nombre) return alert("Nombre requerido");

    const nuevo = {
      id: Date.now(),
      ...form
    };

    setPacientes([...pacientes, nuevo]);

    setForm({
      nombre: "",
      telefono: "",
      edad: "",
      sexo: "",
      motivo: "",
      alergias: "",
      enfermedades: "",
      notas: ""
    });
  };

  const eliminarPaciente = (id) => {
    setPacientes(pacientes.filter(p => p.id !== id));
  };

  // CALENDARIO
  const cambiarMes = (num) => {
    const nueva = new Date(fechaActual);
    nueva.setMonth(nueva.getMonth() + num);
    setFechaActual(nueva);
  };

  const diasEnMes = new Date(
    fechaActual.getFullYear(),
    fechaActual.getMonth() + 1,
    0
  ).getDate();

  const nombreMes = fechaActual.toLocaleString("es-MX", {
    month: "long",
    year: "numeric"
  });

  // CITAS
  const agendar = (hora) => {
    if (!pacienteSeleccionado || !fechaSeleccionada) return alert("Faltan datos");

    const nueva = {
      id: Date.now(),
      fecha: fechaSeleccionada,
      hora,
      paciente: pacienteSeleccionado.nombre
    };

    setCitas([...citas, nueva]);
  };

  const citasDelDia = citas.filter(c => c.fecha === fechaSeleccionada);

  // HORAS
  const horas = [];
  for (let h = 9; h <= 18; h++) {
    let hora12 = h > 12 ? h - 12 : h;
    let ampm = h >= 12 ? "PM" : "AM";
    horas.push(`${hora12}:00 ${ampm}`);
  }

  // MENU
  if (pagina === "menu") {
    return (
      <div style={container}>
        <h1>Consultorio Médico</h1>

        <button style={btn} onClick={() => setPagina("pacientes")}>Pacientes</button>
        <button style={btn} onClick={() => setPagina("citas")}>Citas</button>
      </div>
    );
  }

  // PACIENTES
  if (pagina === "pacientes") {
    return (
      <div style={container}>
        <button style={btn} onClick={() => setPagina("menu")}>⬅ Volver</button>

        <h2>Agregar paciente</h2>

        {Object.keys(form).map(k => (
          <input
            key={k}
            style={input}
            placeholder={k}
            value={form[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          />
        ))}

        <button style={btn} onClick={agregarPaciente}>Guardar</button>

        <h2>Lista</h2>

        {pacientes.map(p => (
          <div key={p.id} style={card}>
            <b>{p.nombre}</b>
            <p>{p.telefono}</p>

            <button onClick={() => setPacienteSeleccionado(p)}>Ver</button>
            <button onClick={() => eliminarPaciente(p.id)}>Eliminar</button>
          </div>
        ))}

        {pacienteSeleccionado && (
          <div style={card}>
            <h3>Expediente</h3>

            {Object.entries(pacienteSeleccionado).map(([k, v]) => (
              k !== "id" && <p key={k}><b>{k}:</b> {v}</p>
            ))}
          </div>
        )}
      </div>
    );
  }

  // CITAS
  if (pagina === "citas") {
    return (
      <div style={container}>
        <button style={btn} onClick={() => setPagina("menu")}>⬅ Volver</button>

        <h2>{nombreMes}</h2>

        <button onClick={() => cambiarMes(-1)}>⬅</button>
        <button onClick={() => cambiarMes(1)}>➡</button>

        <div>
          {[...Array(diasEnMes)].map((_, i) => {
            const fecha = `${fechaActual.getFullYear()}-${fechaActual.getMonth()+1}-${i+1}`;
            return (
              <button key={i} onClick={() => setFechaSeleccionada(fecha)}>
                {i + 1}
              </button>
            );
          })}
        </div>

        {fechaSeleccionada && (
          <>
            <h3>{fechaSeleccionada}</h3>

            <select onChange={(e) => {
              const p = pacientes.find(x => x.id === Number(e.target.value));
              setPacienteSeleccionado(p);
            }}>
              <option>Paciente</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>

            {horas.map(h => (
              <button key={h} onClick={() => agendar(h)}>
                {h}
              </button>
            ))}

            {citasDelDia.map(c => (
              <div key={c.id}>
                {c.hora} - {c.paciente}
              </div>
            ))}
          </>
        )}
      </div>
    );
  }
}

const container = { padding: 20, fontFamily: "Arial" };
const btn = { padding: 10, margin: 5 };
const input = { display: "block", margin: 5, padding: 8 };
const card = { border: "1px solid #ccc", padding: 10, marginTop: 10 };

export default App;