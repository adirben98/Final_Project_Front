import React, { useState } from "react";
import userService from "../Services/userService";
import commentService from "../Services/commentService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPenToSquare, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
export interface IComment {
  _id?: string;
  author: string;
  content: string;
  bookId: string;
  createdAt: string;
  edited?: boolean;
  onUpdateHandler?: () => void;
}

const Comment: React.FC<IComment> = ({
  _id,
  author,
  content,
  createdAt,
  bookId,
  edited,
  onUpdateHandler,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<string>(content);
  async function deleteComment() {
    commentService
      .deleteComment(_id!)
      .then((res) => {
        console.log(res);
        onUpdateHandler!();
      })
      .catch((error) => console.log(error));
  }

  async function handleEdit() {
    const newComment = {
      _id: _id,
      author: author,
      content: newContent,
      bookId: bookId,
      createdAt: createdAt,
      edited: true,
    };
    commentService
      .updateComment(newComment)
      .then((res) => {
        console.log(res);
        setIsEditing(false);
        onUpdateHandler!();
      })
      .catch((error) => console.log(error));
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "5px",
        margin: "10px 0",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: "bold", marginRight: "10px" }}>
          {author}
        </span>
        <span style={{ fontSize: "0.8em", color: "#666" }}>{createdAt}</span>
      </div>
      {isEditing ? (
        <>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            style={{
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              resize: "none",
              height: "100px",
            }}
          /><div>
         <button
                type="button"
                className="btn"
                onClick={() => {
                  setIsEditing(false);
                  
                }}
                style={{ marginRight: "10px" }}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  className="fa-xl tinted-icon"
                />
              </button>
          <button
                type="button"
                className="btn"
                onClick={() => {
                 handleEdit()
                }}
                
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  className="fa-xl tinted-icon"
                />
              </button>
              </div>
        </>
      ) : (
        <>
          <p style={{ margin: "10px 0" }}>{content}</p>
          {edited && (
            <span style={{ fontSize: "0.8em", color: "#999" }}>Edited</span>
          )}
          {userService.getConnectedUser()!.username === author && (
            <div>
             <button
                type="button"
                className="btn"
                onClick={() => {
                  setIsEditing(true);
                  setNewContent(content);
                }}
                style={{ marginRight: "10px" }}
              >
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className="fa-xl tinted-icon"
                />
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                 deleteComment();
                }}
                style={{ marginRight: "10px" }}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className="fa-xl tinted-icon"
                />
              </button>
             
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comment;
