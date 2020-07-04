import axios from 'axios';
import UserMessage from './UserMessage';

export default class HttpClient {

    messenger = new UserMessage();

    sendUpdate = (filename, attr, value) => {
        axios({
          method: 'patch',
          url: 'http://mmdok.emagnca.webfactional.com/update',
          data:
         {
            'filename' : filename,
            'attribute' : attr,
            'value': value
          },
          headers: {'Authorization': "Bearer " + sessionStorage.getItem('token')}
        }
      ).then(() => {
        console.log("update successful");
      })
        .catch((error) => {
          if (error.response.status == 401) 
            this.messenger.alert("Du får ej uppdatera det här dokumentet")
          else 
            this.messenger.alert(error.response.message);
        });
      }

      delete = (filename) => {
        axios({
            method: 'delete',
            url: 'http://mmdok.emagnca.webfactional.com/delete',
            data:
            {
              'filename' : filename
            },
            headers: {'Authorization': "Bearer " + sessionStorage.getItem('token')}
          }
        ).then(() => {
          console.log("success");
        })
          .catch((error) => {
            if (error.response.status == 401) 
              this.messenger.alert("Du får ej radera det här dokumentet")
          else 
            this.messenger.alert(error.response.message);
          });
      }

}