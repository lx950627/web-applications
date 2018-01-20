<!DOCTYPE html>
<%@ page import = "java.io.*,java.util.*,java.sql.*"%>
<%@ page import = "javax.servlet.http.*,javax.servlet.*" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/sql" prefix = "sql"%>
<html>
<head>
    <link rel="icon" type="image/png" href="smile.png">
    <style type="text/css">
    table,th,td {   
    text-align:center;  
    } 
    .m 
    {   
    margin-left:30px;  
    margin-right:30px;  
    } 
    </style>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <title>Post List</title>
</head>
<body>
     <sql:setDataSource var = "dataSource" driver = "com.mysql.jdbc.Driver" url = "jdbc:mysql://localhost:3306/CS144"
         user = "cs144"  password = ""/>
     
      <c:set var="username" value='<%= request.getParameter("username") %>'/>
      <sql:query dataSource = "${dataSource}" var = "result">
         SELECT * from Posts WHERE username=? ORDER BY postid ASC;
         <sql:param value="${username}" />
      </sql:query>

    <div class="p-3 mb-2 bg-success text-white"><h1>List Posts</h1></div>
    <div>
        <form action="post" id="0">
            <input type="hidden" name="username" value='<%= request.getParameter("username")%>'>
            <input type="hidden" name="postid" value="0">
            <button type="submit" class="btn btn-info btn-lg m" name="action" value="open">New Post</button>
        </form>
    </div>
    <br>

      <table class="table table-striped table-hover table-sm m">
         <caption>List of posts of <%= request.getParameter("username") %></caption>
         <thead>
             <tr>
                <th>Title</th>
                <th>Created</th>
                <th>Modified</th>
                <th>Operations</th>
             </tr>
         </thead>
         
         <c:forEach var = "row" items = "${result.rows}" varStatus="loop">
            <tr>
               <form id="<c:out value="${loop.index}"/>" action="post" method="POST">
                 <input type="hidden" name="username" value="${row.username}">
                 <input type="hidden" name="postid" value="${row.postid}">
                 <td><c:out value = "${row.title}"/></td>
                 <td><c:out value = "${row.created}"/></td>
                 <td><c:out value = "${row.modified}"/></td>
                 <td>
                    <button type="submit" class="btn btn-primary" name="action" value="open">Open</button>
                    <button type="submit" class="btn btn-danger" name="action" value="delete">Delete</button>
                </td>
               </form>
            </tr>
         </c:forEach>
      </table>

    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
</body>
</html>


