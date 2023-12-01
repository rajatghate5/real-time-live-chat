import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./style.css";
import "bootstrap/dist/css/bootstrap.css";

const socket = io("http://127.0.0.1:5000");

const App = () => {
  const [username, setUsername] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const receivedMessageHandler = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("received-message", receivedMessageHandler);

    return () => {
      socket.off("received-message", receivedMessageHandler);
    };
  }, [socket]);

  const handleSubmit = (e) => {
    console.log(username, newMessage);
    e.preventDefault();

    const messageData = {
      message: newMessage,
      user: username,
    };
    console.log(messageData);

    if (!newMessage == "") {
      socket.emit("send-message", messageData);
      setNewMessage("");
    } else {
      alert("Message cannot be empty field");
    }
  };

  const handleReturn = () => {
    setUsername("");
    setChatActive(false);
    socket.disconnect()
  };

  return (
    <>
      <div
        id="container"
        className="bg-white d-flex justify-content-center align-items-center"
      >
        {chatActive ? (
          <div
            className="card border-0 border-start border-end h-100 bg-transparent border-secondary-subtle"
            style={{ width: "30rem" }}
          >
            <div className="card-header border-0 bg-dark d-flex justify-content-center align-items-center" style={{gap: '1rem'}}>
              <h2 className="border-3 border-bottom text-light text-center w-75 h-100">
                Chat With Buddies
              </h2>
              <button
                className="w-25 px-2 py-2 btn btn-outline-light rounded-0"
                onClick={handleReturn}
              >
                Exit
              </button>
            </div>
            <div className="card-body bg-body-tertiary d-flex flex-column justify-content-center overflow-y-auto py-2 h-100" style={{objectFit: 'contain'}}>
              <div className="d-flex flex-column">
                {messages.map((message, i) => (
                  <div
                    className="bg-transparent w-100 h-auto py-0 my-2"
                    key={i}
                  >
                    <div
                      className={`bg-white p-2 ${
                        username === message.user ? "ms-auto" : ""
                      }`}
                      style={{
                        width: "fit-content",
                        textAlign: username === message.user ? "right" : "",
                      }}
                    >
                      <small
                        className={`text-capitalize fw-bold ${
                          username === message.user
                            ? "text-primary-emphasis"
                            : "text-warning"
                        }`}
                      >
                        {message.user}
                      </small>
                      <p className="fs-5 m-0">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-footer p-0">
              <form onSubmit={handleSubmit} className="w-100 d-flex">
                <input
                  type="text"
                  className="w-75 p-2 f-4"
                  placeholder="Enter message here...."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-25 px-2 py-2 btn btn-outline-dark rounded-0"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div
            className="card border-0 border-start border-end h-100 bg-transparent border-secondary-subtle"
            style={{ width: "30rem" }}
          >
            <div className="card-header border-0 bg-transparent">
              <h2 className="border-3 border-bottom text-center w-50">
                Join Chatroom
              </h2>
            </div>
            <div className="card-body d-flex flex-column justify-content-center">
              <label className="fs-5">Username </label>
              <input
                type="text"
                className="p-2 my-2 fs-6 mb-3"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                className="w-25 px-2 py-2 btn btn-outline-dark"
                onClick={() => !username == "" && setChatActive(true)}
              >
                Join
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
