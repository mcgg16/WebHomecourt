import Nav from '../components/Nav'
import ProfileHeader from "../components/Perfil/ProfileHeader"

function Perfil() {
    return (
        <div>
            <div className="flex flex-col items-center justify-center">
                <Nav current="Perfi" />
            </div>
            <div className="px-6 py-4">
                <ProfileHeader userId="ac3a5447-1b6f-4324-8830-5ddc2d7b2c47"/>
            </div>
        </div>
    )
}

export default Perfil