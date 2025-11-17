import { URL } from 'url';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
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

        const encodedFileName = encodeURIComponent(fileName);
        // Retorna a URL pública
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${encodedFileName}`;
        
    } catch (error) {
        console.error("Erro no upload para o S3:", error);
        throw new Error("Falha no upload da imagem.");
    }
}

/**
 * Deleta um arquivo do S3 com base na URL completa.
 * @param {string} fileUrl - A URL completa do arquivo (ex: https://bucket.s3.../key.jpg)
 */
export async function deleteFileFromS3(fileUrl) {
    if (!fileUrl) {
        console.log("Nenhuma URL de arquivo fornecida para exclusão.");
        return;
    }

    try {
        // extrai a "Key" (o nome do arquivo) da URL
        const url = new URL(fileUrl);

        const decodePathname = decodeURIComponent(url.pathname);
        const fileKey = decodePathname.substring(1); // Remove a "/" inicial do caminho


        if (!fileKey) {
            console.warn(`Não foi possível extrair a chave do S3 da URL: ${fileUrl}`);
            return;
        }

        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey, // O nome do arquivo no S3
        });

        await s3Client.send(command);
        console.log(`Arquivo deletado com sucesso do S3: ${fileKey}`);

    } catch (error) {
        console.error(`Erro ao deletar arquivo do S3 (${fileUrl}):`, error);
        throw new Error("Falha ao deletar a imagem.");
    }
}