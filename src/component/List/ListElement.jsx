import { useState, useRef, useEffect } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { AiOutlineCheckCircle, AiOutlineMinusCircle } from 'react-icons/ai'
import IssueTable from '../IssueTable/IssueTable'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import './ListElement.css'

const ListElement = (props) => {
    const [displayLabelList, setDisplayLabelList] = useState(false);
    const [displayOptionList, setDisplayOptionList] = useState(false);
    const [displayEdit, setDisplayEdit] = useState(false);
    const labelRef = useRef();
    const optionRef = useRef();

    const handleLabel = () => {
        setDisplayLabelList(!displayLabelList);
    }

    const handleOption = () => {
        setDisplayOptionList(!displayOptionList);
    }

    const handleLabelChange = (e) => {
        handleNewIssue({
            title: props.issue.title,
            body: props.issue.body,
            labels: [e.target.value],
            state: props.issue.state
        })
    }

    const handleOptionChange = (e) => {
        if (e.target.value === 'delete') {
            handleNewIssue({
                title: props.issue.title,
                body: props.issue.body,
                labels: [props.issue.label],
                state: 'closed'
            })
        } else {
            setDisplayEdit(!displayEdit);
        }
    }

    const closeIssueTable = () => {
        setDisplayEdit(false);
    }

    const handleNewIssue = (newIssue) => {
        props.issue.title = 'Loading...';
        props.issue.body = 'Loading...';
        props.handleNewIssue(newIssue, props.issue.number, props.index);
    }

    useEffect(() => {
        const closeList = (e) => {
            if (!labelRef.current.contains(e.target)) {
                setDisplayLabelList(false);
            }
            if (!optionRef.current.contains(e.target)) {
                setDisplayOptionList(false);
            }
        };

        document.body.addEventListener('click', closeList);
        return () => {
            document.body.removeEventListener('click', closeList);
        }
    }, [])

    return (
        <div className={'list_element_' + props.issue.label.slice(0, 1).toLowerCase()}>
            <div className='top_row'>
                {props.issue.state === 'closed' ?
                    <AiOutlineCheckCircle size={35} className='state_closed_icon'/>
                    :
                    <AiOutlineMinusCircle size={35} className='state_open_icon' />
                }
                <button className={'issue_label_' + props.issue.label.slice(0, 1).toLowerCase()} ref={labelRef} onClick={handleLabel}>
                    {props.issue.label.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}
                </button>
                {displayLabelList ?
                    <div className='edit_label_list' onClick={handleLabelChange}>
                        <button className='edit_label_list_open' value='Open'>Open</button>
                        <button className='edit_label_list_in_progress' value='In Progress'>In Progress</button>
                        <button className='edit_label_list_done' value='Done'>Done</button>
                    </div>
                    :
                    <></>
                }
                <div className='more_icon_div' ref={optionRef} onClick={handleOption}>
                    <BsThreeDotsVertical size={20} />
                </div>
                {displayOptionList ?
                    <div className='option_list' onClick={handleOptionChange}>
                        <button className='option_list_edit' value='edit'>Edit</button>
                        {props.issue.state === 'closed' ?
                            <button className='option_list_delete' value='delete' disabled>Delete</button>
                            :
                            <button className='option_list_delete' value='delete'>Delete</button>
                        }
                    </div>
                    :
                    <></>
                }
                {displayEdit ?
                    <div className='cover_issue_table'>
                        <IssueTable closeIssueTable={closeIssueTable} handleNewIssue={handleNewIssue} type={'Edit'} 
                        originalTitle={props.issue.title} originalBody={props.issue.body} originalLabel={props.issue.label}
                        number={'#' + props.issue.number}/>
                    </div>
                    :
                    <></>
                }
            </div>
            <h2 className='issue_title'>#{props.issue.number} {props.issue.title}</h2>
            <ReactMarkdown className='issue_body' children={props.issue.body} />
        </div>
    )
}

export default ListElement;
