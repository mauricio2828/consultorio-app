/* eslint-disable */
import { useState, useEffect } from "react";
import "./App.css";

function App() {

const hoy = new Date();

const [pagina, setPagina] = useState("menu");
const [pacientes, setPacientes] = useState([]);
const [citas, setCitas] = useState([]);
const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
const [editando, setEditando] = useState(false);

const [mes, setMes] = useState(hoy.getMonth());
const [anio, setAnio] = useState(hoy.getFullYear());
const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

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

// ================= LOCAL STORAGE =================
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

useEffect(()=>{
  localStorage.setItem("pacientes", JSON.stringify(pacientes));
},[pacientes]);

useEffect(()=>{
  localStorage.setItem("citas", JSON.stringify(citas));
},[citas]);

useEffect(()=>{
  localStorage.setItem("config", JSON.stringify(config));
},[config]);

useEffect(()=>{
  if(logo){
    localStorage.setItem("logo", logo);
  }
},[logo]);

// ================= LOGO =================
const cambiarLogo = (e)=>{
  const archivo = e.target.files[0];
  if(!archivo) return;

  const reader = new FileReader();
  reader.onload = function(event){
    setLogo(event.target.result);
  };
  reader.readAsDataURL(archivo);
};

// ================= PACIENTES =================
const guardarPaciente = ()=>{
  if(!formPaciente.nombre) return;

  if(editando){
    setPacientes(pacientes.map(p =>
      p.id === pacienteSeleccionado.id ? {...formPaciente, id:p.id} : p
    ));
    setEditando(false);
    setPacienteSeleccionado(null);
  }else{
    setPacientes([
      ...pacientes,
      { id: Date.now(), ...formPaciente }
    ]);
  }

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

const editarPaciente = (p)=>{
  setPacienteSeleccionado(p);
  setFormPaciente(p);
  setEditando(true);
};

const toggleExpediente = (p)=>{
  if(pacienteSeleccionado?.id === p.id){
    setPacienteSeleccionado(null);
  }else{
    setPacienteSeleccionado(p);
  }
};

// ================= CALENDARIO =================
const diasSemana = ["L","M","M","J","V","S","D"];
const diasEnMes = new Date(anio, mes+1, 0).getDate();
const primerDia = (new Date(anio, mes, 1).getDay()+6)%7;

const horas = [];
for(let h=config.inicio; h<=config.fin; h++){
  horas.push(h+":00");
}

const citasFecha = (f)=> citas.filter(c=>c.fecha===f);

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
    c=>c.fecha===fechaSeleccionada && c.hora===hora
  );

  if(existe) return;

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

// ================= MENU =================
if(pagina==="menu"){
return(
<div style={container}>
{logo && <img src={logo} alt="logo" style={{width:120}}/>}
<h1>Consultorio Médico</h1>

<button style={btn} onClick={()=>setPagina("pacientes")}>👤 Pacientes</button>
<button style={btn} onClick={()=>setPagina("citas")}>📅 Citas</button>
<button style={btn} onClick={()=>setPagina("config")}>⚙️ Configuración</button>
<button style={btn} onClick={()=>setPagina("stats")}>📊 Estadísticas</button>

</div>
);
}

// ================= PACIENTES =================
if(pagina==="pacientes"){
return(
<div style={container}>
<button style={btn} onClick={()=>setPagina("menu")}>⬅ Regresar</button>

<h2>{editando ? "Editar Paciente" : "Nuevo Paciente"}</h2>

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

<input style={input} placeholder="Dirección"
value={formPaciente.direccion}
onChange={(e)=>setFormPaciente({...formPaciente,direccion:e.target.value})}
/>

<input style={input} placeholder="Padecimiento"
value={formPaciente.padecimiento}
onChange={(e)=>setFormPaciente({...formPaciente,padecimiento:e.target.value})}
/>

<input style={input} placeholder="Alergias"
value={formPaciente.alergias}
onChange={(e)=>setFormPaciente({...formPaciente,alergias:e.target.value})}
/>

<textarea style={input} placeholder="Notas"
value={formPaciente.notas}
onChange={(e)=>setFormPaciente({...formPaciente,notas:e.target.value})}
/>

<button style={btn} onClick={guardarPaciente}>
{editando ? "Actualizar Paciente" : "Guardar Paciente"}
</button>

<h2>Pacientes</h2>

{pacientes.map(p=>(
<div key={p.id} style={card}>
<b>{p.nombre}</b>
<button onClick={()=>toggleExpediente(p)}>Expediente</button>
<button onClick={()=>editarPaciente(p)}>Editar</button>

{pacienteSeleccionado?.id===p.id && (
<div style={expediente}>
<p>Tel: {p.telefono}</p>
<p>Edad: {p.edad}</p>
<p>Dirección: {p.direccion}</p>
<p>Padecimiento: {p.padecimiento}</p>
<p>Alergias: {p.alergias}</p>
<p>Notas: {p.notas}</p>
</div>
)}
</div>
))}

</div>
);
}

// ================= CITAS =================
if(pagina==="citas"){
return(
<div style={container}>
<button style={btn} onClick={()=>setPagina("menu")}>⬅ Regresar</button>

<h2>Citas</h2>

<select value={mes} onChange={(e)=>setMes(Number(e.target.value))}>
{["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map((m,i)=>(
<option key={i} value={i}>{m}</option>
))}
</select>

<select value={anio} onChange={(e)=>setAnio(Number(e.target.value))}>
{[2024,2025,2026,2027,2028,2029].map(a=>(
<option key={a}>{a}</option>
))}
</select>

<div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginTop:10}}>
{diasSemana.map(d=><div key={d}>{d}</div>)}
</div>

<div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
{[...Array(primerDia)].map((_,i)=><div key={"v"+i}></div>)}

{[...Array(diasEnMes)].map((_,i)=>{
const dia=i+1;
const fecha=`${anio}-${mes+1}-${dia}`;

return(
<button key={i}
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
<button key={h} onClick={()=>agendar(h)}>
{h}
</button>
))}
</div>
</div>
)}

</div>
);
}

// ================= CONFIG =================
if(pagina==="config"){
return(
<div style={container}>
<button style={btn} onClick={()=>setPagina("menu")}>⬅ Regresar</button>

<h2>Configuración</h2>

<h3>Cambiar Logo</h3>
<input type="file" onChange={cambiarLogo} />

<label>Hora inicio</label>
<input type="number" value={config.inicio}
onChange={(e)=>setConfig({...config,inicio:Number(e.target.value)})}
/>

<label>Hora fin</label>
<input type="number" value={config.fin}
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

// ================= ESTADISTICAS =================
if(pagina==="stats"){
return(
<div style={container}>
<button style={btn} onClick={()=>setPagina("menu")}>⬅ Regresar</button>

<h2>Estadísticas</h2>
<p>Total Pacientes: {pacientes.length}</p>
<p>Total Citas: {citas.length}</p>

</div>
);
}

return null;
}

const container={padding:30,fontFamily:"Arial"};
const btn={padding:"12px",margin:"8px",background:"#2c7be5",color:"white",border:"none",borderRadius:"8px"};
const input={display:"block",margin:5,padding:8,width:"300px"};
const card={border:"1px solid #ccc",padding:10,marginTop:10};
const expediente={background:"#f4f4f4",padding:10,marginTop:5};

export default App;