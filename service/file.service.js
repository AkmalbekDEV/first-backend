const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

class FileService {
    save(file) {
        try {
            const fileName = uuidv4() + '.jpg';
            const currentDir = __dirname;
            const staticDir = path.join(currentDir, '..', 'static');
            const filePath = path.join(staticDir, fileName);

            if (!fs.existsSync(staticDir)) {
                fs.mkdirSync(staticDir, { recursive: true });
            }

            file.mv(filePath);
            return fileName;
        } catch (error) {
            throw new Error("Error saving file: " + error.message);
        }
    }

    delete(fileName) {
        try {
            const currentDir = __dirname;
            const staticDir = path.join(currentDir, '..', 'static');
            const filePath = path.join(staticDir, fileName);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return true;
            };

            return false;
        } catch (error) {
            throw new Error("Error deleting file: " + error.message);
        };
    };
};

module.exports = new FileService();