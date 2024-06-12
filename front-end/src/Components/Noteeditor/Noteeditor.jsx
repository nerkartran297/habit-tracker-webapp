import React from 'react'
import './Noteeditor.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import upload_area from '../../Assets/upload_area.svg'
const Noteeditor = () => {
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần +1
        const day = String(today.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`; // Định dạng YYYY-MM-DD
      };


    const [image, setImage] = useState(false);
    const [NoteDetails,setNoteDetails] = useState({
        image:"",
        createdAt:getCurrentDate(),
        title:"",
        content:""
      })

     

      const imageHandler = (e) =>{
        setImage(e.target.files[0]);
      }

      const changeHandler = (e) =>{
        setNoteDetails({...NoteDetails,[e.target.name]:e.target.value})
      }

      const createnote = async () =>{
        console.log(NoteDetails);
        let responseData;
        let notes = NoteDetails;
        let formData = new FormData();
        formData.append('notes',image);
        await fetch('/upload',{
            method:'POST',
            headers:{
                Accept:'application/json',
                'auth-token':`${localStorage.getItem('auth-token')}`,
            },
            body:formData,
        }).then((resp) => resp.json())
        .then((data)=>{responseData=data});
        
        if(responseData.success)
        {
          notes.image = responseData.image_url;
          console.log(notes);
          await fetch('/createnote',{
            method:'POST',
            headers:{
              Accept:'application/form-data',
              'Content-Type':'application/json',
                'auth-token':`${localStorage.getItem('auth-token')}`
            },
            body: JSON.stringify(notes),
          }).then((response)=> response.json()).then((data)=>responseData=data)
        }
        
      
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
                    <label htmlFor="file-input">
                        <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumnail-img' alt="" />
                    </label>
                    <input onChange={imageHandler} type="file" name="image" id='file-input' hidden />
                    </div>
                    <div className="noteHeader">
                    <label>Created At:</label>
                        <input value={NoteDetails.createdAt} onChange={changeHandler} type="text" id="noteDate" name="createdAt" readOnly/>
                    </div>
                    <div className="noteClass">
                        <input value={NoteDetails.title} onChange={changeHandler} type="text" id="noteTitle" name="title" placeholder="Diary" />
                    </div>
                    <div className="noteBody">
                        <textarea value={NoteDetails.content} onChange={changeHandler} id="noteBodyID" name="content" placeholder='Today is a good day and I love that.'></textarea>
                    </div>
                </div>
            </div>
            <div className="notePreview">
                <div className="noteHeader">
                    <p id="previewDate">{NoteDetails.createdAt || "27-04-2024"}</p>
                </div>
                <div className="noteClass">
                    <p id="previewTitle">{NoteDetails.title || "Diary"}</p> 
                </div>
                <div className="noteBody">
                    <p id="previewBody">{NoteDetails.content || "Today is a good day and I love that."}</p>
                </div>
            </div>
        </div>
        <button id="noteSave" onClick={()=>createnote()}> <Link to='/noteview'>Save & go to view mode</Link></button>
    </div>
  )
}

export default Noteeditor
