import { useRef, useEffect } from 'react'
import { RiGitRepositoryFill } from 'react-icons/ri'
import './SetRepo.css'

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
        <div className="set_repo">
            <h1 className='welcome_title'>{props.user}, welcome to Dcard Project Manager!</h1>
            <div className='repo_input'>
                <RiGitRepositoryFill size={40} />
                <input type='text' className='repo_name_input' placeholder='Enter OWNER/REPO here'
                    onChange={(e) => repoInput.current = e.target.value} autoFocus/>
                <button onClick={handleRepoName} className='repo_name_button'>Go</button>
            </div>
        </div>
    );
}

export default SetRepo;