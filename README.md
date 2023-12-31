# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Registration page"](https://raw.githubusercontent.com/blueyellow7/tinyapp/main/docs/register-page.png)
!["Page to create new urls"](https://raw.githubusercontent.com/blueyellow7/tinyapp/main/docs/new-url-page.png)
!["Page with all your urls"](https://raw.githubusercontent.com/blueyellow7/tinyapp/main/docs/all-urls-page.png)


## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Once web server is running, search in your browser 'http://localhost:8000/'

## Using Tinyapp
- Register and login to create and save shortened urls
  - You will need an email and password!

- To shorten new url, click `Create New Url` on navigation bar. Type in the long url and click submit.

- To edit/delete url, go to `My URLs` and click the **edit** or **delete** button beside the url you wish to edit.

- The path to use a shortened url is: `/u/:shortUrl` This will take you to the website you wish to go to. 
  - Alternatively, you can click the **Edit** button, and use the link beside 'Short URL ID' on the page.
