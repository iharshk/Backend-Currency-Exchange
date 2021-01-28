const fs = require('fs');
const util = require('util');
const path = require('path');
require('dotenv').config();
const { dbConnect } = require('../config/database');
dbConnect()
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const assetsDir = path.join(__dirname, '..', 'assets' );
const modelDir = path.join(__dirname, '..', 'models' );

const getAssetsDirFiles = async () => {
  return await readdir(assetsDir);
};

const seed = async() => {
  const files = await getAssetsDirFiles();

  const filteredFiles = files.filter((file) => file !== '.git');

  if (!filteredFiles) return new Error(`Reading files dir error ${filteredFiles}`);
  const extractedFileData = await extractFileData(filteredFiles);
  if (!extractedFileData) return new Error(`extractedFileData error ${extractedFileData}`);
};

/** IIF for starting seed operation  */

(async () => {
  try {
      console.log('Running seed');
      await seed();
  } catch(err) {
      console.log(err);
      process.exit(1);
  } finally {
      console.log('Success seed');
      process.exit(0);
  }
})();

/** Extract Data of Files */

const extractFileData = async(files) => {
  if (!files) return new Error('Invalid Input');

  console.log(`Starting Seed for ${files.length} files`);

  for (let i = 0; i < files.length; ++i) {
    const modalData = await getJSONFileDataAsync(files[i]);
    const modelFile = files[i].replace('.json', '') + '.js';
    
    const modal = await require(path.join(modelDir, modelFile));
    await restoreInDB(modal, modalData, modelFile);
  }
};

const getJSONFileDataAsync = async (file) => {
  try {
    const content = await readFile(path.join(assetsDir, file), 'utf8');
    if (content) {
      return JSON.parse(content)
    }
  } catch(ex) {
    throw new Error(ex)
  }
};


/*
   Description: Add or update records to database
*/
const restoreInDB = async (modal, data, modelFile) => {
  const fileName = modelFile.replace('.js', '');
  console.log(`Running seed for ${fileName}`);
  for (let i = 0; i < data.length; ++i) {
    const {_id, ...value} = typeof(data[i]) === 'string' ? await JSON.parse(data[i]) : data[i];

    if (_id) {
      try {
        const updated = await modal.findOneAndUpdate({ _id }, value, { upsert: true, new: true, setDefaultsOnInsert: true });
        
        if (!updated) {
          console.log('Failed during update ', _id);
        }

      } catch (ex) {
        console.log('Failed during update ', _id, ex.message);
      }

    } else {
      try {
        const inserted = await modal.create(data[i]);
      
        if (!inserted) {
          console.log("Error while insertion", data[i]);
        }
      } catch(ex) {
        console.log("Error while insertion", ex.message)
      }
      
    }
  }
}
