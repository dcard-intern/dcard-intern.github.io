import { useState } from 'react';
import './App.css';

import Login from './component/Login/Login';
import Home from './component/Home/Home';

function App() {
    const [login, setLogin] = useState(false);
    const [authToken, setAuthToken] = useState("");

    if (!login) {
        return (
            <Login setAuthToken={setAuthToken} setLogin={setLogin} />
        );
    } else {
        return (
            <Home authToken={authToken} login={login} />
        );
    }
}

export default App;
