import 'leaflet/dist/leaflet.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Agenda from './pages/Agenda'
import Brackets from './pages/Brackets'
import Estadisticas from './pages/Estadisticas'
import LakersCourt from './pages/LakersCourt'
import Juego from './pages/Juego'
import Store from './pages/Store'
import Perfil from './pages/Perfil'
import Admin from './pages/Admin';
import ReportDetails from './pages/ReportDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/brackets" element={<Brackets />} />
        <Route path="/estadisticas" element={<Estadisticas game_id={2} />} />
        <Route path="/lakerscourt" element={<LakersCourt />} />
        <Route path="/juego" element={<Juego />} />
        <Route path="/store" element={<Store />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/admin/report/:id" element={<ReportDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
