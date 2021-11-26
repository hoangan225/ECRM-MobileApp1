import moment from 'moment';

export const convertContentSyntax = (content, syntax) => {
  
    return `<div>
    haocidshcoishoc
    <b>dksfljdfljdflkjdslkjf</b>
</div>`;
}


export const convertContract = (content, contract) => {
    
    //#Thông tin chung
    var today = new Date();
    var hourMinute = moment().format("HH:mm");
    content = content.replace('[dd]', function (x) {
        return today.getDate();
    });
    content = content.replace('[mm]', function (x) {
        return (today.getMonth() + 1);
    });
    content = content.replace('[yyyy]', function (x) {
        return today.getFullYear();
    });
    content = content.replace('[hhmm]', function (x) {
        return hourMinute;
    });
    content = content.replace('[date]', function (x) {
        return (today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear());
    });

    content = content.replace('[datealpha]', function (x) {
        return ('Ngày ' + today.getDate() + ' tháng ' + (today.getMonth() + 1) + ' năm ' + today.getFullYear());
    });


    //#Hợp đồng
    content = content.replace('[mahd]', function (x) {
        return contract.code;
    });
    content = content.replace('[tenhopdong]', function (x) {
        return contract.name;
    });
    content = content.replace('[ngayky]', function (x) {
        return contract.signatureDate;
    });
    content = content.replace('[cohieuluc]', function (x) {
        return contract.startDate;
    });
    content = content.replace('[hethieuluc]', function (x) {
        return contract.endDate;
    });
    content = content.replace('[dieukhoan]', function (x) {
        return contract.term;
    });
    if (contract.contractors && contract.contractors.length > 0) {
        //#Sỡ hữu
        content = content.replace('[ahoten]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[0].fullName;
        });
        content = content.replace('[adiachi]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[0].address;
        });
        content = content.replace('[asodienthoai]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[0].phone;
        });
        content = content.replace('[afax]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[0].fax;
        });
        content = content.replace('[anganhang]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[0].bankName;
        });
        content = content.replace('[asotaikhoan]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[0].bankNumber;
        });
        content = content.replace('[adaidien]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[0].deputy;
        });
        content = content.replace('[achucvu]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[0].deputyPosition;
        });
        content = content.replace('[amasothue]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[0].taxCode;
        });
        //#Đối tác
        content = content.replace('[bhoten]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[1].fullName;
        });
        content = content.replace('[bdiachi]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[1].address;
        });
        content = content.replace('[bsodienthoai]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[1].phone;
        });
        content = content.replace('[bfax]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[1].fax;
        });
        content = content.replace('[bnganhang]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[1].bankName;
        });
        content = content.replace('[bsotaikhoan]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[1].bankNumber;
        });
        content = content.replace('[bdaidien]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[1].deputy;
        });
        content = content.replace('[bchucvu]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[1].deputyPosition;
        });
        content = content.replace('[bmasothue]', function (x) {
            return contract.contractors.filter(t => t.isOwner == true)[1].taxCode;
        });
    }

    return content;
}