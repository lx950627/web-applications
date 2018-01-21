import java.io.IOException;
import java.sql.* ;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.commonmark.node.*;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Servlet implementation class for Servlet: ConfigurationTest
 *
 */
public class Editor extends HttpServlet {
    /**
     * The Servlet constructor
     * 
     * @see javax.servlet.http.HttpServlet#HttpServlet()
     */
    public Editor() {}

    public void init() throws ServletException
    {
        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException ex) {
            System.out.println(ex);
            return;
        }
    }
    
    public void destroy()
    {
        /*  write any servlet cleanup code here or remove this function */
    }

    /**
     * Handles HTTP GET requests
     * 
     * @see javax.servlet.http.HttpServlet#doGet(HttpServletRequest request,
     *      HttpServletResponse response)
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
    {
        String action=request.getParameter("action");
        System.out.println(action);
        if(action==null)
        {
           request.setAttribute("code",2);
           response.setStatus(400);
           request.getRequestDispatcher("/invalid.jsp").forward(request, response);
           return;
        }

        else if(action.equals("save") || action.equals("delete"))
        {
          request.setAttribute("code",1);
          response.setStatus(405);
          request.getRequestDispatcher("/invalid.jsp").forward(request, response);
        }

        else if(action.equals("open"))
        {
            ActionOpen(request,response);       
        }

        else if(action.equals("list"))
        {
             ActionList(request,response);
        }

        else if(action.equals("preview"))
        {
             ActionPreview(request,response);
        }

        else{
           request.setAttribute("code",2);
           response.setStatus(400);
           request.getRequestDispatcher("/invalid.jsp").forward(request, response);
        }
        
    }
    
    /**
     * Handles HTTP POST requests
     * 
     * @see javax.servlet.http.HttpServlet#doPost(HttpServletRequest request,
     *      HttpServletResponse response)
     */
    public void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
    {

        String action=request.getParameter("action");
        System.out.println(action);
        if(action==null)
        {
           request.setAttribute("code",2);
           response.setStatus(400);
           request.getRequestDispatcher("/invalid.jsp").forward(request, response);
           return;
        }

        else if(action.equals("save"))
        {
            Connection conn = null;
        try {
             String username=request.getParameter("username");
             String pidstring=request.getParameter("postid");
             if(!CheckNameAndPID(request,response,username,pidstring))
             {
              return ;
             }
             int pid=Integer.parseInt(pidstring);
             String title=request.getParameter("title");
             String body=request.getParameter("body");
  
             if(title==null || body==null || title.equals("") || body.equals(""))
             {
              request.setAttribute("code",6);
              response.setStatus(400);
              request.getRequestDispatcher("/invalid.jsp").forward(request, response);
              return;
             }
    
             if(pid<=0)//assign a new postid and save as a new post
            {
               conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/CS144", "cs144", "");
               PreparedStatement preparedStmt = conn.prepareStatement("SELECT MAX(postid) FROM Posts WHERE username=?"); 
               preparedStmt.setString(1,username);
               ResultSet rs = preparedStmt.executeQuery();
               
               int newid=1;
               if(rs.next())
               {
                  newid=rs.getInt(1)+1;
               }
               System.out.println("newid:"+newid);
               preparedStmt = conn.prepareStatement("INSERT INTO Posts"
                +"(username,postid,title,body,created,modified) VALUES"
                +"(?,?,?,?,?,?)");

               String timeStamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date());
               preparedStmt.setString(1,username);
               preparedStmt.setInt(2,newid);
               preparedStmt.setString(3,title);
               preparedStmt.setString(4,body);
               preparedStmt.setString(5,timeStamp);
               preparedStmt.setString(6,timeStamp);
               int n = preparedStmt.executeUpdate();
               //System.out.println(n);

            } 
            else if(pid>0)
            {
               conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/CS144", "cs144", "");
               PreparedStatement preparedStmt = conn.prepareStatement("SELECT * FROM Posts WHERE username=? AND postid=?");     
               preparedStmt.setString(1,username);
               preparedStmt.setInt(2,pid);
               ResultSet rs = preparedStmt.executeQuery();
               System.out.println("pid>0");
               if(rs.next())// recored exists in mysql, update the row with new title, body, and modification date.
               {
                   //System.out.println("Exist!");
                   preparedStmt = conn.prepareStatement("Update Posts SET title=?, body=?, modified=? WHERE username=? AND postid=?"); 
                   preparedStmt.setString(1,title);
                   preparedStmt.setString(2,body);
                   String timeStamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date());
                   preparedStmt.setString(3,timeStamp);
                   preparedStmt.setString(4,username);
                   preparedStmt.setInt(5,pid);
                   int n = preparedStmt.executeUpdate();

               }
            }
            }
                catch (SQLException ex){
            System.out.println("SQLException caught");
            ex.printStackTrace();
            System.out.println(ex);
            } finally {
            try { conn.close(); } catch (Exception e) { /* ignored */ }
            }
            

            request.getRequestDispatcher("/list.jsp").forward(request, response);

        }

        else if(action.equals("delete"))
        {
            String username=request.getParameter("username");
            String pidstring=request.getParameter("postid");
            if(!CheckNameAndPID(request,response,username,pidstring))
            {
              return ;
            }
            int pid=Integer.parseInt(pidstring);
            Connection conn = null;
            try{
              conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/CS144", "cs144", "");
              PreparedStatement preparedStmt = conn.prepareStatement("DELETE FROM Posts WHERE username=? AND postid=?");
              preparedStmt.setString(1,username);
              preparedStmt.setInt(2,pid);
              int n = preparedStmt.executeUpdate();

            }catch (SQLException ex){
            System.out.println("SQLException caught");
            } finally {
            try { conn.close(); } catch (Exception e) { /* ignored */ }
            }
            request.getRequestDispatcher("/list.jsp").forward(request, response);
                 
        }

        else if(action.equals("preview"))
        {
          ActionPreview(request,response);
        }

        else if(action.equals("list"))
        {
           ActionList(request,response);
        }

        else if(action.equals("open"))
        {
          ActionOpen(request,response);    
        }

        else{
            request.setAttribute("code",2);
            response.setStatus(400);
            request.getRequestDispatcher("/invalid.jsp").forward(request, response);
        }   
    }

    private void ActionOpen(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
        {
            Connection conn = null;
        try {
            String username=request.getParameter("username");
            String pidstring=request.getParameter("postid");
            if(!CheckNameAndPID(request,response,username,pidstring))
            {
              return ;
            }
            int pid=Integer.parseInt(pidstring);
            String title=request.getParameter("title");
            String body=request.getParameter("body");

            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/CS144", "cs144", "");
            PreparedStatement preparedStmt = conn.prepareStatement("SELECT title,body FROM Posts WHERE username=? AND postid=?");
                
            preparedStmt.setString(1,username);
            preparedStmt.setInt(2,pid);
            ResultSet rs = preparedStmt.executeQuery();

            String dbtitle="";
            String dbbody="";
            while(rs.next())
            {
               dbtitle=rs.getString("title");
               dbbody=rs.getString("body");
            }

            title=(title==null)?dbtitle:title;
            body=(body==null)?dbbody:body;
            
            System.out.println(title+":"+body);
            request.setAttribute("title",title);
            request.setAttribute("body",body);
            request.getRequestDispatcher("/edit.jsp").forward(request, response);
            } catch (SQLException ex){
            System.out.println("SQLException caught");
            } finally {
            try { conn.close(); } catch (Exception e) { /* ignored */ }
            }
        }

    private void ActionPreview(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
        {
          String username=request.getParameter("username");
          String pidstring=request.getParameter("postid");
          if(!CheckNameAndPID(request,response,username,pidstring))
          {
              return ;
          }
          Parser parser = Parser.builder().build();
          HtmlRenderer renderer = HtmlRenderer.builder().build();

          String bmarkdown = request.getParameter("body");
          String tmarkdown = request.getParameter("title");
          if(bmarkdown==null || tmarkdown==null){
              request.setAttribute("code",6);
              response.setStatus(400);
              request.getRequestDispatcher("/invalid.jsp").forward(request, response);
          }

          String html = renderer.render(parser.parse(bmarkdown));  
          request.setAttribute("mbody",html);
          html = renderer.render(parser.parse(tmarkdown));  
          request.setAttribute("mtitle",html);
          
          request.getRequestDispatcher("/preview.jsp").forward(request, response);
        }

    private void ActionList(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException 
        {
            String username=request.getParameter("username");
            if(username==null)
            {
              request.setAttribute("code",4);
              response.setStatus(400);
              request.getRequestDispatcher("/invalid.jsp").forward(request, response);
              return;
            }
            request.getRequestDispatcher("/list.jsp").forward(request, response);
        }

    private boolean CheckNameAndPID(HttpServletRequest request, HttpServletResponse response, String username,String pidstring)
       {
          try{
            if(username==null)
            {
              request.setAttribute("code",4);
              response.setStatus(400);
              request.getRequestDispatcher("/invalid.jsp").forward(request, response);
              return false;
            }
            if(pidstring==null)
            {
              request.setAttribute("code",5);
              response.setStatus(400);
              request.getRequestDispatcher("/invalid.jsp").forward(request, response);
              return false;
            }

            if(!pidstring.matches("-*[0-9]+"))
            {
              request.setAttribute("code",3);
              response.setStatus(400);
              request.getRequestDispatcher("/invalid.jsp").forward(request, response);
              return false;
            }
          }catch(Exception e){
            System.out.print(e);
          }
           
            return true;
       }

}

