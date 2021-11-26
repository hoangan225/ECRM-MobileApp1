export default {
    required: {
        pattern: /^\s*$/,
        message: 'Không được để trống trường này',
        type: 'danger',
    },
    email: {
        pattern: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        message: 'Vui lòng nhập đúng định dạng email',
        type: 'danger',
    },
    url: {
        pattern: /^(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
        message: 'Vui lòng nhập đúng định dạng url',
        type: 'danger',
    },
    tel: {
        pattern: /^(\+?\d{1,3}|0\d{1,3}|0)\d{8,10}$/,
        message: 'Vui lòng nhập đúng định dạng điện thoại',
        type: 'danger',
    },
    number: {
        pattern: /^(((?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?)|((?:-?\d+|-?\d{1,3}(?:.\d{3})+)?(?:\,\d+)?))$/,
        message: 'Vui lòng nhập đúng định dạng chữ số',
        type: 'danger',
    }
}