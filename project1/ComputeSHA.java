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
        try {
            File file=new File(args[0]);
            FileInputStream finput=new FileInputStream(file);
            byte data[]=new byte[1024];
            MessageDigest md;
            md=MessageDigest.getInstance("SHA-1");
            int len=0;
            while((len=finput.read(data))!=-1)
            {
                md.update(data,0,len);
                //System.out.print("read"+len+"bytes\n");
            }
            
            finput.close();
            byte[] messageSha1=md.digest();
            StringBuffer message=new StringBuffer();
            for(byte bytes:messageSha1)
            {
                message.append(String.format("%02x",bytes & 0xff));
            }
            
            System.out.println(message.toString());
        }
        catch (IOException e)
        {
            System.out.println("Error Reading File");
        }
        catch (NoSuchAlgorithmException e)
        {
            System.out.println("No Such Algorithm");
        }
    }
}
