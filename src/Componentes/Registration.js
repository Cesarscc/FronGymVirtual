import React, { useState } from "react";
import { Form, Input, Tooltip, Checkbox, Button } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
const API_REACT_URL = "https://app-gymvirtual.herokuapp.com";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 20,
    },
    sm: {
      span: 15,
    },
  },
  wrapperCol: {
    xs: {
      span: 20,
    },
    sm: {
      span: 15,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 20,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 4,
    },
  },
};

const Registration = () => {
  const onFinish = (values) => {
    console.log(values);
    return fetch(`${API_REACT_URL}/api/auth/signup`, {
      crossDomain: true,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((response) => {
        console.log(response);
        window.location.href = "/login";
        return response.json();
      })
      .then(console.log)
      .catch((err) => console.log(err));
  };

  const [form] = Form.useForm();

  const [nseguridad, setCount] = useState(0);

  var letras = "abcdefghyjklmnñopqrstuvwxyz";

  function tiene_letras(texto) {
    texto = texto.toLowerCase();
    for (var i = 0; i < texto.length; i++) {
      if (letras.indexOf(texto.charAt(i), 0) !== -1) {
        return 1;
      }
    }
    return 0;
  }

  var numeros = "0123456789";

  function tiene_numeros(texto) {
    for (var i = 0; i < texto.length; i++) {
      if (numeros.indexOf(texto.charAt(i), 0) !== -1) {
        return 1;
      }
    }
    return 0;
  }

  function tiene_minusculas(texto) {
    for (var i = 0; i < texto.length; i++) {
      if (letras.indexOf(texto.charAt(i), 0) !== -1) {
        return 1;
      }
    }
    return 0;
  }

  var letras_mayusculas = "ABCDEFGHYJKLMNÑOPQRSTUVWXYZ";

  function tiene_mayusculas(texto) {
    for (var i = 0; i < texto.length; i++) {
      if (letras_mayusculas.indexOf(texto.charAt(i), 0) !== -1) {
        return 1;
      }
    }
    return 0;
  }

  function seguridad_clave(clave) {
    var seguridad = 0;
    if (clave.length !== 0) {
      if (tiene_numeros(clave) && tiene_letras(clave)) {
        seguridad += 30;
      }
      if (tiene_minusculas(clave) && tiene_mayusculas(clave)) {
        seguridad += 30;
      }
      if (clave.length >= 5 && clave.length <= 6) {
        seguridad += 10;
      } else {
        if (clave.length >= 7 && clave.length <= 8) {
          seguridad += 30;
        } else {
          if (clave.length > 8) {
            seguridad += 40;
          }
        }
      }
    }
    return seguridad;
  }

  function seguridad_clave_valor(clave) {
    if (seguridad_clave(clave) >= 0 && seguridad_clave(clave) < 10) {
      return "Nulo";
    } else {
      if (seguridad_clave(clave) >= 10 && seguridad_clave(clave) < 30) {
        return "Muy Bajo";
      } else {
        if (seguridad_clave(clave) >= 30 && seguridad_clave(clave) < 50) {
          return "Bajo";
        } else {
          if (seguridad_clave(clave) >= 50 && seguridad_clave(clave) < 80) {
            return "Medio";
          } else {
            if (seguridad_clave(clave) >= 80 && seguridad_clave(clave) < 100) {
              return "Alto";
            } else {
              if (seguridad_clave(clave) === 100) {
                return "Muy Alto";
              }
            }
          }
        }
      }
    }
  }

  const security = (
    <Form.Item name="afterix" style={{ width: "70px", height: "6px" }}>
      <i>{seguridad_clave_valor(nseguridad)}</i>
    </Form.Item>
  );

  return (
    <div className="Todo">
      <div className="GymVirtual">
        <h1>GYM VIRTUAL</h1>
      </div>
      <div className="Log">
        <h1 className="login">REGISTRO</h1>
      </div>

      <Form
        {...formItemLayout}
        form={form}
        name="register"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        scrollToFirstError
        className="register-form"
      >
        <Form.Item
          name="first_name"
          label="Nombre"
          rules={[
            {
              required: true,
              message: "Es necesario ingresar su nombre",
            },
          ]}
          style={{marginLeft: 20}}
        >
          <Input style={{borderRadius: 5}}/>
        </Form.Item>

        <Form.Item
          name="last_name"
          label="Apellidos"
          rules={[
            {
              required: true,
              message: "Es necesario ingresar sus apellidos",
            },
          ]}
          style={{marginLeft: 20}}
        >
          <Input style={{borderRadius:5}}/>
        </Form.Item>

        <Form.Item
          name="usuario"
          label={
            <span>
              Usuario&nbsp;
              <Tooltip title="¿Con que nombre te gustaría que te conozcan en nuestra app?">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          rules={[
            {
              required: true,
              message: "Ingresa tu usuario",
              whitespace: true,
            },
          ]}
          style={{marginLeft: 20}}
        >
          <Input style={{borderRadius:5}}/>
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "Ingresaste un correo no valido",
            },
            {
              required: true,
              message: "¡Por favor, ingrese su email!",
            },
          ]}
          style={{marginLeft: 20}}
        >
          <Input style={{borderRadius: 5}}/>
        </Form.Item>

        <Form.Item
          name="password"
          label="Contraseña"
          rules={[
            {
              required: true,
              message: "¡Por favor, ingrese su contraseña!",
            },
            () => ({
              validator(rule, value) {
                setCount(value);
                if (value.length > 4) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "Su contraseña debe tener mínimo 5 caracteres"
                );
              },
            }),
          ]}
          hasFeedback
          style={{marginLeft: 20}}
        >
          <Input.Password addonAfter={security} />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirmar Contraseña"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Por favor confirma tu contraseña",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "Las contraseñas que has ingresado no coinciden"
                );
              },
            }),
          ]}
          style={{marginLeft: 20}}
        >
          <Input.Password style={{borderRadius: 5}}/>
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject("Acepta los términos y condiciones"),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            He leído los <a href="/">Términos y Condiciones</a>.
          </Checkbox>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            shape="round"
            size="large"
            style={{ minWidth: 160, background: "#0077E4", marginBottom: 10 }}
          >
            Registrarse
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Registration;