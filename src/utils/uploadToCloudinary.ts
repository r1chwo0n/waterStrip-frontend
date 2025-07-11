export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = "dkxrapjzb"; // 🔁 แก้เป็นของคุณ
  const uploadPreset = "default_upload"; // 🔁 ตั้งไว้ใน Cloudinary → Upload settings

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      return data.secure_url; // ✅ ส่งกลับ URL ของภาพที่ฝากสำเร็จ
    } else {
      throw new Error(data.error?.message || "Cloudinary upload failed");
    }
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
};
