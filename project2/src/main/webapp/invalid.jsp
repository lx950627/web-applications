<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
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
</body>
</html>

