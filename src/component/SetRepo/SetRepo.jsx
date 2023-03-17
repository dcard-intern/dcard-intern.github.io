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
        console.log(repoInput.current);
        if (repoInput.current === '') {
            alert('Please enter repo name first.');
            return;
        }

        const url = `https://api.github.com/repos/${props.owner}/${repoInput.current}`;
        const response = await fetch(url);

        if (response.ok) {
            props.setRepoName(repoInput.current);
        } else {
            alert('Invalid repo name!');
        }
    }

    return (
        <div className="set_repo">
            <h1 className='welcome_title'>{props.owner}, welcome to Dcard Project Manager!</h1>
            <div className='repo_input'>
                <RiGitRepositoryFill size={40} />
                <input type='text' className='repo_name_input' placeholder='Enter repo name here'
                    onChange={(e) => repoInput.current = e.target.value} />
                <button onClick={handleRepoName} className='repo_name_button'>Go</button>
            </div>
        </div>
    );
}

export default SetRepo;