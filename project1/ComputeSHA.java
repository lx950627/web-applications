import java.io.*;
import java.security.*;
/**
 *
 * @author liuxin
 */
public class ComputeSHA {

    /**
     * @param args the command line arguments
     */
    public static void main (String[] args)
    {
        File file=new File(args[0]);
        FileInputStream finput=null;
        byte data[]=new byte[(int)file.length()];
        try {
            finput=new FileInputStream(file);
            finput.read(data);  
            finput.close();  
        } catch (IOException ex) {
            System.out.println("Error Reading File");   
        }
        
        MessageDigest md;
        try {
            md=MessageDigest.getInstance("SHA-1");
            md.update(data);
            byte[] messageSha1=md.digest();
            StringBuffer message=new StringBuffer();
            for(byte bytes:messageSha1)
            {
               message.append(String.format("%02x", bytes & 0xff));
            }
            //System.out.println(data.toString());
            System.out.println(message.toString());
        } catch (NoSuchAlgorithmException ex) {
            System.out.println("No Such Algorithm");
        }
          System.out.println();
    }
}
