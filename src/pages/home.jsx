export default function HomePage(){
    return(
        <div className='w-full h-screen bg-red-100 flex flex-col justify-evenly items-center'>
            <h1 className='text-4xl font-bold text-red-900'>Home Page</h1>
            <p className='text-lg text-red-700'>Welcome to the home page. Please navigate to the login or sign up page to access your account.</p>
            <button className='px-4 py-2 bg-blue-600 text-white rounded'>Go to Login</button>
            <button className='px-4 py-2 bg-green-600 text-white rounded'>Go to Sign Up</button>
        </div>
    )
}