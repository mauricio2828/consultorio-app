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
  borderRadius: "8px",
  cursor: "pointer"
};

const input = { display: "block", margin: "5px 0", padding: "8px", width: "250px" };
const card = { border: "1px solid #ccc", padding: "10px", marginTop: "10px" };
const grid = { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "5px" };

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

  // STORAGE
  useEffect(()=>{
    setPacientes(JSON.parse(localStorage.getItem("pacientes"))||[]);
    setCitas(JSON.parse(localStorage.getItem("citas"))||[]);
    setConfig(JSON.parse(localStorage.getItem("config"))||{
      inicio:9, fin:18, diasLaborales:[1,2,3,4,5], multiplePorHora:false
    });
    setLogo(localStorage.getItem("logo"));
  },[]);

  useEffect(()=>localStorage.setItem("pacientes",JSON.stringify(pacientes)),[pacientes]);
  useEffect(()=>localStorage.setItem("citas",JSON.stringify(citas)),[citas]);
  useEffect(()=>localStorage.setItem("config",JSON.stringify(config)),[config]);
  useEffect(()=>{ if(logo) localStorage.setItem("logo",logo)},[logo]);

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

  const reagendarCita = (cita)=>{
    setPacienteSeleccionado(cita.paciente);
    setFechaSeleccionada(cita.fecha);
    setCitas(citas.filter(c=>c.id !== cita.id));
  };

  const horaOcupada = (hora)=>{
    return citas.some(c=>c.fecha===fechaSeleccionada && c.hora===hora);
  };

  const agendar=(hora)=>{
    if(!pacienteSeleccionado || !fechaSeleccionada) return;

    if(!config.multiplePorHora){
      const existe = citas.some(
        c => c.fecha === fechaSeleccionada && c.hora === hora
      );
      if(existe) return;
    }

    setCitas([...citas,{
      id:Date.now(),
      fecha:fechaSeleccionada,
      hora,
      paciente:pacienteSeleccionado
    }]);
  };

  // LOGO
  const cambiarLogo=(e)=>{
    const file=e.target.files[0];
    const reader=new FileReader();
    reader.onload=e=>setLogo(e.target.result);
    reader.readAsDataURL(file);
  };

  // CALENDARIO
  const hoy = new Date();
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

  const exportarExcel = () => {
    if(!fechaSeleccionada) return;

    let texto = "Hora,Paciente\n";

    horas.forEach(h => {
      const cita = citas.find(c => c.fecha === fechaSeleccionada && c.hora === h);
      texto += `${h},${cita ? cita.paciente : ""}\n`;
    });

    const blob = new Blob([texto], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Horario.csv";
    a.click();
  };

  // MENU
  if(pagina==="menu"){
    return(
      <div style={container}>
        {logo && <img src={logo} alt="" width="120"/>}
        <h1>Consultorio</h1>

        <button style={btn} onClick={()=>setPagina("pacientes")}>👤 Pacientes</button>
        <button style={btn} onClick={()=>setPagina("citas")}>📅 Citas</button>
        <button style={btn} onClick={()=>setPagina("config")}>⚙️ Configuración</button>
        <button style={btn} onClick={()=>setPagina("stats")}>📊 Estadísticas</button>
      </div>
    );
  }

  // CITAS
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

            <button style={btn} onClick={exportarExcel}>
              Exportar Excel del día
            </button>

            <h3>Citas del día</h3>
            {citas
              .filter(c=>c.fecha === fechaSeleccionada)
              .map(c=>(
                <div key={c.id} style={card}>
                  <b>{c.hora}</b> - {c.paciente}
                  <br/>
                  <button style={{...btn, background:"red"}}
                    onClick={()=>cancelarCita(c.id)}>
                    Cancelar
                  </button>

                  <button style={{...btn, background:"orange"}}
                    onClick={()=>reagendarCita(c)}>
                    Reagendar
                  </button>
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

        <h3>Múltiples pacientes por hora</h3>
        <button
          style={{...btn, background: config.multiplePorHora ? "green" : "gray"}}
          onClick={()=>setConfig({...config, multiplePorHora: !config.multiplePorHora})}
        >
          {config.multiplePorHora ? "Activado" : "Desactivado"}
        </button>
      </div>
    );
  }

  // STATS
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