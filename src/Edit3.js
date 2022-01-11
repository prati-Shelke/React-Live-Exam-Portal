import React,{useState,useEffect} from 'react'
import {useNavigate,useLocation} from 'react-router-dom';
import http from './http';
import Form from './Form';
import ReactQuill from 'react-quill';
import {BiX} from 'react-icons/bi'
import {AiOutlinePlus} from 'react-icons/ai'


function EditQuestionForm({handleDisplayNavbar}) 
{

    let navigate = useNavigate()
    let hasError = false ;
    let [isDuplicateOption,setisDuplicateOption] = useState(false);
    let flag = 0,s,t
    let question = useLocation().state.question
    console.log(question);
    
    let [QueObject,setQueObject] = useState({
        type : question.type ,
        diffLevel : question.diffLevel ,
        subject : question.subject ,
        topic : question.topic ,
        rightMarks : question.rightMarks ,
        wrongMarks : question.wrongMarks,
        questionText : question.questionText ,
        options : question.options
    })
   
    //-----------------------all values from api------------------------
    
    const [AllSubject,setAllSubject] = useState()
    const [AllTopic,setAllTopic] = useState()
    const [richText , setrichText] = useState(false)
    let [Subject,setSubject] = useState()
    let [Topic,setTopic] =useState()
    
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
    
    // const pattern = /<\/?[a-z][\s\S]*>/i;
    // let rad = QueObject.options.map((q) => (
    // {
    //     ...q, richTextEditor: pattern.test(q.option)
    // }))
    
    // console.log(rad);
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
    
    
    //------------------------------cancel the new question and goes back to display question---------------------------
    const handleCancel = () =>
    {
        navigate(-1)
        handleDisplayNavbar(true)
    }
    
    //-------------------------------------to display error message on particular field--------------------------------
    const handleError = (field , value = '') =>
    {
                        
        let error = document.getElementById(`${field}`)   
        console.log('value',value)
        console.log('error',error)
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
                    setisDuplicateOption(true)
                }
                else
                {
                    error.style.display="none"
                    setisDuplicateOption(false)
                }
            
        }           
        else if(value === '' || value === 'DEFAULT')
        {
            
            if(field === 'Subject' || field === 'Topic' || field === 'Type' || field === 'Difficulty level')
            {
                error.style.display = "block"
            }

            else if(field === 'Right marks' || field === 'Wrong marks' || field === 'qText')
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

            if(QueObject.questionText === '' )
                {
                    handleError('qText','')
                    hasError = true
                }
            
            
                QueObject.options.map((opt,ind)=>            
                {
                    // opt.option == '' && handleError('',`Option${ind+1}`)
                    if(opt.option == '')
                    {
                        
                        handleError(`Option${ind+1}`,'')
                        hasError = true
                        k=1
                    }
                    else 
                    {  
                        if(opt.isCorrect === true)
                        {
                            
                            hasError = false
                            k=1
                        }
                    }                
                })
            console.log(hasDuplicateOption);
            if(hasDuplicateOption == true)
            {
                hasError = true
                console.log(hasDuplicateOption);
            }
            else 
            {
                if(k==0)
                {
                    handleError('CorrectOpt','DEFAULT')
                    hasError = true
                }
            }
            
            return hasError
    }
    
    //------------------------------Post question into api after clicking on save question button-----------------------
    const postQuestion = async() =>
    {

            console.log(!hasAnyFieldEmpty());
            if(!hasAnyFieldEmpty())
            {
                await http.post('/questions',QueObject)
                navigate('/QuestionList')
                handleDisplayNavbar(true)
            }
        
        // Questions = [...Questions , newQue]
        // setQuestions(Questions) 
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
                    setQueObject({...QueObject , questionText : value})
                    richText!=true && handleError('qText',value)
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
                        handleError(`DuplicateOpt`,'falg')
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
        
        val.includes('<br>') && (val = '')
        QueObject.options[ind].option = val
        setQueObject({...QueObject})
        
        handleError(`Option${ind+1}`,val)
        hasDuplicateOption()
    }
    console.log(QueObject);


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
        setQueObject({...QueObject , options : [...QueObject.Options,array] })
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

    return (
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

                <div>
            
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
                                <label> Select Topic </label>
                            </div>
                    
                            <select className="form-control" style={{position:"relative"}} value={QueObject.topic ? QueObject.topic : "DEFAULT"} onChange={(e)=>handleSelectedField(e.target.value,'topic')}>
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
                                        value = {QueObject.questionText} formcontrolname="questionText" rows="6">
                                    </textarea>

                                    <div style={{textAlign:'left'}}>
                                        <a className='text-muted' href="#" onClick={()=>setrichText(true)}>
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
                                        modules={Form.modules}
                                        formats={Form.formats}
                                        onChange={(e)=>handleSelectedField(e,'questionText')}
                                        value = {QueObject.questionText}
                                        style={{height:"12rem",marginBottom:"3rem"}}
                                    />
                                </div>

                                <div style={{textAlign:'left'}}>
                                    <a className='text-muted' href="#" onClick={()=>setrichText(false)} >
                                        Disable Rich text editor
                                    </a>
                                </div>
                             
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
                                            <a className='text-muted' style={{cursor:"pointer"}} onClick={() => RemoveOption(ind)}>
                                                Remove option 
                                            </a> 
                                            
                                            <span className="text -muted"> | </span>

                                            <a _ngcontent-waj-c5="" className="text-muted" href="#" onClick={()=>opt.richTextEditor = true}>
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
                                                modules={Form.modules}
                                                formats={Form.formats}
                                                onChange={(e)=>handleChange(e,ind)}
                                                value = {opt.option}
                                                onBlur = {(e)=>handleError(`Option${ind+1}`,opt.option)}
                                                
                                            />
                                        </div>

                                        <div className='col-md-12' style={{textAlign:'left' , paddingLeft:'-10px',marginLeft:"-15px"}}>
                                            <a className='text-muted' style={{cursor:"pointer"}} onClick={() => RemoveOption(ind)}>
                                                Remove option 
                                            </a> 
                                            
                                            <span className="text -muted"> | </span>

                                            <a _ngcontent-waj-c5="" className="text-muted" href="#" onClick={()=>opt.richTextEditor = false}>
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
                

                <div className="my-4" >
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
                    </div>

                    <div className="card-footer text-muted" style={{textAlign:'left'}}>
                        <button type="button" className="btn btn-primary" style={{height:'50px',width:'160px',fontSize:'18px'}} onClick={postQuestion}>Update Question</button> &nbsp;&nbsp;
                        <button type="button" className="btn btn-light" style={{height:'50px'}} onClick={handleCancel}  >Cancel</button>
                    </div>
                    
                </div>
            </div>
    )
}

export default EditQuestionForm