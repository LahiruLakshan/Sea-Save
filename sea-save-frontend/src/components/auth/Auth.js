import React, {useState} from "react";
import Login from "../../views/auth/Login";
import Register from "../../views/auth/Register";

const Auth = () => {
    const [index, setIndex] = useState(false);
    const toggleIndex = () => {
        setIndex((prevState) => !prevState);
    };
    return (
        <div>
            {!index ? <Login toggleIndex={toggleIndex} /> : <Register toggleIndex={toggleIndex}/>}
            {/*<p onClick={toggleIndex}>*/}
            {/*    {!index ? "New user? Click here " : "Already have an acount?"}*/}
            {/*</p>*/}
        </div>
        // <Login />
    );
};

export default Auth;
