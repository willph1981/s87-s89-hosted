import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditPost() {
    const { id } = useParams(); // Get post ID from URL
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch the post details
        fetch(`https://s87-s89-hosted.onrender.com/api/posts/${id}`)
            .then(res => res.json())
            .then(data => {
                setTitle(data.title);
                setContent(data.content);
            })
            .catch(err => console.error('Error fetching post:', err));
    }, [id]);

    const handleUpdate = async () => {
        if (!title.trim() || !content.trim()) {
            setError('Title and content cannot be empty.');
            return;
        }

        try {
            const response = await fetch(`https://s87-s89-hosted.onrender.com/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ title, content }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update post');
            }

            navigate(`/blog/${id}`); // Redirect to updated post
        } catch (error) {
            setError(error.message);
            console.error('Error updating post:', error);
        }
    };

    return (
    	
      <div style={{ 
    width: '100%', 
    maxWidth: '800px',  
    margin: '0 auto',  // Removes excessive margin
    padding: '16px',  // Ensures equal padding on all sides
    border: '1px solid #ccc', 
    borderRadius: '8px', 
    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)', 
    fontFamily: "'Courier New', monospace",  // Keeps the font you liked
    boxSizing: 'border-box' // Prevents overflow issues
}}>
    <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '12px' }}>Edit Post</h1>
    
    {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}

    <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        style={{
            width: '100%', 
            padding: '10px',
            marginBottom: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px',
            fontFamily: 'inherit',
            boxSizing: 'border-box' // Prevents extra width issues
        }}
    />
    
    <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        style={{
            width: '100%', 
            minHeight: '150px', 
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px',
            fontFamily: 'inherit',
            resize: 'vertical',
            boxSizing: 'border-box'
        }}
    />
    
    <button 
        onClick={handleUpdate} 
        style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontFamily: 'inherit',
            cursor: 'pointer',
            marginTop: '10px',
            transition: 'background 0.3s ease'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
    >
        Update Post
    </button>
</div>




      
    );
}

export default EditPost;
