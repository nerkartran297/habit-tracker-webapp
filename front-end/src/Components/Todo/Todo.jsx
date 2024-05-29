import React from 'react'
import './Todo.css'
const Todo = () => {
  return (
    <div className="todo">
      <form>
        <div>
          <input type="checkbox" id="task1" name="task1" />
          <label htmlFor="task1">Quên tập thể dục buổi sáng</label>
        </div>
        <div>
          <input type="checkbox" id="task2" name="task2" />
          <label htmlFor="task2">Quên ngủ sớm</label>
        </div>
        <div>
          <input type="checkbox" id="task3" name="task3" />
          <label htmlFor="task3">Quên làm bài tập về nhà</label>
        </div>
        <div>
          <input type="checkbox" id="task4" name="task4" />
          <label htmlFor="task4">Quên dậy sớm</label>
        </div>
        <div>
          <input type="checkbox" id="task5" name="task5" />
          <label htmlFor="task5">Quên đi học</label>
        </div>
        <div>
          <input type="checkbox" id="task6" name="task6" />
          <label htmlFor="task6">Quên đi ăn</label>
        </div>
        <div>
          <input type="checkbox" id="task7" name="task7" />
          <label htmlFor="task7">Quên đi vệ sinh</label>
        </div>
        <div>
          <input type="checkbox" id="task8" name="task8" />
          <label htmlFor="task8">Quên laptop trên trường</label>
        </div>
      </form>
    </div>
  )
}

export default Todo
