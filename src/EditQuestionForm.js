import React,{useEffect,useState} from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import http from './http';
import NavBar from "./NavBar";
import {AiOutlinePlus} from 'react-icons/ai'
import { setSelectionRange } from '@testing-library/user-event/dist/utils';
import QuestionList from './QuestionList';
import {BiX} from 'react-icons/bi'

import ReactQuill from 'react-quill';
import '../node_modules/react-quill/dist/quill.snow.css';

import {ThreeDots} from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

function EditQuestionForm({handleDisplayNavbar,display}) 
{

   
    let navigate = useNavigate()
    const pattern = /<\/?[a-z][\s\S]*>/i;
    let question = useLocation().state.question
    let queId = useParams().id
    
    const [AllSubject,setAllSubject] = useState([])
    const [AllTopic,setAllTopic] = useState()
    let [Subject,setSubject] = useState()
    let [Topic,setTopic] =useState()
    let [DotSpinner,setDotSpinner] = useState(false)
    let [IsDuplicate,setIsDuplicate] = useState(false)
    const [richText , setrichText] = useState(pattern.test(question.questionText))
    
    

    let s,t,flag=0
    let hasError = false , hasChecked = false 
    
    
    //-------------to check whether text is written in rich text editor or not--------------------
    let optionObj = question.options.map((opt)=>
    ({
        ...opt , richTextEditor : pattern.test(opt.option)
    }))
    // console.log(optionObj)
    

    
    let [QueObject,setQueObject] = useState({
        type : question.type ,
        diffLevel : question.diffLevel ,
        subject : question.subject ,
        topic : question.topic ,
        rightMarks : question.rightMarks ,
        wrongMarks : question.wrongMarks,
        questionText : question.questionText ,
        options : optionObj
    })
    // console.log(QueObject)
    
    useEffect(async() => {
    
        //to get subject
        let data = await http.get('/subjects?term=')
        setAllSubject(data)
        s = data.filter(sub => (sub._id === QueObject.subject))
        setSubject(s[0].name)

        //to get topic
        let data1 = await http.get('/topics?page=1&limit=9007199254740991&term=')
        setAllTopic(data1)
        t = data1.filter(top => top._id === QueObject.topic)
        setTopic(t[0].name)

    }, [])
    
    


    //---------------------------Display Navbar--------------------------

    const [fullscreen,setfullscreen] = useState(true)
    const handleOnclick = (value) =>
    {
        if(value==='full')
        {
            handleDisplayNavbar(false)
            setfullscreen(false)
        }
        else
        {
            handleDisplayNavbar(true)
            setfullscreen(true)
        }
    }
    

    //-------------------------------------to display error message on particular field--------------------------------
    const handleError = (field , value = '') =>
    {
                        
        let error = document.getElementById(`${field}`)   
        // console.log(error)
        if(field === 'CorrectOpt')
        {
            if(value !== '')
                {  
                   
                    error.style.display="block"                    
                }
                else
                {
                    error.style.display="none"
                    hasError = false
                }
            
        }        
        else if(field === 'DuplicateOpt')
        {
                if(value !== '')
                {  
                    error.style.display="block"
                    setIsDuplicate(true)
                }
                else
                {
                    error.style.display="none"
                    setIsDuplicate(false)
                }
            
        }           
        else if(value === '' || value === 'DEFAULT')
        {
            
            if(field === 'Subject' || field === 'Topic' || field === 'Type' || field === 'Difficulty level')
            {
                error.style.display = "block"
            }

            else if(field === 'Right marks' || field === 'Wrong marks' || field === 'qText' || field === 'richQueText')
            {
                error.style.display = "block"
                field === 'Right marks' && (document.getElementById('Rmarks').className = "form-control is-invalid")
                field === 'Wrong marks' && (document.getElementById('Wmarks').className = "form-control is-invalid")
                field === 'qText' && (error.className = "form-control is-invalid")
               
            }
            else if(field.includes('Option'))
            {
                error.style.display="block"
            }

        } 
           
        else
        {
            error.style.display = "none"
            document.getElementById('Rmarks').className = "form-control"
            document.getElementById('Wmarks').className = "form-control "
            
            if(field === 'qText') 
            {
                error.className = "form-control";
                error.style.display = "block"
            }
        }
    }



    //-------------------------to set all selected values to question object--------------
    const handleSelectedField = (value,field) =>
    {

        switch(field)
        {
            case 'subject' :
                {
                    setQueObject({...QueObject , subject : value})
                    // error.style.display = "none"
                    handleError('Subject',value)
                    handleError('Topic',value)
                    break;
                }

            case 'topic' :
                {   
                    setQueObject({...QueObject,topic:value})   
                    handleError('Topic',value)
                    break;
                }

            case 'type' :
                {
                    
                    setQueObject({...QueObject , type : value})
                    handleError('Type',value)
                    break;
                }

            case 'diffLevel' :
                {
                    setQueObject({...QueObject , diffLevel : value})
                    handleError('Difficulty level',value)
                    break;
                }
                
            case 'rightMarks' :
                {
                    setQueObject({...QueObject , rightMarks : parseInt(value)})
                    value!='' && handleError('Right marks',value)
                    break;
                }

            case 'wrongMarks' :
                {
                    setQueObject({...QueObject , wrongMarks : parseInt(value)})
                    value!='' && handleError('Wrong marks',value)
                    break;
                }

            case 'questionText' :
                {
                    
                    let hasText = !!value.replace(/(<([^>]+)>)/ig, "").length;
                    if((!hasText && richText === true) || value==="<p> </p>")
                    {
                        console.log("hi1",value);
                        handleError('richQueText','')
                        value = ''
                        setQueObject({...QueObject , questionText : value})
                    }
                    else if(hasText && richText === true)
                    {console.log("hi2");
                        handleError('richQueText',value)
                        setQueObject({...QueObject , questionText : value})
                    }
                    else
                    {
                        handleError('qText',value)
                        setQueObject({...QueObject , questionText : value})
                    }
                    break;
                }
        }
        
    }


    //-----------------------------to check whether option has duplicate value--------------------------
    const hasDuplicateOption = () =>
    {
        for(let i=0; i<QueObject.options.length; i++)
        {
            for(let j=i+1; j<QueObject.options.length; j++)
            {
                 
                /* If duplicate found then increment count by 1 */
                if(QueObject.options[j].option!='')
                {
                    if(QueObject.options[i].option == QueObject.options[j].option)
                    {
                        handleError(`DuplicateOpt`,'flag')
                        flag = 1
                    }
                }
            }
             
        }
         
        flag===0 && handleError(`DuplicateOpt`,'');
    }
 
    
    //----------------------to add options in object-------------------
    const handleChange = (val , ind) =>
    {
       
        let hasText = !!val.replace(/(<([^>]+)>)/ig, "").length;
        if((!hasText && QueObject.options[ind].richTextEditor === true) || val==="<p> </p>")
        {
           
            handleError(`Option${ind+1}`,'')
            val = ''
            QueObject.options[ind].option = val
            setQueObject({...QueObject})
        }
        else 
        {
            handleError(`Option${ind+1}`,val)
            QueObject.options[ind].option = val
            setQueObject({...QueObject})
            
        }
        hasDuplicateOption()
    }
    
    
    

    //----------------------to set checked option--------------------------
    const handleChecked = (ind) =>
    {
        if(QueObject.type==="MULTIPLE CHOICE" || QueObject.type==="FILL IN BLANKS")
        {
            for(let i=0 ; i<QueObject.options.length ; i++)
            {
                QueObject.options[i].isCorrect = false
                setQueObject({...QueObject})
            }
            console.log(QueObject)
            
            QueObject.options[ind].isCorrect = !QueObject.options[ind].isCorrect
            setQueObject({...QueObject})
            
        }
        else
        {
           
            QueObject.options[ind].isCorrect = !QueObject.options[ind].isCorrect
            setQueObject({...QueObject})
            
        }
        handleError('CorrectOpt','')
        
    }
   

    //--------------------------to add option-------------------------
    const AddOption = () =>
    {
        let array = 
        {
            option:'',
            isCorrect:false,
            richTextEditor: false
        }
        setQueObject({...QueObject , options : [...QueObject.options,array] })
    }

   //-------------------------to remove option-------------------------
    const RemoveOption = (ind) =>
    {
        if(QueObject.options.length>2)
        {
            QueObject.options.splice(ind,1)
            setQueObject({...QueObject , options : [...QueObject.options]})
        }
    }

    //------------------------------cancel the new question and goes back to display question---------------------------
    const handleCancel = () =>
    {
        navigate(-1)
        handleDisplayNavbar(true)
    }
    // console.log(QueObject);

    //------------------------------to check if any field empty or not before edit question------------------------------------------------
    const hasAnyFieldEmpty = () =>
    {
        let k=0 , i=0
            
            if(QueObject.subject === '')
                {
                    handleError('Subject','DEFAULT')
                    hasError = true
                }

            if(QueObject.topic === '')
                {
                    handleError('Topic','DEFAULT')
                    hasError = true
                    
                }

            if(QueObject.type === '')
                {
                    handleError('Type','DEFAULT')
                    hasError = true
                }

            if(QueObject.diffLevel === '')
                {
                    handleError('Difficulty level','DEFAULT')
                    hasError = true
                }           
                
            if(QueObject.rightMarks === '')
                {
                    handleError('Right Marks','')
                    hasError = true
                }

            if(QueObject.wrongMarks === '')
                {
                    handleError('Wrong Marks','')
                    hasError = true
                }

            
            if(QueObject.questionText === '')
                {
                    richText!=true ? handleError('qText','') : handleError('richQueText')
                    hasError = true
                }

                QueObject.options.map((opt,ind)=>            
                {
                    //option is empty
                    if(opt.option == '')
                    {
                        
                        handleError(`Option${ind+1}`,'')
                        hasError = true
                        k=1
                        
                    }
                })

                QueObject.options.map((opt,ind)=>            
                { 
                    //option is not checked
                    if(opt.isCorrect === true && k!=1)
                    {
                        hasChecked = true
                        k=1
                    }
                                 
                })
            
            if(IsDuplicate == true)
            {
                hasError = true
                // console.log(hasDuplicateOption);
            }
            else 
            {
                if(k==0)
                {
                    handleError('CorrectOpt','DEFAULT')
                    hasError = true
                }
            }
            // console.log(hasError);
            return hasError
    }
    


    //---------------------to add notification after question is added---------------------------------------
    const notify = () => 
    {
        
        toast.success('Question updated successfully!',
        { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 3000 })
    }

    //------------------------------Post question into api after clicking on save question button-----------------------
    const editQuestion = async() =>
    {
        // console.log(!hasAnyFieldEmpty());
        
        if(!hasAnyFieldEmpty() && hasChecked === true)
        {
            setDotSpinner(true)
            await http.put(`/questions/${queId}`,QueObject)
            notify()
            navigate(-1)
            handleDisplayNavbar(true)
        }
        // Questions = [...Questions , newQue]
        // setQuestions(Questions) 
    }


    return (

        <>
            {display===true ? 
            <NavBar /> : <></>}  
                <div className='container'>
                    <div className="card text-center" style={{margin:'40px'}}>
                        <div className="card-header" style={{fontWeight:'bold', fontSize:'26px',textAlign:'left'}}>
                            Edit Question
                            {fullscreen === true ?
                                <i className='bx bx-fullscreen' onClick={()=>handleOnclick('full')} style={{cursor:'pointer',float:'right'}} ></i>
                            :  
                                <i className='bx bx-exit-fullscreen bx-flip-horizontal' onClick={()=>handleOnclick('small')} style={{cursor:'pointer',float:'right'}}></i>}
                        </div>
                    
                        <div className="card-body">
                            
                    
                            <form >                    
                                <div className="form-row">
                                    <div className="form-group col-md-6 ">
                                            <div style={{textAlign:'left'}}>
                                                <label> Select Subject  </label>
                                            </div>

                                            <select required className="form-control" style={{position:"relative"}} value={QueObject.subject ? QueObject.subject : "DEFAULT"}  
                                                // onBlur={(e)=>handleError(e.target.value , 'Subject')} 
                                                onChange={(e)=>handleSelectedField(e.target.value,'subject')}>
                                                <option disabled hidden value="DEFAULT">Type to search subject....</option>
                                                {AllSubject ? AllSubject.map((sub)=>   
                                                (
                                                    <option key={sub._id} value={sub._id}>{sub.name} </option>
                                                    
                                                )) : ('')}
                                            </select>

                                            {QueObject.subject &&
                                                <span className="cancel" style={{position:"absolute",top:"38px",right:"0",marginRight: "30px",cursor:"pointer"}}> 
                                                    <BiX size={18} className='text-muted' 
                                                        onClick = {()=>{
                                                                            setQueObject({...QueObject , subject : '' , topic : ''});
                                                                            handleError( 'Subject','DEFAULT')
                                                                        }}
                                                    />
                                                </span>}
                                            <span  id = "Subject" style={{color:"red",display:"none",float:"left",fontSize:"12px",marginTop:"4px"}}> Subject is required</span>
                                    </div>
                                    
                                    <div className="form-group col-md-6">
                                            <div style={{textAlign:'left'}}>
                                                <label >Select Topic</label>
                                            </div>
                                    
                                            <select className="form-control" style={{position:"relative"}} value={QueObject.topic ? QueObject.topic : "DEFAULT"} onChange={(e)=>handleSelectedField(e.target.value,'topic')}
                                            // onBlur={(e)=>handleError(e.target.value , 'Topic')} 
                                            >
                                            <option value="DEFAULT" disabled hidden>Type to search topic....</option>
                                            {AllTopic ? AllTopic.map((top,i) =>
                                            (   top.subject._id === QueObject.subject &&
                                                <option key={i} value={top._id}> {top.name} </option>
                                            )) : ('')}
                                            </select>
                                            {QueObject.topic &&
                                                <span className="cancel" style={{position:"absolute",top:"38px",right:"0",marginRight: "30px",cursor:"pointer"}}> 
                                                    <BiX size={18} className='text-muted' 
                                                        onClick={()=>{
                                                                        setQueObject({...QueObject , topic : ''})
                                                                        handleError('Topic' ,  'DEFAULT')
                                                                    }} 
                                                    />
                                                </span>}
                                            <span  id="Topic" style={{color:"red",display:"none",float:"left",fontSize:"12px",marginTop:"4px"}}> Topic is required </span>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-3">
                                            <div style={{textAlign:'left'}}>
                                                <label> Question Type  </label>
                                            </div>

                                            <select id="inputState" style={{position:"relative"}} value={QueObject.type ? QueObject.type : "DEFAULT"} className="form-control"
                                            // onBlur={(e)=> handleError(e.target.value , 'Type')}  
                                            onChange={(e)=>handleSelectedField(e.target.value,'type')}>
                                                <option value="DEFAULT" disabled hidden>Type to search ....</option>
                                                <option value="MULTIPLE CHOICE"> MULTIPLE CHOICE </option>
                                                <option value='MULTIPLE RESPONSE'> MULTIPLE RESPONSE </option>
                                                <option value='FILL IN BLANKS'> FILL IN BLANKS </option>
                                            </select>
                                    
                                            {QueObject.type &&
                                            <span className="cancel" style={{position:"absolute",top:"42px",right:"0",marginRight: "40px",cursor:"pointer"}}> 
                                                <BiX size={18} className='text-muted position-absolute'
                                                    onClick={()=>{
                                                                    setQueObject({...QueObject , type : ''})
                                                                    handleError('Type', 'DEFAULT')
                                                                }} 
                                                />
                                            </span>}

                                            <span  id="Type" style={{color:"red",display:"none",float:"left",fontSize:"12px",marginTop:"4px"}}>Question Type is required</span>
                                    </div>

                                    <div className="form-group col-md-3">
                                            <div style={{textAlign:'left'}}>
                                                <label> Difficulty Level  </label>
                                            </div>

                                        {QueObject.diffLevel &&
                                            <span className="cancel" style={{position:"absolute",top:"42px",right:"0",marginRight: "40px",cursor:"pointer"}}> 
                                                <BiX size={18} className='text-muted position-absolute'  
                                                    onClick={()=>{
                                                                    setQueObject({...QueObject , diffLevel : ''})
                                                                    handleError('Difficulty level' , 'DEFAULT')
                                                    }} />
                                            </span>}

                                            <select id="inputState" className="form-control" value={QueObject.diffLevel ? QueObject.diffLevel : "DEFAULT"} onChange={(e)=>handleSelectedField(e.target.value,'diffLevel')}>
                                                <option value="DEFAULT" disabled hidden>Type to search ....</option>
                                                <option > Easy </option>
                                                <option > Medium </option>
                                                <option > Hard </option>
                                            </select>

                                            <span  id="Difficulty level" style={{color:"red",display:"none",float:"left",fontSize:"12px",marginTop:"4px"}}> Difficulty level is required</span>
                                    </div>

                                    <div className="form-group col-md-3">
                                            <div style={{textAlign:'left'}}>
                                                <label> Right Marks  </label>
                                            </div>

                                            <input type="text" id="Rmarks" className="form-control" onBlur={(e)=>handleError('Right marks',e.target.value)} value={QueObject.rightMarks ? QueObject.rightMarks : ''} placeholder={QueObject.rightMarks ? " " :  'Enter right marks'} 
                                            onChange={(e)=>handleSelectedField(e.target.value,'rightMarks')}/>
                                            <span  id="Right marks" style={{color:"red",display:"none", float:"left",fontSize:"12px",marginTop:"4px"}}> Right marks is required </span>
                                    </div>

                                    <div className="form-group col-md-3">
                                            <div style={{textAlign:'left'}}>
                                                <label> Wrong Marks  </label>
                                            </div>

                                            <input type="text" id="Wmarks" className="form-control"  onBlur={(e)=>handleError('Wrong marks',e.target.value )} value={QueObject.wrongMarks===0 || QueObject.wrongMarks ? QueObject.wrongMarks : ''}  placeholder={QueObject.wrongMarks ? " " :  'Enter wrong marks'}  
                                            onChange={(e)=>handleSelectedField(e.target.value,'wrongMarks')}/>
                                            <span  id="Wrong marks" style={{color:"red",display:"none",float:"left",fontSize:"12px",marginTop:"4px"}}> Wrong marks is required </span>
                                    </div>

                                </div>

                                <div className="form-group">
                                        <div style={{textAlign:'left'}}>
                                            <label>Question</label>
                                        </div>
                                    
                                        { richText === false ?
                                        <>
                                            <div className="questxt" style={{ display: richText ? 'none' : 'block' }}>
                                                <textarea className="form-control" id="qText" onBlur={(e)=> handleError('qText',e.target.value)} onChange={(e)=>handleSelectedField(e.target.value,'questionText')}
                                                value={QueObject.questionText}  formcontrolname="questionText" rows="6">
                                                </textarea>

                                                <div style={{textAlign:'left'}}>
                                                    <a className='text-muted' href='/EditQuestionForm' style={{cursor:"pointer"}} onClick={()=>setrichText(true)}>
                                                        Enable Rich text editor
                                                    </a>
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="questxt" style={{ display: richText ? 'block' : 'none'}}>
                                                <ReactQuill theme={'snow'} id="qText"
                                                    placeholder="Insert text here..."
                                                    modules={EditQuestionForm.modules}
                                                    formats={EditQuestionForm.formats}
                                                    onChange={(e)=>handleSelectedField(e,'questionText')}
                                                    value = {QueObject.questionText}
                                                    style={{height:"12rem",marginBottom:"3rem"}}
                                                />
                                            </div>

                                            <div style={{textAlign:'left'}}>
                                                <a className='text-muted' href='/EditQuestionForm' style={{cursor:"pointer"}} onClick={()=>setrichText(false)} >
                                                    Disable Rich text editor
                                                </a>
                                            </div>
                                            <span  id="richQueText" style={{color:"red",display:"none",float:"left",fontSize:"12px",marginTop:"4px"}}>Question Text is required</span>&nbsp;&nbsp;
                                        </>
                                        }
                                </div>  

                                <div className='form-group'>
                                        <div style={{textAlign:'left'}}>
                                                    <label> Options </label>
                                        </div>

                                        { QueObject.options.length ?
                                        (
                                            QueObject.options.map((opt,ind) =>
                                            <div className="input-group" key={ind} style={{marginTop:"30px"}}>
                                                <div className="input-group-prepend">
                                                    <div className="input-group-text">
                                                        <input type={QueObject.type==="MULTIPLE CHOICE" || QueObject.type==="FILL IN BLANKS" ? "radio" : "checkbox"} 
                                                            aria-label="Radio button for following text input" 
                                                            style={{marginRight:"6px" }} 
                                                            onChange={()=>handleChecked(ind)}
                                                            checked={!!opt.isCorrect}
                                                            name="a"
                                                        />
                                                        Option {ind+1}
                                                    </div>
                                                </div>
                                                
                                                {opt.richTextEditor === false ?
                                                <>
                                                    <textarea className="form-control" onBlur={(e)=>handleError(`Option${ind+1}`,e.target.value)} style={{display:"block"}}
                                                        formcontrolname="questionText" rows="4" value={opt.option} onChange={(e)=>handleChange(e.target.value,ind)}>
                                                    </textarea>

                                                    <div className='col-md-12' style={{textAlign:'left' , paddingLeft:'-10px',marginLeft:"-15px"}}>
                                                        <a className='text-muted' href='/EditQuestionForm' style={{cursor:"pointer"}} onClick={() => RemoveOption(ind)}>
                                                            Remove option 
                                                        </a> 
                                                        
                                                        <span className="text -muted"> | </span>

                                                        <a _ngcontent-waj-c5="" href='/EditQuestionForm' className="text-muted" style={{cursor:"pointer"}} onClick={()=>{opt.richTextEditor = true ; setQueObject({...QueObject})}}>
                                                            Enable Rich text editor
                                                        </a>
                                                    </div>  &nbsp;&nbsp; 
                                                    <span  id={`Option${ind+1}`} style={{color:"red",display:"none",float:"left",fontSize:"12px",marginTop:"4px"}}>Option is required</span>                         
                                                </> 
                                                :
                                                <>
                                                    <div className="questxt" style={{ display: opt.richTextEditor ? 'block' : 'none'}}>
                                                        <ReactQuill theme={'snow'} 
                                                            placeholder="Insert text here..."
                                                            modules={EditQuestionForm.modules}
                                                            formats={EditQuestionForm.formats}
                                                            onChange={(e)=>handleChange(e,ind)}
                                                            value = {opt.option}
                                                            onBlur = {(e)=>opt.option ? handleError(`Option${ind+1}`,'flag') : handleError(`Option${ind+1}`,opt.option) }
                                                            
                                                        />
                                                    </div>

                                                    <div className='col-md-12' style={{textAlign:'left' , paddingLeft:'-10px',marginLeft:"-15px"}}>
                                                        <a className='text-muted' href='/EditQuestionForm' style={{cursor:"pointer"}} onClick={() => RemoveOption(ind)}>
                                                            Remove option 
                                                        </a> 
                                                        
                                                        <span className="text -muted"> | </span>

                                                        <a  href='/EditQuestionForm' className="text-muted" style={{cursor:"pointer"}} onClick={()=>{opt.richTextEditor = false ; setQueObject({...QueObject})}}>
                                                            Disable Rich text editor
                                                        </a>
                                                    </div>  &nbsp;&nbsp; 
                                                    <span  id={`Option${ind+1}`} style={{color:"red",display:"none",float:"left",fontSize:"12px",marginTop:"4px"}}>Option is required</span>
                                                </>
                                                                                
                                                }
                                            
                                            </div>)
                                        ) : (<div></div>)
                                        }
                                </div> 
                                

                                <div className="my-3">
                                    <div style={{textAlign:'left'}}> 
                                        <a className="text-decoration-none" style={{cursor:"pointer"}} onClick={AddOption}>
                                            <AiOutlinePlus size={18} style={{marginBottom:"4px",marginRight:"6px"}}/> 
                                                Add option 
                                        </a>
                                    </div>
                                    <span id="CorrectOpt" style={{color:"red",display:"none",float:"left",fontSize:"12px",marginTop:"4px"}}>Please select correct answer from options </span><br/>
                                    <span id="DuplicateOpt" style={{color:"red",display:"none",float:"left",fontSize:"12px",marginTop:"4px"}}>Duplicate options are not allowed.</span>
                                </div>      
                            </form>

                    
                        </div>
                        <div className="card-footer text-muted" style={{textAlign:'left'}}>
                        { DotSpinner ? 
                                <button type="button" className="btn btn-primary" style={{height:'50px',width:'180px',fontSize:'18px'}} onClick={editQuestion} disabled>
                                    <div style={{marginLeft:"60px"}}>
                                    <ThreeDots style={{marginBottom:"10px"}} color="white"  height={40} width={40}/>
                                    </div>
                                </button>
                            :
                                <button type="button" className="btn btn-primary" style={{height:'50px',width:'180px',fontSize:'18px'}} onClick={editQuestion}>Update Question</button> 
                            }
                            &nbsp;&nbsp;&nbsp;<button type="button" className="btn btn-light" style={{height:'50px'}} onClick={handleCancel} >Cancel</button>
                        </div>
                        
                    </div>
                </div>
        </>
    )
}


EditQuestionForm.modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' },
      { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean'],
      ['code-block']
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    }
  }
  
  EditQuestionForm.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ]

export default EditQuestionForm

// { DotSpinner ? 
//     <button type="button" className="btn btn-primary" style={{height:'50px',width:'180px',fontSize:'18px'}} onClick={editQuestion}>
//         <Loader type="ThreeDots" height={80} width={80}/>
//     </button>
// :
//     <button type="button" className="btn btn-primary" style={{height:'50px',width:'180px',fontSize:'18px'}} onClick={editQuestion}>Update Question</button> 
// }

{/* <div className="card-footer text-muted" style={{textAlign:'left'}}>
                    <button type="button" className="btn btn-primary" style={{height:'50px',width:'180px',fontSize:'18px'}} onClick={editQuestion}>{DotSpinner ? <Loader type="ThreeDots" height={80} width={80}/> :'Update Question'}</button> &nbsp;&nbsp;
                    <button type="button" className="btn btn-light" style={{height:'50px'}} onClick={handleCancel} >Cancel</button>
                </div>
                 */}