import React,{useState,useEffect} from 'react'
import {AiOutlinePlus} from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';
import {RiDeleteBin5Line} from 'react-icons/ri';
import {MdOutlineEdit} from 'react-icons/md'
import ReactPaginate from 'react-paginate';
import http from './http';
import NoQuesImg from './NoQuesImg.png'
import { selectOptions } from '@testing-library/user-event/dist/select-options';
import {BiX} from 'react-icons/bi'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function QuestionList() {

    let navigate = useNavigate()
    let [Questions,setQuestions] = useState([])
    let [showcount , setShowcount] = useState(1)
    let [loading,setloading]= useState(true)   

    // topic variables

    const [Topic,setTopic] = useState()
    let [SelectedTopic,setSelectedTopic] = useState(JSON.parse(localStorage.getItem('SelectedTopic')) || 0)

    //pagination variables
    let [questionPerPage,setquestionPerPage] = useState(20)
    const [pageNumber,setPageNumber]  = useState(0)
    const pagesVisited = pageNumber * questionPerPage
    

    //search question
    let [searchText,setSearchText] = useState("")

    useEffect(async() => {

        //to get topics
        let data = await http.get('/topics?page=1&limit=9007199254740991&term=')
        setTopic(data)
        
        fetchQue()
        
    }, [SelectedTopic])
   

    //----------------------------to get all question in array-------------------------
    const fetchQue = async() =>
    {
        //to get questions as per topic when topic is selected o.w all questions
        
        if(SelectedTopic === 'AllQuestion')
        {
            
            setQuestions(await http.get('/questions?page=1&limit=500&term=&topic='))
        }
        else
        {
            SelectedTopic ?
            setQuestions(await http.get(`/questions?page=1&limit=&term=&topic=${SelectedTopic.topic}`))
            :
            setQuestions(await http.get('/questions?page=1&limit=500&term=&topic=61d963cce6d7d77c8e4f302e')) 
            
        }
        setloading(false)
    }
    
    //-------------set values to selected topic---------------------
    const handleTopicChange = (val) =>
    {
        setloading(true)
        let data=Topic.find((top) => 
            {
                if(top.name===val)
                    return top._id
            })
        
        const temp = {
            topic:data._id ,
            name:data.name
           
        }
        setSelectedTopic(temp)
        localStorage.setItem('SelectedTopic',JSON.stringify(temp))
        
        
    }
    
    //--------------------for pagination----------------------------
    const pageCount = Math.ceil(Questions.length / questionPerPage);
    const changePage = ({selected}) => {
        setPageNumber(selected);
        setShowcount(showcount + questionPerPage)
        
    };
    
    //---------------------to add notification after question is added---------------------------------------
    const notify = () => 
    {
        
        toast.success('Question removed successfully!',
        { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 2000 })
    }

    //---------------------delete Question--------------------------
    const DeleteQuestion = async(qid) =>
    {
        console.log(qid)
        let result =window.confirm("Are you sure you want to delete the question, this can not be rolled back?")
        if(result)
            {
                await http.delete(`/questions/${qid}`)
                setloading(true)
                notify()
                fetchQue()
                // const filterQue = Questions.filter(que => que.id !== qid)
                // setQuestions(filterQue)
            }
    }
    


    return (
    <>
        <div className='container '>
            <div style={{fontWeight:'bold', fontSize:'26px',textAlign:'left',marginTop:"40px"}}>
                    Questions
            </div>

            <div style={{textAlign:'right',marginTop:"-40px"}}>
                    <button type="button" className="btn btn-primary" onClick={()=>navigate('/AddQuestionForm')} style={{height:'40px',width:'160px',fontSize:'18px'}}>
                        <AiOutlinePlus size={18} />  Add Question
                    </button>
            </div>

            <div className="card text-center" style={{margin:'40px'}}>
                
            
                <div className="card-body">
                    <div className="align-items-center">
                        <div className='form-row' style={{textAlign:"left"}}>

                            <div className='form-group col-md-8'>
                                <input data-toggle="tooltip" id="checkbox-2" title="Select all" type="checkbox" 
                                style={{marginRight:"8px",marginTop:"16px"}}/>
                            
                            
                                <span className="text-muted" style={{marginRight:"6px"}} > 
                                    Show 
                                </span>
                                    
                                <select formcontrolname="limitPerPage" style={{marginRight:"6px"}} onChange={(e)=> {setquestionPerPage(parseInt(e.target.value))}} value={questionPerPage}>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="50">50</option>
                                </select>
                            

                                <span  className="text-muted" style={{marginRight:"6px"}}>
                                    records per page
                                </span>
                            </div>
                        
                        
                          
                            
                            <input type="text" style={{marginLeft:"-100px",marginRight:"14px",marginTop:"8px"}} 
                            className="form-control col-3" id="inputPassword2" placeholder="Search Question" onChange={(e)=>setSearchText(e.target.value)}/>
                        
                            
                            <select className="d-flex form-control col-md-2" value={SelectedTopic.name ? SelectedTopic.name : 'DEFAULT'} onChange={(e)=>handleTopicChange(e.target.value)}  style={{marginTop:"8px",position:"relative"}} >
                                <option value="DEFAULT" disabled hidden > Choose topic </option>
                            {Topic ? Topic.map((top)=>   
                                (
                                    <option key={top._id} >{top.name}</option>
                                )) : ('')}
                            </select>

                            {SelectedTopic.name &&
                                <span className="cancel" style={{position:"absolute",top:"38px",right:"0",marginRight: "70px",cursor:"pointer"}}> 
                                    <BiX size={20} className='text-muted position-absolute'  
                                        onClick={()=>{
                                                        setloading(true)
                                                        fetchQue()
                                                        setSelectedTopic('AllQuestion')
                                                        localStorage.setItem('SelectedTopic',JSON.stringify({topic:Topic[0]._id ,name:Topic[0].name}))   
                                                    }}
                                    />
                                </span>}
                        </div>
                    </div>
                  <hr />

                { loading!==true && Questions.length!==0 ?
                    (<>
                    <div >
                        {
                        Questions.filter((question) =>
                            {
                                    if(searchText === "") 
                                        return question
                                    else if(question.questionText.toLowerCase().includes(searchText.toLowerCase()))
                                        return question;
                                        
                            }).slice(pagesVisited,pagesVisited + questionPerPage).map((question,ind) =>

                        
                        <div key={question._id}>
                            <div style={{textAlign:"left"}} >
                                
                                <input data-toggle="tooltip" id="checkbox-2" title="Select all" type="checkbox" 
                                style={{marginRight:"8px",marginTop:"16px"}}/>

                                
                                <label dangerouslySetInnerHTML={{ __html: question.questionText }}></label>

                                {question.options.map((opt) =>

                                    <div className='text-muted' style={{marginLeft:"20px"}} key={opt._id} >
                                        <div>
                                            <input type={question.type==="MULTIPLE CHOICE" || question.type==="FILL IN BLANKS"? ("radio") : ("checkbox")}  checked={opt.isCorrect} disabled/> &nbsp;&nbsp;
                                            <label dangerouslySetInnerHTML={{ __html: opt.option }}></label>
                                        </div>                                
                                    </div>
                                )}
                                
                                <div style={{marginLeft:"20px"}} className='text-muted d-flex' >
                                    <div onClick={()=>navigate(`/EditQuestionForm/${question._id}`,{state:{question}})} >
                                        <MdOutlineEdit size={14}  style={{cursor:"pointer"}}/>
                                            <label style={{fontSize:"14px", marginRight:"14px" , cursor:"pointer"}}>
                                                Edit
                                            </label>
                                    </div>

                                    <div onClick={()=>DeleteQuestion(question._id)} >
                                        <RiDeleteBin5Line size={14}  style={{cursor:"pointer"}}/> 
                                            <label style={{fontSize:"14px" , cursor:"pointer"}}>
                                                Delete
                                            </label> &nbsp;
                                    </div>
                                </div>

                            </div>
                            <hr />
                        </div>
                    )}
                    </div>

                        <p className='text-muted' style={{float:"left",marginTop:"15px"}}> Showing {showcount} of {questionPerPage + showcount - 1} of {Questions.length} entries  </p>
                        <div style={{float:"right"}}><ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        pageCount={pageCount}
                        onPageChange={changePage}
                        containerClassName={"paginationBttns"}
                        previousLinkClassName={"previousBttn"}
                        nextLinkClassName={"nextBttn"}
                        disabledClassName={"paginationDisabled"}
                        activeClassName={"paginationActive"}
                        /></div>
                    </>
                    ) :
                    (
                        <div>
                            { Questions.length!==0 || loading ?
                                (
                                    <div className='spinner-border text-primary'>   
                                    </div>
                                )
                                :
                                (
                                    
                                    <div className="text-center col-sm-6 offset-sm-3 col-lg-4 offset-lg-4">
                                        <img style={{height:"200px"}} className="img-fluid" src={NoQuesImg} />
                                            <div style={{fontSize:"20px"}} className="text-muted mt-2 display-large">No questions available</div>
                                            <button className="btn btn-link" type="button" onClick={()=>navigate('/AddQuestionForm')}>
                                            Add Question
                                            </button>
                                    </div> 
                                )
                            }
                        </div>
                    )
                }
                </div>
            </div>

            
        </div>
    </>
    )
}

export default QuestionList;
