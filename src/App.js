import { useState, useEffect } from "react";
import "./App.css";

const container = {
  padding: 20,
  fontFamily: "Arial",
  minHeight: "100vh",
  background: "#f5f7fb",
  overflowX: "hidden"
};

const btn = {
  padding: "12px",
  margin: "5px",
  background: "#1565c0",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px"
};

const btnBack = {
  padding: "10px",
  marginBottom: "15px",
  background: "#424242",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const inputStyle = {
  display: "block",
  margin: "8px 0",
  padding: "10px",
  width: "100%",
  maxWidth: "350px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box"
};

const card = {
  border: "1px solid #dcdcdc",
  borderRadius: "10px",
  padding: "12px",
  marginTop: "10px",
  background: "white",
  boxShadow: "0 2px 5px rgba(0,0,0,0.08)"
};

const calendarioGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(7,1fr)",
  gap: "5px",
  marginTop: "15px"
};

const diaBtn = {
  padding: "10px 0",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer"
};

export default function App() {

  const [pagina, setPagina] = useState("menu");
  const [pacientes, setPacientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [editandoPaciente, setEditandoPaciente] = useState(null);

  const [config, setConfig] = useState({
    inicio: 9,
    fin: 18,
    multiplePorHora: false
  });

  const [formPaciente, setFormPaciente] = useState({
    nombre:"",
    telefono:"",
    padecimiento:""
  });

  const [fechaSeleccionada,setFechaSeleccionada] = useState("");
  const [pacienteSeleccionado,setPacienteSeleccionado] = useState("");

  // STORAGE
  useEffect(()=>{
    try{
      const pacientesGuardados = JSON.parse(localStorage.getItem("pacientes")) || [];
      const citasGuardadas = JSON.parse(localStorage.getItem("citas")) || [];
      const configGuardada = JSON.parse(localStorage.getItem("config")) || {
        inicio:9,
        fin:18,
        multiplePorHora:false
      };

      setPacientes(pacientesGuardados);
      setCitas(citasGuardadas);
      setConfig(configGuardada);

    }catch(error){
      console.log(error);
    }
  },[]);

  useEffect(()=>{
    localStorage.setItem("pacientes",JSON.stringify(pacientes));
  },[pacientes]);

  useEffect(()=>{
    localStorage.setItem("citas",JSON.stringify(citas));
  },[citas]);

  useEffect(()=>{
    localStorage.setItem("config",JSON.stringify(config));
  },[config]);

  // PACIENTES
  const guardarPaciente = ()=>{

    if(!formPaciente.nombre) return;

    if(editandoPaciente){

      setPacientes(
        pacientes.map(p=>
          p.id===editandoPaciente
          ? {...formPaciente,id:editandoPaciente}
          : p
        )
      );

      setEditandoPaciente(null);

    }else{

      setPacientes([
        ...pacientes,
        {
          id:Date.now(),
          ...formPaciente
        }
      ]);
    }

    setFormPaciente({
      nombre:"",
      telefono:"",
      padecimiento:""
    });
  };

  const eliminarPaciente = (id)=>{
    setPacientes(pacientes.filter(p=>p.id!==id));
  };

  // CITAS
  const cancelarCita = (id)=>{
    setCitas(citas.filter(c=>c.id!==id));
  };

  const horaOcupada = (hora)=>{
    return citas.some(
      c=>c.fecha===fechaSeleccionada && c.hora===hora
    );
  };

  const agendar = (hora)=>{

    if(!fechaSeleccionada) return;
    if(!pacienteSeleccionado) return;

    if(!config.multiplePorHora && horaOcupada(hora)){
      alert("Esta hora ya está ocupada");
      return;
    }

    setCitas([
      ...citas,
      {
        id:Date.now(),
        fecha:fechaSeleccionada,
        hora,
        paciente:pacienteSeleccionado
      }
    ]);
  };

  // FECHA
  const hoy = new Date();

  const diasMes = new Date(
    hoy.getFullYear(),
    hoy.getMonth()+1,
    0
  ).getDate();

  // HORAS
  const horas = [];

  for(let h=config.inicio; h<=config.fin; h++){

    let hora = h > 12 ? h-12 : h;
    let ampm = h >= 12 ? "PM" : "AM";

    horas.push(`${hora}:00 ${ampm}`);
  }

  // MENU
  if(pagina==="menu"){
    return(
      <div style={container}>

        <h1>Consultorio Médico</h1>

        <button style={btn} onClick={()=>setPagina("pacientes")}>
          👤 Pacientes
        </button>

        <button style={btn} onClick={()=>setPagina("citas")}>
          📅 Citas
        </button>

        <button style={btn} onClick={()=>setPagina("config")}>
          ⚙️ Configuración
        </button>

        <button style={btn} onClick={()=>setPagina("stats")}>
          📊 Estadísticas
        </button>

      </div>
    );
  }

  // PACIENTES
  if(pagina==="pacientes"){
    return(
      <div style={container}>

        <button style={btnBack} onClick={()=>setPagina("menu")}>
          ← Regresar
        </button>

        <h2>Nuevo Paciente</h2>

        <input
          style={inputStyle}
          placeholder="Nombre"
          value={formPaciente.nombre}
          onChange={(e)=>
            setFormPaciente({
              ...formPaciente,
              nombre:e.target.value
            })
          }
        />

        <input
          style={inputStyle}
          placeholder="Teléfono"
          value={formPaciente.telefono}
          onChange={(e)=>
            setFormPaciente({
              ...formPaciente,
              telefono:e.target.value
            })
          }
        />

        <input
          style={inputStyle}
          placeholder="Padecimiento"
          value={formPaciente.padecimiento}
          onChange={(e)=>
            setFormPaciente({
              ...formPaciente,
              padecimiento:e.target.value
            })
          }
        />

        <button style={btn} onClick={guardarPaciente}>
          💾 Guardar
        </button>

        <h2>Pacientes</h2>

        {pacientes.map(p=>(
          <div key={p.id} style={card}>

            <b>{p.nombre}</b>

            <p>📞 {p.telefono}</p>

            <p>🩺 {p.padecimiento}</p>

            <button
              style={btn}
              onClick={()=>{
                setFormPaciente(p);
                setEditandoPaciente(p.id);
              }}
            >
              ✏️ Editar
            </button>

            <button
              style={btn}
              onClick={()=>eliminarPaciente(p.id)}
            >
              🗑 Eliminar
            </button>

          </div>
        ))}

      </div>
    );
  }

  // CITAS
  if(pagina==="citas"){
    return(
      <div style={container}>

        <button style={btnBack} onClick={()=>setPagina("menu")}>
          ← Regresar
        </button>

        <h2>Calendario</h2>

        <div style={calendarioGrid}>
          {[...Array(diasMes)].map((_,i)=>{

            const dia = i+1;

            const fecha =
              `${hoy.getFullYear()}-${hoy.getMonth()+1}-${dia}`;

            const citasDia = citas.filter(c=>c.fecha===fecha);

            let color = "#ffffff";

            if(citasDia.length>0){
              color = "#a5d6a7";
            }

            return(
              <button
                key={i}
                style={{
                  ...diaBtn,
                  background: color,
                  border:
                    fechaSeleccionada===fecha
                    ? "3px solid #1565c0"
                    : "1px solid #ccc"
                }}
                onClick={()=>setFechaSeleccionada(fecha)}
              >
                {dia}
              </button>
            );
          })}
        </div>

        <div style={{marginTop:"20px"}}>
          <p>🟢 Día con citas</p>
          <p>⚪ Día sin citas</p>
        </div>

        {fechaSeleccionada && (
          <div style={{marginTop:"20px"}}>

            <h3>Fecha: {fechaSeleccionada}</h3>

            <select
              style={inputStyle}
              value={pacienteSeleccionado}
              onChange={(e)=>setPacienteSeleccionado(e.target.value)}
            >
              <option value="">
                Seleccionar paciente
              </option>

              {pacientes.map(p=>(
                <option key={p.id} value={p.nombre}>
                  {p.nombre}
                </option>
              ))}
            </select>

            <h3>Horarios</h3>

            <div>
              {horas.map(h=>{

                const ocupada = horaOcupada(h);

                return(
                  <button
                    key={h}
                    disabled={
                      ocupada && !config.multiplePorHora
                    }
                    style={{
                      ...btn,
                      background:
                        ocupada
                        ? "#9e9e9e"
                        : "#1565c0"
                    }}
                    onClick={()=>agendar(h)}
                  >
                    {h}
                  </button>
                );
              })}
            </div>

            <h3>Citas del día</h3>

            {citas
              .filter(c=>c.fecha===fechaSeleccionada)
              .map(c=>(
                <div key={c.id} style={card}>

                  <b>{c.hora}</b>

                  <p>{c.paciente}</p>

                  <button
                    style={btn}
                    onClick={()=>cancelarCita(c.id)}
                  >
                    ❌ Cancelar
                  </button>

                </div>
              ))
            }

          </div>
        )}

      </div>
    );
  }

  // CONFIG
  if(pagina==="config"){
    return(
      <div style={container}>

        <button style={btnBack} onClick={()=>setPagina("menu")}>
          ← Regresar
        </button>

        <h2>Configuración</h2>

        <div style={card}>

          <p>
            Permitir múltiples pacientes
            en la misma hora
          </p>

          <button
            style={btn}
            onClick={()=>
              setConfig({
                ...config,
                multiplePorHora:
                !config.multiplePorHora
              })
            }
          >
            {config.multiplePorHora
              ? "✅ ACTIVADO"
              : "❌ DESACTIVADO"}
          </button>

        </div>

      </div>
    );
  }

  // ESTADISTICAS
  if(pagina==="stats"){

    const hoyStr =
      `${hoy.getFullYear()}-${hoy.getMonth()+1}-${hoy.getDate()}`;

    const citasHoy =
      citas.filter(c=>c.fecha===hoyStr);

    return(
      <div style={container}>

        <button style={btnBack} onClick={()=>setPagina("menu")}>
          ← Regresar
        </button>

        <h2>📊 Estadísticas</h2>

        <div style={card}>
          <h3>Pacientes</h3>
          <p>Total: {pacientes.length}</p>
        </div>

        <div style={card}>
          <h3>Citas</h3>
          <p>Total: {citas.length}</p>
          <p>Hoy: {citasHoy.length}</p>
        </div>

      </div>
    );
  }

  return null;
}