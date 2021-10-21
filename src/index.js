import {createUseStyles} from 'react-jss'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';


const initialTasks = {
  'task-1': {id:'task-1', content: 'Get Mung beans'},
  'task-2': {id:'task-2', content: 'Eat Food'},
  'task-3': {id:'task-3', content: 'Feed Dog'},
  'task-4': {id:'task-4', content: 'Play Fetch'},
}

const initialColumns = {
    'column-1':{
      id:'column-1',
      title:'todo',
      taskIds: ['task-1', 'task-2', 'task-3','task-4']
    }
}

const initialColumnOrder = ['column-1']

// Task
const useTaskStyles = createUseStyles({
  container: {
    padding: 8,
    marginBottom: 8,
    border: '1px solid lightGrey',
    borderRadius: 2,
    backgroundColor: 'lavender',
    display: 'flex',
    alignItems: 'center',
  },
  dragging: {
    backgroundColor: 'orchid'
  },
  handle: {
    display:'flex',
    height: 25,
    width: 12,
    marginRight: 25,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'lightGrey'
  }
})

const Task = ({task, index}) => {
  const classes = useTaskStyles()

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapShot) => (
        <div 
          {...provided.draggableProps}
          className={`${classes.container}${snapShot.isDragging ? ` ${classes.dragging}`:''}`}
          ref={provided.innerRef}
        >
          <div 
            {...provided.dragHandleProps}
            className={classes.handle}
          >
            &#8942;
          </div>
          <p>{task.content}</p>
        </div>
      )}
    </Draggable>
  )
}

// Column
const useColumnStyles = createUseStyles({
  container: {
    margin: 8,
    border: '1px solid lightGrey',
    borderRadius: 2,
    backgroundColor: 'paleGreen'
  },
  title: {
    padding: 8
  },
  taskList: {
    transition: 'background-color 0.2s ease',
    padding: 8
  },
  draggingOver: {
    backgroundColor: 'mediumSpringGreen'
  }
})

const Column = ({column, tasks}) => {
  const classes = useColumnStyles()

  return (
    <div className={classes.container}>
      <div className={classes.title}>{column.title}</div>
      <Droppable droppableId={column.id}>
        {(provided, snapShot) => (
          <div 
            {...provided.droppableProps}
            className={`${classes.taskList} ${snapShot.isDraggingOver && classes.draggingOver}`}
            ref={provided.innerRef}
          >
            {tasks.map((task, i) => (
              <Task key={task.id} task={task} index={i}/>
            ))}  
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

const App = () => {
  const [tasks, setTasks] = useState(initialTasks)
  const [columns, setColumns] = useState(initialColumns)
  const [columnOrder, setColumnOrder] = useState(initialColumnOrder)

  const onDragEnd = (result) => {
    const {destination, source, draggableId} = result

    if (!destination) 
      return
    if(
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    const column = columns[source.droppableId]
    const taskIds = Array.from(column.taskIds)
    taskIds.splice(source.index, 1)
    taskIds.splice(destination.index, 0 , draggableId)

    setColumns({
      ...columns,
      [column.id]: {
        ...column,
        taskIds
      }
    })

  }

  return <DragDropContext onDragEnd={onDragEnd}>
          <div>
              {columnOrder.map((columnId)=>{
                const column = columns[columnId]

                const mungTasks = column.taskIds.map((taskId) => tasks[taskId])

                return <Column key={column.id} column={column} tasks={mungTasks}/>
              })}
          </div>
        </DragDropContext>
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
