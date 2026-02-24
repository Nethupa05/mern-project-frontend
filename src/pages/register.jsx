import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RegisterPage(){

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate("");

    async function handleRegister(){
        try{
            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/users",
                {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                }
            );

            toast.success("Registration Successful");
            console.log(response.data);

            // Redirect to login page after register
            navigate("/login");

        }catch(e){
            toast.error(e.response?.data?.message || "Registration Failed");
        }
    }

    return(
        <div className='w-full h-screen bg-[url("/login.jpg")] bg-center bg-cover flex justify-center items-center'>
            
            <div className="w-[50%] h-full">
            </div>

            <div className="w-[50%] h-full flex justify-center items-center">
                <div className="w-[500px] h-[650px] backdrop-blur-md rounded-[20px] shadow-xl flex flex-col justify-center items-center">

                    <input
                        placeholder="First Name"
                        onChange={(e)=> setFirstName(e.target.value)}
                        value={firstName}
                        className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[15px] px-4"
                    />

                    <input
                        placeholder="Last Name"
                        onChange={(e)=> setLastName(e.target.value)}
                        value={lastName}
                        className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[15px] px-4"
                    />

                    <input
                        placeholder="Email"
                        onChange={(e)=> setEmail(e.target.value)}
                        value={email}
                        className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[15px] px-4"
                    />

                    <input
                        placeholder="Password"
                        type="password"
                        onChange={(e)=> setPassword(e.target.value)}
                        value={password}
                        className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[15px] px-4"
                    />

                    <button
                        onClick={handleRegister}
                        className="w-[300px] h-[50px] cursor-pointer bg-[#c3efe9] rounded-[20px] text-[20px] font-bold text-white my-[20px]"
                    >
                        Register
                    </button>

                </div>
            </div>
        </div>
    );
}