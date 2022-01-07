import React,{useState} from 'react'
import {useNavigate } from 'react-router-dom';
import http from './http';
import Form from './Form';

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
    let flag = true
    
    
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
            if(val === '')
                {
                    document.getElementById('qText').className = "form-control is-invalid"
                }
            else
                {
                    document.getElementById('qText').className = "form-control"
                }
        }
        else if(field === 'duplicateOption')
        {
                if(val !== '')
                {  
                    error.style.display="block"
                    
                }
                else
                {
                    error.style.display="none"
                    
                }
            
        }
        else if(field === 'selectOption')
        {
            
                if(val !== '')
                {  
                    // error.textContent = `Duplicate options are not allowed.`
                    error.style.display="block"                    
                }
                else
                {
                    error.style.display="none"
                    flag = true
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
            // document.getElementById('qText').className = "form-control"
        }
    }


    const valid = () =>
    {
        let k=0
            
            if(QueObject.subject === '')
                {
                    handleError('DEFAULT','Subject')
                    flag = false
                }

            if(QueObject.topic === '')
                {
                    handleError('DEFAULT','Topic')
                    flag = false
                    
                }

            if(QueObject.type === '')
                {
                    handleError('DEFAULT','Type')
                    flag = false
                }

            if(QueObject.diffLevel === '')
                {
                    handleError('DEFAULT','Difficulty level')
                    flag = false
                }           
                
            if(QueObject.rightMarks === '')
                {
                    handleError('','Right Marks')
                    flag = false
                }

            if(QueObject.wrongMarks === '')
                {
                    handleError('','Wrong Marks')
                    flag = false
                }

            if(QueObject.questionText === '' )
                {
                    handleError('','qText')
                    flag = false
                }
            
            
                QueObject.options.map((opt,ind)=>            
                {
                    // opt.option == '' && handleError('',`Option${ind+1}`)
                    if(opt.option == '')
                    {
                        console.log("option null");
                        handleError('',`Option${ind+1}`)
                        flag = false
                        k=1
                    }
                    if(opt.isCorrect === true)
                    {  
                        console.log(QueObject);
                        flag = true
                        k=1
                    }                
                })

            if(k==0)
            {
                console.log(flag);
                handleError('DEFAULT','selectOption')
                flag = false
            }

            return flag
    }
    //------------------------------Post question into api after clicking on save question button-----------------------
    const postQuestion = async() =>
    {

            console.log(valid())
            if(valid())
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