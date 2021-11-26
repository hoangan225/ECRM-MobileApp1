import en from './i18n/en.json';
export default {
    language: "en",
    name: "English",
    format: {
        moment: {
            date: 'MM/DD/YYYY',
            dateTime: 'MM/DD/YYYY HH:mm',
            time: 'HH:mm'
        },
        datePicker: {
            date: 'm/d/Y',
            dateTime: 'm/d/Y H:i',
            time: 'H:i'
        },
        number: {
            ".": '.',
            ",": ','
        }
    },
    catalog: {
        ...en,
        "test ngon ngu": "test ngon ngu EN",

        // "Thêm mới": "Add new",
        // "Xóa": "Delete",
        // "Sửa": "Edit",
        // "Cập nhật": "Update",
        // "Hủy": "Cancel",

        // "Họ": "Lastname",
        // "Tên": "Firstname",
        // "Giới tính": "Gender",
        // "Điện thoại": "Phone number",
        // "Ngày sinh": "Birthdate",
        // "Ngôn ngữ": "Language",
        // "Giới thiệu": "About",

        // //Link
        // "Về trang chủ": "Go to home page",

        // //Account
        // "Tài khoản": "Account",
        // "Tên đăng nhập": "Username",
        // "Thông tin tài khoản": "Profile",
        // "Mật khẩu": "Password",
        // "Điền thông tin đăng nhập": "Hi there! Please Sign in",
        // "Quên mật khẩu": "Lost password",
        // "Đổi mật khẩu": "Change password",
        // "Điền email để khôi phục mật khẩu": "Enter your email to recover your password",
        // "Lấy lại mật khẩu": "Get password",
        // "Quay lại đăng nhập": "Login",
        // "Đăng xuất": "Logout",
        // "Cập nhật tài khoản": "Edit profile",
        // "Không có quyền truy cập": "Access denied",
        // "Tài khoản của bạn chưa được thiết lập phân quyền": "Your account has not been set up the permissions",


        // //Customer
        // "Thêm mới khách hàng": "Add new customer",
        // "Xóa khách hàng": "Delete customer",
        // "Sửa khách hàng": "Edit customer",
        // "Thêm mới khách hàng thành công": "Add new customer success",
        // "Cập nhật khách hàng thành công": "Update customer success",
        // "Xóa khách hàng thành công": "Delete customer success",


        //Capability
        "Customer.Manage": "Manage customer",
        "Customer.Create": "Create customer",
        "Customer.Edit": "Edit customer",
        "Customer.Delete": "Delete customer",

        "XXX.Manager": "Manage xxx",
        "XXX.Create": "Create xxx",
        "XXX.Edit": "Edit xxx",
        "XXX.Delete": "Delete xxx"
    }
}