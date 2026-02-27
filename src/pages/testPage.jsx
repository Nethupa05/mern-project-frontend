
import { useState } from "react";
import mediaUpload from "../utils/mediaUpload";

export default function TestPage(){
    const[image, setImage] = useState(null)

    function fileUpload(){
        mediaUpload(image).then(
            (res)=>{
                console.log(res)
            }
        ).catch(
            (res)=>{
                console.log(res)
            }
        )
    }
   
    return(
        <div className="w-full h-screen flex justify-center items-center">
            <input type="file" className="w-[300px] h-[50px] border-2 border-gray-400 rounded-md"
            onChange={(e) => {
                setImage(e.target.files[0])
            }}/>

            <button onClick={fileUpload} className="w-[100px] h-[50px] bg-green-500 text-white font-bold py-2 px-4 rounded">Upload</button>
        </div>
    )
}