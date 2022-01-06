import React,{useState,useEffect} from 'react'


function AddOption({type,OptionObj,handleChange,handleChecked,RemoveOption}) {

    console.log();
    return (
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
                                        formcontrolname="questionText" id="question" rows="4" value={opt.option} onChange={(e)=>handleChange(e,ind)}>
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
                
    )
}

export default AddOption
