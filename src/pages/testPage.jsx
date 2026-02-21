import { useState } from "react";

export default function TestPage(){

    const [count,setCount] = useState(0)



   
    return(
        <div className="w-full h-screen flex justify-center items-center">
            <div className="h-[250px] w-[450px] shadow flex justify-center items-center">
                <button onClick={()=>{
                    setCount(count - 1);
                }} 
                className="bg-blue-500 text-white font-bold text-center w-[100px] h-[40px] text-[20px] cursor-pointer">
                    -                    
                </button>

                <span className="text-[40px] font-bold text-center w-[100px] h-[40px] mx-[10px flex items-center justify-center">
                    {count}
                </span>
                
                <button onClick={()=>{
                    setCount(count + 1);
                }} 
                className="bg-blue-500 text-white font-bold text-center w-[100px] h-[40px] text-[20px] cursor-pointer">
                    +
                </button>

            </div>
        </div>
    )
}