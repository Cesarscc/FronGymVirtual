import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import "./Style/Primer_basico.css";
import "./Style/Basico.css";
import { useParams } from "react-router-dom";
import Titulo from "./Titulo"

import { Modal } from "antd";
import CancelIcon from '@material-ui/icons/Cancel';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import RestoreIcon from '@material-ui/icons/Restore';
const API_REACT_URL = "https://app-gymvirtual.herokuapp.com";


const Primer_Basico = () => {
  let userobj = localStorage.getItem("usuario");
  let routineobj = localStorage.getItem("rutina");
  
  if (!userobj) {
    window.location.replace = "/login";
  }

  let usuario = JSON.parse(userobj);
  let rutina = JSON.parse(routineobj);

  const coins = rutina.ganancia;
  const len = rutina.tamaño;
  
  const [ex, setEx] = useState(null);
  const [item, setItem] = useState(null);

  let match = useParams();
  const id = match.idRoutine;
  const i = match.idExercise;
  
  console.log(id, i);

  useEffect(() => {
    return fetch(`${API_REACT_URL}/api/routine/${id}`, {
      crossDomain: true,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          setEx(data);
        }
      })
      .catch((error) => console.log(error));
  }, [id]);

  useEffect(() => {
    if (ex !== null) {
      return fetch(`${API_REACT_URL}/api/exercise/${ex.exerciseIds[i]}`, {
        crossDomain: true,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) {
            console.log(data);
            setItem(data);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [ex, i]);

  const [time, setTime] = useState(2000)  //el numero representa 300 segundos = 5 min
  const [timerOn, setTimeOn] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    let interval = null;

    if (timerOn && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 10)
      }, 10)
    } else {
      if(item !== null){
        setTime(parseInt(item.time) * 1000);
        clearInterval(interval);
      }
    }

    if (time === 0) { // segundos = cero
      reset();
      vent_emergente();
      clearInterval(interval);
    }

    return ()=>clearInterval(interval)

  }, [time,timerOn, item])

  function vent_emergente() {
    if (i < len){
      setIsModalVisible(true);
    }
    else{
      final();
    }
  }

  function reset() {
    setTime(0);// pisa el estado 'segundos' con cero
    setTimeOn(false); // pisa el estado 'activo' con false
    setTimeOn(true);
  }

  const handleOk = () => {
    setIsModalVisible(false);
    changeData();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    final();
  };

  const changeData = () => {
    if (i < len){
      let j = parseInt(i) + 1;
      let newCoins = parseInt(coins) + item.coins;
      const rutina = {
        tamaño: ex.exerciseIds.length - 1,
        ganancia: newCoins
      }
      //console.log(rutina);
      localStorage.setItem("rutina", JSON.stringify(rutina));
      window.location.href = `/rutina/${id}/${j}`;
    }
    else{
      final();
    }
  }

  const passPanel = () => {
    if (i < len){
      let j = parseInt(i) + 1;
      window.location.href = `/rutina/${id}/${j}`;
    }
    else{
      let secondsToGo = 5;
      const modal = Modal.info({
        title: '¡Nos irá mejor la próxima vez!',
        content: `Monedas obtenidas: ${coins}`,
        onOk() {
          window.location.href = `/dashboard`;
        },
      });
      const timer = setInterval(() => {
        secondsToGo -= 1;
      }, 1000);
      setTimeout(() => {
        clearInterval(timer);
        modal.destroy();
        window.location.href = `/dashboard`;
      }, secondsToGo * 1000);
  
  }
  }

const final = () => {
  let secondsToGo = 5;
  let newCoins = parseInt(coins) + item.coins;
  const modal = Modal.success({
    title: '¡Lo lograste!',
    content: `Monedas obtenidas: ${newCoins}`,
    onOk() {
      usuario.coins = parseInt(usuario.coins) + newCoins;
      updateUser(usuario._id, usuario);
      window.location.href = `/dashboard`;
    }
  });
  const timer = setInterval(() => {
    secondsToGo -= 1;
  }, 1000);
  setTimeout(() => {
    clearInterval(timer);
    modal.destroy();
  }, secondsToGo * 1000);
  usuario.coins = parseInt(usuario.coins) + newCoins;
  updateUser(usuario._id, usuario);
  window.location.href = `/dashboard`;
}

function updateUser(idUsuario, usuario) {
  return fetch(`${API_REACT_URL}/api/auth/updUsuario/${idUsuario}`, {
    crossDomain: true,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  })
    .then((data) => data.json())
    .then((json) => {
      localStorage.removeItem("usuario");
      localStorage.setItem("usuario", JSON.stringify(json.usuario));
    });
}
  return (
    <div>
        <Titulo />

      <h1 className="primero">{item && item.tittle}</h1>

      <div className="box_random">
        <img src={item && item.exercisePhoto} alt='Deporte'/>
      </div>

      <div>
        <div className="cronometro">
          <span> {item && ("0" + Math.floor((time / 60000) % 60)).slice(-2)} : </span>
          <span> {item && ("0" + Math.floor((time / 1000) % 60)).slice(-2)} : </span>
          <span> {item && ("0" + ((time/10)%100)).slice(-2)} </span>
        </div>
      </div>

      <div>
        {!timerOn && (
          <button className="boto" onClick={() => setTimeOn(true)} ><PlayCircleOutlineIcon fontSize="large"/></button>
        )}
        {timerOn && (
          <button className="boto" onClick={() => setTimeOn(false)} ><RestoreIcon fontSize="large" /></button>
        )}
      </div>

      <div className="premio">
        <h3 className="premio">Recompensa:</h3>
        {item && item.coins} <p>puntos</p>
      </div>

      <div>
        <button type="button" class="btn btn-warning btn-lg" onClick={changeData}>Siguiente</button>
      </div>

      <div>
        <button className="cancelar">Cancelar <CancelIcon /> </button>
      </div>

      <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} className="modal" okText="Sí" cancelText="No">
          <h2>¿Podemos continuar?</h2>
      </Modal>

      <footer className="foot">
        <Footer />
      </footer>
    </div>
  );
};

export default Primer_Basico;
