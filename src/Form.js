import React,{useState,useEffect,useRef} from 'react'
import './App.css'
import { useNavigate } from 'react-router-dom'
import {AiOutlinePlus} from 'react-icons/ai'
import {BiX} from 'react-icons/bi'
import { selectOptions } from '@testing-library/user-event/dist/select-options'
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse'
import http from './http'
import QuestionList from './QuestionList'
import ReactQuill from 'react-quill'
import '../node_modules/react-quill/dist/quill.snow.css';



function Form({QueObject,setQueObject,handleError,richText,setrichText}) 
{

    
    let navigate = useNavigate()
    let flag = 0


    //-----------------------all values from api------------------------
    
    const [AllSubject,setAllSubject] = useState()
    const [AllTopic,setAllTopic] = useState()
    


    useEffect(async() => {
           
        const arr = QueObject.options.map(()=>
            {
                return {
                option : '' ,
                isCorrect:false ,
                richTextEditor: false
                 }
            }
         )
         
         setQueObject({...QueObject , options : arr})

        //to get subject
        setAllSubject(await http.get('/subjects?term='))

        //to get topic
        setAllTopic(await http.get('/topics?page=1&limit=9007199254740991&term='))
    
    }, [])
    
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
                    
                    if (value.includes("<img")) 
                    {
                        handleError('richQueText',value)
                        setQueObject({...QueObject , questionText : value})
                    }
                    else if((!hasText && richText === true) || value==="<p> </p>")
                    {
                        console.log("hi1",value);
                        handleError('richQueText','')
                        value = ''
                        setQueObject({...QueObject , questionText : value})
                    }
                    else if(hasText && richText === true)
                    {
                        console.log("hi2");
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
    // console.log(QueObject);


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
        if (val.includes("<img")) 
        {
            handleError(`Option${ind+1}`,val)
            QueObject.options[ind].option = val
            setQueObject({...QueObject})
            
        }
        else if((!hasText && QueObject.options[ind].richTextEditor === true) || val==="<p> </p>")
        {
            console.log("hi1",val);
            handleError(`Option${ind+1}`,'')
            val = ''
            QueObject.options[ind].option = val
            setQueObject({...QueObject})
        }
        else 
        {console.log("hi2");
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
                                        formcontrolname="questionText" rows="6">
                                    </textarea>

                                    <div style={{textAlign:'left'}}>
                                        <a className='text-muted' style={{cursor:"pointer"}} onClick={()=>setrichText(true)}>
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
                                    <a className='text-muted' style={{cursor:"pointer"}} onClick={()=>setrichText(false)} >
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
                                            <a className='text-muted' style={{cursor:"pointer"}} onClick={() => RemoveOption(ind)}>
                                                Remove option 
                                            </a> 
                                            
                                            <span className="text -muted"> | </span>

                                            <a _ngcontent-waj-c5="" className="text-muted" style={{cursor:"pointer"}} onClick={()=>{opt.richTextEditor = true ; setQueObject({...QueObject})}}>
                                                Enable Rich text editor
                                            </a>
                                        </div>  &nbsp;&nbsp; 
                                        <span  id={`Option${ind+1}`} style={{color:"red",display:"none",float:"left",fontSize:"12px",marginTop:"4px"}}>Option is required</span>                         
                                    </> 
                                    :
                                    <>
                                        <div className="questxt" style={{ display: opt.richTextEditor ? 'block' : 'none'}}>
                                            <ReactQuill theme={'snow'} 
                                                id="option"
                                                placeholder="Insert text here..."
                                                modules={Form.modules}
                                                formats={Form.formats}
                                                onChange={(e)=>handleChange(e,ind)}
                                                value = {opt.option}
                                                onBlur = {(e)=>opt.option ? handleError(`Option${ind+1}`,'flag') : handleError(`Option${ind+1}`,opt.option) }
                                                
                                            />
                                        </div>

                                        <div className='col-md-12' style={{textAlign:'left' , paddingLeft:'-10px',marginLeft:"-15px"}}>
                                            <a className='text-muted' style={{cursor:"pointer"}} onClick={() => RemoveOption(ind)}>
                                                Remove option 
                                            </a> 
                                            
                                            <span className="text -muted"> | </span>

                                            <a _ngcontent-waj-c5="" className="text-muted" style={{cursor:"pointer"}} onClick={()=>{opt.richTextEditor = false ; setQueObject({...QueObject})}}>
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
    )
}

Form.modules = {
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
  
  Form.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ]
export default Form;
