import { useEffect, useState } from 'react';
import ListElement from '../List/ListElement';
import IssueTable from '../IssueTable/IssueTable';
import { BiFilterAlt } from 'react-icons/bi'
import { BiSort } from 'react-icons/bi'
import { GoSearch } from 'react-icons/go'
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

    const owner = "dcard-intern";
    const repo = "dcard-intern.github.io";
    const accessToken = props.authToken;
    const perPage = 10;

    useEffect(() => {
        console.log('Call useEffect');
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
            console.log('true!');
            setRerender(!rerender);
        }
    };

    const getIssues = async () => {
        setLoading(true);
        let url = '';
        if (searchText.length === 0) {
            url = `https://api.github.com/repos/${owner}/${repo}/issues?page=${page}&per_page=${perPage}&direction=${direction}`;
            if (labelFilter !== 'None') {
                url += '&labels=' + encodeURIComponent(labelFilter);
            }
        } else {
            url = `https://api.github.com/search/issues?page=${page}&sort=created&order=${direction}&per_page=${perPage}&q=${searchText}+repo:${owner}/${repo}`;
            if (labelFilter !== 'None') {
                url += '+label:' + (labelFilter.includes(' ') ? encodeURIComponent('\"' + labelFilter + '\"') : labelFilter);
            }
        }
        console.log(url);
        try {
            const response = await fetch(url);
            let data = await response.json();
            console.log(data);
            if (searchText.length !== 0) data = data.items;
            if (data.length < 10) {
                setFinished(true);
                console.log('set finished');
            }
            const filtered = data.map((item) => {
                return {
                    title: item.title,
                    body: item.body,
                    label: item.labels[0].name,
                    number: item.number,
                    state: item.state
                }
            })
            console.log(`Now page ${page}`, filtered);
            setIssues(prevIssues => [...prevIssues, ...filtered]); // add new issues to the existing set
            setPage(prevPage => prevPage + 1); // increment the page number to fetch the next set of issues
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
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

        await fetch(apiUrl, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    if (newIssue.state === 'open') {
                        alert("Issue updated successfully.");
                    } else {
                        alert(`Issue #${number} has been closed.`);
                    }
                    return response.json();
                } else {
                    console.error("Failed to update issue.");
                }
            })
            .then((res) => {
                console.log(res);
                setIssues([...issues.slice(0, index), {
                    title: res.title,
                    body: res.body,
                    label: res.labels[0].name,
                    number: res.number,
                    state: res.state
                }, ...issues.slice(index + 1)]);
            })
            .catch(error => {
                console.error("An error occurred while updating issue:", error);
            });
    }

    const createIssue = async (newIssue) => {
        setLoading(true);

        // API endpoint to create an issue
        const url = `https://api.github.com/repos/${owner}/${repo}/issues`;

        console.log(newIssue);
        // Define the request options
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `token ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newIssue)
        };

        // Send the request to create the issue
        await fetch(url, requestOptions)
            .then(response => response.json())
            .then((res) => {
                console.log(res);
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
    }

    const renewPage = () => {
        setIssues([]);
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
            alert('Nothing to clear!');
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

    return (
        <div className='List'>
            <h1 className='web_title'>Dcard Project Manager</h1>
            <h2>Developed by <a href='https://github.com/cjchang925'>Chi-chun Chang 張棋鈞</a></h2>
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
                        <option value='in progress'>In Progress</option>
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
                    <IssueTable closeIssueTable={closeIssueTable} handleNewIssue={handleNewIssue} type={'New'} />
                </div>
                :
                <></>
            }
            {loading ?
                <p style={{ fontSize: '30px' }}>Loading...</p>
                :
                <>
                    {issues.length === 0 ?
                        <p style={{ fontSize: '30px' }}>No issues!</p>
                        :
                        <></>
                    }
                </>
            }
            {issues.map((item, index) => {
                return <ListElement issue={item} handleNewIssue={handleNewIssue} key={index} index={index} />
            })}
        </div>
    );
};

export default Home;