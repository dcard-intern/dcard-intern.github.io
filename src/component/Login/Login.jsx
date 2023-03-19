import { useEffect, useState } from 'react';
import { RxGithubLogo } from 'react-icons/rx'
import './Login.css';

const Login = (props) => {
    const [loading, setLoading] = useState(false);

    const CLIENT_ID = "9c73cb3e1e3fa8f9e1f2";

    const loginWithGithub = () => {
        setLoading(true);
        window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID + '&scope=repo');
    }

    useEffect(() => {
        // Get the returned code from GitHub OAuth API

        const query = window.location.search;
        const urlParams = new URLSearchParams(query);
        const authorizationCode = urlParams.get("code");

        if (authorizationCode) {
            setLoading(true);
            const getAccessToken = async () => {
                await fetch('https://prevexam.dece.nycu.edu.tw/api/getAccessToken?code=' + authorizationCode, {
                    method: "GET"
                }).then(res => res.json())
                    .then((data) => {
                        props.setAuthToken(data.access_token);
                        props.setLogin(true);
                        props.setUser(data.username);
                        setLoading(false);
                    })
            }
            getAccessToken();
        }
    }, [])

    return (
        <div className="login_page">
            <header className="login_header">
                <h1 className='login_web_title'>Dcard Project Manager</h1>
                {loading ?
                    <h2>Loading...</h2>
                    :
                    <button onClick={loginWithGithub} className='login_button'>
                        <RxGithubLogo style={{marginRight: '20px'}}/>
                        Login with GitHub
                    </button>
                }
            </header>
        </div>
    )
}

export default Login;