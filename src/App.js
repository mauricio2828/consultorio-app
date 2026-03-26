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

const [formPaciente, setFormPaciente] = useState({
  nombre:"",
  telefono:"",
  edad:"",
  direccion:"",
  padecimiento:"",
  alergias:"",
  notas:""
});

useEffect(()=>{
  const p = localStorage.getItem("pacientes");
  const c = localStorage.getItem("citas");
  const conf = localStorage.getItem("config");

  if(p) setPacientes(JSON.parse(p));
  if(c) setCitas(JSON.parse(c));
  if(conf) setConfig(JSON.parse(conf));
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

// PACIENTES
const guardarPaciente = () =>{
  if(!formPaciente.nombre) return;

  const nuevo = {
    id: Date.now(),
    ...formPaciente
  };

  setPacientes([...pacientes, nuevo]);

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

const eliminarPaciente = (id)=>{
  setPacientes(pacientes.filter(p=>p.id!==id));
};

const toggleExpediente = (p)=>{
  if(pacienteSeleccionado?.id === p.id){
    setPacienteSeleccionado(null);
  }else{
    setPacienteSeleccionado(p);
  }
};

// CALENDARIO
const cambiarMes = (n)=>{
  const nueva = new Date(fechaActual);
  nueva.setMonth(nueva.getMonth()+n);
  setFechaActual(nueva);
};

const diasMes = new Date(
  fechaActual.getFullYear(),
  fechaActual.getMonth()+1,
  0
).getDate();

const diasSemana = ["D","L","M","M","J","V","S"];

const esLaboral = (fecha)=>{
  const d = new Date(fecha).getDay();
  return config.diasLaborales.includes(d);
};

const horas = [];
for(let h=config.inicio; h<=config.fin; h++){
  horas.push(h + ":00");
}

const citasFecha = (f)=>{
  return citas.filter(c=>c.fecha===f);
};

const diaLleno = (f)=>{
  return citasFecha(f).length >= horas.length;
};

const tieneCitas = (f)=>{
  return citas.some(c=>c.fecha===f);
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

// ESTADISTICAS
const totalCitas = citas.length;
const totalPacientes = pacientes.length;
const diasConCitas = [...new Set(citas.map(c=>c.fecha))].length;
const promedio = diasConCitas ? (totalCitas/diasConCitas).toFixed(1) : 0;

// ===================== MENU =====================
if(pagina==="menu"){
return(
<div style={container}>
<h1>Consultorio Médico</h1>

<button style={btn} onClick={()=>setPagina("pacientes")}>Pacientes</button>
<button style={btn} onClick={()=>setPagina("calendario")}>Calendario</button>
<button style={btn} onClick={()=>setPagina("config")}>Configuración</button>
<button style={btn} onClick={()=>setPagina("stats")}>Estadísticas</button>
</div>
);
}

// ===================== PACIENTES =====================
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

<button style={btn} onClick={guardarPaciente}>Guardar Paciente</button>

<h2>Lista Pacientes</h2>

{pacientes.map(p=>(
<div key={p.id} style={card}>
<b>{p.nombre}</b> - {p.telefono}

<button onClick={()=>toggleExpediente(p)}>Expediente</button>
<button onClick={()=>eliminarPaciente(p.id)}>Eliminar</button>

{pacienteSeleccionado?.id===p.id && (
<div style={expediente}>
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

// ===================== CALENDARIO =====================
if(pagina==="calendario"){
return(
<div style={container}>
<button style={btn} onClick={()=>setPagina("menu")}>Regresar</button>

<h2>
{fechaActual.toLocaleString("es-MX",{month:"long"})}
{" "}
{fechaActual.getFullYear()}
</h2>

<button onClick={()=>cambiarMes(-1)}>Mes anterior</button>
<button onClick={()=>cambiarMes(1)}>Mes siguiente</button>

<div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
{diasSemana.map(d=><div key={d}>{d}</div>)}
</div>

<div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
{[...Array(diasMes)].map((_,i)=>{
const dia=i+1;
const fecha=`${fechaActual.getFullYear()}-${fechaActual.getMonth()+1}-${dia}`;

let color="white";
if(!esLaboral(fecha)) color="#ccc";
else if(diaLleno(fecha)) color="red";
else if(tieneCitas(fecha)) color="green";

return(
<button key={i}
style={{background:color,margin:3,padding:10}}
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
{horas.map(h=>{
const ocupado=citas.some(c=>c.fecha===fechaSeleccionada && c.hora===h);
return(
<button key={h} disabled={ocupado} onClick={()=>agendar(h)}>
{h}
</button>
);
})}
</div>
</div>
)}

</div>
);
}

// ===================== CONFIG =====================
if(pagina==="config"){
return(
<div style={container}>
<button style={btn} onClick={()=>setPagina("menu")}>Regresar</button>

<h2>Días laborales</h2>

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

// ===================== STATS =====================
if(pagina==="stats"){
return(
<div style={container}>
<button style={btn} onClick={()=>setPagina("menu")}>Regresar</button>

<h2>Estadísticas</h2>
<p>Total citas: {totalCitas}</p>
<p>Total pacientes: {totalPacientes}</p>
<p>Días con citas: {diasConCitas}</p>
<p>Promedio citas por día: {promedio}</p>

</div>
);
}

}

const container={padding:30,fontFamily:"Arial"};
const btn={padding:10,margin:5,background:"#2c7be5",color:"white",border:"none"};
const input={display:"block",margin:5,padding:8,width:"300px"};
const card={border:"1px solid #ccc",padding:10,marginTop:10};
const expediente={background:"#f4f4f4",padding:10,marginTop:5};

export default App;