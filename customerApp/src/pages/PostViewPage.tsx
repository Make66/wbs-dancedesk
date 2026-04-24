import { useParams, useNavigate, Link } from "react-router";
import { useEffect, useState } from "react";
import { getPostById } from "../data/post";
import type { Post } from "../types/post-types";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { LuArrowLeft, LuPencil } from "react-icons/lu";

const PostViewPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | undefined>(undefined);

  useEffect(() => {
    if (!postId) return;
    getPostById(postId)
      .then((data) => setPost(data))
      .catch(() => setPost(undefined));
  }, [postId]);

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-4 border-b border-muted-foreground bg-background pl-6 z-20">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <LuArrowLeft className="text-xl" />
        </button>
        <h1 className="text-2xl font-semibold line-clamp-1 flex-1">{post?.title ?? ""}</h1>
      </div>

      {post && (
        <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title ?? ""}
              className="w-full rounded-xl object-cover max-h-80"
            />
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {post.date && (
              <span>{format(new Date(post.date), "dd. MMMM yyyy", { locale: de })}</span>
            )}
            {post.author && <span>· {post.author}</span>}
            {post.isTopPost && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                Top-News
              </span>
            )}
            <Link
              to={`/post/${post.id}`}
              className="ml-auto p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <LuPencil className="text-base" />
            </Link>
          </div>

          {post.teaser && (
            <p className="text-lg font-medium leading-snug text-foreground">{post.teaser}</p>
          )}

          {post.text && (
            <div
              className="text-sm leading-relaxed text-muted-foreground prose-editor"
              dangerouslySetInnerHTML={{ __html: post.text }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PostViewPage;
