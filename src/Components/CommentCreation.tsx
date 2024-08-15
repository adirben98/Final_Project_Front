import { useForm } from "react-hook-form";
import commentService from "../Services/commentService";
import moment from "moment";

interface AddCommentProps {
  author: string;
  bookId: string;
  handle: () => void;
}

interface FormData {
  content: string;
}

export default function CommentCreate({
  author,
  bookId,
  handle,
}: AddCommentProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const newComment = {
        author,
        bookId,
        content: data.content,
        createdAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
      };
      commentService
        .createComment(newComment)
        .then((res) => {
          console.log(res);
          reset();
          handle();
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ margin: "20px 0", display: "flex", flexDirection: "column" }}
    >
      <textarea
        {...register("content", { required: "Your Comment is Empty!" })}
        placeholder="Your comment"
        style={{
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          resize: "none",
          height: "100px",
        }}
      />
      {errors.content && <span>{errors.content.message}</span>}
      <button className="btn btn-primary" style={{ fontSize: "1rem", width: "100%", marginBottom: "15px" }}>
        Add Comment
      </button>
    </form>
  );
}
