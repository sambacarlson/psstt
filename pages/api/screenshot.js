import DB from "lib/db";
import { getSession } from "next-auth/react";

import spawn from 'child_process'
import fs from 'fs'
import aws from 'aws-sdk'
import Timer from 'modals/Timers'

/** creates and saves a snapshot */
// async function makeScreenshot(req, res) {
//     fs = require("fs");
//     if (!fs.existsSync(".screenshots")) {
//         await fs.mkdirSync(".screenshots");
//     }
//     const pythonProcess = spawn("python", ["screenshot.py"]);
//     pythonProcess.stdout.on("data", (data) => {
//         console.log(`stdout: ${data}`);
//     });

//     pythonProcess.stderr.on("data", (data) => {
//         console.error(`stderr: ${data}`);
//         res.status(400).json({ "message": "something went wrong" })
//     });

//     pythonProcess.on("close", (code) => {
//         console.log(`child process exited with code ${code}`);
//         res.status(200).json({ "messge": "Screenshot taken" });
//     });
// }

/** retrieves a list of screenshots (paths) */
// async function retrieveScreenshots(req, res) {
//   const fs = require("fs");
//   const path = require("path");

//   const directoryPath = "./.screenshots";
//   if (!fs.existsSync(directoryPath)) {
//     res.json({ "sceenshots": [] });
//     return
//   }

//   const files = fs.readdirSync(directoryPath);
//   const paths = [];

//   for (const file of files) {
//     const fullPath = path.join(directoryPath, file);

//     if (fs.lstatSync(fullPath).isDirectory()) {
//       const subPaths = getFilesInDirectory(fullPath);
//       paths.push(...subPaths);
//     } else {
//       paths.push(fullPath);
//     }
//   }

//   res.json({ "screenshots": paths });
// }

// /** clears screenshots */
// async function clearScreenshots(req, res) {
//   const fs = require("fs");
//   const path = require("path");
//   const directoryPath = "./.screenshots";

//   if (fs.existsSync(directoryPath)) {
//     const files = fs.readdirSync(directoryPath);

//     for (const file of files) {
//       const fullPath = path.join(directoryPath, file);

//       if (fs.lstatSync(fullPath).isDirectory()) {
//         deleteFolderRecursively(fullPath);
//       } else {
//         fs.unlinkSync(fullPath);
//       }
//     }

//     fs.rmdirSync(directoryPath);
//     res.json({ message: "Screenshot cleared" });
//   } else {
//     res.json({ message: "No screenshots to delete" });
//   }

//   function deleteFolderRecursively(directoryPath) {
//     if (fs.existsSync(directoryPath)) {
//       const files = fs.readdirSync(directoryPath);

//       for (const file of files) {
//         const fullPath = path.join(directoryPath, file);

//         if (fs.lstatSync(fullPath).isDirectory()) {
//           deleteFolderRecursively(fullPath);
//         } else {
//           fs.unlinkSync(fullPath);
//         }
//       }

//       fs.rmdirSync(directoryPath);
//     }
//   }
// }

// module.exports = { makeScreenshot, retrieveScreenshots, clearScreenshots };

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploadFile = () => {
    return new Promise((resolve, reject) => {
        try {
            const file = fs.readFileSync(
                `pages/api/.screenshots/screenshot.png`
            );
            const BUCKET = process.env.AWS_BUCKET;

            const uploadParams = {
                Bucket: BUCKET,
                Key: `${new Date().getTime()}.png`,
                Body: file,
            };

            s3.upload(uploadParams, function (err, data) {
                if (err) {
                    return reject(err);
                }
                if (data) {
                    return resolve(data);
                }
            });
        } catch (error) {
            return reject(error);
        }
    });
};


export default async function tag(req, res, next) {
    await DB();
    const session = await getSession({ req });
    const dailyCheckId = session?.dailyCheckId;

    const pythonProcess = spawn.spawn("python3", ["pages/api/screenshot.py"]);
    pythonProcess.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
        res.status(400).json({ "message": "something went wrong" })
    });

    pythonProcess.on("close", async (code) => {
        console.log(`child process exited with code ${code}`);
        const file = await uploadFile();
        // req.profilePic = res.Location;
        console.log('pofile pic: ', file)
        console.log('daily check id: ', dailyCheckId)
        const runningTask = await Timer.findOne({ dailyCheckId: dailyCheckId, status: 'running' });
        if (!runningTask) {
            res.status(404).json({ "message": "No task found!" })
        }
        console.log('running task: ', runningTask)
        const screenshots = [...runningTask.screenshots, file.Location]
        await Timer.findByIdAndUpdate(runningTask._id, { screenshots: screenshots })
        res.send({ filename: file.Location });
    });
}