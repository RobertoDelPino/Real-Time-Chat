import { Link } from "react-router-dom";
import { useState } from "react";
import Alert from "../components/Alert";
import axiosClient from "../config/axiosClient";


const Register = () => {

  const [ name, setName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ repeatPassword, setRepeatPassword ] = useState("");
  const [ alert, setAlert ] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if([name, email, password, repeatPassword].includes("")){
      setAlert({
        message: "Todos los campos son obligatorios",
        error: true
      })
      return
    }

    if(password !== repeatPassword){
      setAlert({
        message: "Los passwords no son iguales",
        error: true
      })
      return
    }

    if(password.length < 6){
      setAlert({
        message: "La password debe contener una longitud minima de 6",
        error: true
      })
      return
    }

    setAlert({});
    try {
      const {data} = await axiosClient.post("/users/register", {name, password, email})

      setAlert({
        message: data.message,
        error: false
      })

      setName("")
      setEmail("")
      setPassword("")
      setRepeatPassword("")

    } catch (error) {
      setAlert({
        message: error.response.data.error,
        error: true
      })
    }
    
  }

  const {message} = alert;

  return (
    <>
      <section className="flex justify-center items-center gap-10 flex-wrap">
        <h1 className="text-sky-600 font-black text-6xl capitalize max-w-md">
          Crea tu cuenta y comienza a {''} <span className="text-slate-700">chatear</span>
        </h1>
      
        <article className="w-full md:max-w-md relative">

          {message && <Alert alert={alert}/>}

          <form 
            className="my-10 bg-white shadow rounded-lg p-10"
            onSubmit={handleSubmit}
          >
            <div className="my-5">
              <label 
                className="uppercase text-gray-600 block text-xl font-bold"
                htmlFor="name"  
              >Nombre</label>
              <input 
                id="name"
                type="name"
                placeholder="Tu nombre"
                className="w-full mt-3 rounded-xl p-3 border bg-gray-50"
                value={name}
                onChange={e => setName(e.target.value)} 
                />
            </div>

            
            <div className="my-5">
              <label 
                className="uppercase text-gray-600 block text-xl font-bold"
                htmlFor="email"  
              >Email</label>
              <input 
                id="email"
                type="email"
                placeholder="Email de registro"
                className="w-full mt-3 rounded-xl p-3 border bg-gray-50"
                value={email}
                onChange={e => setEmail(e.target.value)} 
                />
            </div>

            <div className="my-5">
              <label 
                className="uppercase text-gray-600 block text-xl font-bold"
                htmlFor="password"  
              >Password</label>
              <input 
                id="password"
                type="password"
                placeholder="Password de registro"
                className="w-full mt-3 rounded-xl p-3 border bg-gray-50"
                value={password}
                onChange={e => setPassword(e.target.value)} 
                />
            </div>

            <div className="my-5">
              <label 
                className="uppercase text-gray-600 block text-xl font-bold"
                htmlFor="repeat-password"  
              >Repetir Password</label>
              <input 
                id="repeat-password"
                type="password"
                placeholder="Repetir tu password"
                className="w-full mt-3 rounded-xl p-3 border bg-gray-50"
                value={repeatPassword}
                onChange={e => setRepeatPassword(e.target.value)} 
                />
            </div>

            <input 
              type="submit" 
              value={"Iniciar sesión"}
              className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold
              rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
            />
          </form>

          <nav className="lg:flex lg:justify-between">
            <Link to={"/"} className="block text-center my-5 text-slate-500 uppercase text-sm">
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>

            <Link to={"/forgot-password"} className="block text-center my-5 text-slate-500 uppercase text-sm">
              Olvidé mi Password
            </Link>
          </nav>

        </article>
      </section>

    </>
  )
}

export default Register