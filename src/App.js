import { useState } from "react";

function App(){

const [pagina, setPagina] = useState("menu");

if(pagina === "menu"){
  return(
    <div style={{padding:40}}>
      <h1>MENU</h1>
      <button onClick={()=>setPagina("pacientes")}>Pacientes</button>
      <button onClick={()=>setPagina("citas")}>Citas</button>
      <button onClick={()=>setPagina("config")}>Config</button>
      <button onClick={()=>setPagina("stats")}>Stats</button>
    </div>
  );
}

if(pagina === "pacientes"){
  return(
    <div style={{padding:40}}>
      <h1>PACIENTES</h1>
      <button onClick={()=>setPagina("menu")}>Volver</button>
    </div>
  );
}

if(pagina === "citas"){
  return(
    <div style={{padding:40}}>
      <h1>CITAS</h1>
      <button onClick={()=>setPagina("menu")}>Volver</button>
    </div>
  );
}

if(pagina === "config"){
  return(
    <div style={{padding:40}}>
      <h1>CONFIGURACION</h1>
      <button onClick={()=>setPagina("menu")}>Volver</button>
    </div>
  );
}

if(pagina === "stats"){
  return(
    <div style={{padding:40}}>
      <h1>ESTADISTICAS</h1>
      <button onClick={()=>setPagina("menu")}>Volver</button>
    </div>
  );
}

}

export default App;