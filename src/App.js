/* eslint-disable */
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
    fin: 18,
    diasLaborales: [1,2,3,4,5]
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
    if (!form.nombre || !form.telefono) return;

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
    setPacienteSeleccionado(
      pacienteSeleccionado?.id === p.id ? null : p
    );
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

  const esHoy = (dia) =>
    dia === hoy.getDate() &&
    fechaActual.getMonth() === hoy.getMonth() &&
    fechaActual.getFullYear() === hoy.getFullYear();

  const nombreMes = fechaActual.toLocaleString("es-MX", {
    month: "long",
    year: "numeric"
  });

  const diasSemana = ["D","L","M","M","J","V","S"];

  const esLaboral = (fecha) => {
    const d = new Date(fecha).getDay();
    return config.diasLaborales.includes(d);
  };

  const horas = [];
  for (let h = config.inicio; h <= config.fin; h++) {
    const hora12 = h > 12 ? h - 12 : h;
    const ampm = h >= 12 ? "PM" : "AM";
    horas.push(`${hora12}:00 ${ampm}`);
  }

  const citasEnFecha = (fecha) => {
    return citas.filter(c => c.fecha === fecha);
  };

  const diaLleno = (fecha) => {
    return citasEnFecha(fecha).length >= horas.length;
  };

  const tieneCitas = (fecha) => {
    return citas.some(c => c.fecha === fecha);
  };

  // CITAS
  const agendar = (hora) => {
    if (!pacienteSeleccionado || !fechaSeleccionada) return;

    if (!esLaboral(fechaSeleccionada)) {
      alert("Día no laboral");
      return;
    }

    const existe = citas.some(
      c => c.fecha === fechaSeleccionada && c.hora === hora
    );

    if (existe) return;

    setCitas([
      ...citas,
      {
        id: Date.now(),
        fecha: fechaSeleccionada,
        hora,
        paciente: pacienteSeleccionado.nombre
      }
    ]);
  };

  const citasDelDia = citas.filter(c => c.fecha === fechaSeleccionada);

  // CONFIG DIAS
  const toggleDia = (dia) => {
    if (config.diasLaborales.includes(dia)) {
      setConfig({
        ...config,
        diasLaborales: config.diasLaborales.filter(d => d !== dia)
      });
    } else {
      setConfig({
        ...config,
        diasLaborales: [...config.diasLaborales, dia]
      });
    }
  };

  // ESTADISTICAS
  const totalCitas = citas.length;

  // MENU
  if (pagina === "menu") {
    return (
      <div style={container}>
        <h1>🏥 Consultorio Médico</h1>

        <button style={btn} onClick={() => setPagina("pacientes")}>👤 Pacientes</button>
        <button style={btn} onClick={() => setPagina("citas")}>📅 Calendario</button>
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

        <input placeholder="Nombre" style={input}
          value={form.nombre}
          onChange={e => setForm({...form, nombre:e.target.value})}
        />

        <input placeholder="Teléfono" style={input}
          value={form.telefono}
          onChange={e => setForm({...form, telefono:e.target.value})}
        />

        <button style={btn} onClick={agregarPaciente}>Guardar</button>

        {pacientes.map(p => (
          <div key={p.id} style={card}>
            <b>{p.nombre}</b>
            <p>{p.telefono}</p>

            <button onClick={() => togglePaciente(p)}>📋</button>
            <button style={btnEliminar} onClick={() => eliminarPaciente(p.id)}>❌</button>

            {pacienteSeleccionado?.id === p.id && (
              <textarea
                style={input}
                value={p.notas}
                onChange={(e)=>{
                  const updated = pacientes.map(x =>
                    x.id===p.id ? {...x, notas:e.target.value} : x
                  );
                  setPacientes(updated);
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  // CALENDARIO
  if (pagina === "citas") {
    return (
      <div style={container}>
        <button style={btn} onClick={() => setPagina("menu")}>⬅</button>

        <h2>{nombreMes}</h2>

        <button onClick={() => cambiarMes(-1)}>⬅</button>
        <button onClick={() => cambiarMes(1)}>➡</button>

        <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginTop:10}}>
          {diasSemana.map(d => (
            <div key={d} style={{textAlign:"center", fontWeight:"bold"}}>{d}</div>
          ))}
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)"}}>
          {[...Array(diasEnMes)].map((_, i) => {
            const dia = i+1;
            const fecha = `${fechaActual.getFullYear()}-${fechaActual.getMonth()+1}-${dia}`;

            let bg = "white";

            if (!esLaboral(fecha)) bg = "#ccc";
            else if (diaLleno(fecha)) bg = "#ff0000";
            else if (tieneCitas(fecha)) bg = "#28a745";
            if (esHoy(dia)) bg = "#2c7be5";

            return (
              <button
                key={i}
                style={{margin:3, padding:10, background:bg, color:"white"}}
                onClick={() => setFechaSeleccionada(fecha)}
              >
                {dia}
              </button>
            );
          })}
        </div>

        {fechaSeleccionada && (
          <>
            <h3>{fechaSeleccionada}</h3>

            <select onChange={(e)=>{
              const p = pacientes.find(x => x.id === Number(e.target.value));
              setPacienteSeleccionado(p);
            }}>
              <option>Paciente</option>
              {pacientes.map(p=>(
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>

            <div>
              {horas.map(h=>{
                const ocupado = citas.some(c=>c.fecha===fechaSeleccionada && c.hora===h);
                return (
                  <button key={h} disabled={ocupado} onClick={()=>agendar(h)}>
                    {h}
                  </button>
                );
              })}
            </div>

            {citasDelDia.map(c=>(
              <div key={c.id}>{c.hora} - {c.paciente}</div>
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
        <button style={btn} onClick={()=>setPagina("menu")}>⬅</button>

        <h2>Días laborales</h2>

        {["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"].map((d,i)=>(
          <label key={i}>
            <input
              type="checkbox"
              checked={config.diasLaborales.includes(i)}
              onChange={()=>toggleDia(i)}
            />
            {d}
          </label>
        ))}
      </div>
    );
  }

  // STATS
  if (pagina === "stats") {
    return (
      <div style={container}>
        <button style={btn} onClick={()=>setPagina("menu")}>⬅</button>
        <h2>Estadísticas</h2>
        <p>Total citas: {totalCitas}</p>
      </div>
    );
  }

}

const container = { padding:30, fontFamily:"Arial" };
const btn = { padding:"10px", margin:"5px", background:"#2c7be5", color:"white", border:"none", borderRadius:8 };
const input = { display:"block", margin:"5px 0", padding:8 };
const card = { border:"1px solid #ddd", padding:10, marginTop:10 };
const btnEliminar = { background:"red", color:"white", border:"none" };

export default App;