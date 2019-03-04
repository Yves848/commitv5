import request from 'request';
import convert from 'xml-js';

const gracenoteURL = 'https://c411160602.web.cddbp.net/webapi/xml/1.0/';
//const clientID = '411160602-BCC13DF4B55952E6113BF1F313B2EC71';


class Gracenote {
  constructor(clientID) {
    this.clientID = clientID;
  }

  register = (setUser) => {

    let client = this.clientID;
    let statusCode;
    let success;
    const register = `
    <QUERIES>
      <QUERY CMD="REGISTER">
        <CLIENT>${client}</CLIENT>
      </QUERY>
    </QUERIES>
`;
    request(
      {
        url: gracenoteURL,
        body: register,
        method: 'POST',
        headers: {
          'User-Agent': 'nodejs-gracenote',
        },
      },
      (error, response, body) => {
        if (response) {
          const json = response.toJSON();
          statusCode = json.statusCode;
          //const body = convert.xml2js(json.body,{compact: true, spaces: 4});
          //console.log(body)
        }

        if (body) {
          const json = convert.xml2js(body,{compact: true, spaces: 4});
          success = !(json.RESPONSES.ERROR);
          if (success) {
          this.clientID = client;
          this.clientUSER= json.RESPONSES.RESPONSE.USER._text;
          setUser(this.clientUSER);
          }
          else {
            setUser("error");
          }
          //console.log('gracenoteRegister [body]', json);

        }
        if (error) {
          console.log(error);
          setUser('error')
        }
      }
    );
  }

  albumSearch = async (mp3File) => {
    return new Promise((resolve, reject) => {
      this.clientID;
      const { artist, title } = mp3File;
      const albumSearch = `
        <QUERIES>
          <AUTH>
            <CLIENT>${this.clientID}</CLIENT>
            <USER>${this.clientUSER}</USER>
          </AUTH>
          <QUERY CMD="ALBUM_SEARCH">
            <TEXT TYPE="ARTIST">${artist}</TEXT>
            <TEXT TYPE="TRACK_TITLE">${title}</TEXT>
            <MODE>SINGLE_BEST_COVER</MODE>
            <OPTION>
              <PARAMETER>COVER_SIZE</PARAMETER>
              <VALUE>LARGE,XLARGE,SMALL,MEDIUM,THUMBNAIL</VALUE>
            </OPTION>
          </QUERY>
        </QUERIES>
  `;
  //console.log('Gracenote - albumSearch')

      request(
        {
          url: gracenoteURL,
          body: albumSearch,
          method: 'POST',
          headers: {
            'User-Agent': 'nodejs-gracenote',
          },
        },
        (error, response, body) => {

          if (error) {
            console.log(error);
            reject(error)
          }

          if (body) {
            const json = convert.xml2js(body, { compact: true, spaces: 4 });
            //console.log('Gracenote - albumSearch',json)
            resolve(json)
          }
        }
      );
    })

  };

  getCover = (artist, title) => {
    return new Promise((resolve, reject) => {
      const queryCover = `
            <QUERIES>
            <AUTH>
              <CLIENT>${this.clientID}</CLIENT>
              <USER>${this.clientUSER}</USER>
            </AUTH>
            <QUERY CMD="ALBUM_SEARCH">
              <TEXT TYPE="ARTIST">${artist}</TEXT>
              <TEXT TYPE="TRACK_TITLE">${title}</TEXT>
              <MODE>SINGLE_BEST_COVER</MODE>
              <OPTION>
                <PARAMETER>COVER_SIZE</PARAMETER>
                <VALUE>large</VALUE>
              </OPTION>
            </QUERY>
            </QUERIES>
          `;
          request(
            {
              url: gracenoteURL,
              body: register,
              method: 'POST',
              headers: {
                'User-Agent': 'nodejs-gracenote',
              },
            },
            (error, response, body) => {
              if (body) {
                const json = convert.xml2js(body,{compact: true, spaces: 4});

                //console.log('getCover [body]', json);
                resolve(json);
              }
            }
          );

    })
  }
}


export default Gracenote
