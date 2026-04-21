import { Link } from "react-router";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import type { Post } from "../../types/post-types";

type PostItemProps = {
  post: Post;
};

const PostItem = ({ post }: PostItemProps) => {
  const formattedDate = post.date
    ? format(new Date(post.date), "dd. MMM yyyy", { locale: de })
    : null;

  return (
    <div className="group rounded-2xl cursor-pointer bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors duration-200 border border-gray-200 dark:border-zinc-600">
      <Link to={`/post/${post.id}`} state={{ post }}>
        <div className="flex items-center gap-6 p-4">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title ?? "Beitrag"}
              className="rounded-xl w-32 aspect-4/3 object-cover shrink-0"
            />
          ) : (
            <div className="rounded-xl w-32 aspect-4/3 bg-gray-300 dark:bg-zinc-500 shrink-0 flex items-center justify-center text-gray-400 text-xs">
              Kein Bild
            </div>
          )}

          <div className="flex flex-col justify-between flex-1 min-w-0">
            <div>
              <h2 className="text-xl font-semibold line-clamp-1">{post.title ?? "–"}</h2>
              {post.teaser && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
                  {post.teaser}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              {post.author && <span>{post.author}</span>}
              {formattedDate && <span>{formattedDate}</span>}
              {!post.isActive && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                  Inaktiv
                </span>
              )}
              {post.isArchived && (
                <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full font-medium">
                  Archiviert
                </span>
              )}
            </div>
          </div>

          <span className="text-4xl font-thin text-gray-400 dark:text-zinc-400 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 select-none pr-2">
            ›
          </span>
        </div>
      </Link>
    </div>
  );
};

export default PostItem;
