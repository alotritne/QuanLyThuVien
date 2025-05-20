import json

# Load dữ liệu từ file
with open("Books_final.json", "r", encoding="utf-8") as f:
    books = json.load(f)

with open("newBooks_final.json", "r", encoding="utf-8") as f:
    new_books = json.load(f)

with open("user.json", "r", encoding="utf-8") as f:
    users = json.load(f)

# Tạo map từ tên sách đến ảnh (img)
book_img_map = {}
for book in books + new_books:
    name = book["name"].strip().upper()
    book_img_map[name] = book.get("img", None)

# Thêm ảnh vào từng user
for user in users:
    book_name = user["book"].strip().upper()
    user["img"] = book_img_map.get(book_name, None)

# Ghi kết quả ra file mới
with open("user_with_images.json", "w", encoding="utf-8") as f:
    json.dump(users, f, ensure_ascii=False, indent=2)

print("Đã tạo file user_with_images.json chứa ảnh sách.")
