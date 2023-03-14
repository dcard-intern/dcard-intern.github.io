import { useEffect } from 'react';
import './Login.css';

const Login = (props) => {
    const CLIENT_ID = "de1f1fb315e2d2c32266";

    const loginWithGithub = () => {
        window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID + '&scope=repo');
    }

    useEffect(() => {
        // Get the returned code from GitHub OAuth API
        const query = window.location.search;
        const urlParams = new URLSearchParams(query);
        const authorizationCode = urlParams.get("code");

        if (authorizationCode) {
            const getAccessToken = async () => {
                await fetch('https://prevexam.dece.nycu.edu.tw/:5688/getAccessToken?code=' + authorizationCode, {
                    method: "GET"
                }).then(res => res.json())
                    .then((data) => {
                        props.setAuthToken(data.access_token);
                        props.setLogin(true);
                    })
            }
            getAccessToken();
        }
    }, [])

    return (
        <div className="login_page">
            <header className="login-header">
                <button onClick={loginWithGithub} className='login_button'>
                    Login with GitHub
                </button>
            </header>
        </div>
    )
}

export default Login;