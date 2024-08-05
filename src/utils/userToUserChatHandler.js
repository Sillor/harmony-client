import { getUser } from "./authHandler";
import axios from "axios";
import { socket } from "./globals";


const url = import.meta.env.VITE_SERVER_ORIGIN;
export const fetchChatHistory = async (selectedFriend, setUsername, setUserId, setChatMessage, setIsEditing) => {
  // Fetch user details
  const fetchusername = await getUser();
  const username = fetchusername.data.username;
  const userId = fetchusername.data.id;

  localStorage.setItem("username", username);
  setUsername(username);
  setUserId(userId);

  // Emit username to socket
  socket.emit("set username", username);

  try {
    // Make API call to fetch chat history
    const response = await axios.get(`${url}/api/peerchat/load`, {
      params: {
        username: username,
        peerUsername: selectedFriend,
      },
      withCredentials: true,
    });

    // Update state with chat messages
    const messages = response.data.data;
    setChatMessage(messages);
    setIsEditing(Array(messages.length).fill(false));
  } catch (error) {
    console.error("Error fetching chat history:", error);
  }
};


export const listenForChatMessages = (username, selectedFriend, setChatMessage,setIsEditing) => {
  socket.on("chat message", async (message) => {
    console.log("received message:", message);
    try {
      // Fetch the latest message from the server
      const chatHistoryLatestResponse = await axios.get(
       `${url}/api/peerchat/loadlatest`,
        {
          params: {
            username: username,
            peerUsername: selectedFriend,
          },
          withCredentials: true,
        }
      );
      const latestMessage = chatHistoryLatestResponse.data.data[0];
      console.log("Latest message:", latestMessage);

      // Update the chat messages state with the latest message
      setChatMessage((prevChatMessage) => [
        ...prevChatMessage,
        latestMessage,
      ]);
      setIsEditing((prevIsEditing) => [...prevIsEditing, false]);
    } catch (error) {
      console.log("Error updating message:", error);
    }
  });

  // Return a cleanup function
  return () => {
    socket.off("chat message");
  };
};

export const editChatMessage = (chatMessage,setChatMessage)=> {
  socket.on("edit message", ({ messageId, message }) => {
    // Find the index of the message in the chatMessage state array
    const messageIndex = chatMessage.findIndex((msg) => msg.id === messageId);
    if (messageIndex !== -1) {
      // Create a copy of the chatMessage state array
      const updatedChatMessage = [...chatMessage];
      // Update the message content at the found index
      updatedChatMessage[messageIndex].message = message;
      // Update the chatMessage state with the updated array
      setChatMessage(updatedChatMessage);
    }
  });
  // Clean up the event listener when the component unmounts
  return () => {
    socket.off("edit message");
  };
}

// Function to handle message editing
export const editMessage = (index, chatMessage, setIsEditing, setEditMessage) => {
  setIsEditing((prevState) =>
    prevState.map((value, i) => (i === index ? true : false))
  );
  setEditMessage(chatMessage[index].message);
};

// Function to send a message
export const sendMessage = async (username, recipient, message, setChatMessage,setIsEditing) => {
  try {
    // Make API call to send message
    const response = await axios.post(
      `${url}/api/peerchat/send`,
      {
        userSender: username,
        userReciever: recipient,
        message: message,
      },
      {
        withCredentials: true, // Send cookies with the request if needed
      }
    );

    // Log the message to the console
    console.log(`Message sent to ${recipient}: ${message}`);

    // After sending the message, fetch the updated chat messages from the database
    if (response.status === 200) {
      socket.emit("chat message", { recipient, message });
      const chatHistoryLatestResponse = await axios.get(
        `${url}/api/peerchat/loadlatest`,
        {
          params: {
            username: username,
            peerUsername: recipient,
          },
          withCredentials: true, // Send cookies with the request if needed
        }
      );
      const latestMessage = chatHistoryLatestResponse.data.data[0];
      console.log("Latest message:", latestMessage);
      // Update the chat messages state with the fetched messages
      if (latestMessage) {
        setChatMessage((prevChatMessage) => [
          ...prevChatMessage,
          latestMessage,
        ]);
      }
    }
    setIsEditing((prevState) => [...prevState, false]);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};


export const deleteMessage = async (index, chatMessage, setChatMessage,  username, selectedFriend, setIsEditing) => {
  try {
    // Send request to delete message
    await axios.put(
      `${url}/api/peerchat/delete`,
      {
        userChatId: chatMessage[index].id,
        userSender: username,
      },
      {
        withCredentials: true,
      }
    );

    // Emit delete message event to socket
    socket.emit("delete message", {
      recipient: selectedFriend,
      messageId: chatMessage[index].id,
    });

    // Update chat messages state by removing the deleted message
    const updatedChatMessage = [...chatMessage]; // Create a copy
    updatedChatMessage.splice(index, 1); // Remove the element
    setChatMessage(updatedChatMessage); // Update state
     // Update isEditing state to match the new array length
  //    setIsEditing((prevState) =>
  //    prevState.filter((value, i) => i !== index) // Remove the deleted index
  //  );
  setIsEditing(Array(chatMessage.length).fill(false));
  } catch (error) {
    console.error("Error deleting message:", error);
  }
};



export const setupDeleteMessageListener = (chatMessage, setChatMessage,setIsEditing) => {
  socket.on("delete message", ({ messageId }) => {
    const messageIndex = chatMessage.findIndex((msg) => msg.id === messageId);
    if (messageIndex !== -1) {
      const updatedChatMessage = [...chatMessage];
      updatedChatMessage.splice(messageIndex, 1);
      setChatMessage(updatedChatMessage);
      setIsEditing(Array(chatMessage.length).fill(false));
    }
  });

  return () => {
    socket.off("delete message");
  };
};


export const handleSaveMessage = async (
  index,
  chatMessage,
  editedMessage,
  username,
  selectedFriend,
  setChatMessage,
  setIsEditing,
  setEditMessage
) => {
  try {
    await axios.put(
      `${url}/api/peerchat/edit`,
      {
        userChatId: chatMessage[index].id,
        message: editedMessage,
        userSender: username,
      },
      {
        withCredentials: true,
      }
    );

    setChatMessage((prevChatMessage) => {
      const updatedChatMessage = [...prevChatMessage];
      updatedChatMessage[index].message = editedMessage;
      return updatedChatMessage;
    });

    socket.emit("edit message", {
      recipient: selectedFriend,
      messageId: chatMessage[index].id,
      message: editedMessage,
    });

    setIsEditing((prevState) =>
      prevState.map((value, i) => (i === index ? false : value))
    );
  } catch (error) {
    console.error("Error updating message:", error);
  }

  setEditMessage("");
};