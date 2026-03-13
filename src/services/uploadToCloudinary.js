
export async function uploadToCloudinary(file, folder) {

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  formData.append("folder", folder);

  const response = await fetch(
    `${import.meta.env.VITE_CLOUDINARY_BASE_URL}/auto/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Cloudinary error:", errorText);
    throw new Error("Cloudinary error: " + errorText);
  }

  const data = await response.json();

  console.log(`secure_url: ${data.secure_url}`);

  return data.secure_url;
}

// export async function uploadPrivateToCloudinary(file, folder) {

//   const formData = new FormData();

//   formData.append("file", file);
//   formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
//   formData.append("folder", folder);
//   formData.append("type", "authenticated");

//   const response = await fetch(
//     `${import.meta.env.VITE_CLOUDINARY_BASE_URL}/auto/upload`,
//     {
//       method: "POST",
//       body: formData
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     console.error("Cloudinary error:", data);
//     throw new Error(data.error?.message || "Upload failed");
//   }

//   return {
//     public_id: data.public_id,
//     resource_type: data.resource_type
//   };
// }
