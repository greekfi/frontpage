import './App.css'
import Main from './base';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import OptionsFunctions from './optionsFunctions';
import Layout from './Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/mint" element={<OptionsFunctions />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
