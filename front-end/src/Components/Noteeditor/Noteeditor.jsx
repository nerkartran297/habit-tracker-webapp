import React from 'react'
import './Noteeditor.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
const Noteeditor = () => {
    const [formData,setFormData] = useState({
        image:"",
       // createdAt:"",
        title:"",
        content:""
      })

      const changeHandler = (e) =>{
        setFormData({...formData,[e.target.name]:e.target.value})
      }

      const createnote = async () =>{
        console.log("createnote Function Excuted",formData);
        let responseData;
        await fetch('/createnote',{
          method:'POST',
          headers:{
            Accept:'application/form-data',
            'Content-Type':'application/json',
            'auth-token':`${localStorage.getItem('auth-token')}`
          },
          body: JSON.stringify(formData),
        }).then((response)=> response.json()).then((data)=>responseData=data)
      
        if(responseData.success) {
            alert("uploaded successfully")
        }
        else {
          alert(responseData.errors)
        }
      
      }
  return (
    <div className="editorContainer">
        <div className="ideContainer">
            <div className="noteIDE">
                <div >
                    <div className="noteImg">
                        <input value={formData.image} onChange={changeHandler} type="text" id="noteImg" name="image" placeholder="Image's link" />
                    </div>
                    {/* <div className="noteHeader">
                        <input value={formData.createdAt} onChange={changeHandler} type="text" id="noteDate" name="createdAt" placeholder="27-04-2024" />
                    </div> */}
                    <div className="noteClass">
                        <input value={formData.title} onChange={changeHandler} type="text" id="noteTitle" name="title" placeholder="Diary" />
                    </div>
                    <div className="noteBody">
                        <textarea value={formData.content} onChange={changeHandler} id="noteBodyID" name="content" placeholder='Today is a good day and I love that.'></textarea>
                    </div>
                </div>
            </div>
            <div className="notePreview">
                <div className="noteHeader">
                    <p id="previewDate">{formData.createdAt || "27-04-2024"}</p>
                </div>
                <div className="noteClass">
                    <p id="previewTitle">{formData.title || "Diary"}</p> 
                </div>
                <div className="noteBody">
                    <p id="previewBody">{formData.content || "Today is a good day and I love that."}</p>
                </div>
            </div>
        </div>
        <button id="noteSave" onClick={()=>createnote()}> <Link to='/noteview'>Save & go to view mode</Link></button>
    </div>
  )
}

export default Noteeditor
