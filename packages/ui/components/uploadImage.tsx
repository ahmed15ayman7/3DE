import React from 'react'

export const UploadImage = ({image,setImage,inputRef,className,setIsUploading}:{image:string,setImage:(image:string)=>void,inputRef:React.RefObject<HTMLInputElement | null>,className?:string,isUploading?:boolean,setIsUploading?:(isUploading:boolean)=>void}) => {
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsUploading?.(true);
        const file = event.target.files?.[0];
        if (!file) return;
    
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''); // 👈 غيّرها
        formData.append("folder", "uploads");
    
        try {
          const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
    
          if (data.secure_url) {
            console.log("🔗 Uploaded Image URL:", data.secure_url);
            setImage(data.secure_url);
            setIsUploading?.(false);
          }
        } catch (err) {
          console.error("Upload error:", err);
          alert("❌ فشل رفع الصورة!");
          setIsUploading?.(false);
        }
      };
  return (
    <div>
        <input ref={inputRef} className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent border-secondary-main ${className}`} type="file" onChange={handleFileChange} />
    </div>
  )
}
