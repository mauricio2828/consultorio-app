import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [pagina, setPagina] = useState("menu");

  const [pacientes, setPacientes] = useState([]);
  const [citas, setCitas] = useState([]);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  // Cargar datos guardados
  useEffect(() => {
    const p = localStorage.getItem("pacientes");
    const c = localStorage.getItem("citas");

    if (p) setPacientes(JSON.parse(p));
    if (c) setCitas(JSON.parse(c));
  }, []);

  // Guardar datos
  useEffect(() => {
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
  }, [pacientes]);

  useEffect(() => {
    localStorage.setItem("citas", JSON.stringify(citas));
  }, [citas]);

  // PACIENTES
  const agregarPaciente = () => {
    if (!nombre || !telefono) return alert("Completa datos");

    const nuevo = {
      id: Date.now(),
      nombre,
      telefono,
      notas: "",
      tratamientos: []
    };

    setPacientes([...pacientes, nuevo]);
    setNombre("");
    setTelefono("");
  };

  const eliminarPaciente = (id) => {
    setPacientes(pacientes.filter(p => p.id !== id));
  };

  // CITAS
  const horas = [];
  for (let h = 9; h <= 18; h++) {
    const hora12 = h > 12 ? h - 12 : h;
    const ampm = h >= 12 ? "PM" : "AM";
    horas.push(`${hora12}:00 ${ampm}`);
  }

  const agendarCita = (hora) => {
    if (!pacienteSeleccionado) return alert("Selecciona paciente");

    const nueva = {
      id: Date.now(),
      dia: diaSeleccionado,
      hora,
      paciente: pacienteSeleccionado.nombre
    };

    setCitas([...citas, nueva]);
  };

  const cancelarCita = (id) => {
    setCitas(citas.filter(c => c.id !== id));
  };

  const citasDelDia = citas.filter(c => c.dia === diaSeleccionado);

  // MENÚ
  if (pagina === "menu") {
    return (
      <div style={container}>
        <h1>Consultorio Médico V2</h1>

        <button style={boton} onClick={() => setPagina("pacientes")}>Pacientes</button>
        <button style={boton} onClick={() => setPagina("citas")}>Citas Médicas</button>
      </div>
    );
  }

  // PACIENTES
  if (pagina === "pacientes") {
    return (
      <div style={container}>

        <h2>Pacientes</h2>
        <button style={boton} onClick={() => setPagina("menu")}>Volver</button>

        <h3>Agregar paciente</h3>

        <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
        <br /><br />
        <input placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} />
        <br /><br />
        <button style={boton} onClick={agregarPaciente}>Guardar</button>

        <h3>Lista</h3>

        {pacientes.map(p => (
          <div key={p.id} style={card}>

            <b>{p.nombre}</b>
            <p>{p.telefono}</p>

            <button style={botonPeq} onClick={() => setPacienteSeleccionado(p)}>
              Ver expediente
            </button>

            <button style={botonEliminar} onClick={() => eliminarPaciente(p.id)}>
              Eliminar
            </button>

          </div>
        ))}

        {/* EXPEDIENTE */}
        {pacienteSeleccionado && (
          <div style={cardGrande}>
            <h3>Expediente: {pacienteSeleccionado.nombre}</h3>

            <textarea
              placeholder="Notas médicas"
              value={pacienteSeleccionado.notas}
              onChange={(e) => {
                const actualizado = pacientes.map(p =>
                  p.id === pacienteSeleccionado.id
                    ? { ...p, notas: e.target.value }
                    : p
                );
                setPacientes(actualizado);
                setPacienteSeleccionado({ ...pacienteSeleccionado, notas: e.target.value });
              }}
            />

          </div>
        )}

      </div>
    );
  }

  // CITAS
  if (pagina === "citas") {
    return (
      <div style={container}>

        <h2>Citas Médicas</h2>
        <button style={boton} onClick={() => setPagina("menu")}>Volver</button>

        <h3>Selecciona día</h3>

        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {[...Array(30)].map((_, i) => (
            <button
              key={i}
              style={diaBtn}
              onClick={() => setDiaSeleccionado(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {diaSeleccionado && (
          <>
            <h3>Día {diaSeleccionado}</h3>

            <select onChange={(e) => {
              const p = pacientes.find(x => x.id == e.target.value);
              setPacienteSeleccionado(p);
            }}>
              <option>Seleccionar paciente</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>

            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {horas.map(h => {

                const ocupado = citas.some(c => c.dia === diaSeleccionado && c.hora === h);

                return (
                  <button
                    key={h}
                    style={{
                      ...horaBtn,
                      background: ocupado ? "#ccc" : "#2c7be5"
                    }}
                    disabled={ocupado}
                    onClick={() => agendarCita(h)}
                  >
                    {h}
                  </button>
                );
              })}
            </div>

            <h3>Citas del día</h3>

            {citasDelDia.map(c => (
              <div key={c.id} style={card}>
                {c.hora} - {c.paciente}
                <br />
                <button style={botonEliminar} onClick={() => cancelarCita(c.id)}>
                  Cancelar
                </button>
              </div>
            ))}

          </>
        )}

      </div>
    );
  }

}

const container = {
  padding: 30,
  fontFamily: "Arial"
};

const boton = {
  padding: "12px 20px",
  margin: "10px",
  background: "#2c7be5",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px"
};

const botonPeq = {
  marginRight: "10px",
  padding: "6px 10px"
};

const botonEliminar = {
  background: "red",
  color: "white",
  padding: "6px 10px",
  border: "none"
};

const card = {
  border: "1px solid #ddd",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px"
};

const cardGrande = {
  border: "2px solid #2c7be5",
  padding: "20px",
  marginTop: "20px"
};

const diaBtn = {
  margin: "5px",
  padding: "10px"
};

const horaBtn = {
  margin: "5px",
  padding: "10px",
  color: "white",
  border: "none"
};

export default App;