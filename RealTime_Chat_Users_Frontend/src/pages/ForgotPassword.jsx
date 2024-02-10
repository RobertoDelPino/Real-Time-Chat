import { useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import axiosClient from "../config/axiosClient";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(email === "" || email.length < 6){
      setAlert({
        message: "El email es obligatorio",
        error: true
      })
      return
    }
    try {
      const url = "/users/forgot-password"
      const { data } = await axiosClient.post(url, {email});
      setAlert({
        message: data.message,
        error: false
      })

    } catch (error) {
      setAlert({
        message: error.response.data.error,
        error: true
      })
    }

  }
  
  const { message } = alert;

  return (
    <>
      <section className="flex justify-center items-center gap-10 flex-wrap mt-10 px-4 md:px-0">
        <h1 className="text-sky-600 font-black text-6xl capitalize max-w-md">
          Recupera tu acceso y no pierdas tus {''} <span className="text-slate-700">chats</span>
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
                htmlFor="email"  
              >Email</label>
              <input 
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email de registro"
                className="w-full mt-3 rounded-xl p-3 border bg-gray-50"
                />
            </div>

            <input 
              type="submit" 
              value={"Enviar instrucciones"}
              className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold
              rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
            />
          </form>

          <nav className="lg:flex lg:justify-between">
            <Link to={"/"} className="block text-center my-5 text-slate-500 uppercase text-sm">
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>

            <Link to={"/register"} className="block text-center my-5 text-slate-500 uppercase text-sm">
              ¿No tienes una cuenta? Regístrate
            </Link>
          </nav>
        </article>
      </section>
      
    </>
  )
}

export default ForgotPassword