import { useState } from 'react';
import './App.css';

import Login from './component/Login/Login';
import Home from './component/Home/Home';
import SetRepo from './component/SetRepo/SetRepo';

function App() {
    const [login, setLogin] = useState(false);
    const [authToken, setAuthToken] = useState("");
    const [owner, setOwner] = useState("");
    const [repoName, setRepoName] = useState("");

    if (!login) {
        return (
            <Login setAuthToken={setAuthToken} setLogin={setLogin} setOwner={setOwner} />
        );
    } else if (repoName.length === 0) {
        return (
            <SetRepo setRepoName={setRepoName} owner={owner} />
        )
    } else {
        return (
            <Home setLogin={setLogin} setRepoName={setRepoName} authToken={authToken} login={login} owner={owner} repo={repoName} />
        );
    }
}

export default App;
