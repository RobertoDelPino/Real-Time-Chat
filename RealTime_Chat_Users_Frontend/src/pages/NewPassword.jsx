import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Alert from "../components/Alert";
import axiosClient from "../config/axiosClient";

const NewPassword = () => {
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [alert, setAlert] = useState({});
  const navigate = useNavigate();

  const params = useParams();
  const {token} = params;

  useEffect(() => {
    const checkToken = async () => {
      try {
        const url = "/users/check-password-token/" + token;
        await axiosClient.post(url, {newPassword});
        setValidToken(true)
  
      } catch (error) {
        setAlert({
          message: "Token no valido",
          error: true
        })
        setTimeout(() => {
          setAlert({});
          navigate("/")
        }, 1500);
      }
    }
    checkToken();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(newPassword === "" || newPassword.length < 6){
      setAlert({
        message: "La nueva contraseña es obligatoria",
        error: true
      })
      return
    }
    try {
      const url = "/users/reset-password/" + token;
      const { data } = await axiosClient.post(url, {newPassword});
      setAlert({
        message: data.message,
        error: false
      })
      setPasswordChanged(true)

      setTimeout(() => {
        setAlert({});
        navigate("/")
      }, 1500);

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
      <section className="flex justify-center items-center gap-10 flex-wrap">
        <h1 className="text-sky-600 font-black text-6xl capitalize">
          Reestablece tu password y no pierdas acceso a tus {''} <span className="text-slate-700">chats</span>
        </h1>
        <article className="w-full md:max-w-md relative">

          {message && <Alert alert={alert}/>}

          { validToken && (
            <form 
              className="my-10 bg-white shadow rounded-lg p-10"
              onSubmit={handleSubmit}
            >
              <div className="my-5">
                <label 
                  className="uppercase text-gray-600 block text-xl font-bold"
                  htmlFor="password"  
                >Nuevo password</label>
                <input 
                  id="password"
                  type="password"
                  placeholder="Escribe Tu Nuevo Password"
                  className="w-full mt-3 rounded-xl p-3 border bg-gray-50"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  />
              </div>

              <input 
                type="submit" 
                value={"Guardar Nueva Password"}
                className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold
                rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
              />
            </form>
          )}

          {passwordChanged && 
            <Link className="block text-center my-5 text-slate-500 uppercase text-sm"
            to="/">Inicia Sesión</Link>
          }
        </article>
      </section>
    </>
  )
}

export default NewPassword