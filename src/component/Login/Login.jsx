import { useEffect, useState } from 'react';
import { RxGithubLogo } from 'react-icons/rx'
import style from './Login.module.css';

/*
 * <Login /> component is the first component to interact with users.
 * It allows users to login with GitHub OAuth API, and fetch the auth token
 * and the user name with the user code returned from GitHub.
 */

const Login = (props) => {
    const [loading, setLoading] = useState(false);

    const loginWithGithub = () => {
        setLoading(true);
        window.location.assign("https://github.com/login/oauth/authorize?client_id=" + process.env.REACT_APP_CLIENT_ID + '&scope=repo');
    }

    useEffect(() => {
        const query = window.location.search;
        const urlParams = new URLSearchParams(query);
        const authorizationCode = urlParams.get("code");

        if (authorizationCode) {
            setLoading(true);
            const getAccessToken = async () => {
                await fetch('https://prevexam.dece.nycu.edu.tw/api/getAccessTokenLocal?code=' + authorizationCode, {
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
        <div className={style["login_page"]}>
            <div className={style["login_header"]}>
                <h1 className={style['login_web_title']}>Dcard Project Manager</h1>
                {loading ?
                    <h2 style={{fontSize: '36px', marginTop: '7px'}}>Loading...</h2>
                    :
                    <button onClick={loginWithGithub} className={style['login_button']}>
                        <RxGithubLogo style={{marginRight: '20px'}}/>
                        Login with GitHub
                    </button>
                }
            </div>
        </div>
    )
}

export default Login;