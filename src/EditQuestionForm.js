import React,{useEffect,useState} from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import http from './http';
import {AiOutlinePlus} from 'react-icons/ai'
import { setSelectionRange } from '@testing-library/user-event/dist/utils';
import QuestionList from './QuestionList';

function EditQuestionForm({handleDisplayNavbar}) 
{

   
    let navigate = useNavigate()
    const [AllSubject,setAllSubject] = useState([])
    const [AllTopic,setAllTopic] = useState()
    let [Subject,setSubject] = useState()
    let [Topic,setTopic] =useState()
    let question = useLocation().state.question
    let s,t
    let queId = useParams().id
    console.log(queId)
    
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
    console.log(QueObject)
    
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
    

    
    //-------------------------to set all selected values to question object--------------
    const handleSelectedField = (value,id) =>
    {

        switch(id)
        {
            case 'subject' :
                {
                    AllSubject.map(sub =>
                        {
                            
                            if( sub.name === value )
                                {
                                    setQueObject({...QueObject , subject : sub._id}) 
                                    setSubject(sub.name)
                                }
                        }
                    )
                    
                    break;
                }

            case 'topic' :
                {   
                    AllTopic.map(top =>
                        {

                            top.name === value && setQueObject({...QueObject,topic:top._id})
                            setTopic(top.name)
                        }
                    )
                    break;
                }

            case 'type' :
                {
                    
                    setQueObject({...QueObject , type : value})
                    break;
                }

            case 'diffLevel' :
                {
                    setQueObject({...QueObject , diffLevel : value})
                    break;
                }
                
            case 'rightMarks' :
                {
                    setQueObject({...QueObject , rightMarks : value})
                    break;
                }

            case 'wrongMarks' :
                {
                    setQueObject({...QueObject , wrongMarks : value})
                    break;
                }

            case 'questionText' :
                {
                    setQueObject({...QueObject , questionText : value})
                    break;
                }
        }
    }
    

    //----------------------to add options in object-------------------
    const handleChange = (val , ind) =>
    {
       
        QueObject.options[ind].option = val
        setQueObject({...QueObject})
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

            QueObject.options[ind].isCorrect = !QueObject.options[ind].isCorrect
            setQueObject({...QueObject})

        }
        else
        {
           
            QueObject.options[ind].isCorrect = !QueObject.options[ind].isCorrect
            setQueObject({...QueObject})
        }
        
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
  
    //------------------------------Post question into api after clicking on save question button-----------------------
    const editQuestion = async() =>
    {
        await http.put(`/questions/${queId}`,QueObject)
        navigate(-1)
        handleDisplayNavbar(true)
        // Questions = [...Questions , newQue]
        // setQuestions(Questions) 
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
                    
            
                    <form >                    
                        <div className="form-row">
                            <div className="form-group col-md-6 ">
                                    <div style={{textAlign:'left'}}>
                                        <label> Select Subject  </label>
                                    </div>

                                    <select  className="form-control" value={Subject} onChange={(e)=>handleSelectedField(e.target.value,'subject')}>
                                            
                                        {AllSubject ? AllSubject.map((sub)=>   
                                        (
                                            <option key={sub._id} >{sub.name}</option>
                                        )) : ('')}
                                    </select>
                            </div>
                            
                            <div className="form-group col-md-6">
                                    <div style={{textAlign:'left'}}>
                                        <label >Select Topic</label>
                                    </div>
                            
                                    <select className="form-control" value={Topic} onChange={(e)=>handleSelectedField(e.target.value,'topic')}>
                                       
                                        {AllTopic ? AllTopic.map((top) =>
                                        (   
                                           
                                            top.subject._id === QueObject.subject &&
                                            <option key={top._id}> {top.name} </option>
                                        )) : ('')}
                                    </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-3">
                                    <div style={{textAlign:'left'}}>
                                        <label> Question Type  </label>
                                    </div>

                                    <select id="inputState" className="form-control" defaultValue={QueObject.type} onChange={(e)=>handleSelectedField(e.target.value,'type')}>
                                        <option value="MULTIPLE CHOICE"> MULTIPLE CHOICE </option>
                                        <option value='MULTIPLE RESPONSE'> MULTIPLE RESPONSE </option>
                                        <option value='FILL IN BLANKS'> FILL IN BLANKS </option>
                                    </select>
                            </div>

                            <div className="form-group col-md-3">
                                    <div style={{textAlign:'left'}}>
                                        <label> Difficulty Level  </label>
                                    </div>

                                    <select id="inputState" className="form-control" defaultValue={QueObject.diffLevel} onChange={(e)=>handleSelectedField(e.target.value,'diffLevel')}>
                                        <option > Easy </option>
                                        <option value="Medium"> Medium </option>
                                        <option > Hard </option>
                                    </select>
                            </div>

                            <div className="form-group col-md-3">
                                    <div style={{textAlign:'left'}}>
                                        <label> Right Marks  </label>
                                    </div>

                                    <input type="email" className="form-control" value={QueObject.rightMarks} onChange={(e)=>handleSelectedField(e.target.value,'rightMarks')}/>
                            </div>

                            <div className="form-group col-md-3">
                                    <div style={{textAlign:'left'}}>
                                        <label> Wrong Marks  </label>
                                    </div>

                                    <input type="email" className="form-control" value={QueObject.wrongMarks} onChange={(e)=>handleSelectedField(e.target.value,'wrongMarks')}/>
                            </div>

                        </div>

                        <div className="form-group">
                                <div style={{textAlign:'left'}}>
                                    <label>Question</label>
                                </div>
                            
                                <textarea className="form-control" onChange={(e)=>handleSelectedField(e.target.value,'questionText')}
                                    formcontrolname="questionText" id="question" rows="6" value={QueObject.questionText}>
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
                                        <div className="input-group" key={ind}>
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">
                                                    <input type={QueObject.type==="MULTIPLE CHOICE" || QueObject.type==="FILL IN BLANKS" ? "radio" : "checkbox"} 
                                                        aria-label="Radio button for following text input" 
                                                        style={{marginRight:"6px" ,marginBottom:"4px"}} 
                                                        onChange={()=>handleChecked(ind)}
                                                        checked={!!opt.isCorrect}
                                                        name="a"
                                                    />
                                                    Option {ind+1}
                                                </div>
                                            </div>
                                            
                                            <textarea className="form-control"
                                                formcontrolname="questionText" id="question" rows="4" value={opt.option} onChange={(e)=>handleChange(e.target.value,ind)}>
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
                    </form>

            
                </div>
                <div className="card-footer text-muted" style={{textAlign:'left'}}>
                    <button type="button" className="btn btn-primary" style={{height:'50px',width:'180px',fontSize:'18px'}} onClick={editQuestion}>Update Question</button> &nbsp;&nbsp;
                    <button type="button" className="btn btn-light" style={{height:'50px'}} onClick={handleCancel} >Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default EditQuestionForm
