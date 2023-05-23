import { useQuery, useMutation } from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

const METHOD = Object.freeze({
  DELETE: Symbol(),
  UPDATE: Symbol(),
});

export function PostDetail({ post }) {
  const { data, error, isError, isLoading } = useQuery(
    ["comments", post.id],
    () => fetchComments(post.id)
  );

  const deleteMutation = useMutation((postId) => deletePost(postId));
  const updateMutation = useMutation((postId) => updatePost(postId));

  const handleMutation = (type, mutation) => {
    if (mutation.isError) {
      const errorMessage = type === METHOD.DELETE ? "deleting" : "updating";
      const msg = `Error ${errorMessage} the post`;
      return <p style={{ color: "red" }}>{msg}</p>;
    }
    if (mutation.isLoading) {
      const errorMessage = type === METHOD.DELETE ? "Deleting" : "Updating";
      const msg = `${errorMessage} the post`;
      return <p style={{ color: "purple" }}>{msg}</p>;
    }
    if (mutation.isSuccess) {
      const errorMessage = type === METHOD.DELETE ? "deleted" : "updated";
      const msg = `Post has (not) been ${errorMessage}`;
      return <p style={{ color: "green" }}>{msg}</p>;
    }
  };

  if (isLoading) return <h3>Loading...</h3>;
  if (isError)
    return (
      <>
        <h3>Oops, Something went wrong</h3>
        <p>{error.toString()}</p>
      </>
    );

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>
      {handleMutation(METHOD.DELETE, deleteMutation)}
      {handleMutation(METHOD.UPDATE, updateMutation)}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
