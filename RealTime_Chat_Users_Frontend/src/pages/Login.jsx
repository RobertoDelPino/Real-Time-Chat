import { Link, useNavigate } from "react-router-dom"
import axiosClient from "../config/axiosClient"
import { useState } from "react"
import Alert  from "../components/Alert"
import useAuth from "../hooks/useAuth"

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({});
  const { setAuth} = useAuth();
  const navigate = useNavigate();

  const { message } = alert;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if([email, password].includes("")){
      setAlert({
        message: "Todos los campos son obligatorios",
        error: true
      })
      return;
    }

    try {
      const {data} = await axiosClient.post("/users/login", {email, password})
      localStorage.setItem("token", data.token)
      setAlert({})
      setAuth(data)
      navigate("/chat")
    } catch (error) {
      setAlert({
        message: error.response.data.error,
        error: true
      })
    }
  }

  return (
    <>
      <section className="flex justify-center items-center gap-10 flex-wrap">
        <h1 className="text-sky-600 font-black text-6xl capitalize max-w-md">
          Inicia sesión y comienza a <span className="text-slate-700"> chatear</span>
        </h1>
        <article className="w-full md:max-w-md relative">
          {message && <Alert alert={alert}/>} 

          <form 
            className="my-5 bg-white shadow rounded-lg p-10"
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

            <input 
              type="submit" 
              value={"Iniciar sesión"}
              className="bg-sky-700 w-full py-3 text-white uppercase font-bold
              rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
            />

          </form>
          <nav className="lg:flex lg:justify-between">
            <Link to={"/register"} className="block text-center text-slate-500 uppercase text-sm">
              ¿No tienes una cuenta? Regístrate
            </Link>

            <Link to={"/forgot-password"} className="block text-center text-slate-500 uppercase text-sm">
              Olvidé mi Password
            </Link>
          </nav>
        </article>
      </section>
    </>
  )
}

export default Login