# 🔐 Hướng dẫn lấy API Keys cho AI

## 📍 **Nơi lưu trữ API Keys**

API Keys được lưu trữ an toàn trong **localStorage** của trình duyệt:
- ✅ **Bảo mật**: Chỉ bạn có thể truy cập
- ✅ **Bền vững**: Lưu trữ giữa các phiên làm việc
- ✅ **Riêng tư**: Không gửi lên server
- ✅ **Dễ quản lý**: Có thể xóa bất kỳ lúc nào

## 🤖 **Cách lấy API Keys**

### 1. **OpenAI API Key**
1. Truy cập: https://platform.openai.com/api-keys
2. Đăng nhập tài khoản OpenAI
3. Click **"Create new secret key"**
4. Copy key (bắt đầu với `sk-`)
5. Paste vào form AI Settings

**Chi phí**: ~$0.002/1K tokens (rất rẻ)

### 2. **Google Gemini API Key**
1. Truy cập: https://aistudio.google.com/app/apikey
2. Đăng nhập Google account
3. Click **"Create API Key"**
4. Copy key (bắt đầu với `AI`)
5. Paste vào form AI Settings

**Chi phí**: Miễn phí 60 requests/phút
**Model**: gemini-1.5-flash (nhanh và miễn phí)

### 3. **Anthropic Claude API Key**
1. Truy cập: https://console.anthropic.com/
2. Đăng ký tài khoản
3. Vào **API Keys** section
4. Click **"Create Key"**
5. Copy key
6. Paste vào form AI Settings

**Chi phí**: $0.008/1K tokens

## 🎯 **Khuyến nghị sử dụng**

### **Cho người mới bắt đầu:**
- **Gemini**: Miễn phí, dễ sử dụng
- **Rule-based AI**: Hoàn toàn miễn phí, không cần API

### **Cho sử dụng thường xuyên:**
- **OpenAI**: Chất lượng cao, giá rẻ
- **Claude**: Tốt cho nội dung dài

## 🔧 **Cách sử dụng**

1. **Vào trang Create/Edit Media**
2. **Click nút ⚙️ Settings** trong AI Gợi ý SEO
3. **Bật "External AI API"**
4. **Chọn provider** (OpenAI/Gemini/Claude)
5. **Nhập API Key**
6. **Click "Tạo Meta Description/Keywords"**

## 🛡️ **Bảo mật**

- ✅ Keys được mã hóa trong localStorage
- ✅ Không gửi lên server của chúng tôi
- ✅ Chỉ sử dụng cho AI suggestions
- ✅ Có thể xóa bất kỳ lúc nào
- ✅ Hiển thị masked key (sk-••••••••)

## 🚨 **Lưu ý quan trọng**

1. **Không chia sẻ API keys** với ai khác
2. **Giới hạn sử dụng** theo plan của bạn
3. **Theo dõi chi phí** trên dashboard provider
4. **Backup keys** ở nơi an toàn
5. **Xóa keys** nếu không sử dụng

## 💡 **Tips tối ưu**

- **Sử dụng Rule-based AI** cho hầu hết trường hợp
- **Chỉ dùng External AI** khi cần chất lượng cao
- **Bật Fallback** để tự động chuyển về Rule-based nếu API lỗi
- **Test với ít requests** trước khi sử dụng nhiều

---

**🎉 Bây giờ bạn đã sẵn sàng sử dụng AI để tạo Meta Description và Keywords tối ưu cho SEO!**
