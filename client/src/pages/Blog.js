import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Blog() {
    const { id } = useParams(); // Get postId from URL
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null); // Track logged-in user's ID
    const [isAdmin, setIsAdmin] = useState(false); // Track if user is admin

    useEffect(() => {
        // Fetch post details
        fetch(`https://s87-s89-hosted.onrender.com/api/posts/${id}`)
            .then(res => res.json())
            .then(data => setPost(data))
            .catch(err => console.error(err));

        // Fetch comments
        fetch(`https://s87-s89-hosted.onrender.com/api/comments/${id}/comments`)
            .then(res => res.json())
            .then(data => setComments(data))
            .catch(err => console.error(err));

        // Check if user is logged in and get their info
        const loggedInUserId = localStorage.getItem('userId');
        const loggedInIsAdmin = localStorage.getItem('isAdmin') === 'true'; // Get admin status from localStorage
        setUserId(loggedInUserId);
        setIsAdmin(loggedInIsAdmin);
    }, [id]);

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            setError('Comment cannot be empty');
            return;  // Stop execution if the comment is empty
        }

        try {
            const response = await fetch(`https://s87-s89-hosted.onrender.com/api/comments/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ content: newComment }),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Get the error details
                console.error('Error:', errorData); // Log the error
                throw new Error('Failed to add comment');
            }

            const newCommentData = await response.json();
            const userId = localStorage.getItem('userId');
            const username = localStorage.getItem('username'); // Assuming you stored the username

            setComments((prevComments) => [
                ...prevComments, 
                { 
                    ...newCommentData, 
                    author: { _id: userId, username: username } // Add username if not in backend response
                }
            ]); // Update the UI immediately
            setNewComment(''); // Clear input
        } catch (error) {
            setError(error.message);
            console.error(error); // Log the error to the console
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`https://s87-s89-hosted.onrender.com/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                setComments(comments.filter(comment => comment._id !== commentId)); // Remove deleted comment from UI
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to delete comment');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to delete comment');
        }
    };

    // Handle Edit Post (triggered from Edit button)
    const handleEditPost = () => {
        // Redirect to edit page (you can replace this logic with your routing logic)
        window.location.href = `/edit-post/${post._id}`;
    };

    return (
        <div className="container">
        <div>
            {post ? (
                <>
                    <h1>{post.title}</h1>
                    <p>{post.content}</p>
                    
                    {/* Conditionally render Edit button only if user is the author of the post */}
                    {post.author._id === userId && (
                        <button onClick={handleEditPost}>Edit Post</button>
                    )}

                    <h2>Comments</h2>
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment._id}>
                                <p>{comment.content}</p>
                                <small>By {comment.author.username}</small>
                                {/* Conditionally render the delete button */}
                                {(comment.author._id === userId || isAdmin) && (
                                    <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No comments yet.</p>
                    )}

                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                    />
                    <button onClick={handleAddComment}>Add Comment</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
        </div>
    );
}

export default Blog;
