import './App.css';

function App() {
  return (
    <div style={{ padding: 30, fontFamily: 'Arial' }}>
      <h1>Consultorio Médico</h1>

      <p>Seleccione una opción:</p>

      <ul>
        <li>👨‍⚕️ Pacientes</li>
        <li>📅 Citas médicas</li>
      </ul>

      <p style={{ marginTop: 20, color: 'gray' }}>
        Los expedientes, tratamientos e historial clínico se gestionan dentro de cada paciente.
      </p>
    </div>
  );
}

export default App;
