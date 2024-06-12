import React from 'react';
import './Recentdiaries.css';

const Recentdiaries = ({ notes }) => {
  // Kiểm tra xem notes có tồn tại và là một mảng hợp lệ không
  if (!Array.isArray(notes) || notes.length === 0) {
    // Nếu notes không tồn tại hoặc là một mảng rỗng, hiển thị thông báo hoặc component thay thế
    return <p>No recent diaries found.</p>;
  }

  return (
    <div className='pinnedDoc'>
      {notes.map((note, i) => (
        <div key={i} className="document">
          <img src={note.image} className="docImage" alt={note.title}/>
          <h4 className="docTitle">{note.title}: {new Date(note.createdAt).toLocaleDateString()}</h4>
          <p className="docShort">{note.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Recentdiaries;
