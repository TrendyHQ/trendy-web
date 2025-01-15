package auth0;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;

public class UploadFile {

    public String uploadToS3(MultipartFile file) throws IOException {
        String bucketName = "trendy-assets";
        String fileName = file.getOriginalFilename();

        // Initialize S3 client
        System.setProperty("aws.region", "us-east-2");
        S3Client s3 = S3Client.create();

        // Upload the file
        s3.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fileName)
                        .build(),
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        // Return the file URL
        return "https://" + bucketName + ".s3.amazonaws.com/" + fileName;
    }

}
