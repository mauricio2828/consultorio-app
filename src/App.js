import { useState, useEffect } from "react";
import "./App.css";

function App() {

const hoy = new Date();

const [pagina, setPagina] = useState("menu");
const [pacientes, setPacientes] = useState([]);
const [citas, setCitas] = useState([]);
const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

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

// ===== LOCAL STORAGE =====
useEffect(()=>{
  const p = localStorage.getItem("pacientes");
  const c = localStorage.getItem("citas");
  const conf = localStorage.getItem("config");
  const l = localStorage.getItem("logo");

  if(p) setPacientes(JSON.parse(p));
  if(c) setCitas(JSON.parse(c));
  if(conf) setConfig(JSON.parse(conf));
  if(l) setLogo(l);
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

// ===== CALENDARIO =====
const diasSemana = ["L","M","M","J","V","S","D"];
const diasEnMes = new Date(anio, mes+1, 0).getDate();
const primerDia = (new Date(anio, mes, 1).getDay()+6)%7;

const horas = [];
for(let h=config.inicio; h<=config.fin; h++){
  horas.push(h+":00");
}

const citasFecha = (fecha)=>{
  return citas.filter(c=>c.fecha === fecha);
};

const colorDia = (fecha)=>{
  const d = new Date(fecha);

  if(d.toDateString() === hoy.toDateString()) return "#ffe082";
  if(!config.diasLaborales.includes(d.getDay())) return "#e0e0e0";
  if(citasFecha(fecha).length >= horas.length) return "#ff8a80";
  if(citasFecha(fecha).length > 0) return "#a5d6a7";
  if(fechaSeleccionada === fecha) return "#90caf9";

  return "white";
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

// ===== MENU =====
if(pagina==="menu"){
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

// ===== PACIENTES =====
if(pagina==="pacientes"){
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
{p.nombre}
</div>
))}

</div>
);
}

// ===== CITAS =====
if(pagina==="citas"){
return(
<div style={container}>
<button style={btn} onClick={()=>setPagina("menu")}>Regresar</button>

<h2>Calendario de Citas</h2>

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

<div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginTop:10}}>
{diasSemana.map(d=><div key={d}>{d}</div>)}
</div>

<div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
{[...Array(primerDia)].map((_,i)=><div key={i}></div>)}

{[...Array(diasEnMes)].map((_,i)=>{
const dia = i+1;
const fecha = `${anio}-${mes+1}-${dia}`;

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

{fechaSeleccionada && (
<div>
<h3>{fechaSeleccionada}</h3>

<select onChange={(e)=>{
const p = pacientes.find(x=>x.id===Number(e.target.value));
setPacienteSeleccionado(p);
}}>
<option>Paciente</option>
{pacientes.map(p=>(
<option key={p.id} value={p.id}>{p.nombre}</option>
))}
</select>

<div>
{horas.map(h=>(
<button key={h} onClick={()=>agendar(h)}>{h}</button>
))}
</div>
</div>
)}

</div>
);
}

// ===== CONFIG =====
if(pagina==="config"){
return(
<div style={container}>
<button style={btn} onClick={()=>setPagina("menu")}>Regresar</button>

<h2>Configuración</h2>

<h3>Logo</h3>
<input type="file" onChange={cambiarLogo} />

<h3>Horario</h3>

<input type="number"
value={config.inicio}
onChange={(e)=>setConfig({...config,inicio:Number(e.target.value)})}
/>

<input type="number"
value={config.fin}
onChange={(e)=>setConfig({...config,fin:Number(e.target.value)})}
/>

<h3>Días laborales</h3>

{["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"].map((d,i)=>(
<label key={i}>
<input
type="checkbox"
checked={config.diasLaborales.includes(i)}
onChange={()=>{
if(config.diasLaborales.includes(i)){
setConfig({...config,diasLaborales:config.diasLaborales.filter(x=>x!==i)});
}else{
setConfig({...config,diasLaborales:[...config.diasLaborales,i]});
}
}}
/>
{d}
</label>
))}

</div>
);
}

// ===== ESTADISTICAS =====
if(pagina==="stats"){
return(
<div style={container}>
<button style={btn} onClick={()=>setPagina("menu")}>Regresar</button>

<h2>Estadísticas</h2>
<p>Total Pacientes: {pacientes.length}</p>
<p>Total Citas: {citas.length}</p>

<p>Citas Hoy: {
citas.filter(c=>{
return c.fecha === `${hoy.getFullYear()}-${hoy.getMonth()+1}-${hoy.getDate()}`
}).length
}</p>

</div>
);
}

return null;
}

const container={padding:30,fontFamily:"Arial"};
const btn={padding:"10px",margin:"5px",background:"#2c7be5",color:"white",border:"none",borderRadius:"6px"};
const input={display:"block",margin:5,padding:8,width:"300px"};
const card={border:"1px solid #ccc",padding:10,marginTop:10};

export default App;