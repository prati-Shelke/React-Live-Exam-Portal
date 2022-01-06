import React,{useEffect,useRef,useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import http from './http';
import Form from './Form';
import QuestionList from './QuestionList';

function AddQuestionForm({handleDisplayNavbar}) 
{

    let navigate = useNavigate()
    let [QueObject,setQueObject] = useState({
        type : 'MULTIPLE CHOICE' ,
        diffLevel : 'Medium' ,
        subject : '' ,
        topic : '' ,
        rightMarks : 1 ,
        wrongMarks : 0 ,
        questionText : '' ,
        options : Array(4).fill({})
    })
    
    
    
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
    const handleError = (val , field) =>
    {
                         
        let error = document.getElementById(`${field}`)   
        // console.log(error);
        if(field==="qText")
        {
            if(val == '')
                {
                    document.getElementById('qText').className = "form-control is-invalid"
                }
            else
                {
                    document.getElementById('qText').className = "form-control"
                }
        }
        else if(field.includes('Option'))
        {
            if(val=='')
            {
                error.style.display="block"
                error.textContent = `Option is required`
            }
            else
            {
                error.style.display="none"
            }
            
        }  
        else if(field == 'radioErr')
        {
            
                if(val != '')
                {  
                    error.textContent = `Duplicate options are not allowed.`
                    error.style.display="block"
                }
                else
                {
                    error.style.display="none"
                }
            
        }
        else if(val == '' || val === "DEFAULT" )
        {
            
            if(field==="Right marks")
            {
                document.getElementById('Rmarks').className = "form-control is-invalid"
            }
            else if(field === "Wrong marks")
            {
                document.getElementById('Wmarks').className = "form-control is-invalid"
            }
            error.style.display="block"
            error.textContent = `${field} is required`
        }
        else
        {
            error.style.display="none"
            document.getElementById('Rmarks').className = "form-control "
            document.getElementById('Wmarks').className = "form-control "
            document.getElementById('qText').className = "form-control"
        }
    }

    //------------------------------Post question into api after clicking on save question button-----------------------
    const postQuestion = async() =>
    {
        

            
            QueObject.subject === '' && handleError('DEFAULT','Subject')
            QueObject.topic === '' && handleError('DEFAULT','Topic')
            QueObject.questionText === '' && handleError('','qText')

            QueObject.options.map((opt,ind)=>            
                {
                    opt.option == '' && handleError('',`Option${ind+1}`)


                    if(opt.isCorrect === false && opt.option !== '')
                    {
                        let error = document.getElementById('radioErr')
                        error.style.display = "block"
                        error.textContent = "Please select correct answer from options"
                        
                    }
                })
            

            let temp = QueObject.options.map((opt,i)=>
            {
                if(opt.option==='' || opt.isCorrect === false)
                    return false
                
            })

            console.log(temp);
            if(QueObject.subject!= '' && QueObject.topic!= '' && QueObject.type!='' && QueObject.diffLevel!='' &&
                    QueObject.rightMarks!='' && QueObject.wrongMarks!='' && QueObject.questionText!='')
            {
                await http.post('/questions',QueObject)
                navigate(-1)
                handleDisplayNavbar(true)
            }
        
        // Questions = [...Questions , newQue]
        // setQuestions(Questions) 
    }

    return (
        <div className='container'>
            <div className="card text-center" style={{margin:'40px'}}>
                <div className="card-header" style={{fontWeight:'bold', fontSize:'26px',textAlign:'left'}}>
                    Add Question
                    {fullscreen === true ?
                        <i className='bx bx-fullscreen' onClick={()=>handleOnclick('full')} style={{cursor:'pointer',float:'right'}} ></i>
                    :  
                        <i className='bx bx-exit-fullscreen bx-flip-horizontal' onClick={()=>handleOnclick('small')} style={{cursor:'pointer',float:'right'}}></i>}
                </div>
            
                <div className="card-body">
                    {/* <Form props={{Subject,setSubject,Topic,setTopic,Type,setType,DiffLevel,setDiffLevel,
                        RightMarks,setRightMarks,WrongMarks,setWrongMarks,QuestionText,setQuestionText,OptionObj,setOptionObj,
                        AllSubject,setAllSubject,AllTopic,setAllTopic,
                        handleSelectedField,handleChecked,handleChange,AddOption,RemoveOption}}/> */}​
                    <Form QueObject={QueObject} setQueObject={setQueObject} handleError={handleError} />
                </div>

                <div className="card-footer text-muted" style={{textAlign:'left'}}>
                    <button type="button" className="btn btn-primary" style={{height:'50px',width:'160px',fontSize:'18px'}} onClick={postQuestion}>Save Question</button> &nbsp;&nbsp;
                    <button type="button" className="btn btn-light" style={{height:'50px'}} onClick={handleCancel}  >Cancel</button>
                </div>
                
            </div>
        </div>
    )
}

export default AddQuestionForm



// if(val == '' || val === "DEFAULT" )
//         {
//             switch(field)
//             {
//                 case "Right Marks" : 
//                             document.getElementById('Rmarks').className = "form-control is-invalid"
//                             break;

//                 case "Wrong Marks" : 
//                             document.getElementById('Wmarks').className = "form-control is-invalid"
//                             break;

//                 case "qText" :
//                             document.getElementById('qText').className = "form-control is-invalid"
//                             break;

//                 default :
//                             if(field.includes('Option'))
//                             {
//                                 error.style.display="block"
//                                 error.textContent = `Option is required`
//                             }
//             }
//             error.style.display="block"
//             error.textContent = `${field} is required`

//         }
//         else
//         {
//             error.style.display="none"
//             document.getElementById('Rmarks').className = "form-control "
//             document.getElementById('Wmarks').className = "form-control "
//             document.getElementById('qText').className = "form-control"
//         }