import { Route, Router, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage';
import Chatpage from './pages/Chatpage';
import ChatProvider from './Context/Chatprovider';

function App() {
  return (
    <div className="App">
      <ChatProvider>
        <Routes>
          <Route path='/' exact Component={Homepage} />
          <Route path='/chats' exact Component={Chatpage} />
        </Routes>
      </ChatProvider>
    </div>
  );
}

export default App;
