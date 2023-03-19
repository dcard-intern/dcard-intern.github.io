import { useEffect, useState, useRef } from 'react';
import ListElement from '../List/ListElement';
import IssueTable from '../IssueTable/IssueTable';
import { BiFilterAlt } from 'react-icons/bi'
import { BiSort } from 'react-icons/bi'
import { GoSearch } from 'react-icons/go'
import { IoMdArrowRoundBack } from 'react-icons/io'
import './Home.css'

const Home = (props) => {
    const [displayIssueTable, setDisplayIssueTable] = useState(false);
    const [direction, setDirection] = useState("desc");
    const [labelFilter, setLabelFilter] = useState("None");
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [issues, setIssues] = useState([]);
    const [page, setPage] = useState(1);
    const [finished, setFinished] = useState(false);
    const [rerender, setRerender] = useState(false);
    const [APIError, setAPIError] = useState(false);
    const existingIssueNumber = useRef([]);

    const owner = props.owner;
    const repo = props.repo;
    const accessToken = props.authToken;
    const perPage = 10;

    useEffect(() => {
        if (props.login && !finished && !loading) getIssues();
    }, [props.login, rerender])

    useEffect(() => {
        // Fetch more issues when the user scrolls to the bottom of the page
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });

    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        if (scrollTop + clientHeight >= scrollHeight - 10 && !finished && !loading) {
            setRerender(!rerender);
        }
    };

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    const getIssues = async () => {
        setLoading(true);
        let arr = [...issues];
        let localFinished = finished;
        const originalLength = arr.length;
        let iterating = true;
        let localPage = page;
        while (iterating === true) {
            let url = '';
            if (searchText.length === 0) {
                url = `https://api.github.com/repos/${owner}/${repo}/issues?page=${localPage}&per_page=${perPage}&direction=${direction}`;
                if (labelFilter !== 'None') {
                    url += '&labels=' + encodeURIComponent(labelFilter);
                }
            } else {
                url = `https://api.github.com/search/issues?page=${localPage}&sort=created&order=${direction}&per_page=${perPage}&q=${searchText}+repo:${owner}/${repo}+state:open`;
                if (labelFilter !== 'None') {
                    url += '+label:' + (labelFilter.includes(' ') ? encodeURIComponent('\"' + labelFilter + '\"') : labelFilter);
                }
            }
            try {
                const response = await fetch(url);
                let data = await response.json();
                
                if (searchText.length !== 0) {
                    data = data.items;
                }
                if (data.length < 10) {
                    localFinished = true;
                }
                const simplified = data.map((item) => {
                    return {
                        title: item.title,
                        body: item.body,
                        label: item.labels[0].name,
                        number: item.number,
                        state: item.state
                    }
                })

                let filtered = [];

                for (var i = 0; i < simplified.length; i++) {
                    if (arr.length + filtered.length - originalLength === 10) break;
                    if (existingIssueNumber.current.indexOf(simplified[i].number) === -1) {
                        existingIssueNumber.current.push(simplified[i].number);
                        filtered.push(simplified[i]);
                    }
                }

                arr = [...arr, ...filtered];

                localPage++;
                
                if (localFinished || arr.length - originalLength === 10) {
                    break;
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
                setAPIError(true);
            }
        }
        setIssues(arr); // add new issues to the existing set
        setFinished(localFinished);
        setPage(localPage);
        setLoading(false);
    }

    const editIssue = async (newIssue, number, index) => {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${number}`;
        const headers = {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": `Bearer ${accessToken}`
        };
        const data = {
            labels: newIssue.labels,
            title: newIssue.title,
            body: newIssue.body,
            state: newIssue.state
        };

        if (newIssue.state === 'closed') {
            setPage(page - 1);
        }

        await fetch(apiUrl, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error("Failed to update issue.");
                }
            })
            .then(async (res) => {
                if (res.state === 'open') {
                    setIssues([...issues.slice(0, index), {
                        title: res.title,
                        body: res.body,
                        label: res.labels[0].name,
                        number: res.number,
                        state: res.state
                    }, ...issues.slice(index + 1)]);
                } else {
                    setIssues([...issues.slice(0, index), ...issues.slice(index + 1)]);
                }
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
                setAPIError(true);
            });
    }

    const createIssue = async (newIssue) => {
        setLoading(true);

        // API endpoint to create an issue
        const url = `https://api.github.com/repos/${owner}/${repo}/issues`;

        // Define the request options
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newIssue)
        };

        // Send the request to create the issue
        await fetch(url, requestOptions)
            .then(response => response.json())
            .then(async (res) => {
                if (direction === 'desc') {
                    setIssues([{
                        title: res.title,
                        body: res.body,
                        label: res.labels[0].name,
                        number: res.number,
                        state: res.state
                    }, ...issues]);
                } else {
                    setIssues([...issues, {
                        title: res.title,
                        body: res.body,
                        label: res.labels[0].name,
                        number: res.number,
                        state: res.state
                    }]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
                setAPIError(true);
            });
    }

    const renewPage = () => {
        setIssues([]);
        existingIssueNumber.current.length = 0;
        setPage(1);
        setFinished(false);
        setRerender(!rerender);
    }

    const handleOrderChange = (e) => {
        setDirection(e.target.value);
        renewPage();
    }

    const handleFilter = (e) => {
        setLabelFilter(e.target.value);
        renewPage();
    }

    const handleSearchText = (e) => {
        setSearchText(e.target.value);
    }

    const handleSearch = () => {
        if (searchText.length === 0) {
            alert('Nothing to search!');
            return;
        }
        renewPage();
    }

    const handleClear = () => {
        if (searchText.length === 0) {
            return;
        }
        setSearchText("");
        renewPage();
    }

    const closeIssueTable = () => {
        setDisplayIssueTable(false);
    }

    const handleNewIssue = async (newIssue, number, index) => {
        if (number === 0) {
            // New issue
            createIssue(newIssue);
        } else {
            // Edit issue
            editIssue(newIssue, number, index);
        }
    }

    const handleChangeRepo = () => {
        props.setRepoName("");
    }

    return (
        <div className='List'>
            <div className='back_icon' onClick={handleChangeRepo}>
                <IoMdArrowRoundBack size={30} />
            </div>
            <h1 className='web_title'>Dcard Project Manager</h1>
            <div className='repo_row'>
                <h2 className='repo_title'>You are working on <a href={`https://github.com/${owner}/${repo}`}>{owner}/{repo}</a></h2>
            </div>
            <div className='setting_row'>
                <BiSort size={23} style={{ marginLeft: '20px' }} />
                <h3 className='order_title'>Sort by time:</h3>
                <select type='text' className="select_order" onChange={handleOrderChange}>
                    <option value='desc'>Descending</option>
                    <option value='asc'>Ascending</option>
                </select>
                <div className='filters'>
                    <BiFilterAlt size={23} style={{ marginLeft: '65px' }} />
                    <h3 className='filter_title'>Filters:</h3>
                    <select type='text' className="select_filter" onChange={handleFilter}>
                        <option value='None'>None</option>
                        <option value='Open'>Open</option>
                        <option value='In Progress'>In Progress</option>
                        <option value='Done'>Done</option>
                    </select>
                </div>
                <button className='new_issue_button' onClick={() => setDisplayIssueTable(!displayIssueTable)}>New issue</button>
            </div>
            <div className='search_row'>
                <GoSearch size={23} style={{ marginLeft: '20px', marginRight: '20px' }} />
                <input type='text' value={searchText} placeholder='Search here...' className='search_input' onChange={handleSearchText}></input>
                <button className='clear_button' onClick={handleClear}>Clear</button>
                <button className='search_button' onClick={handleSearch}>Apply</button>
            </div>
            {displayIssueTable ?
                <div className='cover_new_issue_table'>
                    <IssueTable closeIssueTable={closeIssueTable} handleNewIssue={handleNewIssue} type={'New'}
                        originalTitle={""} originalBody={""} originalLabel={"Open"} number={""} />
                </div>
                :
                <></>
            }
            {loading ?
                <p style={{ fontSize: '30px' }}>Loading...</p>
                :
                APIError ?
                    <p style={{ fontSize: '30px' }}>Error!</p>
                    :
                    issues.length === 0 ?
                        <p style={{ fontSize: '30px' }}>No issues!</p>
                        :
                        <></>
            }
            {issues.map((item, index) => {
                return <ListElement issue={item} handleNewIssue={handleNewIssue} key={index} index={index} />
            })}
        </div>
    );
};

export default Home;