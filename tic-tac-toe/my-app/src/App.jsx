import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function Square({value, onClick}){
  return(
    <button className='square' onClick={onClick}>
      {value}
    </button>
  )
}

function showMsg(Msg){
  console.log(Msg);
  const element = document.getElementById('msg');
  element.textContent = Msg;
  
  setTimeout(()=>{
    element.textContent = "";
  }, 2500)
}

function Board(){
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [next, setNext] = useState('X');
  const winner = calculateWinner(squares);
  let status;
  if(winner){
    status = "winner is " + (next==='X'?'O':'X');
  }else{
    let full = true;
    squares.forEach((square, i)=>{
      if(square === null){
        full = false;
      }
    });
    if(full){
      status = "Nobody Wins!!!"
    }else{
      status = 'Next move: ' + next;
    }
  }
  function handleClick(i){
    if(squares[i] || winner){
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = next;
    setSquares(nextSquares);
    if(next==='X'){
      setNext('O');
    }else{
      setNext('X');
    }
  }

  return (
    <>
    <div id='msg'>{status}</div>
    <div className='board-row'>
      <Square value={squares[0]} onClick={() => handleClick(0)}/>
      <Square value={squares[1]} onClick={() => handleClick(1)}/>
      <Square value={squares[2]} onClick={() => handleClick(2)}/>
    </div>
    <div className='board-row'>
      <Square value={squares[3]} onClick={() => handleClick(3)}/>
      <Square value={squares[4]} onClick={() => handleClick(4)}/>
      <Square value={squares[5]} onClick={() => handleClick(5)}/>
    </div>
    <div className='board-row'>
      <Square value={squares[6]} onClick={() => handleClick(6)}/>
      <Square value={squares[7]} onClick={() => handleClick(7)}/>
      <Square value={squares[8]} onClick={() => handleClick(8)}/>
    </div>
    </>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


export default function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Board value={'X'}/>

      <p id='msg'></p>
    </>
  )
}

 
