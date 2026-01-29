import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/logo.svg";
import Avatar from "../assets/avatar_intro.svg";
import AvatarBox from "../components/AvatarBox";
import python from "../assets/python.svg";
import java from "../assets/java.svg";
import cpp from "../assets/cpp.svg";
import { useUpdateProfileMutation } from "../store/api/profileApi";

const Language: React.FC = () => {
  const navigate = useNavigate();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleSelect = async (language: string) => {
    try {
      await updateProfile({ language }).unwrap();
      navigate("/difficulty");
    } catch (err: any) {
      toast.error(err.data?.message || err.data?.detail || "Failed to update language");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="p-2 bg-[#282828]" >
        <img src={logo} alt="RogueCode" className="w-14" />
      </header>
      <div className="flex-1 flex flex-row gap-24 items-center justify-center">
        <div
          onClick={() => !isLoading && handleSelect("python")}
          className={`bg-[#1A1A1A] w-48 h-48 rounded-full border-4 border-blue-500 flex items-center justify-center ${isLoading ? 'opacity-50' : 'cursor-pointer hover:scale-105 hover:border-blue-400'} transition`}
        >
          <img src={python} alt="Python" className="w-20" />
        </div>

        <div
          onClick={() => !isLoading && handleSelect("java")}
          className={`bg-[#1A1A1A] w-48 h-48 rounded-full border-4 border-blue-500 flex items-center justify-center ${isLoading ? 'opacity-50' : 'cursor-pointer hover:scale-105 hover:border-blue-400'} transition`}
        >
          <img src={java} alt="Java" className="w-20" />
        </div>

        <div
          onClick={() => !isLoading && handleSelect("cpp")}
          className={`bg-[#1A1A1A] w-48 h-48 rounded-full border-4 border-blue-500 flex items-center justify-center ${isLoading ? 'opacity-50' : 'cursor-pointer hover:scale-105 hover:border-blue-400'} transition`}
        >
          <img src={cpp} alt="C++" className="w-20" />
        </div>

      </div>

      <AvatarBox
        avatar={Avatar}
        onSkip={() => navigate("/difficulty")}
        text={
          <>
            Pick the language that suits your{" "}
            <span className="text-blue-400 font-semibold">strength</span>!
          </>
        }

      />
    </div>
  );
};

export default Language;
