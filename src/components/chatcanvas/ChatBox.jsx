import Textarea from "./TextareaChatCanvas";

const ChatBox = ({ setindividualChatOpen }) => {
  const individualChatClickHandler = () => {
    setindividualChatOpen(false);
  };
  return (
    <>
      <div className="flex flex-col chat-canvas  w-[75vw] md:w-[350px] dark:bg-black text-primary pb-2">
        <div className=" border-b p-1 md:p-3 flex items-center justify-between">
          <div className="flex items-center ">
            <img
              src="assets\\img\\pexels-andrea-piacquadio-774909.jpg"
              className="rounded-full w-10 h-10 object-cover flex-shrink-0 "
            ></img>

            <h1 className="text-xl ml-3">John Doe</h1>
          </div>
          <button className="me-3" onClick={individualChatClickHandler}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="mt-3 h-[75vh] scrollable-div ">
          <div className="flex flex-col chat-list h-4/5 overflow-auto">
            <div className="flex mb-2 ">
              <p className="message from-them dark:from-them-dark">
                Eating eggs on Thursday for choir practice was recommended.
              </p>
            </div>
            <div className="flex flex-row-reverse mb-2">
              <p className="message from-me">
                Pantyhose and heels are an interesting choice of attire for the
                beach.
              </p>
            </div>
            <div className="flex mb-2">
              <p className="message from-them  ">
                Eating eggs on Thursday for choir practice was recommended.
              </p>
            </div>
            <div className="flex flex-row-reverse mb-2">
              <p className="message from-me">
                Pantyhose and heels are an interesting choice of attire for the
                beach.
              </p>
            </div>
            <div className="flex mb-2">
              <p className="message from-them  ">
                Eating eggs on Thursday for choir practice was recommended.
              </p>
            </div>
            <div className="flex flex-row-reverse mb-2">
              <p className="message from-me">
                Pantyhose and heels are an interesting choice of attire for the
                beach.
              </p>
            </div>
            <div className="flex mb-2">
              <p className="message from-them  ">
                Eating eggs on Thursday for choir practice was recommended.
              </p>
            </div>
            <div className="flex flex-row-reverse mb-2">
              <p className="message from-me">
                Pantyhose and heels are an interesting choice of attire for the
                beach.
              </p>
            </div>
            <div className="flex mb-2">
              <p className="message from-them  ">
                Eating eggs on Thursday for choir practice was recommended.
              </p>
            </div>
            <div className="flex flex-row-reverse mb-2">
              <p className="message from-me">
                Pantyhose and heels are an interesting choice of attire for the
                beach.
              </p>
            </div>
          </div>

          <Textarea />
        </div>
      </div>
    </>
  );
};

export default ChatBox;
