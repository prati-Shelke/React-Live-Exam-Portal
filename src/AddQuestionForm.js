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
    let hasError = false 
    let [hasDuplicateOption,sethasDuplicateOption] = useState(false)
    
    
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
                    sethasDuplicateOption(true)
                }
                else
                {
                    error.style.display="none"
                    sethasDuplicateOption(false)
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


 // if(field==="qText")
        // {
        //     if(value === '')
        //         {
        //             document.getElementById('qText').className = "form-control is-invalid"
        //         }
        //     else
        //         {
        //             document.getElementById('qText').className = "form-control"
        //         }
        // }
        // else if(field === 'DuplicateOpt')
        // {
        //         if(value !== '')
        //         {  
        //             error.style.display="block"
        //             sethasDuplicateOption(true)
        //         }
        //         else
        //         {
        //             error.style.display="none"
        //             sethasDuplicateOption(false)
        //         }
            
        // }
        // else if(field === 'CorrectOpt')
        // {
            
        //         if(value !== '')
        //         {  
                   
        //             error.style.display="block"                    
        //         }
        //         else
        //         {
        //             error.style.display="none"
        //             hasError = false
        //         }
            
        // }
        // else if(field.includes('Option'))
        // {
        //     if(value=='')
        //     {
        //         error.style.display="block"
        //         error.textContent = `Option is required`
        //     }
        //     else
        //     {
        //         error.style.display="none"
                
        //     }
            
        // }  
        
        // else if(value == '' || value === "DEFAULT" )
        // {
            
        //     if(field==="Right marks")
        //     {
        //         document.getElementById('Rmarks').className = "form-control is-invalid"
        //     }
        //     else if(field === "Wrong marks")
        //     {
        //         document.getElementById('Wmarks').className = "form-control is-invalid"
        //     }
        //     error.style.display="block"
        //     error.textContent = `${field} is required`
        // }
        // else
        // {
        //     error.style.display="none"
        //     document.getElementById('Rmarks').className = "form-control "
        //     document.getElementById('Wmarks').className = "form-control "
        //     // document.getElementById('qText').className = "form-control"
        // }

