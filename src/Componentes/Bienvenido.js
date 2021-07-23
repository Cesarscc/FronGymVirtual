import "./Style/Bienvenido.css";
import React from "react";
import "antd/dist/antd.css";
import imagen from "../images/triceps.jpg";
import titulo from "../images/titulo.png";
import { AudioFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function Bienvenido() {
  const commands = [
    {
      command: "gymvirtual *",
      callback: (website) => {
        //window.open("http://" + website.split(" ").join(""));
        window.location.replace(`/Piernas/Niveles`);
      },
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

  let nombres = ["comenzar"];

  if (transcript === nombres[0]) {
    window.location.replace(`/login`);
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
  //###################################

  return (
    <div className="App">
      <img className="titulo-bienvenido" src={titulo} alt="" />
      <img className="fondo" src={imagen} alt="" />

      <div className="welcome">BIENVENID@</div>
      <p>
        Disfruta de la aplicación GYM VIRTUAL para seguir rutinas de
        entrenamiento de un nivel básico hasta avanzado.
        <br />
        ¡Simplemente todo lo que necesitas!
      </p>

      <div>
        <button
          className="btn-micro"
          ref={microphoneRef}
          onClick={handleListing}
        >
          <AudioFilled />
        </button>
      </div>
      <br/>
      <div>
        <Link to={'/login'}>
          <button type="button" class="btn btn-outline-primary">
            COMENZAR
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Bienvenido;
