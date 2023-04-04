import { faAngleRight, faCheck, faRepeat, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { basicBlocks, typeMapTag } from "../shared/blockType"
import { Dispatch, SetStateAction, forwardRef } from "react";
import Image from "next/image";

interface IMenuOverlayProps {
    activeBlockType: string
    setTag: Dispatch<SetStateAction<string[]>>
    setMenuOpen: Dispatch<SetStateAction<boolean>>
    deleteBlock: () => void
}



const MenuOverlay = forwardRef<HTMLDivElement, IMenuOverlayProps>(function MenuOverlay({
   activeBlockType,
   setTag,
   setMenuOpen,
   deleteBlock
  } , ref) {

  const MenuList = [
    {
      name: "Turn into",
      icon: <FontAwesomeIcon icon={faRepeat} className="text-neutral-500" />,
      subMenus: basicBlocks.map((block) => ({
        name: block.name,
        thumbnail: block.thumbnail,
      })),
    },
    {
      name: "Delete",
      icon: <FontAwesomeIcon icon={faTrashCan} className="text-neutral-500" />,
      action: deleteBlock
    },
  ]

  const handleChangeBlockType = (blockType: string) => {
    setTag(typeMapTag[blockType])
    setMenuOpen(false)
  }

  return (
    <div
      className="absolute z-10 translate-x-14"
      id="main-menu-overlay"
      ref={ref}
    >
      <div className="min-w-[12rem] rounded-sm border-[1px] bg-white p-1 shadow-2xl">
        {MenuList.map((menu) => (
          <div className="group relative" key={menu.name}>
            <div
              className="flex items-center justify-between px-2 py-1 hover:cursor-pointer hover:bg-neutral-200/60"
              onClick={menu.action}
            >
              <div>
                <div className="inline-block w-4 text-center">{menu.icon}</div>
                <span className="ml-2 text-sm">{menu.name}</span>
              </div>
              {menu.subMenus && (
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="mr-1 text-neutral-400"
                />
              )}
            </div>
            {menu.subMenus && (
              <div
                className="absolute min-w-[12rem] origin-top-left -translate-y-10 translate-x-44 scale-0 rounded-sm
                           border-[1px] bg-white p-1 shadow-2xl transition group-hover:scale-100"
              >
                {menu.subMenus.map((subMenu) => (
                  <div
                    key={subMenu.name}
                    className="flex items-center justify-between px-2 py-1 hover:cursor-pointer hover:bg-neutral-200/60"
                    onClick={() => handleChangeBlockType(subMenu.name)}
                  >
                    <div className="flex items-center">
                      <div className="relative h-6 w-6 rounded-md border-[1px]">
                        <Image
                          src={`${subMenu.thumbnail}`}
                          fill
                          sizes="100%"
                          alt={`${subMenu.name} thumbnail`}
                        />
                      </div>
                      <span className="ml-2 text-sm">{subMenu.name}</span>
                    </div>
                    {activeBlockType === subMenu.name && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="mr-1 text-neutral-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
})

export default MenuOverlay
