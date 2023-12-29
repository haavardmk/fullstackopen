describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Administrator',
      username: 'admin',
      password: 'admin123',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login button shown by default.(assume button needs to be clicked, as implemented)', function () {
    cy.contains('Log in').click()
    cy.contains('Blogs')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('Log in').click()
      cy.get('#username').type('admin')
      cy.get('#password').type('admin123')
      cy.get('#login-button').click()

      cy.contains('Administrator logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('Log in').click()
      cy.get('#username').type('admin')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'admin', password: 'admin123' })
    })

    it('A blog can be created', function () {
      cy.contains('New Blog').click()
      cy.get('#titleInput').type('a blog created by cypress')
      cy.get('#authorInput').type('cypress automated test')
      cy.get('#URLInput').type('www.cypress.com')
      cy.contains('save').click()
      cy.contains('a blog created by cypress')
      cy.visit('')
      cy.contains('a blog created by cypress')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'first blog',
          name: 'Administrator',
          url: 'www.1.fi',
          likes: 0,
        })
        cy.createBlog({
          title: 'second blog',
          name: 'Administrator',
          url: 'www.2.fi',
          likes: 2,
        })
        cy.createBlog({
          title: 'third blog',
          name: 'Administrator',
          url: 'www.3.fi',
          likes: 4,
        })
      })

      it('one of those can be made visible', function () {
        cy.contains('second blog').parent().find('button').as('viewButton')
        cy.get('@viewButton').click()
        cy.get('@viewButton').should('contain', 'Hide')
      })

      it('users can like a blog', function () {
        cy.contains('first blog')
          .parent()
          .find('button')
          .as('viewButton')
          .click()
        cy.get('#Like').click()
        cy.contains('Likes: 1')
        cy.get('#Like').click()
        cy.contains('Likes: 2')
      })

      it('user can delete blog it made', function () {
        cy.contains('third blog')
          .parent()
          .find('button')
          .as('viewButton')
          .click()
        cy.get('#Delete').click()
        cy.wait(1000)
        cy.contains('third blog').should('not.exist')
      })

      it('Only author can see delete', function () {
        cy.get('#Logout').click()
        cy.contains('third blog')
          .parent()
          .find('button')
          .as('viewButton')
          .click()
        cy.contains('second blog')
          .parent()
          .find('button')
          .as('viewButton')
          .click()
        cy.contains('first blog')
          .parent()
          .find('button')
          .as('viewButton')
          .click()
        cy.wait(1000)
        cy.contains('delete').should('not.exist')
      })

      it('Blogs are ordered by likes', function () {
        cy.contains('third blog')
          .parent()
          .find('button')
          .as('viewButton')
          .click()
        cy.contains('second blog')
          .parent()
          .find('button')
          .as('viewButton')
          .click()
        cy.contains('first blog')
          .parent()
          .find('button')
          .as('viewButton')
          .click()
        cy.contains('Sort by likes').click()
        cy.get('.blog').eq(0).should('contain', 'third blog')
        cy.get('.blog').eq(1).should('contain', 'second blog')
        cy.get('.blog').eq(2).should('contain', 'first blog')
      })
    })
  })
})
