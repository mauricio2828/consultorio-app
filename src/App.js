import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "./App.css";

function App() {

  const [pagina, setPagina] = useState("menu");
  const [pacientes, setPacientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [logo, setLogo] = useState(null);

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
    const l = localStorage.getItem("logo");

    if (p) setPacientes(JSON.parse(p));
    if (c) setCitas(JSON.parse(c));
    if (conf) setConfig(JSON.parse(conf));
    if (l) setLogo(l);
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
      notas: ""
    };

    setPacientes([...pacientes, nuevo]);
    setForm({ nombre: "", telefono: "" });
  };

  const eliminarPaciente = (id) => {
    setPacientes(pacientes.filter(p => p.id !== id));
  };

  const togglePaciente = (p) => {
    if (pacienteSeleccionado && pacienteSeleccionado.id === p.id) {
      setPacienteSeleccionado(null);
    } else {
      setPacienteSeleccionado(p);
    }
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

  const hoy = new Date();

  const esHoy = (dia) => {
    return (
      dia === hoy.getDate() &&
      fechaActual.getMonth() === hoy.getMonth() &&
      fechaActual.getFullYear() === hoy.getFullYear()
    );
  };

  const nombreMes = fechaActual.toLocaleString("es-MX", {
    month: "long",
    year: "numeric"
  });

  // HORAS
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
      paciente: pacienteSeleccionado.nombre,
      estado: "programada"
    };

    setCitas([...citas, nueva]);
  };

  const cambiarEstado = (id, estado) => {
    setCitas(citas.map(c => c.id === id ? { ...c, estado } : c));
  };

  const citasDelDia = citas.filter(c => c.fecha === fechaSeleccionada);

  // EXPORTAR EXCEL
  const exportarExcel = () => {
    const data = citasDelDia.map(c => ({
      Hora: c.hora,
      Paciente: c.paciente,
      Estado: c.estado
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Agenda");

    XLSX.writeFile(wb, `Agenda_${fechaSeleccionada}.xlsx`);
  };

  // LOGO
  const cambiarLogo = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      localStorage.setItem("logo", reader.result);
      setLogo(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // ESTADÍSTICAS
  const total = citas.length;
  const asistio = citas.filter(c => c.estado === "asistio").length;
  const canceladas = citas.filter(c => c.estado === "cancelada").length;

  // MENU
  if (pagina === "menu") {
    return (
      <div style={container}>
        {logo && <img src={logo} style={{ width: 100 }} />}

        <h1>🏥 Consultorio Médico</h1>

        <button style={btn} onClick={() => setPagina("pacientes")}>👤 Pacientes</button>
        <button style={btn} onClick={() => setPagina("citas")}>📅 Citas</button>
        <button style={btn} onClick={() => setPagina("config")}>⚙️ Configuración</button>
        <button style={btn} onClick={() => setPagina("stats")}>📊 Estadísticas</button>
      </div>
    );
  }

  // PACIENTES
  if (pagina === "pacientes") {
    return (
      <div style={container}>
        <button style={btn} onClick={() => setPagina("menu")}>⬅</button>

        <h2>Pacientes</h2>

        <input style={input} placeholder="Nombre"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
        />

        <input style={input} placeholder="Teléfono"
          value={form.telefono}
          onChange={e => setForm({ ...form, telefono: e.target.value })}
        />

        <button style={btn} onClick={agregarPaciente}>Guardar</button>

        {pacientes.map(p => (
          <div key={p.id} style={card}>
            <b>{p.nombre}</b>
            <p>{p.telefono}</p>

            <button style={btnPeq} onClick={() => togglePaciente(p)}>
              📋 Expediente
            </button>

            <button style={btnEliminar} onClick={() => eliminarPaciente(p.id)}>
              ❌
            </button>

            {pacienteSeleccionado && pacienteSeleccionado.id === p.id && (
              <textarea
                style={input}
                placeholder="Notas"
                value={pacienteSeleccionado.notas}
                onChange={(e) => {
                  const actualizado = pacientes.map(x =>
                    x.id === p.id ? { ...x, notas: e.target.value } : x
                  );
                  setPacientes(actualizado);
                  setPacienteSeleccionado({ ...p, notas: e.target.value });
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  // CITAS
  if (pagina === "citas") {
    return (
      <div style={container}>
        <button style={btn} onClick={() => setPagina("menu")}>⬅</button>

        <h2>📅 {nombreMes}</h2>

        <button onClick={() => cambiarMes(-1)}>⬅</button>
        <button onClick={() => cambiarMes(1)}>➡</button>

        <div>
          {[...Array(diasEnMes)].map((_, i) => {
            const fecha = `${fechaActual.getFullYear()}-${fechaActual.getMonth()+1}-${i+1}`;
            return (
              <button
                key={i}
                style={{
                  ...diaBtn,
                  background: esHoy(i+1) ? "#2c7be5" : "white",
                  color: esHoy(i+1) ? "white" : "black"
                }}
                onClick={() => setFechaSeleccionada(fecha)}
              >
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
                const ocupado = citas.some(
                  c => c.fecha === fechaSeleccionada && c.hora === h
                );

                return (
                  <button
                    key={h}
                    style={{
                      ...horaBtn,
                      background: ocupado ? "#ccc" : "#2c7be5"
                    }}
                    disabled={ocupado}
                    onClick={() => agendar(h)}
                  >
                    {h}
                  </button>
                );
              })}
            </div>

            <button style={btn} onClick={exportarExcel}>
              📥 Exportar Excel
            </button>

            {citasDelDia.map(c => (
              <div key={c.id} style={card}>
                {c.hora} - {c.paciente}

                <select onChange={(e) => cambiarEstado(c.id, e.target.value)}>
                  <option value="programada">Programada</option>
                  <option value="asistio">Asistió</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }

  // CONFIG
  if (pagina === "config") {
    return (
      <div style={container}>
        <button style={btn} onClick={() => setPagina("menu")}>⬅</button>

        <h2>Configuración</h2>

        <label>Logo</label>
        <input type="file" onChange={cambiarLogo} />

        <label>Hora inicio</label>
        <input type="number" style={input}
          value={config.inicio}
          onChange={(e) => setConfig({ ...config, inicio: Number(e.target.value) })}
        />

        <label>Hora fin</label>
        <input type="number" style={input}
          value={config.fin}
          onChange={(e) => setConfig({ ...config, fin: Number(e.target.value) })}
        />
      </div>
    );
  }

  // STATS
  if (pagina === "stats") {
    return (
      <div style={container}>
        <button style={btn} onClick={() => setPagina("menu")}>⬅</button>

        <h2>Estadísticas</h2>

        <p>Total citas: {total}</p>
        <p>Asistieron: {asistio}</p>
        <p>Canceladas: {canceladas}</p>
      </div>
    );
  }
}

// ESTILOS (NO CAMBIADOS)
const container = { padding: 30, fontFamily: "Arial", background: "#f5f7fb", minHeight: "100vh" };
const btn = { padding: "14px 22px", margin: "10px", background: "#2c7be5", color: "white", border: "none", borderRadius: "10px" };
const btnPeq = { marginRight: 10 };
const btnEliminar = { background: "red", color: "white", padding: "6px 10px", border: "none" };
const input = { display: "block", margin: "5px 0", padding: "8px", width: "100%" };
const card = { border: "1px solid #ddd", padding: 10, marginTop: 10, borderRadius: 8, background: "white" };
const diaBtn = { margin: 5, padding: 10, borderRadius: 8, border: "1px solid #ccc" };
const horaBtn = { margin: 5, padding: 10, color: "white", border: "none", borderRadius: 8 };

export default App;