 
const Button = ({text}:{text:string}) => {
    return (
        <button className="px-12 py-3 border-gray-400 border-2 font-bold text-sm ">
        {text}
      </button>
    );
};

export default Button;