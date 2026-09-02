import { useEffect, useState, useCallback } from "react";
import { FiMessageSquare, FiSend, FiTrash2, FiLoader } from "react-icons/fi";
import { fetchComments, postComment, removeComment } from "../../services/commentsService";

/**
 * CommentsSection
 * Props:
 *   entityType  - string: 'request' | 'issue' | 'damage' | 'return' | 'inventory' | 'purchase_request' | 'project' | 'team'
 *   entityId    - number
 *   currentUserId - optional, for showing delete button on own comments
 */
const CommentsSection = ({ entityType, entityId, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!entityType || !entityId) return;
    try {
      setLoading(true);
      const data = await fetchComments({ entityType, entityId });
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => { load(); }, [load]);

  const handlePost = async () => {
    if (!text.trim() || posting) return;
    try {
      setPosting(true);
      setError("");
      const comment = await postComment({ entityType, entityId, commentText: text.trim() });
      setComments((prev) => [...prev, comment]);
      setText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await removeComment(commentId);
      setComments((prev) => prev.filter((c) => c.comment_id !== commentId));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    } catch { return ts; }
  };

  return (
    <div className="mt-6 border-t border-slate-200 pt-5">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
        <FiMessageSquare className="w-4 h-4 text-cyan-500" />
        Comments
        {!loading && (
          <span className="ml-1 text-xs font-normal text-slate-400">
            ({comments.length})
          </span>
        )}
      </h4>

      {/* Comment list */}
      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
            <FiLoader className="w-4 h-4 animate-spin" />
            Loading comments...
          </div>
        )}
        {!loading && comments.length === 0 && (
          <p className="text-slate-400 text-sm italic">No comments yet. Be the first to add one.</p>
        )}
        {!loading && comments.map((c) => (
          <div
            key={c.comment_id}
            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-800">
                {c.author_name ?? "User"}
                {c.author_role && (
                  <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-600 border border-cyan-200">
                    {c.author_role}
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs">{formatTime(c.created_at)}</span>
                {currentUserId && c.user_id === currentUserId && (
                  <button
                    onClick={() => handleDelete(c.comment_id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete comment"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed">{c.comment_text}</p>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-xs mb-3">{error}</p>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handlePost()}
          placeholder="Add a comment..."
          className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-100 transition-all"
        />
        <button
          onClick={handlePost}
          disabled={!text.trim() || posting}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {posting ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSend className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default CommentsSection;
