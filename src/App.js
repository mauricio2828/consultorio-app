import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [pagina, setPagina] = useState("menu");

  const [pacientes, setPacientes] = useState([]);
  const [citas, setCitas] = useState([]);

  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const [fechaActual, setFechaActual] = useState(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const [config, setConfig] = useState({
    inicio: 9,
    fin: 18
  });

  const [form, setForm] = useState({
    nombre: "",
    telefono: ""
  });

  // CARGAR
  useEffect(() => {
    const p = localStorage.getItem("pacientes");
    const c = localStorage.getItem("citas");
    const conf = localStorage.getItem("config");

    if (p) setPacientes(JSON.parse(p));
    if (c) setCitas(JSON.parse(c));
    if (conf) setConfig(JSON.parse(conf));
  }, []);

  // GUARDAR
  useEffect(() => {
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
  }, [pacientes]);

  useEffect(() => {
    localStorage.setItem("citas", JSON.stringify(citas));
  }, [citas]);

  useEffect(() => {
    localStorage.setItem("config", JSON.stringify(config));
  }, [config]);

  // PACIENTES
  const agregarPaciente = () => {
    if (!form.nombre || !form.telefono) return alert("Completa datos");

    const nuevo = {
      id: Date.now(),
      ...form,
      edad: "",
      sexo: "",
      alergias: "",
      enfermedades: "",
      motivo: "",
      notas: ""
    };

    setPacientes([...pacientes, nuevo]);
    setForm({ nombre: "", telefono: "" });
  };

  const eliminarPaciente = (id) => {
    setPacientes(pacientes.filter(p => p.id !== id));
  };

  const actualizarPaciente = (campo, valor) => {
    const actualizado = pacientes.map(p =>
      p.id === pacienteSeleccionado.id
        ? { ...p, [campo]: valor }
        : p
    );

    setPacientes(actualizado);
    setPacienteSeleccionado({
      ...pacienteSeleccionado,
      [campo]: valor
    });
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

  // HORAS CONFIGURABLES
  const horas = [];
  for (let h = config.inicio; h <= config.fin; h++) {
    const hora12 = h > 12 ? h - 12 : h;
    const ampm = h >= 12 ? "PM" : "AM";
    horas.push(`${hora12}:00 ${ampm}`);
  }

  // CITAS
  const agendar = (hora) => {
    if (!pacienteSeleccionado || !fechaSeleccionada)
      return alert("Selecciona paciente y fecha");

    const existe = citas.some(
      c => c.fecha === fechaSeleccionada && c.hora === hora
    );

    if (existe) return alert("Horario ocupado");

    const nueva = {
      id: Date.now(),
      fecha: fechaSeleccionada,
      hora,
      paciente: pacienteSeleccionado.nombre
    };

    setCitas([...citas, nueva]);
  };

  const cancelarCita = (id) => {
    setCitas(citas.filter(c => c.id !== id));
  };

  const citasDelDia = citas.filter(c => c.fecha === fechaSeleccionada);

  // MENU
  if (pagina === "menu") {
    return (
      <div style={container}>
        <h1>Consultorio Médico</h1>

        <button style={btn} onClick={() => setPagina("pacientes")}>Pacientes</button>
        <button style={btn} onClick={() => setPagina("citas")}>Citas</button>
        <button style={btn} onClick={() => setPagina("config")}>Configuración</button>
      </div>
    );
  }

  // PACIENTES
  if (pagina === "pacientes") {
    return (
      <div style={container}>
        <button style={btn} onClick={() => setPagina("menu")}>⬅ Volver</button>

        <h2>Agregar paciente</h2>

        <input style={input} placeholder="Nombre" value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })} />

        <input style={input} placeholder="Teléfono" value={form.telefono}
          onChange={e => setForm({ ...form, telefono: e.target.value })} />

        <button style={btn} onClick={agregarPaciente}>Guardar</button>

        <h2>Lista</h2>

        {pacientes.map(p => (
          <div key={p.id} style={card}>
            <b>{p.nombre}</b>
            <p>{p.telefono}</p>

            <button style={btnPeq} onClick={() => setPacienteSeleccionado(p)}>Expediente</button>
            <button style={btnEliminar} onClick={() => eliminarPaciente(p.id)}>Eliminar</button>
          </div>
        ))}

        {pacienteSeleccionado && (
          <div style={cardGrande}>
            <h3>{pacienteSeleccionado.nombre}</h3>

            {["edad","sexo","alergias","enfermedades","motivo"].map(campo => (
              <input
                key={campo}
                style={input}
                placeholder={campo}
                value={pacienteSeleccionado[campo]}
                onChange={(e) => actualizarPaciente(campo, e.target.value)}
              />
            ))}

            <textarea
              style={input}
              placeholder="Notas"
              value={pacienteSeleccionado.notas}
              onChange={(e) => actualizarPaciente("notas", e.target.value)}
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
        <button style={btn} onClick={() => setPagina("menu")}>⬅ Volver</button>

        <h2 style={{ textTransform: "capitalize" }}>{nombreMes}</h2>

        <button onClick={() => cambiarMes(-1)}>⬅</button>
        <button onClick={() => cambiarMes(1)}>➡</button>

        <div>
          {[...Array(diasEnMes)].map((_, i) => {
            const fecha = `${fechaActual.getFullYear()}-${fechaActual.getMonth()+1}-${i+1}`;
            return (
              <button key={i} style={diaBtn} onClick={() => setFechaSeleccionada(fecha)}>
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

            <div>
              {horas.map(h => {
                const ocupado = citas.some(c => c.fecha === fechaSeleccionada && c.hora === h);

                return (
                  <button
                    key={h}
                    style={{ ...horaBtn, background: ocupado ? "#ccc" : "#2c7be5" }}
                    disabled={ocupado}
                    onClick={() => agendar(h)}
                  >
                    {h}
                  </button>
                );
              })}
            </div>

            <h3>Citas</h3>

            {citasDelDia.map(c => (
              <div key={c.id} style={card}>
                {c.hora} - {c.paciente}
                <br />
                <button style={btnEliminar} onClick={() => cancelarCita(c.id)}>
                  Cancelar
                </button>
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
        <button style={btn} onClick={() => setPagina("menu")}>⬅ Volver</button>

        <h2>Configuración</h2>

        <label>Hora inicio</label>
        <input
          type="number"
          value={config.inicio}
          onChange={(e) => setConfig({ ...config, inicio: Number(e.target.value) })}
        />

        <label>Hora fin</label>
        <input
          type="number"
          value={config.fin}
          onChange={(e) => setConfig({ ...config, fin: Number(e.target.value) })}
        />
      </div>
    );
  }
}

const container = { padding: 30, fontFamily: "Arial" };

const btn = {
  padding: "12px 20px",
  margin: "10px",
  background: "#2c7be5",
  color: "white",
  border: "none",
  borderRadius: "8px"
};

const btnPeq = { marginRight: 10 };
const btnEliminar = { background: "red", color: "white", marginTop: 5 };

const input = {
  display: "block",
  margin: "5px 0",
  padding: "8px",
  width: "100%"
};

const card = {
  border: "1px solid #ddd",
  padding: 10,
  marginTop: 10,
  borderRadius: 8
};

const cardGrande = {
  border: "2px solid #2c7be5",
  padding: 20,
  marginTop: 20
};

const diaBtn = { margin: 5, padding: 10 };

const horaBtn = {
  margin: 5,
  padding: 10,
  color: "white",
  border: "none"
};

export default App;