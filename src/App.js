import { useState, useEffect } from "react";
import "./App.css";

const container = { padding: 20, fontFamily: "Arial" };

const btn = {
  padding: "12px",
  margin: "5px",
  background: "#1565c0",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
};

const btnBack = {
  padding: "10px",
  marginBottom: "10px",
  background: "#424242",
  color: "white",
  border: "none",
  borderRadius: "8px"
};

const inputStyle = {
  display: "block",
  margin: "5px 0",
  padding: "8px",
  width: "250px"
};

const card = {
  border: "1px solid #ccc",
  padding: "10px",
  marginTop: "10px"
};

export default function App() {

  const [pagina, setPagina] = useState("menu");
  const [pacientes, setPacientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [logo, setLogo] = useState(null);
  const [editandoPaciente, setEditandoPaciente] = useState(null);

  const [config, setConfig] = useState({
    inicio: 9,
    fin: 18,
    diasLaborales: [1,2,3,4,5],
    multiplePorHora: false
  });

  const [formPaciente, setFormPaciente] = useState({
    nombre:"",
    telefono:"",
    edad:"",
    direccion:"",
    padecimiento:"",
    notas:""
  });

  const [fechaSeleccionada,setFechaSeleccionada] = useState("");
  const [pacienteSeleccionado,setPacienteSeleccionado] = useState("");

  useEffect(()=>{
    setPacientes(JSON.parse(localStorage.getItem("pacientes"))||[]);
    setCitas(JSON.parse(localStorage.getItem("citas"))||[]);
    setConfig(JSON.parse(localStorage.getItem("config"))||config);
    setLogo(localStorage.getItem("logo"));
  },[]);

  useEffect(()=>localStorage.setItem("pacientes",JSON.stringify(pacientes)),[pacientes]);
  useEffect(()=>localStorage.setItem("citas",JSON.stringify(citas)),[citas]);
  useEffect(()=>localStorage.setItem("config",JSON.stringify(config)),[config]);

  // PACIENTES
  const guardarPaciente = ()=>{
    if(!formPaciente.nombre) return;

    if(editandoPaciente){
      setPacientes(pacientes.map(p =>
        p.id === editandoPaciente
          ? { id: editandoPaciente, ...formPaciente }
          : p
      ));
      setEditandoPaciente(null);
    } else {
      setPacientes([...pacientes,{id:Date.now(),...formPaciente}]);
    }

    setFormPaciente({
      nombre:"",
      telefono:"",
      edad:"",
      direccion:"",
      padecimiento:"",
      notas:""
    });
  };

  const eliminarPaciente = (id)=>{
    setPacientes(pacientes.filter(p=>p.id!==id));
  };

  // CITAS
  const cancelarCita = (id)=>{
    setCitas(citas.filter(c=>c.id !== id));
  };

  const horaOcupada = (hora)=>{
    return citas.some(c=>c.fecha===fechaSeleccionada && c.hora===hora);
  };

  const agendar=(hora)=>{
    if(!pacienteSeleccionado || !fechaSeleccionada) return;

    if(!config.multiplePorHora){
      if(horaOcupada(hora)) return;
    }

    setCitas([...citas,{
      id:Date.now(),
      fecha:fechaSeleccionada,
      hora,
      paciente:pacienteSeleccionado
    }]);
  };

  // CALENDARIO
  const hoy = new Date();
  const diasMes = new Date(hoy.getFullYear(), hoy.getMonth()+1, 0).getDate();

  const horas=[];
  for(let h=config.inicio;h<=config.fin;h++){
    let hora=h>12?h-12:h;
    let ampm=h>=12?"PM":"AM";
    horas.push(`${hora}:00 ${ampm}`);
  }

  // MENU
  if(pagina==="menu"){
    return(
      <div style={container}>
        <h1>Consultorio</h1>

        <button style={btn} onClick={()=>setPagina("pacientes")}>👤 Pacientes</button>
        <button style={btn} onClick={()=>setPagina("citas")}>📅 Citas</button>
        <button style={btn} onClick={()=>setPagina("config")}>⚙️ Configuración</button>
      </div>
    );
  }

  // PACIENTES
  if(pagina==="pacientes"){
    return(
      <div style={container}>
        <button style={btnBack} onClick={()=>setPagina("menu")}>← Regresar</button>

        <h2>Paciente</h2>

        <input style={inputStyle} placeholder="Nombre"
          value={formPaciente.nombre}
          onChange={(e)=>setFormPaciente({...formPaciente,nombre:e.target.value})}/>

        <input style={inputStyle} placeholder="Teléfono"
          value={formPaciente.telefono}
          onChange={(e)=>setFormPaciente({...formPaciente,telefono:e.target.value})}/>

        <input style={inputStyle} placeholder="Padecimiento"
          value={formPaciente.padecimiento}
          onChange={(e)=>setFormPaciente({...formPaciente,padecimiento:e.target.value})}/>

        <button style={btn} onClick={guardarPaciente}>Guardar</button>

        {pacientes.map(p=>(
          <div key={p.id} style={card}>
            <b>{p.nombre}</b>
            <p>{p.telefono}</p>
            <p>{p.padecimiento}</p>

            <button style={btn} onClick={()=>{
              setFormPaciente(p);
              setEditandoPaciente(p.id);
            }}>Editar</button>

            <button style={btn} onClick={()=>eliminarPaciente(p.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    );
  }

  // CITAS
  if(pagina==="citas"){
    return(
      <div style={container}>
        <button style={btnBack} onClick={()=>setPagina("menu")}>← Regresar</button>

        <h2>Selecciona día</h2>

        {[...Array(diasMes)].map((_,i)=>{
          const dia=i+1;
          const fecha=`${hoy.getFullYear()}-${hoy.getMonth()+1}-${dia}`;

          return(
            <button key={i} style={btn}
              onClick={()=>setFechaSeleccionada(fecha)}>
              {dia}
            </button>
          );
        })}

        {fechaSeleccionada && (
          <>
            <h3>Paciente</h3>
            <select onChange={(e)=>setPacienteSeleccionado(e.target.value)}>
              <option value="">Seleccionar</option>
              {pacientes.map(p=>(
                <option key={p.id}>{p.nombre}</option>
              ))}
            </select>

            <h3>Horas</h3>
            {horas.map(h=>{
              const ocupada = horaOcupada(h);

              return(
                <button
                  key={h}
                  style={{
                    ...btn,
                    background: ocupada ? "gray" : "#1565c0"
                  }}
                  disabled={ocupada && !config.multiplePorHora}
                  onClick={()=>agendar(h)}
                >
                  {h}
                </button>
              );
            })}

            <h3>Citas</h3>
            {citas.filter(c=>c.fecha===fechaSeleccionada).map(c=>(
              <div key={c.id} style={card}>
                {c.hora} - {c.paciente}
                <button style={btn} onClick={()=>cancelarCita(c.id)}>Cancelar</button>
              </div>
            ))}
          </>
        )}
      </div>
    );
  }

  // CONFIG
  if(pagina==="config"){
    return(
      <div style={container}>
        <button style={btnBack} onClick={()=>setPagina("menu")}>← Regresar</button>

        <h2>Configuración</h2>

        <button style={btn}
          onClick={()=>setConfig({...config,multiplePorHora:!config.multiplePorHora})}>
          {config.multiplePorHora ? "Múltiples citas ACTIVADO" : "Múltiples citas DESACTIVADO"}
        </button>
      </div>
    );
  }

  return null;
}