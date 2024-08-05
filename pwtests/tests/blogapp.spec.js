const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset');

    await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'newuser',
          username: 'newuser',
          password: '1234'
        }
      });

      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'anotheruser',
          username: 'anotheruser',
          password: '5678'
        }
      });



    

    
    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {

    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        
        await page.getByTestId('username').fill('newuser')
        await page.getByTestId('password').fill('1234')
        await page.getByTestId('loginB').click()

        const errorMessage = page.getByRole('errorMes');
        console.log(errorMessage)
        await expect(page.getByTestId('blogs')).toBeVisible();

    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByTestId('username').fill('newuser')
        await page.getByTestId('password').fill('1233')
        await page.getByTestId('loginB').click()

        await expect(page.getByTestId('blogs')).not.toBeVisible();
    })
  })
  describe('blog creation', () => {

    test('logged in user can create, like and delete a blog', async ({ page }) => {

        await page.getByTestId('username').fill('newuser')
        await page.getByTestId('password').fill('1234')
        await page.getByTestId('loginB').click()

        await page.getByTestId('newBlog').click()
        await page.getByTestId('title').fill('Test Title');
        await page.getByTestId('author').fill('Test Author');
        await page.getByTestId('url').fill('http://testblog.com');
      
        await page.getByTestId('addBlog').click();
        await page.waitForTimeout(1000);


        await expect(page.getByTestId('Test Title')).toBeVisible();
        await page.getByTestId('Test Title').click();
        await page.getByTestId('likeB').click();
        await page.waitForTimeout(1000);

        await expect(page.getByText('likes: 1')).toBeVisible();
        page.on('dialog', dialog => dialog.accept());

     
        await page.getByTestId('removeBlog').click();
        await expect(page.getByTestId('Test Title')).not.toBeVisible();

    });
  });

  describe('Visibility of delete button', () => {
    test('only blog creator can see the delete button', async ({ page }) => {

      await page.getByTestId('username').fill('newuser');
      await page.getByTestId('password').fill('1234');
      await page.getByTestId('loginB').click();

      await page.getByTestId('newBlog').click();
      await page.getByTestId('title').fill('Test Title');
      await page.getByTestId('author').fill('Test Author');
      await page.getByTestId('url').fill('http://testblog.com');
      await page.getByTestId('addBlog').click();

      await page.getByTestId('Test Author').click();
      await expect(page.getByTestId('removeBlog')).toBeVisible();

      await page.getByTestId('logoutB').click();

      await page.getByTestId('username').fill('anotheruser');
      await page.getByTestId('password').fill('5678');
      await page.getByTestId('loginB').click();

      await page.getByTestId('Test Author').click();
      await expect(page.getByTestId('removeBlog')).not.toBeVisible();
    });
  });

  describe('blog sorting by likes', () => {
    beforeEach(async ({ page }) => {
        await page.getByTestId('username').fill('newuser');
        await page.getByTestId('password').fill('1234');
        await page.getByTestId('loginB').click();

        await page.getByTestId('newBlog').click();
        await page.getByTestId('title').fill('Blog1');
        await page.getByTestId('author').fill('Author1');
        await page.getByTestId('url').fill('http://blog1.com');
        await page.getByTestId('addBlog').click();
        await page.waitForTimeout(1000);


        await page.getByTestId('title').fill('Blog2');
        await page.getByTestId('author').fill('Author2');
        await page.getByTestId('url').fill('http://blog2.com');
        await page.getByTestId('addBlog').click();
        await page.waitForTimeout(1000);


        await page.getByTestId('title').fill('Blog3');
        await page.getByTestId('author').fill('Author3');
        await page.getByTestId('url').fill('http://blog3.com');
        await page.getByTestId('addBlog').click();

        
        await page.getByTestId('Author1').click();
        await page.getByTestId('likeB').click();
        await page.getByTestId('likeB').click();
        await page.getByTestId('likeB').click();
        await page.getByTestId('Author1').click();

        

        await page.getByTestId('Author2').click();        
        await page.getByTestId('likeB').click();
        await page.getByTestId('likeB').click();
        await page.getByTestId('likeB').click();
        await page.getByTestId('likeB').click();
        await page.getByTestId('Author2').click();


        await page.getByTestId('Author3').click();        
        await page.getByTestId('likeB').click();
        await page.getByTestId('Author3').click();

        
    });

    test.only('blogs are sorted by likes in descending order', async ({ page }) => {

        await page.waitForTimeout(1000);

        const dataTestIds = await page.$$eval('[data-testid^="Blog"]', elements =>
            elements.map(el => el.getAttribute('data-testid'))
          );

      const expectedOrder = [
        'Blog2', 
        'Blog1',
        'Blog3'  
      ];

      expect(dataTestIds).toEqual(expectedOrder);
    });
  });
});
