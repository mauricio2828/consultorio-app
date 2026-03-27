import { useState, useEffect } from "react";
import "./App.css";

function App() {

const hoy = new Date();

const [pagina, setPagina] = useState("menu");
const [pacientes, setPacientes] = useState([]);
const [citas, setCitas] = useState([]);

const [expedienteAbierto, setExpedienteAbierto] = useState(null);
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

// ===== STORAGE =====
useEffect(()=>{
  try{
    setPacientes(JSON.parse(localStorage.getItem("pacientes")) || []);
    setCitas(JSON.parse(localStorage.getItem("citas")) || []);

    const conf = JSON.parse(localStorage.getItem("config"));
    if(conf) setConfig(conf);

    const l = localStorage.getItem("logo");
    if(l) setLogo(l);

  }catch{
    localStorage.clear();
  }
},[]);

useEffect(()=>localStorage.setItem("pacientes",JSON.stringify(pacientes)),[pacientes]);
useEffect(()=>localStorage.setItem("citas",JSON.stringify(citas)),[citas]);
useEffect(()=>localStorage.setItem("config",JSON.stringify(config)),[config]);
useEffect(()=>{if(logo)localStorage.setItem("logo",logo)},[logo]);

// ===== LOGO =====
const cambiarLogo = (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e=>setLogo(e.target.result);
  reader.readAsDataURL(file);
};

// ===== PACIENTES =====
const guardarPaciente = ()=>{
  if(!formPaciente.nombre) return;

  setPacientes([...pacientes,{ id:Date.now(), ...formPaciente }]);

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

const actualizarPaciente = (id,campo,valor)=>{
  setPacientes(pacientes.map(p=>p.id===id ? {...p,[campo]:valor}:p));
};

const toggleExpediente = (id)=>{
  setExpedienteAbierto(expedienteAbierto===id?null:id);
};

// ===== HORAS 12H =====
const horas = [];
for(let h=config.inicio; h<=config.fin; h++){
  let hora = h > 12 ? h-12 : h;
  let ampm = h >= 12 ? "PM" : "AM";
  horas.push(`${hora}:00 ${ampm}`);
}

// ===== CALENDARIO =====
const diasSemana = ["L","M","M","J","V","S","D"];
const diasEnMes = new Date(anio, mes+1, 0).getDate();
const primerDia = (new Date(anio, mes, 1).getDay()+6)%7;

const citasFecha = (fecha)=>citas.filter(c=>c.fecha===fecha);

const colorDia = (fecha)=>{
  const d = new Date(fecha);

  if(d.toDateString()===hoy.toDateString()) return "#ffe082";
  if(!config.diasLaborales.includes(d.getDay())) return "#ffcdd2";
  if(citasFecha(fecha).length>=horas.length) return "#ff5252";
  if(citasFecha(fecha).length>0) return "#a5d6a7";
  if(fechaSeleccionada===fecha) return "#90caf9";

  return "white";
};

// ===== AGENDAR =====
const agendar = (hora)=>{
  if(!pacienteSeleccionado || !fechaSeleccionada) return;

  const existe = citas.some(c=>c.fecha===fechaSeleccionada && c.hora===hora);
  if(existe) return;

  setCitas([...citas,{
    id:Date.now(),
    fecha:fechaSeleccionada,
    hora,
    paciente:pacienteSeleccionado.nombre
  }]);
};

// ===== MENU =====
function Menu(){
  return(
    <div style={container}>
      {logo && <img src={logo} alt="" style={{width:120}} />}
      <h1>Consultorio Médico</h1>

      <button style={btn} onClick={()=>setPagina("pacientes")}>👤 Pacientes</button>
      <button style={btn} onClick={()=>setPagina("citas")}>📅 Citas</button>
      <button style={btn} onClick={()=>setPagina("config")}>⚙️ Configuración</button>
      <button style={btn} onClick={()=>setPagina("stats")}>📊 Estadísticas</button>
    </div>
  );
}

// ===== PACIENTES =====
function Pacientes(){
  return(
    <div style={container}>
      <button style={btn} onClick={()=>setPagina("menu")}>← Volver</button>

      <h2>Nuevo Paciente</h2>

      {Object.keys(formPaciente).map((campo)=>(
        <input key={campo}
          style={input}
          placeholder={campo}
          value={formPaciente[campo]}
          onChange={(e)=>setFormPaciente({...formPaciente,[campo]:e.target.value})}
        />
      ))}

      <button style={btn} onClick={guardarPaciente}>Guardar</button>

      <h2>Pacientes</h2>

      {pacientes.map(p=>(
        <div key={p.id} style={card}>
          <b onClick={()=>setPacienteSeleccionado(p)}>{p.nombre}</b>

          <button style={btnSmall} onClick={()=>toggleExpediente(p.id)}>Expediente</button>

          {expedienteAbierto===p.id && (
            <div style={expediente}>
              {Object.keys(formPaciente).map(campo=>(
                <input key={campo}
                  style={inputSmall}
                  value={p[campo]}
                  onChange={(e)=>actualizarPaciente(p.id,campo,e.target.value)}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ===== CITAS =====
function Citas(){
  return(
    <div style={container}>
      <button style={btn} onClick={()=>setPagina("menu")}>← Volver</button>

      <h2>Calendario</h2>

      <select value={mes} onChange={(e)=>setMes(Number(e.target.value))}>
        {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map((m,i)=>(
          <option key={i} value={i}>{m}</option>
        ))}
      </select>

      <select value={anio} onChange={(e)=>setAnio(Number(e.target.value))}>
        {[2024,2025,2026,2027,2028].map(a=><option key={a}>{a}</option>)}
      </select>

      <div style={grid}>
        {diasSemana.map((d,i)=><div key={i} style={dayHeader}>{d}</div>)}

        {[...Array(primerDia)].map((_,i)=><div key={i}></div>)}

        {[...Array(diasEnMes)].map((_,i)=>{
          const dia=i+1;
          const fecha=`${anio}-${mes+1}-${dia}`;

          return(
            <button key={i}
              style={{...dayBtn, background:colorDia(fecha)}}
              onClick={()=>setFechaSeleccionada(fecha)}
            >
              {dia}
            </button>
          );
        })}
      </div>

      {fechaSeleccionada && (
        <>
          <h3>Seleccionar paciente</h3>

          <select onChange={(e)=>{
            const p = pacientes.find(x=>x.id===Number(e.target.value));
            setPacienteSeleccionado(p);
          }}>
            <option>Seleccionar</option>
            {pacientes.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>

          <h3>Horas</h3>
          {horas.map(h=>(
            <button key={h} style={btnSmall} onClick={()=>agendar(h)}>
              {h}
            </button>
          ))}
        </>
      )}
    </div>
  );
}

// ===== CONFIG =====
function Config(){
  const toggleDia=(d)=>{
    if(config.diasLaborales.includes(d)){
      setConfig({...config,diasLaborales:config.diasLaborales.filter(x=>x!==d)});
    }else{
      setConfig({...config,diasLaborales:[...config.diasLaborales,d]});
    }
  };

  return(
    <div style={container}>
      <button style={btn} onClick={()=>setPagina("menu")}>← Volver</button>

      <h2>Configuración</h2>

      <input type="file" onChange={cambiarLogo} />

      <h3>Días laborales</h3>
      {["Dom","Lun","Mar","Mie","Jue","Vie","Sab"].map((d,i)=>(
        <button key={i}
          style={{...btnSmall,background:config.diasLaborales.includes(i)?"green":"gray"}}
          onClick={()=>toggleDia(i)}
        >
          {d}
        </button>
      ))}
    </div>
  );
}

// ===== STATS =====
function Stats(){
  return(
    <div style={container}>
      <button style={btn} onClick={()=>setPagina("menu")}>← Volver</button>
      <h2>Estadísticas</h2>
      <p>Pacientes: {pacientes.length}</p>
      <p>Citas: {citas.length}</p>
    </div>
  );
}

// ===== ROUTER =====
if(pagina==="menu") return <Menu/>
if(pagina==="pacientes") return <Pacientes/>
if(pagina==="citas") return <Citas/>
if(pagina==="config") return <Config/>
if(pagina==="stats") return <Stats/>

return null;
}

// ===== ESTILOS =====
const container={padding:30,fontFamily:"Arial"};
const btn={padding:"12px 20px",margin:"10px",background:"#2c7be5",color:"white",border:"none",borderRadius:"8px"};
const btnSmall={padding:"6px 10px",margin:"5px"};
const input={display:"block",margin:"5px",padding:"8px",width:"300px"};
const inputSmall={display:"block",margin:"3px",padding:"5px",width:"200px"};
const card={border:"1px solid #ddd",padding:"10px",marginTop:"10px",borderRadius:"8px"};
const expediente={background:"#f4f4f4",padding:"10px",marginTop:"5px"};

const grid={display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"5px"};
const dayHeader={textAlign:"center",fontWeight:"bold"};
const dayBtn={padding:"10px",border:"1px solid #ccc"};

export default App;