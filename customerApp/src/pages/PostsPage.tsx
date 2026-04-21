import { useEffect, useState } from "react";
import { Link } from "react-router";
import PostItem from "../components/post/PostItem";
import type { Post } from "../types/post-types";
import { getPosts } from "../data/post";
import AddButton from "../components/ui/AddButton";

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="w-full h-screen bg-background">
      <div className="sticky top-0 flex h-20 items-center pl-6 gap-9 border-b border-muted-foreground">
        <h1 className="text-3xl font-semibold">News</h1>
        <Link to="/post">
          <AddButton />
        </Link>
      </div>
      <div className="p-6 flex flex-col gap-6">
        {posts.length > 0 ? (
          posts.map((post) => <PostItem key={post.id} post={post} />)
        ) : (
          <p>Keine Beiträge gefunden.</p>
        )}
      </div>
    </div>
  );
};

export default PostsPage;
