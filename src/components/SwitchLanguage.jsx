import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SwitchLanguage(){
    const {i18n}=useTranslation();
    const [lang, setLang]=useState("en");

    const toggleLanguage = () =>{
        const newLang = lang === "en" ? "hi" : "en";
        i18n.changeLanguage(newLang);
        setLang(newLang);
    }

    return (
        <div>
            <button onClick={toggleLanguage}>{lang === "en" ? "हिंदी": "English"}</button>
        </div>
    )
} 