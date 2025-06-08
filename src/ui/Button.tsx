 

const Button = ({text,onClick}:{text:string,onClick:()=>void}) => {
    return (
       <button onClick={onClick} className="bg-green-400 rounded-md py-2 text-white text-2xl font-bold w-full">{text}</button>
    );
};

export default Button;