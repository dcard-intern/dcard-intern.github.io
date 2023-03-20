import { useRef, useEffect } from 'react'
import { RiGitRepositoryFill } from 'react-icons/ri'
import style from './SetRepo.module.css'

/*
 * <SetRepo /> component allows users to enter the repo owner and name to
 * work on. If users enter nothing and click "Go" or press "Enter," it will
 * alert them to type something and then search. If the repo owner or name
 * is invalid, it will also alert the user to type again.
 */

const SetRepo = (props) => {
    const repoInput = useRef("");

    useEffect(() => {
        const keyDownHandler = event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleRepoName();
            }
        };

        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, []);

    const handleRepoName = async () => {
        if (repoInput.current === '') {
            alert('Please enter owner and repo name.');
            return;
        }

        const url = `https://api.github.com/repos/${repoInput.current}`;
        const response = await fetch(url);

        if (response.ok) {
            let str = repoInput.current;
            props.setOwner(str.slice(0, str.indexOf('/')));
            props.setRepoName(str.slice(str.indexOf('/') + 1));
        } else {
            alert('Invalid owner or repo name!');
        }
    }

    return (
        <div className={style["set_repo"]}>
            <h1 className={style['welcome_title']}>{props.user}, welcome to Dcard Project Manager!</h1>
            <div className={style['repo_input']}>
                <RiGitRepositoryFill size={40} />
                <input type='text' className={style['repo_name_input']} placeholder='Enter OWNER/REPO here'
                    onChange={(e) => repoInput.current = e.target.value} autoFocus/>
                <button onClick={handleRepoName} className={style['repo_name_button']}>Go</button>
            </div>
        </div>
    );
}

export default SetRepo;