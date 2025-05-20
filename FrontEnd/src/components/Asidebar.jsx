import React, { useContext } from "react";
import { AppContext } from "../Context/AppContext";

const Asidebar = () => {
  const { PageNum, setPageNum } = useContext(AppContext);
  const {setNewTask} = useContext(AppContext);
  return (
    <>
      <aside className="col-start-1 col-end-2 row-start-2 row-end-3 p-0">
        <nav>
          <ul className="list-none bg-[#3e3d3d] h-[90vh] pr-[6%] pt-[20px]">
            <li className="bg-[#726c6c] mb-[15px] rounded-[5px]">
              <a
                href="#"
                className={`block text-left text-white no-underline h-[35px] pl-[15px] pt-[10px] pb-[4px]
                           ${
                             PageNum === 1
                               ? "bg-[#1d0f90] font-bold text-[17px]"
                               : ""
                           }
                           hover:bg-[#1d0f55] hover:font-bold hover:text-[17px]
                           font-['Franklin_Gothic_Medium','Arial_Narrow',Arial,sans-serif]`}
                onClick={() => {
                  setPageNum(1);
                }}
              >
                Home
              </a>
            </li>
            <li className="bg-[#726c6c] mb-[15px] rounded-[5px]">
              <a
                href="#"
                className={`block text-left text-white no-underline h-[35px] pl-[15px] pt-[10px] pb-[4px]
                          ${
                             PageNum === 2
                               ? "bg-[#1d0f90] font-bold text-[17px]"
                               : ""
                           }
                         hover:bg-[#1d0f55] hover:font-bold hover:text-[17px]
                         font-['Franklin_Gothic_Medium','Arial_Narrow',Arial,sans-serif]`}
                onClick={() => {
                  setPageNum(2);
                  setNewTask(0);
                }}
              >
                Tasks
              </a>
            </li>
            <li className="bg-[#726c6c] mb-[15px] rounded-[5px]">
              <a
                href="#"
                className={`block text-left text-white no-underline h-[35px] pl-[15px] pt-[10px] pb-[4px]
                    ${
                             PageNum === 3
                               ? "bg-[#1d0f90] font-bold text-[17px]"
                               : ""
                           }
                         hover:bg-[#1d0f55] hover:font-bold hover:text-[17px]
                         font-['Franklin_Gothic_Medium','Arial_Narrow',Arial,sans-serif]`}
                onClick={() => {
                  setPageNum(3);
                }}
              >
                Projects
              </a>
            </li>
            <li className="bg-[#726c6c] mb-[15px] rounded-[5px]">
              <a
                href="#"
                className={`block text-left text-white no-underline h-[35px] pl-[15px] pt-[10px] pb-[4px]
                    ${
                             PageNum === 4
                               ? "bg-[#1d0f90] font-bold text-[17px]"
                               : ""
                           }
                         hover:bg-[#1d0f55] hover:font-bold hover:text-[17px]
                         font-['Franklin_Gothic_Medium','Arial_Narrow',Arial,sans-serif]`}
                onClick={() => {
                  setPageNum(4);
                }}
              >
                Chat
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Asidebar;
