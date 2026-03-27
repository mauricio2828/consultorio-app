import { useState, useEffect } from "react";
import "./App.css";

// ===== ESTILOS =====
const container = { padding: 20, fontFamily: "Arial" };
const btn = { padding: "10px 15px", margin: "5px", background: "#1976d2", color: "white", border: "none", borderRadius: "5px" };
const btnBack = { padding: "8px 12px", marginBottom: "10px", background: "gray", color: "white", border: "none", borderRadius: "5px" };
const input = { display: "block", margin: "5px 0", padding: "8px", width: "250px" };
const card = { border: "1px solid #ccc", padding: "10px", marginTop: "10px" };
const grid = { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "5px" };

// ===== APP =====
export default function App() {

  const [pagina, setPagina] = useState("menu");
  const [pacientes, setPacientes] = useState([]);
  const [citas, setCitas] = useState([]);
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
    notas:""
  });

  // ===== STORAGE =====
  useEffect(()=>{
    setPacientes(JSON.parse(localStorage.getItem("pacientes"))||[]);
    setCitas(JSON.parse(localStorage.getItem("citas"))||[]);
    setConfig(JSON.parse(localStorage.getItem("config"))||{
      inicio:9, fin:18, diasLaborales:[1,2,3,4,5]
    });
    setLogo(localStorage.getItem("logo"));
  },[]);

  useEffect(()=>localStorage.setItem("pacientes",JSON.stringify(pacientes)),[pacientes]);
  useEffect(()=>localStorage.setItem("citas",JSON.stringify(citas)),[citas]);
  useEffect(()=>localStorage.setItem("config",JSON.stringify(config)),[config]);
  useEffect(()=>{ if(logo) localStorage.setItem("logo",logo)},[logo]);

  // ===== PACIENTES =====
  const guardarPaciente = ()=>{
    if(!formPaciente.nombre) return;
    setPacientes([...pacientes,{id:Date.now(),...formPaciente}]);
    setFormPaciente({nombre:"",telefono:"",edad:"",direccion:"",notas:""});
  };

  const eliminarPaciente = (id)=>{
    setPacientes(pacientes.filter(p=>p.id!==id));
  };

  // ===== LOGO =====
  const cambiarLogo=(e)=>{
    const file=e.target.files[0];
    const reader=new FileReader();
    reader.onload=e=>setLogo(e.target.result);
    reader.readAsDataURL(file);
  };

  // ===== CALENDARIO =====
  const hoy = new Date();
  const [fechaSeleccionada,setFechaSeleccionada] = useState("");
  const [pacienteSeleccionado,setPacienteSeleccionado] = useState("");

  const diasSemana=["L","M","M","J","V","S","D"];
  const diasMes=new Date(hoy.getFullYear(),hoy.getMonth()+1,0).getDate();
  const primerDia=(new Date(hoy.getFullYear(),hoy.getMonth(),1).getDay()+6)%7;

  const horas=[];
  for(let h=config.inicio;h<=config.fin;h++){
    let hora=h>12?h-12:h;
    let ampm=h>=12?"PM":"AM";
    horas.push(`${hora}:00 ${ampm}`);
  }

  const citasFecha=(fecha)=>citas.filter(c=>c.fecha===fecha);

  const colorDia=(fecha)=>{
    const d=new Date(fecha);

    if(d.toDateString()===hoy.toDateString()) return "#ffe082";
    if(!config.diasLaborales.includes(d.getDay())) return "#ffcdd2";
    if(citasFecha(fecha).length>=horas.length) return "#ef5350";
    if(citasFecha(fecha).length>0) return "#a5d6a7";
    if(fechaSeleccionada===fecha) return "#90caf9";

    return "white";
  };

  const agendar=(hora)=>{
    if(!pacienteSeleccionado || !fechaSeleccionada) return;

    setCitas([...citas,{
      id:Date.now(),
      fecha:fechaSeleccionada,
      hora,
      paciente:pacienteSeleccionado
    }]);
  };

  // ===== MENÚ =====
  if(pagina==="menu"){
    return(
      <div style={container}>
        {logo && <img src={logo} alt="" width="120"/>}
        <h1>Consultorio</h1>

        <button style={btn} onClick={()=>setPagina("pacientes")}>Pacientes</button>
        <button style={btn} onClick={()=>setPagina("citas")}>Citas</button>
        <button style={btn} onClick={()=>setPagina("config")}>Configuración</button>
        <button style={btn} onClick={()=>setPagina("stats")}>Estadísticas</button>
      </div>
    );
  }

  // ===== PACIENTES =====
  if(pagina==="pacientes"){
    return(
      <div style={container}>
        <button style={btnBack} onClick={()=>setPagina("menu")}>← Regresar</button>

        <h2>Nuevo Paciente</h2>
        <input style={input} placeholder="Nombre" value={formPaciente.nombre}
          onChange={(e)=>setFormPaciente({...formPaciente,nombre:e.target.value})}/>
        <input style={input} placeholder="Teléfono" value={formPaciente.telefono}
          onChange={(e)=>setFormPaciente({...formPaciente,telefono:e.target.value})}/>
        <input style={input} placeholder="Edad" value={formPaciente.edad}
          onChange={(e)=>setFormPaciente({...formPaciente,edad:e.target.value})}/>
        <input style={input} placeholder="Dirección" value={formPaciente.direccion}
          onChange={(e)=>setFormPaciente({...formPaciente,direccion:e.target.value})}/>
        <input style={input} placeholder="Notas" value={formPaciente.notas}
          onChange={(e)=>setFormPaciente({...formPaciente,notas:e.target.value})}/>

        <button style={btn} onClick={guardarPaciente}>Guardar</button>

        <h2>Lista Pacientes</h2>
        {pacientes.map(p=>(
          <div key={p.id} style={card}>
            <b>{p.nombre}</b>
            <p>{p.telefono}</p>
            <button style={btn} onClick={()=>eliminarPaciente(p.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    );
  }

  // ===== CITAS =====
  if(pagina==="citas"){
    return(
      <div style={container}>
        <button style={btnBack} onClick={()=>setPagina("menu")}>← Regresar</button>

        <h2>Calendario</h2>

        <div style={grid}>
          {diasSemana.map((d,i)=><div key={i}>{d}</div>)}
          {[...Array(primerDia)].map((_,i)=><div key={i}></div>)}

          {[...Array(diasMes)].map((_,i)=>{
            const dia=i+1;
            const fecha=`${hoy.getFullYear()}-${hoy.getMonth()+1}-${dia}`;
            return(
              <button key={i}
                style={{background:colorDia(fecha)}}
                onClick={()=>setFechaSeleccionada(fecha)}>
                {dia}
              </button>
            );
          })}
        </div>

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
            {horas.map(h=>(
              <button key={h} style={btn} onClick={()=>agendar(h)}>{h}</button>
            ))}
          </>
        )}
      </div>
    );
  }

  // ===== CONFIG =====
  if(pagina==="config"){
    return(
      <div style={container}>
        <button style={btnBack} onClick={()=>setPagina("menu")}>← Regresar</button>

        <h2>Configuración</h2>
        <input type="file" onChange={cambiarLogo}/>

        <h3>Días laborales</h3>
        {["Dom","Lun","Mar","Mie","Jue","Vie","Sab"].map((d,i)=>(
          <button key={i}
            style={{...btn,background:config.diasLaborales.includes(i)?"green":"gray"}}
            onClick={()=>{
              if(config.diasLaborales.includes(i)){
                setConfig({...config,diasLaborales:config.diasLaborales.filter(x=>x!==i)});
              }else{
                setConfig({...config,diasLaborales:[...config.diasLaborales,i]});
              }
            }}>
            {d}
          </button>
        ))}
      </div>
    );
  }

  // ===== STATS =====
  if(pagina==="stats"){
    return(
      <div style={container}>
        <button style={btnBack} onClick={()=>setPagina("menu")}>← Regresar</button>
        <h2>Estadísticas</h2>
        <p>Total pacientes: {pacientes.length}</p>
        <p>Total citas: {citas.length}</p>
      </div>
    );
  }

  return null;
}