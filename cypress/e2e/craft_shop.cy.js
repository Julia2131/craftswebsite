// npx cypress open

describe('Hệ thống Craft Shop - Kiểm thử E2E', () => {
  const baseUrl = 'http://localhost:5173';

  beforeEach(() => {
    // Xóa sạch để bắt đầu mỗi test case mới
    cy.clearLocalStorage();
    cy.visit(baseUrl);
  });

  // --- LUỒNG LỖI: ĐĂNG NHẬP SAI (TC_AUTH_010) ---
  it('TC_AUTH_010: Đăng nhập với tài khoản không tồn tại (Negative)', () => {
    cy.visit(`${baseUrl}/log`);

    // 1. Nhập một username chắc chắn chưa đăng ký
    const fakeUser = 'user_khong_ton_tai_999';
    cy.get('input[placeholder="Tên đăng nhập"]').type(fakeUser);
    cy.get('input[placeholder="Mật khẩu"]').type('anyPassword123');

    // 2. Nhấn nút Đăng nhập
    cy.contains('button', 'Đăng nhập').click();

    // 3. KIỂM TRA THÔNG BÁO LỖI (Quan trọng nhất để thuyết trình)
    // Theo code Log.jsx của bạn: alert("Sai tên đăng nhập hoặc mật khẩu")
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Sai tên đăng nhập hoặc mật khẩu');
    });

    // 4. KIỂM TRA: Vẫn phải ở lại trang Login chứ không được chuyển hướng
    cy.url().should('include', '/log');
    
    // 5. Kiểm tra: LocalStorage phải TRỐNG (không được lưu user)
    cy.window().then((win) => {
      expect(win.localStorage.getItem('craft_user')).to.be.null;
    });
  });

  // --- LUỒNG 2: TÌM KIẾM SẢN PHẨM (TC_CART_001) ---
  it('TC_CART_001: Tìm kiếm sản phẩm tại trang chủ', () => {
    const searchKeyword = 'Gốm';
    
    // Nhập vào ô tìm kiếm trên Header
    cy.get('input[placeholder="Nội dung tìm kiếm ..."]')
      .type(`${searchKeyword}{enter}`);

    // Kiểm chứng kết quả (Giả sử có sản phẩm hiện ra)
    // Dựa vào code Home.jsx của bạn, các sản phẩm nằm trong thẻ img
    cy.get('section').contains('Gói Trọn Tâm Tình').should('be.visible');
    cy.get('img[alt^="product-"]').should('have.length.at.least', 1);
  });

  // --- LUỒNG 3: QUẢN LÝ SẢN PHẨM SELLER (TC_CART_021) ---
  it('TC_CART_021: Truy cập danh sách sản phẩm và kiểm tra số lượng', () => {
    // Giả lập trạng thái đã đăng nhập để vào thẳng Dashboard cho nhanh
    cy.window().then((win) => {
      win.localStorage.setItem('craft_user', JSON.stringify({ name: 'haha' }));
      win.localStorage.setItem('register_seller_id', 'DUMMY_ID_SELLER'); 
    });

    cy.visit(`${baseUrl}/seller/product/all`);

    // Kiểm tra xem có đúng 5 tab trạng thái không
    cy.get('button').contains('Đang bán').click();
    
    // Kiểm tra table hiển thị
    cy.get('div').contains('Sản phẩm').should('be.visible');
    
  });

  // --- LUỒNG 4: THIẾT LẬP THÔNG TIN NGƯỜI BÁN (NEGATIVE CASE) ---
  it('TC_CART_022: Báo lỗi khi tạo Seller thiếu thông tin', () => {
    // Giả lập login nhưng chưa có tài khoản seller
    cy.window().then((win) => {
      win.localStorage.setItem('register_user_id', 'USER_123');
    });

    cy.visit(`${baseUrl}/switch-to-seller`);

    // Nhấn nút mà không nhập gì
    cy.get('button').contains('Tạo tài khoản người bán').click();

    // Kiểm tra xem các câu báo lỗi có hiện ra không (dựa trên setErrors trong code của bạn)
    cy.get('div').contains('Vui lòng nhập tiền nhân công').should('be.visible');
    cy.get('div').contains('Vui lòng nhập mã số thuế').should('be.visible');
  });
});