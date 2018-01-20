<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<html>
<head>
    <link rel="icon" type="image/png" href="smile.png">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
 
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <style type="text/css">
    .m 
    {   
    margin-left:30px;  
    margin-right:30px;  
    } 
    </style>
    <title>Edit Post</title>

</head>
<body>
<%
    int pid=Integer.parseInt(request.getParameter("postid"));
    String username=request.getParameter("username");
%>
    <div class="p-3 mb-2 bg-success text-white"><h1>Edit Post</h1></div>
    <form action="post" method="POST">
        <div class="m">
            <button type="submit" class="btn btn-outline-info" name="action" value="save">Save</button>
            <button type="submit" class="btn btn-outline-warning" name="action" value="list">Close</button>
            <button type="submit" class="btn btn-outline-secondary" name="action" value="preview">Preview</button>
            <button type="submit" class="btn btn-outline-danger" name="action" value="delete">Delete</button>
        </div>
        <input type="hidden" name="username" value="<%= username %>">
        <input type="hidden" name="postid" value="<%= pid %>">
        <br>
        <div class="m">
            <label for="title">Title</label>
            <input class="form-control" name="title" type="text" id="title" value='<%= request.getAttribute("title") %>'>
        </div>
        <div class="m">
            <label for="body">Body</label>
            <textarea class="form-control" name="body" style="height:20rem;" id="body"><%= request.getAttribute("body") %></textarea>
        </div>
    </form>

    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
</body>
</html>
