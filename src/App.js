import { useState, useEffect } from "react";
import "./App.css";

// ===== ESTILOS =====
const container={padding:30,fontFamily:"Arial"};
const btn={padding:"10px 15px",margin:"5px",background:"#2c7be5",color:"white",border:"none",borderRadius:"6px"};
const btnSmall={padding:"5px 10px",margin:"3px"};
const input={display:"block",margin:"5px",padding:"8px",width:"250px"};
const card={border:"1px solid #ccc",padding:"10px",marginTop:"10px"};
const grid={display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"5px"};

// ===== COMPONENTES =====

function Menu({setPagina,logo}){
  return(
    <div style={container}>
      {logo && <img src={logo} alt="" width="120"/>}
      <h1>Consultorio</h1>
      <button style={btn} onClick={()=>setPagina("pacientes")}>Pacientes</button>
      <button style={btn} onClick={()=>setPagina("citas")}>Citas</button>
      <button style={btn} onClick={()=>setPagina("config")}>Configuración</button>
    </div>
  );
}

function Pacientes({
  pacientes,setPacientes,
  formPaciente,setFormPaciente,
  guardarPaciente,
  actualizarPaciente
}){
  const eliminarPaciente = (id)=>{
    setPacientes(pacientes.filter(p=>p.id!==id));
  };

  return(
    <div style={container}>
      <h2>Pacientes</h2>

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

      <button style={btn} onClick={guardarPaciente}>Guardar</button>

      {pacientes.map(p=>(
        <div key={p.id} style={card}>
          <b>{p.nombre}</b>

          <input style={input}
            value={p.telefono}
            onChange={(e)=>actualizarPaciente(p.id,"telefono",e.target.value)}
          />

          <button style={btnSmall} onClick={()=>eliminarPaciente(p.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}

function Config({config,setConfig,cambiarLogo}){
  const toggleDia=(d)=>{
    if(config.diasLaborales.includes(d)){
      setConfig(prev=>({
        ...prev,
        diasLaborales: prev.diasLaborales.filter(x=>x!==d)
      }));
    }else{
      setConfig(prev=>({
        ...prev,
        diasLaborales: [...prev.diasLaborales,d]
      }));
    }
  };

  return(
    <div style={container}>
      <h2>Configuración</h2>

      <input type="file" onChange={cambiarLogo}/>

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

function Citas({
  pacientes,
  citas,setCitas,
  config
}){
  const hoy=new Date();
  const [fechaSeleccionada,setFechaSeleccionada]=useState("");
  const [pacienteSeleccionado,setPacienteSeleccionado]=useState("");

  const diasSemana=["L","M","M","J","V","S","D"];
  const diasEnMes=new Date(hoy.getFullYear(),hoy.getMonth()+1,0).getDate();
  const primerDia=(new Date(hoy.getFullYear(),hoy.getMonth(),1).getDay()+6)%7;

  const horas=[];
  for(let h=config.inicio;h<=config.fin;h++){
    let hora=h>12?h-12:h;
    let ampm=h>=12?"PM":"AM";
    horas.push(`${hora}:00 ${ampm}`);
  }

  const agendar=(hora)=>{
    if(!pacienteSeleccionado||!fechaSeleccionada) return;

    setCitas(prev=>[...prev,{
      id:Date.now(),
      fecha:fechaSeleccionada,
      hora,
      paciente:pacienteSeleccionado
    }]);
  };

  return(
    <div style={container}>
      <h2>Citas</h2>

      <div style={grid}>
        {diasSemana.map((d,i)=><div key={i}>{d}</div>)}
        {[...Array(primerDia)].map((_,i)=><div key={i}></div>)}

        {[...Array(diasEnMes)].map((_,i)=>{
          const dia=i+1;
          const fecha=`${hoy.getFullYear()}-${hoy.getMonth()+1}-${dia}`;
          return(
            <button key={i} onClick={()=>setFechaSeleccionada(fecha)}>
              {dia}
            </button>
          );
        })}
      </div>

      {fechaSeleccionada && (
        <>
          <select onChange={(e)=>setPacienteSeleccionado(e.target.value)}>
            <option value="">Paciente</option>
            {pacientes.map(p=>(
              <option key={p.id} value={p.nombre}>{p.nombre}</option>
            ))}
          </select>

          <div>
            {horas.map(h=>(
              <button key={h} onClick={()=>agendar(h)}>{h}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ===== APP =====
export default function App(){

  const [pagina,setPagina]=useState("menu");
  const [pacientes,setPacientes]=useState([]);
  const [citas,setCitas]=useState([]);
  const [logo,setLogo]=useState(null);

  const [config,setConfig]=useState({
    inicio:9,
    fin:18,
    diasLaborales:[1,2,3,4,5]
  });

  const [formPaciente,setFormPaciente]=useState({
    nombre:"",
    telefono:"",
    edad:""
  });

  useEffect(()=>{
    setPacientes(JSON.parse(localStorage.getItem("pacientes"))||[]);
    setCitas(JSON.parse(localStorage.getItem("citas"))||[]);
    setConfig(JSON.parse(localStorage.getItem("config"))||{
      inicio:9,fin:18,diasLaborales:[1,2,3,4,5]
    });
  },[]);

  useEffect(()=>localStorage.setItem("pacientes",JSON.stringify(pacientes)),[pacientes]);
  useEffect(()=>localStorage.setItem("citas",JSON.stringify(citas)),[citas]);
  useEffect(()=>localStorage.setItem("config",JSON.stringify(config)),[config]);

  const guardarPaciente=()=>{
    if(!formPaciente.nombre) return;
    setPacientes(prev=>[...prev,{id:Date.now(),...formPaciente}]);
    setFormPaciente({nombre:"",telefono:"",edad:""});
  };

  const actualizarPaciente=(id,campo,valor)=>{
    setPacientes(prev=>prev.map(p=>p.id===id?{...p,[campo]:valor}:p));
  };

  const cambiarLogo=(e)=>{
    const file=e.target.files[0];
    if(!file) return;
    const reader=new FileReader();
    reader.onload=e=>setLogo(e.target.result);
    reader.readAsDataURL(file);
  };

  if(pagina==="menu") return <Menu setPagina={setPagina} logo={logo}/>
  if(pagina==="pacientes") return <Pacientes
      pacientes={pacientes}
      setPacientes={setPacientes}
      formPaciente={formPaciente}
      setFormPaciente={setFormPaciente}
      guardarPaciente={guardarPaciente}
      actualizarPaciente={actualizarPaciente}
  />
  if(pagina==="citas") return <Citas
      pacientes={pacientes}
      citas={citas}
      setCitas={setCitas}
      config={config}
  />
  if(pagina==="config") return <Config
      config={config}
      setConfig={setConfig}
      cambiarLogo={cambiarLogo}
  />

  return null;
}