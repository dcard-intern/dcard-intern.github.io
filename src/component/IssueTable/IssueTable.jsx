import { useState, useRef, useEffect } from "react";
import style from './IssueTable.module.css'

/*
 * <IssueTable /> component serves as the interface of edit/create new issues.
 * After the user clicking "Submit" button, it sends the new issue to <Home /> component
 * to edit/create new issues. Once "Cancel" button is clicked, this table would be closed.
 */

const IssueTable = (props) => {
    const [newTitle, setNewTitle] = useState(props.originalTitle);
    const [newBody, setNewBody] = useState(props.originalBody);
    const [newLabel, setNewLabel] = useState(props.originalLabel);
    const [displayLabelList, setDisplayLabelList] = useState(false);
    const labelRef = useRef();

    let labelClassExtension = newLabel.slice(0, 1).toLowerCase();
    if (newLabel.toLowerCase() !== 'open' && newLabel.toLowerCase() !== 'in progress' && newLabel.toLowerCase() !== 'done') {
        labelClassExtension = 'a';
    }

    const handleTableSubmit = (e) => {
        e.preventDefault();
        if (newBody.length < 30) {
            alert('The task body should contain more than 30 words!');
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
        <div className={style['new_issue_table']}>
            <h2 className={style['new_issue_title']}>{props.type} task {props.number}</h2>
            <button className={style['new_issue_label_' + labelClassExtension]}
                onClick={() => setDisplayLabelList(!displayLabelList)} ref={labelRef}>{newLabel.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}</button>
            {displayLabelList ?
                <div className={style['label_list']} onClick={handleLabelChange}>
                    <button className={style['label_list_open']} value='Open'>Open</button>
                    <button className={style['label_list_in_progress']} value='In Progress'>In Progress</button>
                    <button className={style['label_list_done']} value='Done'>Done</button>
                </div>
                :
                <></>
            }
            <form className={style['new_issue_form']} onSubmit={handleTableSubmit}>
                <textarea id='new_issue_input_title' placeholder='Title' className={style['new_issue_input_title']}
                    onChange={(e) => setNewTitle(e.target.value)} rows={2} cols={30} required defaultValue={props.originalTitle} />
                <textarea id='new_issue_input_body' placeholder='Body' className={style['new_issue_input_body']}
                    onChange={(e) => setNewBody(e.target.value)} rows={5} cols={30} defaultValue={props.originalBody} />
                <button className={style['send_new_issue_table']}>Submit</button>
            </form>
            <button className={style['close_new_issue_table']} onClick={props.closeIssueTable}>Cancel</button>
        </div>
    )
};

export default IssueTable;