import Nav from '../components/Nav'
import Map from "../components/Map"
function LakersCourt() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center bg-black p-10">
        <h1 className="text-white text-5xl font-bold">LakersCourt</h1>
        <Nav current="LakersCourt" />
      </div>
      <div>
        <h1 className="text-2xl font-bold p-5">Mapa de canchas</h1>
        <div className="flex items-center justify-center">
        <Map />
        </div>
      </div>
    </div>
  )
}

export default LakersCourt
