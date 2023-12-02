import { Route, Router, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage';
import Chatpage from './pages/Chatpage';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path='/' exact Component={Homepage} />
          <Route path='/chats' exact Component={Chatpage} />
        </Routes>
    </div>
  );
}

export default App;
