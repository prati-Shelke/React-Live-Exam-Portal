import React,{useState,useEffect} from 'react'
import './App.css'
import {AiOutlinePlus} from 'react-icons/ai'
import { selectOptions } from '@testing-library/user-event/dist/select-options'
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse'
import { useNavigate, useParams,useLocation } from 'react-router-dom'

function EditQuestionForm() 
{
    let navigate = useNavigate()
    // let qid = useParams().id

    let question = useLocation().state.question
    console.log(question);
    
    const [type,setType] = useState(null)

    const [OptionObj,setOptionObj] = useState(Array(4).fill({}))
    
    
    useEffect(() => {
        
        const arr = OptionObj.map((opt)=>
            {
                return {
                isCorrect:false ,
                option : '' , 
                }
            }
        )
        setOptionObj(arr)
    }, [])
    
    
    const selectQueType = (val) =>
    {
        setType(val)
        for(let i=0 ; i<OptionObj.length ; i++)
            {
                OptionObj[i].isCorrect = false
                setOptionObj([...OptionObj])
            }
    }

    const handleChange = (val , ind) =>
    {
        
        OptionObj[ind].option = val
        setOptionObj([...OptionObj])
    }

    const handleChecked = (ind) =>
    {
        if(type==="multiple-choice" || type==="fill-in-blanks" || type===null)
        {
            for(let i=0 ; i<OptionObj.length ; i++)
            {
                OptionObj[i].isCorrect = false
                setOptionObj([...OptionObj])
            }
            OptionObj[ind].isCorrect = !OptionObj[ind].isCorrect
            setOptionObj([...OptionObj])
        }
        else
        {
            OptionObj[ind].isCorrect = !OptionObj[ind].isCorrect
            setOptionObj([...OptionObj])
        }
        
    }
    
    const AddOption = () =>
    {
        let array = 
        {
            isCorrect:false,
            option:''
        }
        setOptionObj([...OptionObj,array])
    }

    const RemoveOption = (ind) =>
    {
        OptionObj.splice(ind,1)
        setOptionObj([...OptionObj])
        
    }

    return (
        <div>
            
            <form >
  
                <div className='container'>
                    <div className="card text-center" style={{margin:'40px'}}>
                        <div className="card-header" style={{fontWeight:'bold', fontSize:'26px',textAlign:'left'}}>
                            Edit Question
                        </div>
            
                        <div className="card-body">  
                        <div className="form-row">
                            <div className="form-group col-md-6 ">
                                    <div style={{textAlign:'left'}}>
                                        <label> Select Subject  </label>
                                    </div>

                                    <select id="inputState" className="form-control">
                                        <option value="DEFAULT">Type to search subject....</option>
                                        <option>...</option>
                                    </select>
                            </div>
                            
                            <div className="form-group col-md-6">
                                    <div style={{textAlign:'left'}}>
                                        <label >Select Topic</label>
                                    </div>
                            
                                    <select id="inputState" className="form-control">
                                        <option value="DEFAULT">Type to search topic....</option>
                                        <option>...</option>
                                    </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-3">
                                    <div style={{textAlign:'left'}}>
                                        <label> Question Type  </label>
                                    </div>

                                    <select id="inputState" className="form-control" onClick={(e)=>selectQueType(e.target.value)}>
                                        <option value="multiple-choice"> MULTIPLE CHOICE </option>
                                        <option value='multiple-response'> MULTIPLE RESPONSE </option>
                                        <option value='fill-in-blanks'> FILL IN BLANKS </option>
                                    </select>
                            </div>

                            <div className="form-group col-md-3">
                                    <div style={{textAlign:'left'}}>
                                        <label> Difficulty Level  </label>
                                    </div>

                                    <select id="inputState" className="form-control" defaultValue="Medium" >
                                        <option > Easy </option>
                                        <option value="Medium"> Medium </option>
                                        <option > Hard </option>
                                    </select>
                            </div>

                            <div className="form-group col-md-3">
                                    <div style={{textAlign:'left'}}>
                                        <label> Right Marks  </label>
                                    </div>

                                    <input type="email" className="form-control" id="inputEmail4" />
                            </div>

                            <div className="form-group col-md-3">
                                    <div style={{textAlign:'left'}}>
                                        <label> Wrong Marks  </label>
                                    </div>

                                    <input type="email" className="form-control" id="inputEmail4" />
                            </div>

                        </div>

                        <div className="form-group">
                                <div style={{textAlign:'left'}}>
                                    <label>Question</label>
                                </div>
                            
                                <textarea className="form-control"
                                    formcontrolname="questionText" id="question" rows="6">
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

                                { OptionObj.length ?
                                    (
                                        OptionObj.map((opt,ind) =>
                                        <div className="input-group" key={ind}>
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <input type={type==="multiple-choice" || type==="fill-in-blanks" || type===null? "radio" : "checkbox"} 
                                                        aria-label="Radio button for following text input" 
                                                        style={{marginRight:"6px" ,marginBottom:"4px"}} 
                                                        onChange={()=>handleChecked(ind)}
                                                        checked={!!opt.isCorrect}
                                                    />
                                                    Option {ind+1}
                                                </div>
                                            </div>
                                            
                                            <textarea className="form-control"
                                            formcontrolname="questionText" id="question" rows="4" onChange={(e)=>handleChange(e.target.value,ind)}>
                                            </textarea>

                                            <div className='col-md-12' style={{textAlign:'left' , paddingLeft:'-10px'}}>
                                                <a className='text-muted' style={{cursor:"pointer"}} onClick={() => RemoveOption(ind)}>
                                                    Remove option 
                                                </a> 
                                                
                                                <span className="text -muted"> | </span>

                                                <a _ngcontent-waj-c5="" className="text-muted" href="#" >
                                                    Enable Rich text editor
                                                </a>
                                            </div>  &nbsp;&nbsp;                          
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
                        </div>
                    </div>
                    <div className="card-footer text-muted" style={{textAlign:'left'}}>
                        <button type="button" className="btn btn-primary" style={{height:'50px',width:'180px',fontSize:'18px'}} onClick={()=>navigate('/QuestioList')}>Update Question</button> &nbsp;&nbsp;
                        <button type="button" className="btn btn-light" style={{height:'50px'}} onClick={()=>navigate('/QuestionList')} >Cancel</button>
                    </div>
                </div>
            </div>
            </form>
        </div>
    )
}

export default EditQuestionForm;


