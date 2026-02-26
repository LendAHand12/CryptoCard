// NPM:

- use npm version 16.17.0
- nếu npm install không được thì thêm --force vào
- trường hợp install vẫn có lỗi do "node-sass" hay tương tự vậy thì search stackoverflow để fix (hoặc là clear remove node module, xóa package lock, xong clear cache của npm để fix)

// NOTES:

- source này đc maintain dựa trên code cũ cho nên không có thời gian optimize và refactor, nếu có thời gian thì refactor và optimize, lược bỏ những phần của code cũ nếu cần thiết

- hiện tại phần relogin đang check dựa trên biến expireToken (nếu api trả 401, thì set biến expireToken là username (bắt buộc phải stringify biến đó), xong interval check xem nếu có biến expireToken dưới LocalStorage thì hiển thị modal relogin)

- khi tắt bảo trì thì mở lại route swap-amc và swap-hewe

@CardDeposit.jsx Hiện tại đang maintained chức năng nạp hewe nên có thêm đoạn code

```
 {coinSelected === "HEWE" ? (
              <>{t("maintained")}</>
            ) : (
            )}
```

Khi nào mà không maintained nữa thì bỏ ra

#TASK
**20/12/2024**

```jsx
#HeaderV3.jsx
Add Some Header Menu For HeaderV3. Detect Not Login Or Login To Show That Menu
```
