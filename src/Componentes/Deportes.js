import React , { useState, useEffect}from "react";
import Deporte from "./Deporte";

const API_REACT_URL = "https://app-gymvirtual.herokuapp.com";

const Deportes = () => {

  const [deportes, setDeportes] = useState(null);

  useEffect(() => {

    if(deportes === null){
      return fetch(`${API_REACT_URL}/api/category/categories`, {
        crossDomain: true,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) {
            console.log(data.data);
            setDeportes(data.data)
          }
        })
        .catch((error) => console.log(error));
    }
  },[deportes]);

  return (
    <div className="arreglo">
      {deportes && deportes.map( deporte => (
        <div className="deporteP" key={deporte._id}>
          <Deporte tittle={deporte.tittle} image={deporte.categoryPhoto} />
        </div>
      ))}
    </div>
  );
};

export default Deportes;
