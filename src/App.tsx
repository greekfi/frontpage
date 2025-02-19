
import './App.css'
import Main from './base';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
  
import OptionsFunctions from './optionsFunctions';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/mint" element={<OptionsFunctions />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
