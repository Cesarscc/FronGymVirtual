import { useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./Style/Dashboard.css";
import Deportes from "./Deportes";
import Footer from "./Footer";

import "./Style/prueba.css";
import { AudioFilled } from "@ant-design/icons";
import Titulo from "./Titulo";

function Dashboard() {
  let usuariobj = localStorage.getItem("usuario");
  if (!usuariobj) {
    window.location.replace = "/login";
  }

  const commands = [
    {
      command: "gymvirtual *",
      callback: (website) => {
        //window.open("http://" + website.split(" ").join(""));
        window.location.replace("/Piernas/Niveles");
      },
    },
    {
      /*command: "color *",
      callback: (color) => {
        document.body.style.background = color;
      },*/
    },
    {
      command: "borrar",
      callback: () => {
        handleReset();
      },
    },
    {
      command: "resetear color",
      callback: () => {
        document.body.style.background = `rgba(0, 0, 0, 0.8)`;
      },
    },
  ];
  const { transcript, resetTranscript } = useSpeechRecognition({ commands });
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef(null);


  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  }

  let nombres = [
    "ejercicio piernas",
    "ejercicio tríceps",
    "ejercicio abdominales",
    "ir a perfil",
    "cerrar sesión",
  ];

  if (transcript === nombres[0]) {
    window.location.replace("/Piernas/Niveles");
  }

  if (transcript === nombres[1]) {
    window.location.replace("/Tríceps/Niveles");
  }

  if (transcript === nombres[2]) {
    window.location.replace("/Abdominales/Niveles");
  }

  if (transcript === nombres[3]) {
    window.location.replace("/perfil");
  }
  
  if (transcript === nombres[4]) {
    localStorage.clear();
    window.location.replace = "/login";
  }

  const handleListing = () => {
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true,
    });
  };

  const stopHandle = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
    console.log(transcript);
  };
  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };

  return (
    <div className="App">
      <Titulo />

      <div className="microfono">
        <h2 className="mensaje">¡Hora de Entrenar!</h2>
        <button
              className="microphone-icon-container"
              ref={microphoneRef}
              onClick={handleListing}
            >
              <AudioFilled />
            </button>
      </div>
      <div>
            
      </div>

      <Deportes />

      <footer className="foot">
        <Footer />
      </footer>
    </div>
  );
}

export default Dashboard;