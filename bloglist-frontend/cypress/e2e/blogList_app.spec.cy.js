describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testingRouter/reset");
    const user = {
      name: "root",
      username: "groot",
      password: "password",
    };
    const user2 = {
      name: "test",
      username: "test",
      password: "test",
    };

    cy.request("POST", "http://localhost:3003/api/users", user);
    cy.request("POST", "http://localhost:3003/api/users", user2);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("login").click();
  });

  describe("login", function () {
    it("successful user login with correct credential", function () {
      cy.contains("login").click();
      cy.get("#username").type("groot");
      cy.get("#password").type("password");
      cy.get("#login-button").click();

      cy.contains("root logged-in");
    });

    it("unsuccessful user login with wrong credential", function () {
      cy.contains("login").click();
      cy.get("#username").type("groot");
      cy.get("#password").type("groot");
      cy.get("#login-button").click();

      cy.contains("invalid username or password");

      cy.get(".error")
        .should("contain", "invalid username or password")
        .and("have.css", "color", "rgb(165, 42, 42)");

      cy.get("html").should("not.contain", "groot logged-in");
    });
  });

  describe("when logged-in", function () {
    beforeEach(function () {
      cy.login({ username: "groot", password: "password" });
    });

    it("a new blog can be created", function () {
      cy.createBlog({
        title: "a new blog created by cypress",
        author: "namuna",
        url: "test.com",
      });
      //cy.contains("create new blog").click();
      // cy.get("#title").type("a new blog created by cypress");
      // cy.get("#author").type("namuna");
      // cy.get("#url").type("test.com");
      // cy.get("#add").click();
      //cy.contains("a new blog created by cypress namuna");
    });

    it.only("user can like a blog", function () {
      cy.contains("create new blog").click();
      cy.get("#title").type("a new blog created by cypress");
      cy.get("#author").type("namuna");
      cy.get("#url").type("test.com");
      cy.get("#add").click();
      cy.contains("a new blog created by cypress namuna");

      cy.get(".view").click();
      cy.get("#likeButton").click();
    });

    it("user can delete a blog", function () {
      cy.contains("create new blog").click();
      cy.get("#title").type("testing for remove blog");
      cy.get("#author").type("namuna");
      cy.get("#url").type("test.com");
      cy.get("#add").click();
      cy.contains("testing for remove blog namuna");

      cy.get(".view").click();
      cy.get("#remove-button").click();
      cy.contains("#title").should("not.exist");
    });

    it("other user can not delete a blog", function () {
      cy.contains("create new blog").click();
      cy.get("#title").type("testing for remove blog");
      cy.get("#author").type("namuna");
      cy.get("#url").type("test.com");
      cy.get("#add").click();
      cy.contains("testing for remove blog namuna");
      cy.contains("log out").click();

      cy.contains("login").click();
      cy.get("#username").type("test");
      cy.get("#password").type("test");
      cy.get("#login-button").click();
      cy.contains("test logged-in");

      cy.get(".view").click();
      cy.get("#remove-button").click();
      cy.contains("testing for remove blog");
    });

    it("placing the blogs in ascending order according to likes", function () {
      cy.createBlog({ title: "mobile", author: "jack", url: "url.com" });
      cy.contains("mobile jack").contains("view").click();

      cy.get("#likeButton").click();
      cy.wait(500);
      cy.get("#likeButton").click();
      cy.wait(500);
      cy.get("#likeButton").click();
      cy.wait(500);
      cy.contains("hide").click();

      cy.createBlog({ title: "silly boy", author: "amir", url: "ktm.com" });
      cy.contains("silly boy amir").contains("view").click();
      cy.get("#likeButton").click();
      cy.wait(500);
      cy.get("#likeButton").click();
      cy.wait(500);
      cy.contains("hide").click();

      cy.createBlog({ title: "hiking", author: "me", url: "test.com" });
      cy.contains("hiking me").contains("view").click();
      cy.get("#likeButton").click();
      cy.wait(500);
      cy.get("#likeButton").click();
      cy.wait(500);
      cy.get("#likeButton").click();
      cy.wait(500);
      cy.get("#likeButton").click();
      cy.wait(500);
      cy.contains("hide").click();

      cy.get(".blog").eq(0).should("contain", "hiking me");
      cy.get(".blog").eq(1).should("contain", "mobile jack");
      cy.get(".blog").eq(2).should("contain", "silly boy amir");
    });
  });
});
