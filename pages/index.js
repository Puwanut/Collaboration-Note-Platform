import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function App() {
  const [open, setOpen] = useState(true)
  const Menus = [
    {title: "ADmin"},
    {title: "ADmin"},
    {title: "ADmin"},
    {title: "ADmin", gap: true},
    {title: "ADmin"},
    {title: "ADmin"},
    {title: "ADmin"},
  ]
   // Auto close menu when on mobile
   const handleResize = () => {
    if (window.innerWidth < 720) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }

  useEffect(() => {
    window.addEventListener("resize",handleResize)

    return () => {
			window.removeEventListener("resize", handleResize);
		};
  })

  return (
    <div>
        <div className="flex">
          <div className={`${open ? 'w-60': 'w-20'} duration-200 h-screen p-5 pt-8 bg-slate-200 relative`}>
            <FontAwesomeIcon icon={faAngleLeft}
            className={`absolute cursor-pointer rounded-full -right-3 top-9 w-7 pt-2 pb-2 border-2 border-slate-200 bg-white ${!open && "rotate-180"}`}
            onClick={() => setOpen(!open)}/>
            <div className="flex gap-x-4 items-center">
              <img
                src="square.svg"
                className={`cursor-pointer w-10 duration-500 ${open && "rotate-[360deg]"}`}
              />
              <h1 className={`text-slate-700 origin-left font-medium text-xl duration-300 ${!open && "scale-0"}`}>
                Puwanut's Workspace
                </h1>
            </div>
            <ul className="pt-6">
              {Menus.map((menu,index) => (
                <li key={index} className={`text-slate-500 text-sm flex items-center
                gap-x-4 cursor-pointer p-2 hover:bg-gray-400 rounded-md ${menu.gap ? "mt-9" : "mt-2"} ${index === 0 && 'bg-slate-100'}`}>
                  <img src={`${menu.src}`}/>
                  <span className={`${!open && 'hidden'} origin-left duration-200`}>{menu.title}</span>
                </li>
              ))}
            </ul>
          </div>


          <div className="p-7 text-2xl font-semibold flex-1 h-screen">
            <h1>Home Page</h1>
          </div>
        </div>
    </div>
  )
}
