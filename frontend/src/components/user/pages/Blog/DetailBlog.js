

const DetailBlog = ({ blogId, blogTitle }) => {
    console.log(blogId);
    console.log(blogTitle);
    return (
        <div>
            <h2>User Component</h2>
            <p>Blog ID: {blogId}</p>
            <p>Blog Title: {blogTitle}</p>
        </div>
    );
};

export default DetailBlog;
