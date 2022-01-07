import React,{useState,useEffect,useRef} from 'react'
import './App.css'
import { useNavigate } from 'react-router-dom'
import {AiOutlinePlus} from 'react-icons/ai'
import {BiX} from 'react-icons/bi'
import { selectOptions } from '@testing-library/user-event/dist/select-options'
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse'
import http from './http'
import QuestionList from './QuestionList'



function Form({QueObject,setQueObject,handleError}) 
{

    
    let navigate = useNavigate()

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
                    handleError(value,'Subject')
                    handleError(value,'Topic')
                    break;
                }

            case 'topic' :
                {   
                    setQueObject({...QueObject,topic:value})   
                    handleError(value,'Topic')
                    break;
                }

            case 'type' :
                {
                    
                    setQueObject({...QueObject , type : value})
                    handleError(value,'Type')
                    break;
                }

            case 'diffLevel' :
                {
                    setQueObject({...QueObject , diffLevel : value})
                    handleError(value,'Difficulty level')
                    break;
                }
                
            case 'rightMarks' :
                {
                    setQueObject({...QueObject , rightMarks : value})
                    value!='' && handleError(value,'Right marks')
                    break;
                }

            case 'wrongMarks' :
                {
                    setQueObject({...QueObject , wrongMarks : value})
                    value!='' && handleError(value,'Wrong marks')
                    break;
                }

            case 'questionText' :
                {
                    setQueObject({...QueObject , questionText : value})
                    value!=='' && handleError(value,'qText')
                    break;
                }
        }
        
    }
    


    //-------------------------------after clicking cancel icon--------------------------------------------
    const handleCancelClick = (field) =>
    {
        
        switch(field)
        {
            case 'Subject':
                {
                    setQueObject({...QueObject , subject : '' , topic : ''})
                    handleError( 'DEFAULT','Subject')
                    // setQueObject({...QueObject , topic : ''})
                    break;
                }

            case 'Topic':
                {
                    setQueObject({...QueObject , topic : ''})
                    handleError( 'DEFAULT','Topic')
                    break;
                }

            case 'Type':
                {
                    setQueObject({...QueObject , type : ''})
                    handleError('DEFAULT','Type')
                    break;
                }

            case 'Difficulty level':
                {
                    setQueObject({...QueObject , diffLevel : ''})
                    handleError('DEFAULT','Difficulty level')
                    break;
                }
        }
    }

    //----------------------to add options in object-------------------
    const handleChange = (val , ind) =>
    {
        let flag = 0
        QueObject.options.map((opt)=>
        {
            if(opt.option === val) 
            {
                handleError(val,`duplicateOption`)
            }
            flag=1 
        })
       
        flag===0 && handleError('','duplicateOption')
        QueObject.options[ind].option = val
        setQueObject({...QueObject})
        handleError(val,`Option${ind+1}`)
    
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
        handleError('','selectOption')
        
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


    
    const handleKeys = (evt) =>
    {
        var charCode = (evt.which) ? evt.which : window.event.keyCode;
        console.log(charCode);
        if ((charCode < 48 || charCode > 57))
            return true;
        else
            return false;
    }

  
    return (
        <div>
            
            <form >
  
                    
                <div className="form-row">
                    <div className="form-group col-md-6 ">
                            <div style={{textAlign:'left'}}>
                                <label> Select Subject  </label>
                            </div>

                            <select required className="form-control" value={QueObject.subject ? QueObject.subject : "DEFAULT"}  
                                // onBlur={(e)=>handleError(e.target.value , 'Subject')} 
                                onChange={(e)=>handleSelectedField(e.target.value,'subject')}>
                                <option disabled hidden value="DEFAULT">Type to search subject....</option>
                                {AllSubject ? AllSubject.map((sub)=>   
                                (
                                    <option key={sub._id} value={sub._id}>{sub.name} </option>
                                    
                                )) : ('')}
                            </select>

                            {QueObject.subject &&
                                <span className="cancel" > 
                                    <BiX size={18} className='text-muted' style={{marginLeft:"340px" , marginTop:"-65px"}} onClick={()=>handleCancelClick('Subject')} />
                                </span>}
                            <span  id = "Subject" style={{color:"red", float:"left",fontSize:"12px",marginTop:"4px"}}> </span>
                    </div>
                    
                    <div className="form-group col-md-6">
                            <div style={{textAlign:'left'}}>
                                <label> Select Topic </label>
                            </div>
                    
                            <select className="form-control" value={QueObject.topic ? QueObject.topic : "DEFAULT"} onChange={(e)=>handleSelectedField(e.target.value,'topic')}
                                // onBlur={(e)=>handleError(e.target.value , 'Topic')} 
                             >
                                <option value="DEFAULT" disabled hidden>Type to search topic....</option>
                                {AllTopic ? AllTopic.map((top,i) =>
                                (   top.subject._id === QueObject.subject &&
                                    <option key={i} value={top._id}> {top.name} </option>
                                )) : ('')}
                            </select>
                            {QueObject.topic &&
                                <span className="cancel" > 
                                    <BiX size={18} className='text-muted' style={{marginLeft:"340px" , marginTop:"-65px"}} onClick={()=>handleCancelClick('Topic')} />
                                </span>}
                            <span  id="Topic" style={{color:"red", float:"left",fontSize:"12px",marginTop:"4px"}}> </span>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-3">
                            <div style={{textAlign:'left'}}>
                                <label> Question Type  </label>
                            </div>

                            {QueObject.type &&
                                <span className="cancel" > 
                                    <BiX size={18} className='text-muted position-absolute' style={{marginLeft:"60px" ,marginTop:"10px"}} onClick={()=>handleCancelClick('Type')} />
                                </span>}

                                <select id="inputState" value={QueObject.type ? QueObject.type : "DEFAULT"} className="form-control"
                                // onBlur={(e)=> handleError(e.target.value , 'Type')}  
                                onChange={(e)=>handleSelectedField(e.target.value,'type')}>
                                    <option value="DEFAULT" disabled hidden>Type to search ....</option>
                                    <option value="MULTIPLE CHOICE"> MULTIPLE CHOICE </option>
                                    <option value='MULTIPLE RESPONSE'> MULTIPLE RESPONSE </option>
                                    <option value='FILL IN BLANKS'> FILL IN BLANKS </option>
                                </select>
                            
                                <span  id="Type" style={{color:"red", float:"left",fontSize:"12px",marginTop:"4px"}}> </span>
                    </div>

                    <div className="form-group col-md-3">
                            <div style={{textAlign:'left'}}>
                                <label> Difficulty Level  </label>
                            </div>

                            {QueObject.diffLevel &&
                                <span className="cancel" > 
                                    <BiX size={18} className='text-muted position-absolute' style={{marginLeft:"60px" ,marginTop:"10px"}} onClick={()=>handleCancelClick('Difficulty level')} />
                                </span>}

                            <select id="inputState" className="form-control" value={QueObject.diffLevel ? QueObject.diffLevel : "DEFAULT"} onChange={(e)=>handleSelectedField(e.target.value,'diffLevel')}>
                                <option value="DEFAULT" disabled hidden>Type to search ....</option>
                                <option > Easy </option>
                                <option > Medium </option>
                                <option > Hard </option>
                            </select>

                            <span  id="Difficulty level" style={{color:"red", float:"left",fontSize:"12px",marginTop:"4px"}}> </span>
                    </div>

                    <div className="form-group col-md-3">
                            <div style={{textAlign:'left'}}>
                                <label> Right Marks  </label>
                            </div>

                            <input type="text" id="Rmarks" className="form-control" onKeyPress={(e)=>handleKeys(e)} onBlur={(e)=>handleError(e.target.value , 'Right marks')} value={QueObject.rightMarks ? QueObject.rightMarks : ''} placeholder={QueObject.rightMarks ? " " :  'Enter right marks'} 
                             onChange={(e)=>handleSelectedField(e.target.value,'rightMarks')}/>
                            <span  id="Right marks" style={{color:"red", float:"left",fontSize:"12px",marginTop:"4px"}}> </span>
                    </div>

                    <div className="form-group col-md-3">
                            <div style={{textAlign:'left'}}>
                                <label> Wrong Marks  </label>
                            </div>

                            <input type="text" id="Wmarks" className="form-control"  onBlur={(e)=>handleError(e.target.value , 'Wrong marks')} value={QueObject.wrongMarks===0 || QueObject.wrongMarks ? QueObject.wrongMarks : ''}  placeholder={QueObject.wrongMarks ? " " :  'Enter wrong marks'}  
                            onChange={(e)=>handleSelectedField(e.target.value,'wrongMarks')}/>
                            <span  id="Wrong marks" style={{color:"red", float:"left",fontSize:"12px",marginTop:"4px"}}> </span>
                    </div>

                </div>

                <div className="form-group">
                        <div style={{textAlign:'left'}}>
                            <label>Question</label>
                        </div>
                    
                        <textarea className="form-control" id="qText" onBlur={(e)=> handleError(e.target.value,'qText')} onChange={(e)=>handleSelectedField(e.target.value,'questionText')}
                            formcontrolname="questionText" rows="6">
                        </textarea>

                        <div style={{textAlign:'left'}}>
                            <a className='text-muted' href="#">
                                Enable Rich text editor
                            </a>
                        </div>
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
                                    
                                    <textarea className="form-control" onBlur={(e)=>handleError(e.target.value , `Option${ind+1}`)}
                                        formcontrolname="questionText" rows="4" value={opt.option} onChange={(e)=>handleChange(e.target.value,ind)}>
                                    </textarea>

                                    <div className='col-md-12' style={{textAlign:'left' , paddingLeft:'-10px',marginLeft:"-15px"}}>
                                        <a className='text-muted' style={{cursor:"pointer"}} onClick={() => RemoveOption(ind)}>
                                            Remove option 
                                        </a> 
                                        
                                        <span className="text -muted"> | </span>

                                        <a _ngcontent-waj-c5="" className="text-muted" href="#" >
                                            Enable Rich text editor
                                        </a>
                                    </div>  &nbsp;&nbsp; 
                                    <span  id={`Option${ind+1}`} style={{color:"red", float:"left",fontSize:"12px",marginTop:"4px"}}> </span>                         
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
                    <span id="selectOption" style={{color:"red",display:"none",float:"left",fontSize:"12px",marginTop:"4px"}}>Please select correct answer from options </span><br/>
                    <span id="duplicateOption" style={{color:"red",display:"none",float:"left",fontSize:"12px",marginTop:"4px"}}>Duplicate options are not allowed.</span>
                </div>      
            </form>

            
        </div>
    )
}

export default Form;


