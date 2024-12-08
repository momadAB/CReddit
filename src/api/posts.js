import axiosInstance from "./axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

const getAllPosts = async () => {
  const response = await axiosInstance.get("/posts");
  return response.data;
};

const getPostById = async (postId) => {
  const response = await axiosInstance.get(`/posts/${postId}`);
  return response.data;
};

const addPost = async (postData) => {
  const response = await axiosInstance.post("/posts", postData);
  return response.data;
};

const deletePost = async (postId) => {
  const response = await axiosInstance.delete(`/posts/${postId}`);
  return response.data;
};

const addComment = async ({ postId, commentData }) => {
  console.log("Payload being sent:", commentData); // Log the payload
  const response = await axiosInstance.post(
    `/posts/${postId}/comments`,
    commentData
  );
  return response.data;
};

const deleteComment = async (commentId) => {
  console.log(commentId);
  const response = await axiosInstance.delete(`/posts/comments/${commentId}`);
  return response.data;
};

export const useGetAllPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });
};

export const useGetPostById = (postId) => {
  return useQuery({
    queryKey: ["posts", postId],
    queryFn: () => getPostById(postId),
  });
};

export const useAddPost = () => {
  return useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });
};

export const useDeletePost = () => {
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });
};

export const useAddComment = () => {
  return useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });
};

export const useDeleteComment = () => {
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });
};
