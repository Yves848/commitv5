const NodeID3 = require('node-id3');
const path = require('path');
const fs = require('fs');
const jsmediatags = require('jsmediatags');

export default class Mp3File {
  constructor(pathName = '', fileName = '', index = -1) {
    this.pathName = pathName;
    this.fileName = fileName;
    this.index = index;
    this.hasCover = false;
  }

  setJson = json => {
    this.json = { ...json };
  };

  getTags2 = async obj => {
    return new Promise(resolve => {
      let filename = path.resolve(obj.pathName, obj.fileName);
      new jsmediatags.Reader(filename).setTagsToRead(['title', 'artist']).read({
        onSuccess: tag => {
          resolve(tag.tags);
        },
      });
    });
  };

  getTags = (obj) => {
    return new Promise(resolve => {
      let filename = path.resolve(obj.pathName, obj.fileName);
      new jsmediatags.Reader(filename).setTagsToRead(['title', 'artist','picture']).read({
        onSuccess: tag => {
          resolve(tag.tags);
        },
        onError: error => {
          resolve(null)
        }
      });
    })
  };

  getPicture = async (object, image) => {
    const url = await this.Picture(object);
    //console.log('getPicture', url);
    return url;
  };

  writePicture = async (Object,image) => {
    return new Promise((resolve, reject) => {
      const imageName = path.resolve('./temp.jpg');
      fs.writeFileSync(imageName,image)
      const tags = {
        artist: Object.artist,
        title: Object.title,
        APIC: imageName
      }
      //console.log('file', f);
      //console.log('writePicture',Object)
      NodeID3.update(tags, path.resolve(Object.pathName, Object.fileName), (err) => {
        console.log(err);
      });
      resolve();
    })

  }

  Picture = async obj => {
    return new Promise((resolve, reject) => {
      let filename = path.resolve(this.pathName, this.fileName);
      new jsmediatags.Reader(filename).setTagsToRead(['title', 'picture']).read({
        onSuccess: tag => {
          var arrayBufferView = new Uint8Array(tag.tags.picture.data);
          var blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
          var urlCreator = window.URL || window.webkitURL;
          resolve(urlCreator.createObjectURL(blob));
        },
        onError: error => {
          console.log('Picture error', error);
          reject(error);
        },
      });
    });
  };

  getImgUrl = obj => {
    var arrayBufferView = new Uint8Array(obj.picture.data);
    var blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
    var urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(blob);
  };
}
