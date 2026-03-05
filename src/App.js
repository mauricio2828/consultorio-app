import { useState } from "react";
import "./App.css";

function App() {

  const [pagina, setPagina] = useState("menu");

  const [pacientes, setPacientes] = useState([]);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const agregarPaciente = () => {

    if(nombre === "" || telefono === ""){
      alert("Completa los datos");
      return;
    }

    const nuevo = {
      id: Date.now(),
      nombre,
      telefono
    };

    setPacientes([...pacientes, nuevo]);

    setNombre("");
    setTelefono("");
  };

  const eliminarPaciente = (id) => {

    const filtrados = pacientes.filter(p => p.id !== id);

    setPacientes(filtrados);
  };

  if(pagina === "menu"){
    return(

      <div style={{padding:40,fontFamily:"Arial"}}>

        <h1>Consultorio Médico</h1>

        <button onClick={()=>setPagina("pacientes")} style={boton}>Pacientes</button>

        <button onClick={()=>setPagina("citas")} style={boton}>Citas Médicas</button>

      </div>

    )
  }

  if(pagina === "pacientes"){
    return(

      <div style={{padding:40,fontFamily:"Arial"}}>

        <h2>Pacientes</h2>

        <button onClick={()=>setPagina("menu")} style={boton}>Volver</button>

        <h3>Agregar paciente</h3>

        <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e)=>setNombre(e.target.value)}
        />

        <br/><br/>

        <input
        placeholder="Teléfono"
        value={telefono}
        onChange={(e)=>setTelefono(e.target.value)}
        />

        <br/><br/>

        <button onClick={agregarPaciente} style={boton}>Guardar</button>

        <h3>Lista de pacientes</h3>

        {pacientes.map(p => (

          <div key={p.id} style={tarjeta}>

            <b>{p.nombre}</b>

            <p>{p.telefono}</p>

            <button onClick={()=>eliminarPaciente(p.id)} style={botonEliminar}>
              Eliminar
            </button>

          </div>

        ))}

      </div>

    )
  }

  if(pagina === "citas"){
    return(

      <div style={{padding:40,fontFamily:"Arial"}}>

        <h2>Citas Médicas</h2>

        <button onClick={()=>setPagina("menu")} style={boton}>Volver</button>

        <p>Calendario en desarrollo...</p>

      </div>

    )
  }

}

const boton = {

  padding:"12px 20px",
  margin:"10px",
  background:"#2c7be5",
  color:"white",
  border:"none",
  borderRadius:"8px",
  fontSize:"16px",
  cursor:"pointer"

};

const botonEliminar = {

  padding:"8px 15px",
  marginTop:"10px",
  background:"#e63757",
  color:"white",
  border:"none",
  borderRadius:"6px",
  cursor:"pointer"

};

const tarjeta = {

  border:"1px solid #ddd",
  padding:"15px",
  borderRadius:"10px",
  marginTop:"10px",
  width:"300px"

};

export default App;