export default [
    {
        label: __('Cơ bản'),
        items: [
            { value: '{{dd}}', label: __('Ngày (dd)') },
            { value: '{{mm}}', label: __('Tháng (MM)') },
            { value: '{{yyyy}}', label: __('Năm (yyyy)') },
            { value: '{{hhmm}}', label: __('Giờ:phút (HH:mm)') },
            { value: '{{date}}', label: __('Ngày hiện tại (dd/MM/yyyy)') },
            { value: '{{longdate}}', label: __('Ngày tháng năm hiện tại') },
        ]
    },
    {
        label: __('Khách hàng'),
        items: [
            { value: '{{hoten}}', label: __('Họ tên khách hàng') },
            { value: '{{HOTEN}}', label: __('Họ tên khách hàng in hoa') },
            { value: '{{ten}}', label: __('Tên') },
            { value: '{{ho}}', label: __('Họ') },
            { value: '{{dienthoai}}', label: __('Điện thoại') },
            { value: '{{diachi}}', label: __('Địa chỉ') },
            { value: '{{email}}', label: __('Email') },
            { value: '{{ngaysinh}}', label: __('Ngày sinh') },
            { value: '{{masothue}}', label: __('Mã số thuế') },
            { value: '{{nganhang}}', label: __('Tên ngân hàng') },
            { value: '{{sotaikhoan}}', label: __('Số tài khoản') },
            { value: '{{socmnd}}', label: __('Số CMND') },
            { value: '{{ngaycap}}', label: __('Ngày cấp') },
            { value: '{{noicap}}', label: __('Nơi cấp') },
        ]
    },
    {
        label: __('Hợp đồng'),
        items: [
            {
                label: __('Thông tin chung'),
                items: [
                    { value: '{{mahd}}', label: __('Mã HĐ') },
                    { value: '{{tenhopdong}}', label: __('Tên HĐ') },
                    { value: '{{ngayky}}', label: __('Ngày ký') },
                    { value: '{{cohieuluc}}', label: __('Ngày có hiệu lực') },
                    { value: '{{hethieuluc}}', label: __('Ngày hết hiệu lực') },
                    { value: '{{dieukhoan}}', label: __('Điều khoản') },
                    { value: '{{cacsanpham}}', label: __('Bảng các sản phẩm') },
                    { value: '{{datcoc}}', label: __('Đặt cọc') },
                    { value: '{{datcocbangchu}}', label: __('Đặt cọc bằng chữ') },
                    { value: '{{giamgia}}', label: __('Giảm giá') },
                ]
            },
            {
                label: __('Bên A'),
                items: [
                    { value: '{{a_hoten}}', label: __('Bên A: Họ tên') },
                    { value: '{{a_diachi}}', label: __('Bên A: Địa chỉ') },
                    { value: '{{a_sodienthoai}}', label: __('Bên A: Số điện thoại') },
                    { value: '{{a_masothue}}', label: __('Bên A: Mã số thuế') },
                    { value: '{{a_fax}}', label: __('Bên A: Fax') },
                    { value: '{{a_nganhang}}', label: __('Bên A: Tại ngân hàng') },
                    { value: '{{a_sotaikhoan}}', label: __('Bên A: Số tài khoản') },
                    { value: '{{a_daidien}}', label: __('Bên A: Đại diện') },
                    { value: '{{a_chucvu}}', label: __('Bên A: Chức vụ') },
                ]
            },
            {
                label: __('Bên B'),
                items: [
                    { value: '{{b_hoten}}', label: __('Bên B: Họ tên') },
                    { value: '{{b_diachi}}', label: __('Bên B: Địa chỉ') },
                    { value: '{{b_sodienthoai}}', label: __('Bên B: Số điện thoại') },
                    { value: '{{b_masothue}}', label: __('Bên B: Mã số thuế') },
                    { value: '{{b_fax}}', label: __('Bên B: Fax') },
                    { value: '{{b_nganhang}}', label: __('Bên B: Tại ngân hàng') },
                    { value: '{{b_sotaikhoan}}', label: __('Bên B: Số tài khoản') },
                    { value: '{{b_daidien}}', label: __('Bên B: Đại diện') },
                    { value: '{{b_chucvu}}', label: __('Bên B: Chức vụ') },
                ]
            }
        ]
    },
    {
        label: __('Sản phẩm'),
        items: [
            { value: '{{masp}}', label: __('Mã sản phẩm') },
            { value: '{{tensp}}', label: __('Tên sản phẩm') },
            { value: '{{donvitinh}}', label: __('Đơn vị tính') },
        ]
    }
];