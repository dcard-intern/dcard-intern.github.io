import { useState, useRef, useEffect } from "react";
import './IssueTable.css'

const IssueTable = (props) => {
    const [newTitle, setNewTitle] = useState("");
    const [newBody, setNewBody] = useState("");
    const [newLabel, setNewLabel] = useState("Open");
    const [displayLabelList, setDisplayLabelList] = useState(false);
    const labelRef = useRef();

    const handleTableSubmit = (e) => {
        e.preventDefault();
        if (newBody.length < 30) {
            alert('The issue body should contain more than 30 words!');
        } else {
            props.closeIssueTable();
            props.handleNewIssue({
                labels: [newLabel],
                title: newTitle,
                body: newBody,
                state: 'open'
            }, 0, 0)
        }
    }

    const handleLabelChange = (e) => {
        setNewLabel(e.target.value);
    }

    useEffect(() => {
        const closeList = (e) => {
            if (!labelRef.current.contains(e.target)) {
                setDisplayLabelList(false);
            }
        };

        document.body.addEventListener('click', closeList);

        return () => {
            document.body.removeEventListener('click', closeList);
        }
    }, [])

    return (
        <div className='new_issue_table'>
            <h2 className='new_issue_title'>{props.type} Issue</h2>
            <button className={'new_issue_label_' + newLabel.slice(0, 1).toLowerCase()}
                onClick={() => setDisplayLabelList(!displayLabelList)} ref={labelRef}>{newLabel}</button>
            {displayLabelList ?
                <div className='label_list' onClick={handleLabelChange}>
                    <button className='label_list_open' value='Open'>Open</button>
                    <button className='label_list_in_progress' value='In Progress'>In Progress</button>
                    <button className='label_list_done' value='Done'>Done</button>
                </div>
                :
                <></>
            }
            <form className='new_issue_form' onSubmit={handleTableSubmit}>
                <textarea id='new_issue_input_title' value={newTitle} placeholder='Title' className='new_issue_input_title'
                    onChange={(e) => setNewTitle(e.target.value)} rows={2} cols={30} required ></textarea>
                <textarea id='new_issue_input_body' value={newBody} placeholder='Body' className='new_issue_input_body'
                    onChange={(e) => setNewBody(e.target.value)} rows={5} cols={30} />
                <input type='submit' className='send_new_issue_table' />
            </form>
            <button className='close_new_issue_table' onClick={props.closeIssueTable} >Close</button>
        </div>
    )
};

export default IssueTable;