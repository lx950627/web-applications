public class PostData{
  private int postid;
  private String title;
  private String created;
  private String modified;

  public PostData(int id,String title,String created,String modified){
    this.postid=id;
    this.title=title;
    this.created=created;
    this.modified=modified;
  }

  public int getPostid(){
    return postid;
  }

  public void setPostid(int id){
    this.postid=id;
  }

  public String getTitle(){
    return title;
  }

  public void setTitle(String title){
    this.title=title;
  }

  public String getCreated(){
    return created;
  }

  public void setCreated(String created){
    this.created=created;
  }

  public String getModified(){
    return modified;
  }

  public void setModified(String modified){
    this.modified=modified;
  }
}

