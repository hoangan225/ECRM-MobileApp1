export const ApplyFors = [
    { value: 'Customer', label: 'Khách hàng', icon: 'accounts-list' },
    { value: 'Company', label: 'Công ty', icon: 'accounts-list' },
    { value: 'Contract', label: 'Hợp đồng', icon: 'account-calendar' },
    { value: 'Product', label: 'Sản phẩm', icon: 'dock' },
    // { value: 'Optinform', label: 'Optinform', icon: 'dock' }
];
export const Customer =
    [

        { name: 'FullName', label: 'Họ tên', type: 0, order: 32, isReadOnly: true, required: true, save: false },
        { name: 'FirstName', label: 'Tên', type: 0, order: 15, isReadOnly: true, required: true, save: false },
        { name: 'LastName', label: 'Họ', type: 0, order: 16, isReadOnly: true, required: true, save: false },
        { name: 'Gender', label: 'Giới tính', type: 20, order: 22, isReadOnly: true, required: true, save: false },
        { name: 'Birthdate', label: 'Ngày sinh', type: 2, order: 17, isReadOnly: true, required: true, save: false },
        { name: 'Phone', label: 'Điện thoại', type: 5, order: 18, isReadOnly: true, required: true, save: false },
        { name: 'PhoneOther', label: 'Điện thoại khác', type: 5, order: 18, isReadOnly: true, required: true, save: false },
        { name: 'Address', label: 'Địa chỉ', type: 0, order: 19, isReadOnly: true, required: true, save: false },
        { name: 'Location', label: 'Địa điểm', type: '', order: 20, isReadOnly: true, required: true, save: false },

        { name: 'CategoryId', label: 'Nhóm khách hàng', type: 0, order: 21, isReadOnly: true, required: true, save: false },
        { name: 'SourceId', label: 'Nguồn khách hàng', type: 0, order: 22, isReadOnly: true, required: true, save: false },

        { name: 'IsRecommender', label: 'Thuộc nhóm giới thiệu', type: 10, order: 23, isReadOnly: true, required: true, save: false },
        { name: 'Email', label: 'Email', type: 4, order: 27, isReadOnly: true, required: true, save: false },
        { name: 'Fax', label: 'Số fax', type: 6, order: 33, isReadOnly: true, required: true, save: false },
        { name: 'TaxCode', label: 'Mã số thuế', type: 6, order: 34, isReadOnly: true, required: true, save: false },
        { name: 'IdCard', label: 'Số chứng minh nhân dân', type: 6, order: 35, isReadOnly: true, required: true, save: false },
        { name: 'IdCardIssued', label: 'Ngày cấp', type: 2, order: 36, isReadOnly: true, required: true, save: false },
        { name: 'IdCardProvince', label: 'Nơi cấp', type: 0, order: 37, isReadOnly: true, required: true, save: false },
        { name: 'RecommenderId', label: 'Người giới thiệu', type: 6, order: 38, isReadOnly: true, required: true, save: false },
        { name: 'ManagerId', label: 'Người phụ trách', type: 6, order: 28, isReadOnly: true, required: true, save: false },
        { name: 'Status', label: 'Trạng thái', type: 'CustomerStatus', order: 39, isReadOnly: true, required: true, save: false },
        { name: 'Notes', label: 'Ghi chú', type: 1, order: 40, isReadOnly: true, required: true, save: false },
        { name: 'IsCompany', label: 'Là Công ty', type: 6, order: 29, isReadOnly: true, required: true, save: false },
        { name: 'DeputyId', label: 'Người đại diện', type: 6, order: 41, isReadOnly: true, required: true, save: false },
        { name: 'CompanyId', label: 'Công ty', type: 6, order: 30, isReadOnly: true, required: true, save: false },
        { name: 'BankNumber', label: 'Số tài khoản', type: 6, order: 42, isReadOnly: true, required: true, save: false },
        { name: 'BankName', label: 'Tại ngân hàng', type: 0, order: 43, isReadOnly: true, required: true, save: false },
        { name: 'Code', label: 'Mã khách hàng', type: 0, order: 42, isReadOnly: true, required: true, save: false },
        { name: 'Avatar', label: 'Avatar', type: 10, order: 31, isReadOnly: true, required: true, save: false },
    ];

export const Company =
    [

        { name: 'FullName', label: 'Tên đầy đủ', type: 0, order: 10, isReadOnly: true, required: true, save: false },
        { name: 'Birthdate', label: 'Ngày thành lập', type: 2, order: 13, isReadOnly: true, required: true, save: false },
        { name: 'Phone', label: 'Điện thoại', type: 5, order: 11, isReadOnly: true, required: true, save: false },
        { name: 'Address', label: 'Địa chỉ', type: 0, order: 12, isReadOnly: true, required: true, save: false },
        { name: 'Email', label: 'Email', type: 4, order: 14, isReadOnly: true, required: true, save: false },
        { name: 'Fax', label: 'Số fax', type: 6, order: 15, isReadOnly: true, required: true, save: false },
        { name: 'TaxCode', label: 'Mã số thuế', type: 6, order: 34, isReadOnly: true, required: true, save: false },
        { name: 'ManagerId', label: 'Người phụ trách', type: 6, order: 28, isReadOnly: true, required: true, save: false },
        { name: 'Status', label: 'Trạng thái', type: 'CustomerStatus', order: 39, isReadOnly: true, required: true, save: false },
        { name: 'Notes', label: 'Ghi chú', type: 1, order: 40, isReadOnly: true, required: true, save: false },
        { name: 'DeputyId', label: 'Người đại diện', type: 6, order: 41, isReadOnly: true, required: true, save: false },
        { name: 'BankNumber', label: 'Số tài khoản', type: 6, order: 42, isReadOnly: true, required: true, save: false },
        { name: 'BankName', label: 'Tại ngân hàng', type: 0, order: 43, isReadOnly: true, required: true, save: false },
    ];

export const Contract =
    [
        { name: 'Code', label: 'Số hợp đồng', type: 0, order: 20, isReadOnly: true, required: true, save: false },
        { name: 'Name', label: 'Tên hợp đồng', type: 0, order: 21, isReadOnly: true, required: true, save: false },
        { name: 'FullName', label: 'Khách hàng', type: 0, order: 21, isReadOnly: true, required: true, save: false },
        { name: 'Phone', label: 'Điện thoại KH', type: 0, order: 21, isReadOnly: true, required: true, save: false },
        { name: 'VAT', label: 'Thuế GTGT (VAT)', type: 7, order: 22, isReadOnly: true, required: true, save: false },
        { name: 'Deposit', label: 'Tiền đặt cọc', type: 7, order: 23, isReadOnly: true, required: true, save: false },
        { name: 'Discount', label: 'Giảm giá', type: 7, order: 24, isReadOnly: true, required: true, save: false },
        { name: 'IsDiscountPrice', label: 'Giảm theo giá', type: 7, order: 25, isReadOnly: true, required: true, save: false },
        { name: 'Total', label: 'Tổng giá trị', type: 7, order: 26, isReadOnly: true, required: true, save: false },

        { name: 'Payment', label: 'Đã thanh toán', type: 7, order: 26, isReadOnly: true, required: true, save: false },
        { name: 'PaymentReceipt', label: 'Tiền đã thu', type: 7, order: 26, isReadOnly: true, required: true, save: false },
        { name: 'PaymentExpenses', label: 'Tiền đã chi', type: 7, order: 26, isReadOnly: true, required: true, save: false },

        { name: 'CancelReason', label: 'Lý do hủy', type: 0, order: 27, isReadOnly: true, required: true, save: false },
        { name: 'SignatureDate', label: 'Ngày ký', type: 3, order: 28, isReadOnly: true, required: true, save: false },
        { name: 'StartDate', label: 'Ngày có hiệu lực', type: 3, order: 29, isReadOnly: true, required: false, save: false },
        { name: 'EndDate', label: 'Ngày hết hiệu lực', type: 3, order: 30, isReadOnly: true, required: false, save: false },
        { name: 'Term', label: 'Điều khoản', type: 21, order: 31, isReadOnly: true, required: true, save: false },
        { name: 'CustomerId', label: 'Khách hàng', type: 6, order: 32, isReadOnly: true, required: true, save: false },
        { name: 'TypeId', label: 'Loại hợp đồng', type: 6, order: 33, isReadOnly: true, required: true, save: false },
        { name: 'Type', label: 'Tên loại hợp đồng', type: 6, order: 33, isReadOnly: true, required: true, save: false },
        { name: 'IsQuote', label: 'Là báo giá', type: 9, order: 34, isReadOnly: true, required: true, save: false },
        { name: 'QuoteId', label: 'Báo giá', type: 6, order: 35, isReadOnly: true, required: false, save: false },
        { name: 'Status', label: 'Trạng thái', type: 'ContractStatus', order: 36, isReadOnly: true, required: true, save: false },
        { name: 'ManagerId', label: 'Người quản lý', type: 6, order: 37, isReadOnly: true, required: true, save: false },
        { name: 'BranchId', label: 'Chi nhánh', type: 6, order: 38, isReadOnly: true, required: true, save: false },
        { name: 'TotalLast', label: 'Tổng sau thuế', type: 6, order: 26, isReadOnly: true, required: false, save: false },
    ];
export const Product =
    [
        { name: 'Code', label: 'Mã sản phẩm', type: 0, order: 20, isReadOnly: true, required: true, save: false },
        { name: 'Name', label: 'Tên sản phẩm', type: 0, order: 21, isReadOnly: true, required: true, save: false },
        { name: 'Price', label: 'Giá', type: 7, order: 22, isReadOnly: true, required: true, save: false },
        { name: 'PriceAvg', label: 'Giá nhập bình quân', type: 7, order: 23, isReadOnly: true, required: true, save: false },
        { name: 'Unit', label: 'Đơn vị tính', type: 0, order: 24, isReadOnly: true, required: true, save: false },
        { name: 'Description', label: 'Mô tả', type: 0, order: 25, isReadOnly: true, required: true, save: false },
        { name: 'Slug', label: 'Slug', type: 0, order: 26, isReadOnly: true, required: true, save: false },
        { name: 'Status', label: 'Trạng thái', type: 'ProductStatus', order: 27, isReadOnly: true, required: true, save: false },
        { name: 'ThumbnailId', label: 'Ảnh đại diện', type: 6, order: 28, isReadOnly: true, required: true, save: false },
    ];
// export const Optinform =
//     [
//         { name: 'Name', label: 'Họ và tên', type: 0, order: 20, isReadOnly: true, required: true, save: false },
//     ];