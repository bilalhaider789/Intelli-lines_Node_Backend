const router = require("express").Router();
const multer = require('multer');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const url="https://2e6f-34-74-7-18.ngrok-free.app/"

const storage = multer.diskStorage({
    destination: './save', // Specify the destination folder
    filename: (req, file, cb) => {
      cb(null, 'video.mp4'); // Set the desired file name and extension
    },
  });
  
  const upload = multer({ storage });


router.post("/video", upload.single('file'),async(req, res) => {
    console.log("accessed")
    // res.status(201).json({"success":"1"})
    console.log(req.body.link)
    var link=req.body.link

    if (req.file) {
        ffmpeg("./save/video.mp4")
            .toFormat('mp3')
            .save("./save/audio.mp3")
            .on('end', () => {
            console.log('Conversion complete');

            const fileData = fs.readFileSync('./save/audio.mp3');
            const formData = new FormData();
            formData.append('file', fileData, 'file.mp3');
            axios.post(link+'audioconvert', formData, {
                headers: formData.getHeaders(),
              })
                .then(response => {
                //   console.log(response);
                    console.log("Cloud work done")
                    console.log(response.data.text)
                  res.json({ "success": '1', "text": response.data.text });
                  
                })
                .catch(error => {
                  console.error('Error uploading file:', error);
                });

            // res.json({ message: 'File uploaded successfully' });
            })
            .on('error', (error) => {
            console.error('Conversion error:', error);
            });
        console.log(req.file);
    
        // Return a response to the client
        
      } else {
        // No file uploaded
        res.status(400).json({ message: 'No file uploaded' });
      }
})



module.exports = router;