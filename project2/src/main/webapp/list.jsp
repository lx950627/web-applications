<!DOCTYPE html>
<%@ page import = "java.io.*,java.util.*,java.sql.*"%>
<%@ page import = "javax.servlet.http.*,javax.servlet.*" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix = "c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/sql" prefix = "sql"%>
<html>
<head>
    <meta charset="UTF-8">
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

    <div>
        <form action="post" id="0">
            <input type="hidden" name="username" value='<%= request.getParameter("username")%>'>
            <input type="hidden" name="postid" value="0">
            <button type="submit" name="action" value="open">New Post</button>
        </form>
    </div>

      <table>
         <tr><th>Title</th><th>Created</th><th>Modified</th><th>&nbsp;</th></tr>
         <c:forEach var = "row" items = "${result.rows}" varStatus="loop">
            <tr>
               <form id="<c:out value="${loop.index}"/>" action="post" method="POST">
                 <input type="hidden" name="username" value="${row.username}">
                 <input type="hidden" name="postid" value="${row.postid}">
                 <td><c:out value = "${row.title}"/></td>
                 <td><c:out value = "${row.created}"/></td>
                 <td><c:out value = "${row.modified}"/></td>
                 <td>
                    <button type="submit" name="action" value="open">Open</button>
                    <button type="submit" name="action" value="delete">Delete</button>
                </td>
               </form>
            </tr>
         </c:forEach>
      </table>
</body>
</html>


