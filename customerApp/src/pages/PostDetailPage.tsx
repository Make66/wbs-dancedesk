import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getPostById } from "../data/post";
import type { Post } from "../types/post-types";
import PostForm from "../components/post/PostForm";

const PostDetailPage = () => {
  const postId = useParams<{ postId: string }>().postId;
  const [post, setPost] = useState<Post | undefined>(undefined);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        const response = await getPostById(postId);
        setPost(response ?? undefined);
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(undefined);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b bg-background border-gray-400 dark:border-gray-700 pl-6 z-20">
        <h1 className="text-3xl font-semibold line-clamp-1">
          {postId ? "Beitrag bearbeiten" : "Neuer Beitrag"}
        </h1>
      </div>
      <div className="p-6 overflow-y-auto flex-1">
        <PostForm post={post} />
      </div>
    </div>
  );
};

export default PostDetailPage;
