import React from "react";

type AvatarBoxProps = {
    text: React.ReactNode;
    avatar: string;
}

const AvatarBox: React.FC<AvatarBoxProps> = ({text, avatar}) => {
    return(
        <div className="mx-auto my-6 mb-6 w-[95%] max-w-[1400px] border-4 border-white flex bg-black h-[215px]">
      
        <div className="w-[18%] relative">
          <img
            src={avatar}
            alt="Avatar"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[240px] object-cover "
          />
        </div>

        <div className="w-[78%] px-8 py-3 relative flex text-balance">
          <p className="text-lg ">
            {text}
          </p>
          <button
            className="group absolute bottom-4 right-6 flex items-center gap-2"
          >
            <span className="opacity-40 group-hover:opacity-70 transition text-sm">
              Skip
            </span>
            <span className="text-3xl">{">>>"}</span>
          </button>
        </div>
        
      </div>
    );
};
export default AvatarBox;