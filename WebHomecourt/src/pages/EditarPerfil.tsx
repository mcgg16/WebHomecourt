import Nav from '../components/Nav'
import EditProfile from "../components/Perfil/EditProfile"
import { useNavigate } from "react-router-dom"

function EditarPerfil() {
    const navigate = useNavigate()
    const userId = "ac3a5447-1b6f-4324-8830-5ddc2d7b2c47"

    return (
        <div>
            <div className="flex flex-col items-center justify-center">
                <Nav current="Perfil" />
            </div>
            <EditProfile 
                userId={userId}
                onBack={() => navigate("/perfil")}
                onSave={() => navigate("/perfil")}
            />
        </div>
    )
}

export default EditarPerfil