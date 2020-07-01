import fs from 'fs';

class FileReader{
    read(){
        fs.readFile('todo.txt', (err, data) => { 
            console.log(data); 
        });
    }
}
export default FileReader;