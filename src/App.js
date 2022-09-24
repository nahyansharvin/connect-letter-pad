import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Navbar from './components/navbar/Navbar'
import AddBody from './pages/addBodyDetails/AddBody';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />} >
           <Route index element={<AddBody />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
