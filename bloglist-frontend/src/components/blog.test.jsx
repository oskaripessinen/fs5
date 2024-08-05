import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Blog from './Blog'; 
import AddBlogForm from './addBlogForm';
import userEvent from '@testing-library/user-event';
import { describe, test, expect} from 'vitest';


const blog = {
  title: 'TestBlogTitle',
  author: 'Test Author',
  url: 'http://testurl.com',
  likes: 5,
  user: {
    username: 'sdad',
    name: 'Test User',
    passwordHash: 'sadasda'
  }
};



describe('<Blog />', () => {
  test('renders title and author but not url or likes by default', () => {
    render(<Blog blog={blog} isVisible={false} />);

        


    expect(screen.getByText('TestBlogTitle')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.queryByText('http://testurl.com')).not.toBeInTheDocument();
    expect(screen.queryByText('likes: 5')).not.toBeInTheDocument();
  });

  test('renders likes and user when the view button is clicked', async () => {

    render(<Blog blog={blog} isVisible={true} />);

    screen.debug();

        


    expect(screen.getByText('likes: 5')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();

  });

  test('calls the like event handler twice', async () => {
    const mockHandler = vi.fn();
    const user = userEvent.setup();

    render(<Blog blog={blog} isVisible={true} handleLike={mockHandler} toggleVisibility={() => {}} user={user} setUpdate={() => {}} />);

    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});

describe('<AddBlogForm />', () => {
    test('calls addBlog with the right details when a new blog is created', async () => {
      const user = userEvent.setup()

      const mockAddBlog = vi.fn();
  
      const mockSetTitle = vi.fn();
      const mockSetAuthor = vi.fn();
      const mockSetUrl = vi.fn();

      const title = 'Test Blog Title';
      const author = 'Test Author';
      const url = 'http://testurl.com';
  
      render(
        <AddBlogForm
          addBlog={mockAddBlog}
          setTitle={mockSetTitle}
          setAuthor={mockSetAuthor}
          setUrl={mockSetUrl}
          title={title}
          author={author}
          url={url}
        />
      );
  
      const titleInput = screen.getByTestId('title');
      const authorInput = screen.getByTestId('author');
      const urlInput = screen.getByTestId('url');
      const submitButton = screen.getByText('create');
  
      await user.type(titleInput, 'Test Blog Title')
      await user.type(authorInput, 'Test Author')
    
      await user.type(urlInput, 'http://testurl.com')
  
      await user.click(submitButton)
  
      expect(mockAddBlog).toHaveBeenCalledWith(title, author, url);
      expect(mockAddBlog).toHaveBeenCalledTimes(1);
    });
  });
