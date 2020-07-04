import confirm from "reactstrap-confirm";

export default class UserMessage {

    constructor(){
        this.message = null;
    }

    alert = (message) => {
        if (this.message === message) return;
        this.message = message;
        confirm({
            title: null,
            message: message,
            confirmText: 'OK',
            confirmColor: 'primary',
            cancelText: null
        });
    };

    /*
    confirm(title, message, func) {
        confirm({
          title: title,
          message: message,
          confirmText: "JA",
          cancelText: "NEJ",
          confirmColor: "primary",
          cancelColor: "link text-danger"
        }).then(isOk => { if(isOk)
          new HttpClient().delete(this.filename);
        });
      }
      */
}