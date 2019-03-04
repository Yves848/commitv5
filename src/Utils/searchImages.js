import axios from 'axios';
import isJpg from 'is-jpg';
import request from 'request'

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

 const searchImageAS = async (key) =>{
   //console.log('SearchImageAS')
  const tempImages = [];
  var CSE_API_KEY = '007439388879951561867:3ragl0fkhpm';
  var CSE_ID = 'AIzaSyDYvQx76ZvFawwKOaDeGqRClb2RJlIcsXM';
  var parameters = '?q=' + encodeURIComponent(key);
  parameters += '&cx=' + CSE_API_KEY;
  parameters += '&imgSize=large';
  parameters += '&searchType=image';
  parameters += '&key=' + CSE_ID;
  parameters += '&lr=lang_fr';
  parameters += '&start=1';

  var path = 'https://www.googleapis.com/customsearch/v1' + parameters;
  //console.log(path)
  let response;
  try {
    response = await axios.get(path);
    if (response) {
      var images = response.data.items;
      await asyncForEach(images, async (image,i) => {
        //const img = await DownloadImage(image.link);
        //if (isJpg(img)) {
        tempImages.push({
          url: image.link,
          width: image.image.width,
          height: image.image.height,
        });
      //}
      })
  
      const covers = tempImages.map((image, i) => {
          return {
            image: image.url,
            type: 'GoogleSearch',
          };
      });
      return covers;
    }
    else {
      return []
    }
  } catch (error) {
    //console.log('SearchImageAS - error',error)
    return []
  }

  //console.log('searchImageAS',response);
  
}

const searchLastFMAS = async (mp3File) =>{
    //console.log("[searchLastFM] mp3File", mp3File);
    //console.log('SearchLastFMAS')
    const url = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=0f61370d07c524f982180c2f0f108d9c&artist=${
      mp3File.artist
    }&track=${mp3File.title}&format=json`;
    const response = await axios.get(url);
    //console.log('[searchLastFM] response', response);
    try
    {
    if (response.data.track.album) {
      const image = response.data.track.album.image[3]['#text'];
      if (image) {
        return ({
          image: image,
          type: 'lastFM',
        });
      }
    }
  }
  catch (err) {
    return null;
  }
}

const DownloadImage = async (url, image_path) => {
  return new Promise(async (resolve, reject) => {
    await request({ url, encoding: null,rejectUnauthorized: false,  }, (err, resp, buffer) => {
      if (err) {
        reject(err);
      }
      resolve(buffer);
    });
  });
};


export {searchImageAS,searchLastFMAS, DownloadImage}
