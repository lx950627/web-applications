<!DOCTYPE html>
<html>
<head>
    <link rel="icon" type="image/png" href="smile.png">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
 
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <title>Preview Post</title>
    <style type="text/css">
    .m 
    {   
    margin-left:30px;  
    margin-right:30px;  
    } 
    </style>
</head>
<body>
    <div class="p-3 mb-2 bg-success text-white"><h1>Preview Post</h1></div>
        <div>
            <form action="post" method="POST">
                <input type="hidden" name="username" value='<%= request.getParameter("username") %>'>
                <input type="hidden" name="postid" value='<%= request.getParameter("postid") %>'>
                <input type="hidden" name="title" value='<%= request.getParameter("title") %>'>
                <input type="hidden" name="body" value='<%= request.getParameter("body") %>'>
                <button type="submit" class="btn btn-info m" name="action" value="open">Close Preview</button>
            </form>
        </div>
        <br>
        <div class="m">
            <div class="card bg-light mb-3" style="max-width: 18rem;">
            <h1 class="card-header" id="title"><%= request.getAttribute("mtitle") %></h1>
            <div class="card-body">
                <div class="card-text" id="body"><%= request.getAttribute("mbody") %></div>
            </div>
        </div>
            
        
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
</body>
</html>