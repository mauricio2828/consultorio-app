import { useState, useEffect } from "react";
import "./App.css";

function App() {

const hoy = new Date();

const [pagina, setPagina] = useState("menu");
const [pacientes, setPacientes] = useState([]);
const [citas, setCitas] = useState([]);
const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
const [expedienteAbierto, setExpedienteAbierto] = useState(null);

const [mes, setMes] = useState(hoy.getMonth());
const [anio, setAnio] = useState(hoy.getFullYear());
const [fechaSeleccionada, setFechaSeleccionada] = useState("");

const [logo, setLogo] = useState(null);

const [config, setConfig] = useState({
  inicio: 9,
  fin: 18,
  diasLaborales: [1,2,3,4,5]
});

const [formPaciente, setFormPaciente] = useState({
  nombre:"",
  telefono:"",
  edad:"",
  direccion:"",
  padecimiento:"",
  alergias:"",
  notas:""
});

// ===== LOCAL STORAGE SEGURO =====
useEffect(()=>{
  try{
    const p = JSON.parse(localStorage.getItem("pacientes")) || [];
    const c = JSON.parse(localStorage.getItem("citas")) || [];
    const conf = JSON.parse(localStorage.getItem("config")) || config;
    const l = localStorage.getItem("logo");

    setPacientes(p);
    setCitas(c);
    setConfig(conf);
    if(l) setLogo(l);
  }catch{
    localStorage.clear();
  }
},[]);

useEffect(()=>{localStorage.setItem("pacientes",JSON.stringify(pacientes));},[pacientes]);
useEffect(()=>{localStorage.setItem("citas",JSON.stringify(citas));},[citas]);
useEffect(()=>{localStorage.setItem("config",JSON.stringify(config));},[config]);
useEffect(()=>{if(logo)localStorage.setItem("logo",logo);},[logo]);

// ===== LOGO =====
const cambiarLogo = (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (ev)=> setLogo(ev.target.result);
  reader.readAsDataURL(file);
};

// ===== PACIENTES =====
const guardarPaciente = ()=>{
  if(!formPaciente.nombre) return;

  setPacientes([...pacientes,{
    id: Date.now(),
    ...formPaciente
  }]);

  setFormPaciente({
    nombre:"",
    telefono:"",
    edad:"",
    direccion:"",
    padecimiento:"",
    alergias:"",
    notas:""
  });
};

const toggleExpediente = (id)=>{
  if(expedienteAbierto === id){
    setExpedienteAbierto(null);
  }else{
    setExpedienteAbierto(id);
  }
};

// ===== CALENDARIO =====
const diasSemana = ["L","M","M","J","V","S","D"];
const diasEnMes = new Date(anio, mes+1, 0).getDate();
const primerDia = (new Date(anio, mes, 1).getDay()+6)%7;

const horas = [];
for(let h=config.inicio; h<=config.fin; h++){
  horas.push(h+":00");
}

const citasFecha = (fecha)=>{
  if(!citas) return [];
  return citas.filter(c=>c.fecha === fecha);
};

const colorDia = (fecha)=>{
  try{
    const partes = fecha.split("-");
    const d = new Date(partes[0], partes[1]-1, partes[2]);

    if(d.toDateString() === hoy.toDateString()) return "#ffe082";
    if(!config.diasLaborales || !config.diasLaborales.includes(d.getDay())) return "#e0e0e0";
    if(citasFecha(fecha).length >= horas.length) return "#ff8a80";
    if(citasFecha(fecha).length > 0) return "#a5d6a7";
    if(fechaSeleccionada === fecha) return "#90caf9";

    return "white";
  }catch{
    return "white";
  }
};

const agendar = (hora)=>{
  if(!pacienteSeleccionado || !fechaSeleccionada) return;

  const existe = citas.some(
    c => c.fecha === fechaSeleccionada && c.hora === hora
  );

  if(existe) return;

  setCitas([...citas,{
    id: Date.now(),
    fecha: fechaSeleccionada,
    hora,
    paciente: pacienteSeleccionado.nombre
  }]);
};

// ===== PAGINAS =====

function Menu(){
  return(
    <div style={container}>
      {logo && <img src={logo} alt="logo" style={{width:120}} />}
      <h1>Consultorio Médico</h1>

      <button style={btn} onClick={()=>setPagina("pacientes")}>👤 Pacientes</button>
      <button style={btn} onClick={()=>setPagina("citas")}>📅 Citas</button>
      <button style={btn} onClick={()=>setPagina("config")}>⚙️ Configuración</button>
      <button style={btn} onClick={()=>setPagina("stats")}>📊 Estadísticas</button>
    </div>
  );
}

function Pacientes(){
  return(
    <div style={container}>
      <button style={btn} onClick={()=>setPagina("menu")}>Regresar</button>

      <h2>Nuevo Paciente</h2>

      <input style={input} placeholder="Nombre"
      value={formPaciente.nombre}
      onChange={(e)=>setFormPaciente({...formPaciente,nombre:e.target.value})}
      />

      <input style={input} placeholder="Teléfono"
      value={formPaciente.telefono}
      onChange={(e)=>setFormPaciente({...formPaciente,telefono:e.target.value})}
      />

      <input style={input} placeholder="Edad"
      value={formPaciente.edad}
      onChange={(e)=>setFormPaciente({...formPaciente,edad:e.target.value})}
      />

      <textarea style={input} placeholder="Notas"
      value={formPaciente.notas}
      onChange={(e)=>setFormPaciente({...formPaciente,notas:e.target.value})}
      />

      <button style={btn} onClick={guardarPaciente}>Guardar</button>

      <h2>Lista Pacientes</h2>

      {pacientes.map(p=>(
        <div key={p.id} style={card}>
          <b>{p.nombre}</b>
          <button onClick={()=>toggleExpediente(p.id)}>Expediente</button>

          {expedienteAbierto === p.id && (
            <div style={expediente}>
              <p>Tel: {p.telefono}</p>
              <p>Edad: {p.edad}</p>
              <p>Notas: {p.notas}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Citas(){
  return(
    <div style={container}>
      <button style={btn} onClick={()=>setPagina("menu")}>Regresar</button>
      <h2>Calendario</h2>

      <select value={mes} onChange={(e)=>setMes(Number(e.target.value))}>
        {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map((m,i)=>(
          <option key={i} value={i}>{m}</option>
        ))}
      </select>

      <select value={anio} onChange={(e)=>setAnio(Number(e.target.value))}>
        {[2024,2025,2026,2027,2028].map(a=>(
          <option key={a}>{a}</option>
        ))}
      </select>

      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
        {diasSemana.map(d=><div key={d}>{d}</div>)}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
        {[...Array(primerDia)].map((_,i)=><div key={i}></div>)}

        {[...Array(diasEnMes)].map((_,i)=>{
          const dia = i+1;
          const fecha = anio + "-" + (mes+1) + "-" + dia;

          return(
            <button
            key={i}
            style={{margin:3,padding:10,background:colorDia(fecha)}}
            onClick={()=>setFechaSeleccionada(fecha)}
            >
            {dia}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Config(){
  return(
    <div style={container}>
      <button style={btn} onClick={()=>setPagina("menu")}>Regresar</button>
      <h2>Configuración</h2>

      <h3>Logo</h3>
      <input type="file" onChange={cambiarLogo} />

      <h3>Horario</h3>
      <input type="number" value={config.inicio}
      onChange={(e)=>setConfig({...config,inicio:Number(e.target.value)})}
      />

      <input type="number" value={config.fin}
      onChange={(e)=>setConfig({...config,fin:Number(e.target.value)})}
      />
    </div>
  );
}

function Stats(){
  return(
    <div style={container}>
      <button style={btn} onClick={()=>setPagina("menu")}>Regresar</button>
      <h2>Estadísticas</h2>
      <p>Pacientes: {pacientes.length}</p>
      <p>Citas: {citas.length}</p>
    </div>
  );
}

if(pagina==="menu") return <Menu/>
if(pagina==="pacientes") return <Pacientes/>
if(pagina==="citas") return <Citas/>
if(pagina==="config") return <Config/>
if(pagina==="stats") return <Stats/>

return null;
}

const container={padding:30,fontFamily:"Arial"};
const btn={padding:"10px",margin:"5px",background:"#2c7be5",color:"white",border:"none",borderRadius:"6px"};
const input={display:"block",margin:5,padding:8,width:"300px"};
const card={border:"1px solid #ccc",padding:10,marginTop:10};
const expediente={background:"#f4f4f4",padding:10,marginTop:5};

export default App;