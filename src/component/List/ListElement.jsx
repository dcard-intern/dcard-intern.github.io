import { useState, useRef, useEffect } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { AiOutlineMinusCircle } from 'react-icons/ai'
import IssueTable from '../IssueTable/IssueTable'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import rehypeRaw from 'rehype-raw'
import style from './ListElement.module.css'

/*
 * <ListElement /> renders an issue, which is sent from <Home /> component.
 * In this component, users are able to change the issue label and edit or delete
 * the issue. It is able to render the issue body with Markdown language and images,
 * which are limited to have a width of 700px.
 */

const ListElement = (props) => {
    const [displayLabelList, setDisplayLabelList] = useState(false);
    const [displayOptionList, setDisplayOptionList] = useState(false);
    const [displayEdit, setDisplayEdit] = useState(false);
    const labelRef = useRef();
    const optionRef = useRef();

    let labelClassExtension = props.issue.label.slice(0, 1).toLowerCase();
    if (props.issue.label.toLowerCase() !== 'open' && props.issue.label.toLowerCase() !== 'in progress' && props.issue.label.toLowerCase() !== 'done') {
        labelClassExtension = 'a';
    }

    const handleLabel = () => {
        setDisplayLabelList(!displayLabelList);
    }

    const handleOption = () => {
        setDisplayOptionList(!displayOptionList);
    }

    const handleLabelChange = (e) => {
        if (e.target.value === props.issue.label) {
            return;
        }
        
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

    const imageReg = /!\[.*?\]\(.*?\.(jpg|jpeg|gif|png|svg|JPG|JPEG|GIF|PNG|SVG)\)/;
    const imageUrlReg = /https:\/\/.*\.(jpg|jpeg|gif|png|svg|JPG|JPEG|GIF|PNG|SVG)/;
    let markdown = props.issue.body;

    while (imageReg.test(markdown)) {
        markdown = markdown.replace(imageReg, `<img src="${markdown.match(imageReg)[0].match(imageUrlReg)[0]}" width="700px"/>`);
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
        <div className={style['list_element_' + labelClassExtension]}>
            <div className={style['top_row']}>
                <AiOutlineMinusCircle size={35} className={style['state_open_icon']} />
                <button className={style['issue_label_' + labelClassExtension]} ref={labelRef} onClick={handleLabel}>
                    {props.issue.label.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}
                </button>
                {displayLabelList ?
                    <div className={style['edit_label_list']} onClick={handleLabelChange}>
                        <button className={style['edit_label_list_open']} value='Open'>Open</button>
                        <button className={style['edit_label_list_in_progress']} value='In Progress'>In Progress</button>
                        <button className={style['edit_label_list_done']} value='Done'>Done</button>
                    </div>
                    :
                    <></>
                }
                <div className={style['more_icon_div']} ref={optionRef} onClick={handleOption}>
                    <BsThreeDotsVertical size={20} />
                </div>
                {displayOptionList ?
                    <div className={style['option_list']} onClick={handleOptionChange}>
                        <button className={style['option_list_edit']} value='edit'>Edit</button>
                        {props.issue.state === 'closed' ?
                            <button className={style['option_list_delete']} value='delete' disabled>Delete</button>
                            :
                            <button className={style['option_list_delete']} value='delete'>Delete</button>
                        }
                    </div>
                    :
                    <></>
                }
                {displayEdit ?
                    <div className={style['cover_issue_table']}>
                        <IssueTable closeIssueTable={closeIssueTable} handleNewIssue={handleNewIssue} type={'Edit'}
                            originalTitle={props.issue.title} originalBody={props.issue.body} originalLabel={props.issue.label}
                            number={'#' + props.issue.number} />
                    </div>
                    :
                    <></>
                }
            </div>
            <h2 className={style['issue_title']}>#{props.issue.number} {props.issue.title}</h2>
            <ReactMarkdown className={style['issue_body']} children={markdown} rehypePlugins={[rehypeRaw]}/>
        </div>
    )
}

export default ListElement;
