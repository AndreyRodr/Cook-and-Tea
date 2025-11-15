import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import 'dotenv/config';

const s3Client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    }
});

/**
 * Faz upload de um arquivo para o S3.
 * @param {object} file - O arquivo recebido do multer (req.file).
 * @returns {string} - A URL pública do arquivo no S3.
 */
export async function uploadFileToS3(file) {
    // Gera um nome de arquivo único (ex: 1678886400000-nomeoriginal.jpg)
    const fileName = `${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName, // O nome do arquivo no S3
        Body: file.buffer, // O conteúdo binário do arquivo
        ContentType: file.mimetype, // O tipo de arquivo (ex: 'image/jpeg')
    });

    try {
        await s3Client.send(command);

        // Retorna a URL pública
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${fileName}`;
        
    } catch (error) {
        console.error("Erro no upload para o S3:", error);
        throw new Error("Falha no upload da imagem.");
    }
}