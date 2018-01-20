<!DOCTYPE html>
<html>
<head>
    <link rel="icon" type="image/png" href="smile.png">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
 
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <title>Invalid Request</title>
</head>
<body>
<%
   int code=(Integer)request.getAttribute("code");
   String reason="";
   if(code==1){
     reason="Action "+request.getParameter("action")+" cannot be issued via GET method";
   }
   else if(code==2){
     reason="Undefined action.Allowed actions include 'save, open, list, preivew, delete'.";
   }
   else if(code==3){
      reason="Please specify the right form of post id. Only the number is allowed.";
   }
   else if(code==4){
      reason="Username is required for this action.";
   }
   else if(code==5){
      reason="Post id is required for this action.";
   }
   else{
      reason="Something is missing...";
   }

%>

    <h1>Invalid Request</h1>
    
    <h2>Request</h2>
    <b>action:</b> <%= request.getParameter("action")%><br>
    <b>username:</b> <%= request.getParameter("username")%><br>
    <b>postid:</b> <%= request.getParameter("postid")%><br>
    <b>title:</b> <%= request.getParameter("title")%><br>
    <b>body:</b> <%= request.getParameter("body")%><br><br>

    <h2>Reason of Error</h2>
    <%= reason %>

    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
</body>
</html>

